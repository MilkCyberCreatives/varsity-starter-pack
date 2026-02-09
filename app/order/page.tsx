import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";
import OrderForm from "@/components/order/OrderForm";
import { getPlansBySlugs, type ApplianceSlug } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Order",
  description:
    "Request an order for student-only appliance rentals. Select your appliances, get a reference number, and receive next steps via email.",
};

type SearchParams = {
  appliance?: string; // can be "bar-fridge,microwave"
};

export default async function OrderPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const raw = (sp.appliance ?? "").split(",").map((s) => s.trim());
  const selectedPlans = getPlansBySlugs(raw);
  const selectedSlugs = selectedPlans.map((p) => p.slug) as ApplianceSlug[];

  return (
    <main className="min-h-screen bg-white">
      <MainHeader />

      <BreadcrumbHero
        title="Order"
        subtitle="Request an order and receive a reference number."
        crumbs={[{ label: "Home", href: "/" }, { label: "Order" }]}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold tracking-widest text-black/50">ORDER REQUEST</p>

        <h1 className="mt-3 text-4xl font-medium tracking-tight text-black">
          Request An Order
        </h1>

        <p className="mt-4 max-w-2xl text-base text-black/65">
          Selected appliances:{" "}
          <span className="font-semibold text-black">
            {selectedPlans.length ? selectedPlans.map((p) => p.name).join(", ") : "Not selected"}
          </span>
        </p>

        <div className="mt-10">
          <OrderForm selectedSlugs={selectedSlugs} />
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
