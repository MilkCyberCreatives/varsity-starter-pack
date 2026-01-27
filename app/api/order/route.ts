import { NextResponse } from "next/server";
import crypto from "crypto";
import { getPlanBySlug } from "@/lib/plans";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Payload = {
  appliance?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  university?: string;
  residence?: string;
  months?: number;
  notes?: string;
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
  return str
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

/** Basic rate-limit (best-effort for serverless) */
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
        { ok: false, error: "too many requests. please try again shortly." },
        { status: 429 }
      );
    }

    const body = (await req.json()) as Payload;

    const plan = getPlanBySlug(body.appliance);
    if (!plan) {
      return NextResponse.json(
        { ok: false, error: "invalid appliance selection." },
        { status: 400 }
      );
    }

    const fullName = clamp(body.fullName ?? "", 80);
    const email = clamp(body.email ?? "", 120);
    const phone = clamp(body.phone ?? "", 30);
    const months = Number(body.months ?? 5);

    const university = clamp(body.university ?? "", 80);
    const residence = clamp(body.residence ?? "", 80);
    const notes = clamp(body.notes ?? "", 600);

    if (!fullName) {
      return NextResponse.json(
        { ok: false, error: "full name is required." },
        { status: 400 }
      );
    }
    if (!email || !isEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "valid email is required." },
        { status: 400 }
      );
    }
    if (!phone) {
      return NextResponse.json(
        { ok: false, error: "phone number is required." },
        { status: 400 }
      );
    }
    if (!Number.isFinite(months) || months < 5) {
      return NextResponse.json(
        { ok: false, error: "minimum rental period is 5 months." },
        { status: 400 }
      );
    }

    const reference = makeReference();

    // ✅ Save order first
    await prisma.order.create({
      data: {
        reference,
        appliance: plan.slug,
        fullName,
        email,
        phone,
        university: university || null,
        residence: residence || null,
        months,
        notes: notes || null,
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

        const subject = `varsity starter pack order request • ${reference}`;
        const html = `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2 style="margin: 0 0 12px;">order request received</h2>
            <p style="margin: 0 0 10px;">Hi ${escapeHtml(fullName)},</p>
            <p style="margin: 0 0 14px;">
              Thanks for your request. Your reference number is:
              <strong>${reference}</strong>
            </p>

            <div style="padding: 12px; border: 1px solid #eee; border-radius: 12px;">
              <p style="margin: 0 0 6px;"><strong>appliance:</strong> ${plan.name}</p>
              <p style="margin: 0 0 6px;"><strong>monthly:</strong> ${plan.monthly}</p>
              <p style="margin: 0;"><strong>deposit:</strong> ${plan.deposit}</p>
            </div>

            <p style="margin: 14px 0 0;">
              Next steps: reply to this email or WhatsApp us with your reference number and we’ll assist.
            </p>
          </div>
        `;

        await resend.emails.send({ from: FROM_EMAIL, to: email, subject, html });

        emailed = true;

        if (ADMIN_EMAIL) {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject: `NEW order request • ${reference}`,
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h3 style="margin: 0 0 10px;">new order request</h3>
                <p style="margin: 0 0 6px;"><strong>reference:</strong> ${reference}</p>
                <p style="margin: 0 0 6px;"><strong>name:</strong> ${escapeHtml(fullName)}</p>
                <p style="margin: 0 0 6px;"><strong>email:</strong> ${escapeHtml(email)}</p>
                <p style="margin: 0 0 6px;"><strong>phone:</strong> ${escapeHtml(phone)}</p>
                <p style="margin: 0 0 6px;"><strong>appliance:</strong> ${plan.name}</p>
                <p style="margin: 0 0 6px;"><strong>months:</strong> ${months}</p>
                <p style="margin: 0 0 6px;"><strong>university:</strong> ${escapeHtml(university)}</p>
                <p style="margin: 0;"><strong>residence:</strong> ${escapeHtml(residence)}</p>
                <p style="margin: 12px 0 0;"><strong>notes:</strong><br/>${escapeHtml(notes)}</p>
              </div>
            `,
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
        slug: plan.slug,
        name: plan.name,
        monthly: plan.monthly,
        deposit: plan.deposit,
      },
    });
  } catch (err) {
    console.error("ORDER API ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "server error. please try again." },
      { status: 500 }
    );
  }
}
