import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import FAQSection from "@/components/home/FAQSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";

export const metadata: Metadata = {
  title: "faq",
  description:
    "answers to common questions about varsity starter pack student-only appliance rentals, delivery, deposits, and rental periods.",
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <MainHeader />
      <BreadcrumbHero
        title="faq"
        subtitle="quick answers to the most common questions."
        crumbs={[{ label: "HOME", href: "/" }, { label: "FAQ" }]}
      />
      <FAQSection />
      <FooterSection />
    </main>
  );
}
