import crypto from "crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";

type Payload = {
  fullName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  website?: string;
  formStartedAt?: number;
};

const RATE = { windowMs: 60_000, max: 4 };
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

function clamp(value: string, max = 160) {
  const text = (value || "").trim();
  return text.length > max ? text.slice(0, max) : text;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function makeReference() {
  const date = new Date();
  const yy = String(date.getUTCFullYear()).slice(-2);
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `VSP-C-${yy}${mm}${dd}-${rand}`;
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
    const website = clamp(body.website ?? "", 30);
    if (website) {
      return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
    }

    const startedAt = Number(body.formStartedAt || 0);
    if (!Number.isFinite(startedAt) || Date.now() - startedAt < 1200) {
      return NextResponse.json(
        { ok: false, error: "Please complete the form and try again." },
        { status: 400 }
      );
    }

    const fullName = clamp(body.fullName ?? "", 80);
    const email = clamp(body.email ?? "", 120).toLowerCase();
    const phone = clamp(body.phone ?? "", 40);
    const subject = clamp(body.subject ?? "", 120);
    const message = clamp(body.message ?? "", 1800);

    if (!fullName) {
      return NextResponse.json({ ok: false, error: "Full name is required." }, { status: 400 });
    }
    if (!email || !isEmail(email)) {
      return NextResponse.json({ ok: false, error: "Valid email is required." }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json(
        { ok: false, error: "Phone number is required." },
        { status: 400 }
      );
    }
    if (!subject) {
      return NextResponse.json({ ok: false, error: "Subject is required." }, { status: 400 });
    }
    if (!message || message.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = process.env.FROM_EMAIL;
    const adminRecipient = process.env.ADMIN_EMAIL || siteConfig.supportEmail;
    if (!RESEND_API_KEY || !FROM_EMAIL) {
      return NextResponse.json(
        { ok: false, error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const reference = makeReference();
    const resend = new Resend(RESEND_API_KEY);

    const adminHtml = `
      <div style="font-family:Arial,sans-serif;line-height:1.5;">
        <h3 style="margin:0 0 10px;">New contact form message</h3>
        <p style="margin:0 0 6px;"><strong>Reference:</strong> ${reference}</p>
        <p style="margin:0 0 6px;"><strong>Name:</strong> ${escapeHtml(fullName)}</p>
        <p style="margin:0 0 6px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="margin:0 0 6px;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p style="margin:0 0 6px;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p style="margin:10px 0 0;"><strong>Message:</strong></p>
        <p style="margin:6px 0 0;white-space:pre-wrap;">${escapeHtml(message)}</p>
      </div>
    `;

    const customerHtml = `
      <div style="font-family:Arial,sans-serif;line-height:1.5;">
        <h2 style="margin:0 0 12px;">Message received</h2>
        <p style="margin:0 0 10px;">Hi ${escapeHtml(fullName)},</p>
        <p style="margin:0 0 10px;">Thank you for contacting Varsity Starter Pack.</p>
        <p style="margin:0 0 10px;">Your reference number is <strong>${reference}</strong>.</p>
        <p style="margin:0 0 10px;">Our team will respond to your enquiry as soon as possible.</p>
      </div>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: adminRecipient,
      replyTo: email,
      subject: `Contact Form - ${reference} - ${subject}`,
      html: adminHtml,
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Varsity Starter Pack Contact - ${reference}`,
      html: customerHtml,
    });

    return NextResponse.json({ ok: true, reference });
  } catch (error) {
    console.error("CONTACT API ERROR:", error);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
