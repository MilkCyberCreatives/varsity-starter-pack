import type { Metadata } from "next";
import HomePage from "@/components/home/HomePage";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig, siteUrl } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Student Appliance Rentals in Johannesburg and Gauteng",
  description:
    "Student-only appliance rentals for bar fridges, microwaves, and top freezers with delivery to res and apartments in Gauteng.",
  path: "/",
  imagePath: "/hero/hero.jpg",
  keywords: [
    "student fridge rental",
    "microwave rental for students",
    "appliance hire for students",
    "campus appliance rental",
    "res room appliances",
    "affordable student living appliances",
  ],
});

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.siteUrl}/pricing?appliance={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  image: siteUrl("/hero/hero.jpg"),
  telephone: siteConfig.phonePrimary,
  email: siteConfig.supportEmail,
  address: {
    "@type": "PostalAddress",
    ...siteConfig.address,
  },
  areaServed: ["Johannesburg", "Gauteng"],
  sameAs: [siteConfig.gbpUrl, siteConfig.facebookUrl],
};

export default function Page() {
  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={localBusinessSchema} />
      <HomePage />
    </>
  );
}

