import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import HowItWorksNumbersSection from "@/components/home/HowItWorksNumbersSection";

export const metadata: Metadata = {
  title: "how it works",
  description:
    "see how varsity starter pack rentals work — choose an appliance, request an order, get your reference number, and schedule delivery.",
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white">
      <MainHeader />
      <HowItWorksSection />
      <HowItWorksNumbersSection />
      <FooterSection />
    </main>
  );
}
