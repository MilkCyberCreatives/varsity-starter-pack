import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";
import DeliveriesMasonry from "@/components/deliveries/DeliveriesMasonry";

export const metadata: Metadata = {
  title: "deliveries",
  description:
    "see recent varsity starter pack deliveries to student res and apartments.",
};

export default function DeliveriesPage() {
  return (
    <main className="min-h-screen bg-white">
      <MainHeader />

      <BreadcrumbHero
        title="Deliveries"
        subtitle="See recent deliveries to res and apartments."
        crumbs={[{ label: "Home", href: "/" }, { label: "Deliveries" }]}
      />

      <DeliveriesMasonry />

      <FooterSection />
    </main>
  );
}
