import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms and Conditions",
  description:
    "Review Varsity Starter Pack rental terms, minimum duration, deposits, and delivery conditions.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col vsp-page-bg">
      <MainHeader />
      <BreadcrumbHero
        title="Terms"
        subtitle="Rental Terms And Conditions."
        crumbs={[{ label: "HOME", href: "/" }, { label: "TERMS" }]}
      />

      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="vsp-card rounded-3xl p-6 text-sm leading-relaxed text-white/84 sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Terms And Conditions
          </h1>
          <p className="mt-4">
            Rentals are for students and require verification documents before
            approval.
          </p>
          <p className="mt-4">
            Minimum rental period is 5 months unless stated otherwise in writing.
          </p>
          <p className="mt-4">
            Deposits are refundable at the end of the rental term, less damage or
            missing item costs.
          </p>
          <p className="mt-4">
            Delivery timing is confirmed after lease completion, supporting
            documents, and deposit confirmation.
          </p>
          <p className="mt-4">
            By submitting an order request, you confirm that provided information is
            accurate and can be used to process your rental.
          </p>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}

