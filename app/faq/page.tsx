import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import FAQSection from "@/components/home/FAQSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Student Appliance Rental FAQ",
  description:
    "Answers to common questions on student fridge, microwave, and appliance rentals, deposits, and delivery.",
  path: "/faq",
  keywords: [
    "student fridge rental",
    "microwave rental for students",
    "second hand fridge vs rent",
    "rent to own appliances",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who can lease from us?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our rentals are strictly for students. You will be asked for a student card copy.",
      },
    },
    {
      "@type": "Question",
      name: "Lease period?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The minimum rental period is 5 months. One cannot lease for a short period less than 5 months.",
      },
    },
    {
      "@type": "Question",
      name: "Why is deposit required?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The deposit is once off and refundable at the end of the lease period.",
      },
    },
    {
      "@type": "Question",
      name: "Do you deliver?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we deliver for free to your res/apartment (T&Cs apply). Excluding UJ Soweto campus, a delivery fee applies.",
      },
    },
  ],
};

export default function FAQPage() {
  return (
    <main className="flex min-h-screen flex-col vsp-page-bg">
      <JsonLd data={faqSchema} />
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


