import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import FAQSection from "@/components/home/FAQSection";

export const metadata: Metadata = {
  title: "faq",
  description:
    "answers to common questions about varsity starter pack student-only appliance rentals, delivery, deposits, and rental periods.",
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <MainHeader />
      <FAQSection />
      <FooterSection />
    </main>
  );
}
