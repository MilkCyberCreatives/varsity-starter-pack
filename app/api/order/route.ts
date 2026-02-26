import crypto from "crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { getPlansBySlugs, isApplianceSlug, type ApplianceSlug } from "@/lib/plans";

export const runtime = "nodejs";

type Upload = {
  name: string;
  type: string;
  base64: string;
};

type SmartPayload = {
  profile?: string;
  reason?: string;
  selectedByGuide?: string[];
  needs?: {
    room?: "single" | "shared";
    cooking?: "rare" | "often";
    storage?: "low" | "high";
    budget?: "tight" | "balanced" | "flexible";
  };
};

type Payload = {
  appliances?: string[];
  fullName?: string;
  email?: string;
  phone?: string;
  university?: string;
  residence?: string;
  months?: number;
  deliveryDate?: string;
  notes?: string;
  website?: string;
  formStartedAt?: number;
  smart?: SmartPayload;
  uploads?: {
    studentCard?: Upload | null;
    idCopy?: Upload | null;
  };
};

const RATE = { windowMs: 60_000, max: 5 };
const rateMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const hit = rateMap.get(ip);

  if (!hit || hit.resetAt <= now) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE.windowMs });
    return false;
  }

  hit.count += 1;
  rateMap.set(ip, hit);
  return hit.count > RATE.max;
}

