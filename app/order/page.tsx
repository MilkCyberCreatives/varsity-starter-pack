import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";
import OrderForm from "@/components/order/OrderForm";
import JsonLd from "@/components/seo/JsonLd";
import { getPlansBySlugs, type ApplianceSlug } from "@/lib/plans";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig, siteUrl } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Order Student Appliance Rental",
  description:
    "Submit a student appliance rental order request, choose multiple appliances, and receive your reference number by email.",
  path: "/order",
  imagePath: "/images/pricing/combo.jpg",
  keywords: [
    "appliance hire for students",
    "student appliance rentals Johannesburg",
    "student essentials",
    "res room appliances",
    "student moving in checklist",
  ],
});

type SearchParams = {
  appliance?: string;
  months?: string;
};

const orderServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Student appliance rental order service",
  provider: {
    "@type": "Organization",
    name: siteConfig.name,
  },
  areaServed: "Gauteng",
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: siteUrl("/order"),
  },
};

export default async function OrderPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const raw = (sp.appliance ?? "").split(",").map((value) => value.trim());
  const selectedPlans = getPlansBySlugs(raw);
  const selectedSlugs = selectedPlans.map((plan) => plan.slug) as ApplianceSlug[];
  const rawMonths = Number(sp.months ?? 5);
  const initialMonths =
    Number.isFinite(rawMonths) && rawMonths >= 5 && rawMonths <= 36
      ? Math.floor(rawMonths)
      : 5;

  return (
    <main className="flex min-h-screen flex-col vsp-page-bg">
      <JsonLd data={orderServiceSchema} />
      <MainHeader />

      <BreadcrumbHero
        title="Order"
        subtitle="Request an order and receive a reference number."
        crumbs={[{ label: "Home", href: "/" }, { label: "Order" }]}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold tracking-widest text-white/76">ORDER REQUEST</p>

        <h1 className="mt-3 text-4xl font-medium tracking-tight text-white">
          Request An Order
        </h1>

        <p className="mt-4 max-w-2xl text-base text-white/84">
          Selected appliances:{" "}
          <span className="font-semibold text-white">
            {selectedPlans.length
              ? selectedPlans.map((plan) => plan.name).join(", ")
              : "Not selected"}
          </span>
        </p>

        <div className="mt-8">
          <OrderForm selectedSlugs={selectedSlugs} initialMonths={initialMonths} />
        </div>
      </section>

      <FooterSection />
    </main>
  );
}


