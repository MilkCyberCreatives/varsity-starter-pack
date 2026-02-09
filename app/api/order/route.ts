import { NextResponse } from "next/server";
import crypto from "crypto";
import { getPlansBySlugs } from "@/lib/plans";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Upload = { name: string; type: string; base64: string };

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
  uploads?: {
    studentCard?: Upload | null;
    idCopy?: Upload | null;
  };
};

function makeReference() {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `VSP-${yy}${mm}${dd}-${rand}`;
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function escapeHtml(str: string) {
  return (str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clamp(s: string, max = 220) {
  const x = (s ?? "").trim();
  return x.length > max ? x.slice(0, max) : x;
}

/** basic best-effort rate limit */
const RATE = { windowMs: 60_000, max: 6 };
const rateMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
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

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const body = (await req.json()) as Payload;

    const appliances = Array.isArray(body.appliances) ? body.appliances : [];
    const plans = getPlansBySlugs(appliances);

    if (!plans.length) {
      return NextResponse.json(
        { ok: false, error: "Please select at least one appliance." },
        { status: 400 }
      );
    }

    const fullName = clamp(body.fullName ?? "", 80);
    const email = clamp(body.email ?? "", 120);
    const phone = clamp(body.phone ?? "", 30);
    const months = Number(body.months ?? 5);

    const university = clamp(body.university ?? "", 80);
    const residence = clamp(body.residence ?? "", 80);
    const deliveryDate = clamp(body.deliveryDate ?? "", 30);
    const notes = clamp(body.notes ?? "", 600);

    const studentCard = body.uploads?.studentCard ?? null;
    const idCopy = body.uploads?.idCopy ?? null;

    if (!fullName) return NextResponse.json({ ok: false, error: "Full name is required." }, { status: 400 });
    if (!email || !isEmail(email)) return NextResponse.json({ ok: false, error: "Valid email is required." }, { status: 400 });
    if (!phone) return NextResponse.json({ ok: false, error: "Phone number is required." }, { status: 400 });
    if (!university) return NextResponse.json({ ok: false, error: "University is required." }, { status: 400 });
    if (!residence) return NextResponse.json({ ok: false, error: "Residence / apartment is required." }, { status: 400 });
    if (!Number.isFinite(months) || months < 5) return NextResponse.json({ ok: false, error: "Minimum rental period is 5 months." }, { status: 400 });
    if (!deliveryDate) return NextResponse.json({ ok: false, error: "Delivery date is required." }, { status: 400 });

    if (!studentCard?.base64 || !studentCard?.name) return NextResponse.json({ ok: false, error: "Student card upload is required." }, { status: 400 });
    if (!idCopy?.base64 || !idCopy?.name) return NextResponse.json({ ok: false, error: "ID copy upload is required." }, { status: 400 });

    const reference = makeReference();

    const monthlyTotal = plans.reduce((s, p) => s + p.monthlyAmount, 0);
    const depositTotal = plans.reduce((s, p) => s + p.depositAmount, 0);
    const upfrontTotal = depositTotal;

    // ✅ save in DB (no schema changes): appliance is a string field
    const applianceStored = plans.map((p) => p.slug).join(",");

    const notesStored = [
      notes ? `Notes: ${notes}` : "",
      `Delivery date: ${deliveryDate}`,
      `Totals: monthly=${monthlyTotal} deposit=${depositTotal} upfront=${upfrontTotal}`,
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
            (p) => `
              <tr>
                <td style="padding:8px 0;"><strong>${escapeHtml(p.name)}</strong></td>
                <td style="padding:8px 0; text-align:right;">R${p.monthlyAmount}</td>
                <td style="padding:8px 0; text-align:right;">R${p.depositAmount}</td>
              </tr>
            `
          )
          .join("");

        const subjectCustomer = `Varsity Starter Pack Order Request • ${reference}`;

        const htmlCustomer = `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2 style="margin: 0 0 12px;">Order request received</h2>
            <p style="margin: 0 0 10px;">Hi ${escapeHtml(fullName)},</p>
            <p style="margin: 0 0 14px;">
              Thanks for your request. Your reference number is:
              <strong>${reference}</strong>
            </p>

            <div style="padding: 14px; border: 1px solid #eee; border-radius: 14px;">
              <p style="margin: 0 0 10px;"><strong>Delivery date:</strong> ${escapeHtml(deliveryDate)}</p>
              <table style="width:100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="text-align:left; padding-bottom:6px; border-bottom:1px solid #eee;">Item</th>
                    <th style="text-align:right; padding-bottom:6px; border-bottom:1px solid #eee;">Monthly</th>
                    <th style="text-align:right; padding-bottom:6px; border-bottom:1px solid #eee;">Deposit</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td style="padding-top:10px; border-top:1px solid #eee;"><strong>Totals</strong></td>
                    <td style="padding-top:10px; border-top:1px solid #eee; text-align:right;"><strong>R${monthlyTotal}</strong></td>
                    <td style="padding-top:10px; border-top:1px solid #eee; text-align:right;"><strong>R${depositTotal}</strong></td>
                  </tr>
                </tfoot>
              </table>
              <p style="margin: 12px 0 0;">
                <strong>Upfront (deposit total):</strong> R${upfrontTotal}
              </p>
            </div>

            <p style="margin: 14px 0 0;">
              Next steps: our admin will reply with banking details and the lease process.
              You can also WhatsApp us using your reference number.
            </p>
          </div>
        `;

        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: subjectCustomer,
          html: htmlCustomer,
        });

        emailed = true;

        if (ADMIN_EMAIL) {
          const subjectAdmin = `NEW Order Request • ${reference}`;
          const htmlAdmin = `
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
              <h3 style="margin: 0 0 10px;">New order request</h3>
              <p style="margin: 0 0 6px;"><strong>Reference:</strong> ${reference}</p>
              <p style="margin: 0 0 6px;"><strong>Name:</strong> ${escapeHtml(fullName)}</p>
              <p style="margin: 0 0 6px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p style="margin: 0 0 6px;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
              <p style="margin: 0 0 6px;"><strong>University:</strong> ${escapeHtml(university)}</p>
              <p style="margin: 0 0 6px;"><strong>Residence:</strong> ${escapeHtml(residence)}</p>
              <p style="margin: 0 0 6px;"><strong>Months:</strong> ${months}</p>
              <p style="margin: 0 0 12px;"><strong>Delivery date:</strong> ${escapeHtml(deliveryDate)}</p>

              <div style="padding: 14px; border: 1px solid #eee; border-radius: 14px;">
                <table style="width:100%; border-collapse: collapse;">
                  <thead>
                    <tr>
                      <th style="text-align:left; padding-bottom:6px; border-bottom:1px solid #eee;">Item</th>
                      <th style="text-align:right; padding-bottom:6px; border-bottom:1px solid #eee;">Monthly</th>
                      <th style="text-align:right; padding-bottom:6px; border-bottom:1px solid #eee;">Deposit</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td style="padding-top:10px; border-top:1px solid #eee;"><strong>Totals</strong></td>
                      <td style="padding-top:10px; border-top:1px solid #eee; text-align:right;"><strong>R${monthlyTotal}</strong></td>
                      <td style="padding-top:10px; border-top:1px solid #eee; text-align:right;"><strong>R${depositTotal}</strong></td>
                    </tr>
                  </tfoot>
                </table>
                <p style="margin: 12px 0 0;">
                  <strong>Upfront (deposit total):</strong> R${upfrontTotal}
                </p>
              </div>

              ${notes ? `<p style="margin: 12px 0 0;"><strong>Notes:</strong><br/>${escapeHtml(notes)}</p>` : ""}
            </div>
          `;

          await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject: subjectAdmin,
            html: htmlAdmin,
            attachments: [
              {
                filename: studentCard.name,
                content: studentCard.base64,
                contentType: studentCard.type || "application/octet-stream",
              },
              {
                filename: idCopy.name,
                content: idCopy.base64,
                contentType: idCopy.type || "application/octet-stream",
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
        slugs: plans.map((p) => p.slug),
        items: plans.map((p) => ({
          slug: p.slug,
          name: p.name,
          monthly: p.monthly,
          deposit: p.deposit,
        })),
        totals: { monthlyTotal, depositTotal, upfrontTotal },
      },
    });
  } catch (err) {
    console.error("ORDER API ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
