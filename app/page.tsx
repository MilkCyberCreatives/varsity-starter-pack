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
    "cheap fridge",
    "second hand fridge vs rent",
    "rent to own appliances",
    "student moving in checklist",
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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.siteUrl}#organization`,
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  logo: siteUrl("/logo.svg"),
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      telephone: siteConfig.phonePrimary,
      email: siteConfig.supportEmail,
      areaServed: "ZA",
      availableLanguage: "en",
    },
  ],
  sameAs: [siteConfig.gbpUrl, siteConfig.facebookUrl],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteConfig.siteUrl}#localbusiness`,
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  image: siteUrl("/hero/hero.jpg"),
  telephone: siteConfig.phonePrimary,
  email: siteConfig.supportEmail,
  address: {
    "@type": "PostalAddress",
    ...siteConfig.address,
  },
  areaServed: ["Midrand", "Johannesburg", "Gauteng"],
  hasMap: siteConfig.gbpUrl,
  sameAs: [siteConfig.gbpUrl, siteConfig.facebookUrl],
};

const serviceCatalogSchema = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Student Appliance Rental Services",
  itemListElement: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Bar Fridge Rental",
        areaServed: "Gauteng",
        provider: {
          "@id": `${siteConfig.siteUrl}#organization`,
        },
      },
      url: siteUrl("/order?appliance=bar-fridge"),
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Microwave Rental",
        areaServed: "Gauteng",
        provider: {
          "@id": `${siteConfig.siteUrl}#organization`,
        },
      },
      url: siteUrl("/order?appliance=microwave"),
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Top Freezer Rental",
        areaServed: "Gauteng",
        provider: {
          "@id": `${siteConfig.siteUrl}#organization`,
        },
      },
      url: siteUrl("/order?appliance=top-freezer"),
    },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={serviceCatalogSchema} />
      <HomePage />
    </>
  );
}
