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
    "rent to own appliances",
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
      "@type": "Service",
      position: 1,
      name: "Bar Fridge Rental",
      areaServed: "Gauteng",
      provider: {
        "@type": "Organization",
        name: siteConfig.name,
      },
      url: siteUrl("/order?appliance=bar-fridge"),
    },
    {
      "@type": "Service",
      position: 2,
      name: "Microwave Rental",
      areaServed: "Gauteng",
      provider: {
        "@type": "Organization",
        name: siteConfig.name,
      },
      url: siteUrl("/order?appliance=microwave"),
    },
    {
      "@type": "Service",
      position: 3,
      name: "Top Freezer Rental",
      areaServed: "Gauteng",
      provider: {
        "@type": "Organization",
        name: siteConfig.name,
      },
      url: siteUrl("/order?appliance=top-freezer"),
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

const productsSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Bar Fridge Rental",
      brand: siteConfig.name,
      image: siteUrl("/images/pricing/fridge.jpg"),
      category: "Student Appliance Rental",
      offers: {
        "@type": "Offer",
        priceCurrency: "ZAR",
        price: "250",
        availability: "https://schema.org/InStock",
        url: siteUrl("/order?appliance=bar-fridge"),
      },
    },
    {
      "@type": "Product",
      name: "Microwave Rental",
      brand: siteConfig.name,
      image: siteUrl("/images/pricing/microwave.jpg"),
      category: "Student Appliance Rental",
      offers: {
        "@type": "Offer",
        priceCurrency: "ZAR",
        price: "160",
        availability: "https://schema.org/InStock",
        url: siteUrl("/order?appliance=microwave"),
      },
    },
    {
      "@type": "Product",
      name: "Top Freezer Rental",
      brand: siteConfig.name,
      image: siteUrl("/images/pricing/combo.jpg"),
      category: "Student Appliance Rental",
      offers: {
        "@type": "Offer",
        priceCurrency: "ZAR",
        price: "360",
        availability: "https://schema.org/InStock",
        url: siteUrl("/order?appliance=top-freezer"),
      },
    },
  ],
};

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col vsp-page-bg">
      <JsonLd data={serviceSchema} />
      <JsonLd data={productsSchema} />
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


