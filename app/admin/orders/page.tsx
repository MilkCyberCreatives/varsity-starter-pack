import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Resend } from "resend";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function toggleEmailed(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const current = await prisma.order.findUnique({ where: { id } });
  if (!current) return;

  await prisma.order.update({
    where: { id },
    data: { emailed: !current.emailed },
  });

  revalidatePath("/admin/orders");
}

async function resendEmail(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return;

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  // If not configured, just revalidate
  if (!RESEND_API_KEY || !FROM_EMAIL) {
    revalidatePath("/admin/orders");
    return;
  }

  const resend = new Resend(RESEND_API_KEY);

  const subject = `varsity starter pack order request • ${order.reference}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin: 0 0 12px;">order request received</h2>
      <p style="margin: 0 0 10px;">Hi ${escapeHtml(order.fullName)},</p>
      <p style="margin: 0 0 14px;">
        Your reference number is: <strong>${order.reference}</strong>
      </p>
      <div style="padding: 12px; border: 1px solid #eee; border-radius: 12px;">
        <p style="margin: 0 0 6px;"><strong>appliance:</strong> ${escapeHtml(order.appliance)}</p>
        <p style="margin: 0 0 6px;"><strong>months:</strong> ${order.months}</p>
      </div>
      <p style="margin: 14px 0 0;">
        Next steps: reply to this email or WhatsApp us with your reference number and we’ll assist.
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email,
      subject,
      html,
    });

    if (ADMIN_EMAIL) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `RESEND • ${order.reference}`,
        html: `<p>Resent email to ${escapeHtml(order.email)} for reference <strong>${order.reference}</strong>.</p>`,
      });
    }

    await prisma.order.update({
      where: { id },
      data: { emailed: true },
    });
  } catch {
    // swallow failures
  }

  revalidatePath("/admin/orders");
}

function escapeHtml(str: string) {
  return (str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default async function AdminOrdersPage() {
  const [orders, total, emailedCount, byAppliance] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.order.count(),
    prisma.order.count({ where: { emailed: true } }),
    prisma.order.groupBy({
      by: ["appliance"],
      _count: { appliance: true },
    }),
  ]);

  const emailedPct = total ? Math.round((emailedCount / total) * 100) : 0;

  const applianceMap = new Map(
    byAppliance.map((x) => [x.appliance, x._count.appliance])
  );

  return (
    <main className="min-h-screen bg-white">
      <MainHeader />

      <BreadcrumbHero
        title="admin orders"
        subtitle="latest order requests (most recent first)."
        crumbs={[{ label: "HOME", href: "/" }, { label: "ADMIN ORDERS" }]}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        {/* Top actions */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="total orders" value={String(total)} />
            <StatCard label="emailed" value={`${emailedCount} (${emailedPct}%)`} />
            <StatCard
              label="bar fridge"
              value={String(applianceMap.get("bar-fridge") ?? 0)}
            />
            <StatCard
              label="microwave"
              value={String(applianceMap.get("microwave") ?? 0)}
            />
          </div>

          <div className="flex gap-2 sm:justify-end">
            <a
              href="/admin/orders/export"
              className="rounded-xl border border-black/15 bg-white px-4 py-2 text-xs font-semibold tracking-widest text-black/70 transition hover:bg-black hover:text-white"
            >
              EXPORT CSV
            </a>

            <a
              href="/admin/logout"
              className="rounded-xl border border-black/15 bg-white px-4 py-2 text-xs font-semibold tracking-widest text-black/70 transition hover:bg-black hover:text-white"
            >
              LOG OUT
            </a>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-3xl border border-black/10 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/5">
                <tr className="text-xs font-semibold tracking-widest text-black/60">
                  <th className="px-4 py-3">DATE</th>
                  <th className="px-4 py-3">REF</th>
                  <th className="px-4 py-3">APPLIANCE</th>
                  <th className="px-4 py-3">NAME</th>
                  <th className="px-4 py-3">PHONE</th>
                  <th className="px-4 py-3">EMAIL</th>
                  <th className="px-4 py-3">MONTHS</th>
                  <th className="px-4 py-3">EMAILED</th>
                  <th className="px-4 py-3">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-black/5">
                    <td className="px-4 py-3 text-black/70">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-semibold text-black">
                      {o.reference}
                    </td>
                    <td className="px-4 py-3 text-black/70">{o.appliance}</td>
                    <td className="px-4 py-3 text-black/70">{o.fullName}</td>
                    <td className="px-4 py-3 text-black/70">{o.phone}</td>
                    <td className="px-4 py-3 text-black/70">{o.email}</td>
                    <td className="px-4 py-3 text-black/70">{o.months}</td>
                    <td className="px-4 py-3 text-black/70">
                      {o.emailed ? "yes" : "no"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <form action={toggleEmailed}>
                          <input type="hidden" name="id" value={o.id} />
                          <button
                            type="submit"
                            className="rounded-xl border border-black/15 bg-white px-3 py-2 text-[11px] font-semibold tracking-widest text-black/70 transition hover:bg-black hover:text-white"
                          >
                            {o.emailed ? "MARK NO" : "MARK YES"}
                          </button>
                        </form>

                        <form action={resendEmail}>
                          <input type="hidden" name="id" value={o.id} />
                          <button
                            type="submit"
                            className="rounded-xl border border-black/15 bg-white px-3 py-2 text-[11px] font-semibold tracking-widest text-black/70 transition hover:bg-black hover:text-white"
                          >
                            RESEND EMAIL
                          </button>
                        </form>

                        <Link
                          href={`https://wa.me/27734921669?text=${encodeURIComponent(
                            `Hi, I'm following up on order reference ${o.reference}. Please assist with next steps.`
                          )}`}
                          target="_blank"
                          className="rounded-xl border border-black/15 bg-white px-3 py-2 text-[11px] font-semibold tracking-widest text-black/70 transition hover:bg-black hover:text-white"
                        >
                          WHATSAPP
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-black/60" colSpan={9}>
                      no orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-xs text-black/50">
          tip: use “export csv” to download orders. “resend email” needs resend
          env vars configured.
        </p>
      </section>

      <FooterSection />
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white px-4 py-3">
      <p className="text-[11px] font-semibold tracking-widest text-black/50">
        {label.toUpperCase()}
      </p>
      <p className="mt-1 text-sm font-semibold text-black">{value}</p>
    </div>
  );
}
