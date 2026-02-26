import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "How Student Appliance Rental Works",
  description:
    "Follow the booking process from appliance selection to lease approval and delivery scheduling.",
  path: "/how-it-works",
  keywords: [
    "appliance hire for students",
    "student essentials",
    "student moving in checklist",
  ],
});

export default function HowItWorksPage() {
  return (
    <main className="flex min-h-screen flex-col vsp-page-bg">
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


