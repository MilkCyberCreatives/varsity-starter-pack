import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import PricingSection from "@/components/home/PricingSection";

export const metadata: Metadata = {
  title: "pricing",
  description:
    "2026 rental rates for bar fridges, microwaves, and top freezers. Student-only rentals with refundable deposits.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <MainHeader />
      <PricingSection />
      <FooterSection />
    </main>
  );
}