function makeReference() {
  const date = new Date();
  const yy = String(date.getUTCFullYear()).slice(-2);
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `VSP-${yy}${mm}${dd}-${rand}`;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clamp(value: string, max = 200) {
  const text = (value || "").trim();
  return text.length > max ? text.slice(0, max) : text;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function validDeliveryDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return true;
}

function sanitizeSmartPayload(payload: SmartPayload | undefined) {
  const selectedByGuide = Array.isArray(payload?.selectedByGuide)
    ? payload.selectedByGuide
        .map((value) => String(value).trim().toLowerCase())
        .filter((value): value is ApplianceSlug => isApplianceSlug(value))
    : [];

  const profile = clamp(payload?.profile ?? "", 100);
  const reason = clamp(payload?.reason ?? "", 220);

  const room = payload?.needs?.room === "shared" ? "shared" : "single";
  const cooking = payload?.needs?.cooking === "rare" ? "rare" : "often";
  const storage = payload?.needs?.storage === "high" ? "high" : "low";
  const rawBudget = payload?.needs?.budget;
  const budget =
    rawBudget === "tight" || rawBudget === "balanced" || rawBudget === "flexible"
      ? rawBudget
      : "balanced";

  return {
    profile,
    reason,
    selectedByGuide,
    needs: { room, cooking, storage, budget },
  };
}

function buildFollowUpSummary(input: {
  monthlyTotal: number;
  depositTotal: number;
  months: number;
  smart: ReturnType<typeof sanitizeSmartPayload>;
}) {
  let score = 0;
  if (input.depositTotal >= 900) score += 2;
  if (input.monthlyTotal >= 450) score += 1;
  if (input.months >= 8) score += 1;
  if (input.smart.needs.room === "shared") score += 1;
  if (input.smart.needs.cooking === "often") score += 1;

  const priority = score >= 5 ? "HIGH" : score >= 3 ? "MEDIUM" : "NORMAL";

  const followUp =
    input.smart.needs.budget === "tight"
      ? "Lead with lower monthly options and confirm move-in date quickly."
      : input.smart.needs.budget === "flexible"
        ? "Lead with full setup bundle and faster delivery slot options."
        : "Lead with balanced bundle and standard onboarding steps.";

  return { priority, followUp };
}

function sanitizeUpload(upload: Upload | null | undefined, fieldName: string) {
  if (!upload?.base64 || !upload?.name) {
    return { ok: false as const, error: `${fieldName} upload is required.` };
  }

  const maxBytes = Math.floor(2.5 * 1024 * 1024);
  const approxBytes = Math.ceil((upload.base64.length * 3) / 4);
  if (approxBytes > maxBytes) {
    return {
      ok: false as const,
      error: `${fieldName} upload must be under 2.5MB.`,
    };
  }

  const allowed = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (!allowed.includes((upload.type || "").toLowerCase())) {
    return {
      ok: false as const,
      error: `${fieldName} upload format is not supported.`,
    };
  }

  return { ok: true as const, upload };
}

function validateOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return true;

  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    if (!validateOrigin(req)) {
      return NextResponse.json(
        { ok: false, error: "Invalid request origin." },
        { status: 403 }
      );
    }

    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const body = (await req.json()) as Payload;

    const website = clamp(body.website ?? "", 40);
    if (website) {
      return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
    }

    const startedAt = Number(body.formStartedAt || 0);
    if (!Number.isFinite(startedAt) || Date.now() - startedAt < 2500) {
      return NextResponse.json(
        { ok: false, error: "Please complete the form and try again." },
        { status: 400 }
      );
    }

    const appliances = Array.isArray(body.appliances)
      ? [...new Set(body.appliances.map((value) => String(value).trim()))]
      : [];

    const plans = getPlansBySlugs(appliances);
    if (!plans.length) {
      return NextResponse.json(
        { ok: false, error: "Please select at least one appliance." },
        { status: 400 }
      );
    }

    const fullName = clamp(body.fullName ?? "", 80);
    const email = clamp(body.email ?? "", 120).toLowerCase();
    const phone = clamp(body.phone ?? "", 30);
    const university = clamp(body.university ?? "", 80);
    const residence = clamp(body.residence ?? "", 120);
    const deliveryDate = clamp(body.deliveryDate ?? "", 30);
    const notes = clamp(body.notes ?? "", 600);
    const months = Number(body.months ?? 5);
    const smart = sanitizeSmartPayload(body.smart);

    if (!fullName)
      return NextResponse.json({ ok: false, error: "Full name is required." }, { status: 400 });
    if (!email || !isEmail(email))
      return NextResponse.json({ ok: false, error: "Valid email is required." }, { status: 400 });
    if (!phone)
      return NextResponse.json({ ok: false, error: "Phone number is required." }, { status: 400 });
    if (!university)
      return NextResponse.json({ ok: false, error: "University is required." }, { status: 400 });
    if (!residence)
      return NextResponse.json(
        { ok: false, error: "Residence or apartment is required." },
        { status: 400 }
      );

    if (!Number.isFinite(months) || months < 5 || months > 36) {
      return NextResponse.json(
        { ok: false, error: "Rental months must be between 5 and 36." },
        { status: 400 }
      );
    }

    if (!deliveryDate || !validDeliveryDate(deliveryDate)) {
      return NextResponse.json(
        { ok: false, error: "Valid delivery date is required." },
        { status: 400 }
      );
    }

    const studentCardResult = sanitizeUpload(body.uploads?.studentCard, "Student card");
    if (!studentCardResult.ok) {
      return NextResponse.json(
        { ok: false, error: studentCardResult.error },
        { status: 400 }
      );
    }

    const idCopyResult = sanitizeUpload(body.uploads?.idCopy, "ID copy");
    if (!idCopyResult.ok) {
      return NextResponse.json({ ok: false, error: idCopyResult.error }, { status: 400 });
    }

    const monthlyTotal = plans.reduce((sum, plan) => sum + plan.monthlyAmount, 0);
    const depositTotal = plans.reduce((sum, plan) => sum + plan.depositAmount, 0);
    const upfrontTotal = depositTotal;

    const applianceStored = plans
      .map((plan) => plan.slug)
      .sort()
      .join(",");
    const followUpSummary = buildFollowUpSummary({
      monthlyTotal,
      depositTotal,
      months,
      smart,
    });

    const guideSelectedText = smart.selectedByGuide.length
      ? smart.selectedByGuide.join(",")
      : "none";
    const smartNeedsLine = `Guide: room=${smart.needs.room} cooking=${smart.needs.cooking} storage=${smart.needs.storage} budget=${smart.needs.budget}`;
    const smartProfileLine = smart.profile
      ? `Guide profile: ${smart.profile}${smart.reason ? ` (${smart.reason})` : ""}`
      : "";
    const guideSelectedLine = `Guide selected: ${guideSelectedText}`;
    const followUpLine = `Follow-up: priority=${followUpSummary.priority}; ${followUpSummary.followUp}`;

    const duplicateWindowStart = new Date(Date.now() - 15 * 60 * 1000);
    const existingOrder = await prisma.order.findFirst({
      where: {
        email,
        phone,
        appliance: applianceStored,
        createdAt: { gte: duplicateWindowStart },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingOrder) {
      return NextResponse.json({
        ok: true,
        reference: existingOrder.reference,
        emailed: existingOrder.emailed,
        duplicate: true,
        selected: {
          slugs: plans.map((plan) => plan.slug),
          items: plans.map((plan) => ({
            slug: plan.slug,
            name: plan.name,
            monthly: plan.monthly,
            deposit: plan.deposit,
          })),
          totals: { monthlyTotal, depositTotal, upfrontTotal },
        },
      });
    }

    const reference = makeReference();

    const notesStored = [
      notes ? `Notes: ${notes}` : "",
      `Delivery date: ${deliveryDate}`,
      `Totals: monthly=${monthlyTotal} deposit=${depositTotal} upfront=${upfrontTotal}`,
      smartNeedsLine,
      smartProfileLine,
      guideSelectedLine,
      followUpLine,
    ]
      .filter(Boolean)
      .join(" | ");

    await prisma.order.create({
      data: {
        reference,
        appliance: applianceStored,
        fullName,
        email,
        phone,
        university: university || null,
        residence: residence || null,
        months,
        notes: notesStored || null,
        emailed: false,
      },
    });

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = process.env.FROM_EMAIL;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

    let emailed = false;

    if (RESEND_API_KEY && FROM_EMAIL) {
      try {
        const resend = new Resend(RESEND_API_KEY);

        const itemsHtml = plans
          .map(
            (plan) =>
              `<tr><td style="padding:8px 0;"><strong>${escapeHtml(plan.name)}</strong></td><td style="padding:8px 0; text-align:right;">R${plan.monthlyAmount}</td><td style="padding:8px 0; text-align:right;">R${plan.depositAmount}</td></tr>`
          )
          .join("");

        const customerHtml = `
          <div style="font-family:Arial,sans-serif;line-height:1.5;">
            <h2 style="margin:0 0 12px;">Order request received</h2>
            <p style="margin:0 0 10px;">Hi ${escapeHtml(fullName)},</p>
            <p style="margin:0 0 12px;">Your reference number is <strong>${reference}</strong>.</p>
            <p style="margin:0 0 10px;"><strong>Delivery date:</strong> ${escapeHtml(deliveryDate)}</p>
            <p style="margin:0 0 12px;"><strong>Rental months:</strong> ${months}</p>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr>
                  <th style="text-align:left;padding-bottom:6px;border-bottom:1px solid #e9e9e9;">Item</th>
                  <th style="text-align:right;padding-bottom:6px;border-bottom:1px solid #e9e9e9;">Monthly</th>
                  <th style="text-align:right;padding-bottom:6px;border-bottom:1px solid #e9e9e9;">Deposit</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
              <tfoot>
                <tr>
                  <td style="padding-top:10px;border-top:1px solid #e9e9e9;"><strong>Totals</strong></td>
                  <td style="padding-top:10px;border-top:1px solid #e9e9e9;text-align:right;"><strong>R${monthlyTotal}</strong></td>
                  <td style="padding-top:10px;border-top:1px solid #e9e9e9;text-align:right;"><strong>R${depositTotal}</strong></td>
                </tr>
              </tfoot>
            </table>
            <p style="margin:12px 0 0;"><strong>Total due now:</strong> R${upfrontTotal} (deposit total)</p>
            <p style="margin:14px 0 0;">Next steps: our admin will send banking details and lease process instructions.</p>
          </div>
        `;

        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: `Varsity Starter Pack Order Request - ${reference}`,
          html: customerHtml,
        });

        emailed = true;

        if (ADMIN_EMAIL) {
          const adminHtml = `
            <div style="font-family:Arial,sans-serif;line-height:1.5;">
              <h3 style="margin:0 0 10px;">New order request</h3>
              <p style="margin:0 0 6px;"><strong>Reference:</strong> ${reference}</p>
              <p style="margin:0 0 6px;"><strong>Name:</strong> ${escapeHtml(fullName)}</p>
              <p style="margin:0 0 6px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p style="margin:0 0 6px;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
              <p style="margin:0 0 6px;"><strong>University:</strong> ${escapeHtml(university)}</p>
              <p style="margin:0 0 6px;"><strong>Residence:</strong> ${escapeHtml(residence)}</p>
              <p style="margin:0 0 6px;"><strong>Months:</strong> ${months}</p>
              <p style="margin:0 0 12px;"><strong>Delivery date:</strong> ${escapeHtml(deliveryDate)}</p>
              ${smart.profile ? `<p style="margin:0 0 6px;"><strong>Guide profile:</strong> ${escapeHtml(smart.profile)}</p>` : ""}
              ${smart.reason ? `<p style="margin:0 0 6px;"><strong>Guide reason:</strong> ${escapeHtml(smart.reason)}</p>` : ""}
              <p style="margin:0 0 6px;"><strong>Guide needs:</strong> room=${escapeHtml(
                smart.needs.room
              )}, cooking=${escapeHtml(smart.needs.cooking)}, storage=${escapeHtml(
                smart.needs.storage
              )}, budget=${escapeHtml(smart.needs.budget)}</p>
              <p style="margin:0 0 6px;"><strong>Guide selected:</strong> ${escapeHtml(guideSelectedText)}</p>
              <p style="margin:0 0 10px;"><strong>Follow-up:</strong> ${followUpSummary.priority} | ${escapeHtml(
                followUpSummary.followUp
              )}</p>
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr>
                    <th style="text-align:left;padding-bottom:6px;border-bottom:1px solid #e9e9e9;">Item</th>
                    <th style="text-align:right;padding-bottom:6px;border-bottom:1px solid #e9e9e9;">Monthly</th>
                    <th style="text-align:right;padding-bottom:6px;border-bottom:1px solid #e9e9e9;">Deposit</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
                <tfoot>
                  <tr>
                    <td style="padding-top:10px;border-top:1px solid #e9e9e9;"><strong>Totals</strong></td>
                    <td style="padding-top:10px;border-top:1px solid #e9e9e9;text-align:right;"><strong>R${monthlyTotal}</strong></td>
                    <td style="padding-top:10px;border-top:1px solid #e9e9e9;text-align:right;"><strong>R${depositTotal}</strong></td>
                  </tr>
                </tfoot>
              </table>
              <p style="margin:12px 0 0;"><strong>Total due now:</strong> R${upfrontTotal}</p>
              ${notes ? `<p style="margin:12px 0 0;"><strong>Notes:</strong> ${escapeHtml(notes)}</p>` : ""}
            </div>
          `;

          await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject: `NEW Order Request - ${reference}`,
            html: adminHtml,
            attachments: [
              {
                filename: studentCardResult.upload.name,
                content: studentCardResult.upload.base64,
                contentType:
                  studentCardResult.upload.type || "application/octet-stream",
              },
              {
                filename: idCopyResult.upload.name,
                content: idCopyResult.upload.base64,
                contentType: idCopyResult.upload.type || "application/octet-stream",
              },
            ],
          });
        }

        await prisma.order.update({
          where: { reference },
          data: { emailed: true },
        });
      } catch {
        emailed = false;
      }
    }

    return NextResponse.json({
      ok: true,
      reference,
      emailed,
      selected: {
        slugs: plans.map((plan) => plan.slug),
        items: plans.map((plan) => ({
          slug: plan.slug,
          name: plan.name,
          monthly: plan.monthly,
          deposit: plan.deposit,
        })),
        totals: { monthlyTotal, depositTotal, upfrontTotal },
      },
    });
  } catch (error) {
    console.error("ORDER API ERROR:", error);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}

