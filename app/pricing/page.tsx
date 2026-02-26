import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import PricingSection from "@/components/home/PricingSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig, siteUrl } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing for Student Fridge and Microwave Rental",
  description:
    "View 2026 student appliance rental rates for bar fridges, microwaves, and top freezers in Johannesburg and Gauteng.",
  path: "/pricing",
  imagePath: "/images/pricing/combo.jpg",
  keywords: [
    "student fridge rental",
    "microwave rental for students",
    "res fridge hire",
    "campus appliance rental",
    "cheap fridge",
    "second hand fridge vs rent",
  ],
});

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Varsity appliance rental services",
  itemListElement: [
    {
      "@type": "Service",
      position: 1,
      name: "Bar Fridge Rental",
      areaServed: "Gauteng",
      provider: siteConfig.name,
      url: siteUrl("/order?appliance=bar-fridge"),
    },
    {
      "@type": "Service",
      position: 2,
      name: "Microwave Rental",
      areaServed: "Gauteng",
      provider: siteConfig.name,
      url: siteUrl("/order?appliance=microwave"),
    },
    {
      "@type": "Service",
      position: 3,
      name: "Top Freezer Rental",
      areaServed: "Gauteng",
      provider: siteConfig.name,
      url: siteUrl("/order?appliance=top-freezer"),
    },
  ],
};

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col vsp-page-bg">
      <JsonLd data={serviceSchema} />
      <MainHeader />
      <BreadcrumbHero
        title="Pricing"
        subtitle="Clear Rates, Refundable Deposits, Student-Only Rentals."
        crumbs={[{ label: "HOME", href: "/" }, { label: "PRICING" }]}
      />

      <PricingSection />
      <FooterSection />
    </main>
  );
}


