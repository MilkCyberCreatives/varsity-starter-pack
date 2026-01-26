import { NextResponse } from "next/server";
import crypto from "crypto";
import { getPlanBySlug } from "@/lib/plans";
import { Resend } from "resend";

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

export async function POST(req: Request) {
  const body = (await req.json()) as Payload;

  const plan = getPlanBySlug(body.appliance);
  if (!plan) {
    return NextResponse.json(
      { ok: false, error: "invalid appliance selection." },
      { status: 400 }
    );
  }

  const fullName = (body.fullName ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const months = Number(body.months ?? 5);

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

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  let emailed = false;

  // If email is configured, send customer confirmation + optional admin notification
  if (RESEND_API_KEY && FROM_EMAIL) {
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
        <p style="margin: 10px 0 0; font-size: 12px; color: #666;">
          Minimum rental is 5 months • Deposits are refundable (less damages)
        </p>
      </div>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
    });

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
            <p style="margin: 0 0 6px;"><strong>university:</strong> ${escapeHtml((body.university ?? "").trim())}</p>
            <p style="margin: 0;"><strong>residence:</strong> ${escapeHtml((body.residence ?? "").trim())}</p>
            <p style="margin: 12px 0 0;"><strong>notes:</strong><br/>${escapeHtml((body.notes ?? "").trim())}</p>
          </div>
        `,
      });
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
}
