import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Read how Varsity Starter Pack handles student data for order requests and service communication.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="flex min-h-screen flex-col vsp-page-bg">
      <MainHeader />
      <BreadcrumbHero
        title="Privacy"
        subtitle="How We Collect And Use Your Information."
        crumbs={[{ label: "HOME", href: "/" }, { label: "PRIVACY" }]}
      />

      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="vsp-card rounded-3xl p-6 text-sm leading-relaxed text-white/84 sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
          Privacy Policy
          </h1>
          <p className="mt-4">
            We collect personal details you submit in the order form to process
            rentals, verify student status, communicate next steps, and arrange
            delivery.
          </p>
          <p className="mt-4">
            We use your details only for service operations, support, and order
            records. We do not sell your data.
          </p>
          <p className="mt-4">
            Documents uploaded during order requests are used for verification and
            compliance checks. Access is limited to authorized admins.
          </p>
          <p className="mt-4">
            If you need your details updated or removed, contact
            info@varsitystarterpack.co.za.
          </p>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}

