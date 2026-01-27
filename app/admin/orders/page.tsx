import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <main className="min-h-screen bg-white">
      <MainHeader />
      <BreadcrumbHero
        title="admin orders"
        subtitle="latest order requests (most recent first)."
        crumbs={[{ label: "HOME", href: "/" }, { label: "ADMIN ORDERS" }]}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
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
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-black/60" colSpan={8}>
                      no orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
