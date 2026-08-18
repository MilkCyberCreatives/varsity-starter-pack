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
    "appliance hire for students",
    "student appliance rentals Gauteng",
  ],
});

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Varsity appliance rental services",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "Bar Fridge Rental",
        areaServed: "Gauteng",
        provider: { "@id": `${siteConfig.siteUrl}#organization` },
        image: siteUrl("/images/pricing/fridge.jpg"),
        offers: {
          "@type": "Offer",
          priceCurrency: "ZAR",
          price: "250",
          url: siteUrl("/order?appliance=bar-fridge"),
        },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "Microwave Rental",
        areaServed: "Gauteng",
        provider: { "@id": `${siteConfig.siteUrl}#organization` },
        image: siteUrl("/images/pricing/microwave.jpg"),
        offers: {
          "@type": "Offer",
          priceCurrency: "ZAR",
          price: "160",
          url: siteUrl("/order?appliance=microwave"),
        },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "Top Freezer Rental",
        areaServed: "Gauteng",
        provider: { "@id": `${siteConfig.siteUrl}#organization` },
        image: siteUrl("/images/pricing/combo.jpg"),
        offers: {
          "@type": "Offer",
          priceCurrency: "ZAR",
          price: "360",
          url: siteUrl("/order?appliance=top-freezer"),
        },
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl("/"),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Pricing",
      item: siteUrl("/pricing"),
    },
  ],
};

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col vsp-page-bg">
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbSchema} />
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
