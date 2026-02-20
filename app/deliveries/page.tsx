import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";
import DeliveriesMasonry from "@/components/deliveries/DeliveriesMasonry";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Student Delivery Gallery",
  description:
    "Browse recent varsity appliance deliveries to student res and apartments across Gauteng.",
  path: "/deliveries",
  imagePath: "/images/deliveries/delivery-01.jpg",
  keywords: [
    "campus appliance rental",
    "student moving in checklist",
    "res room appliances",
  ],
});

export default function DeliveriesPage() {
  return (
    <main className="flex min-h-screen flex-col vsp-page-bg">
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


