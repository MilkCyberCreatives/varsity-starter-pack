import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "How Student Appliance Rental Works",
  description:
    "Follow the booking process from appliance selection to lease approval and delivery scheduling.",
  path: "/how-it-works",
  keywords: [
    "appliance hire for students",
    "student essentials",
    "student moving in checklist",
    "campus appliance rental",
    "student appliance rentals Gauteng",
  ],
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${siteConfig.siteUrl}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "How It Works",
      item: `${siteConfig.siteUrl}/how-it-works`,
    },
  ],
};

export default function HowItWorksPage() {
  return (
    <main className="flex min-h-screen flex-col vsp-page-bg">
      <JsonLd data={breadcrumbSchema} />
      <MainHeader />
      <BreadcrumbHero
        title="How It Works"
        subtitle="Simple Steps, Zero Stress."
        crumbs={[{ label: "HOME", href: "/" }, { label: "HOW IT WORKS" }]}
      />

      <HowItWorksSection />
      <FooterSection />
    </main>
  );
}
