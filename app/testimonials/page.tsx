import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Student Rental Testimonials",
  description:
    "Read what students say about Varsity Starter Pack appliance rental service and delivery support.",
  path: "/testimonials",
  keywords: [
    "student appliance rentals Johannesburg",
    "res fridge hire",
    "affordable student living appliances",
  ],
});

export default function TestimonialsPage() {
  return (
    <main className="flex min-h-screen flex-col vsp-page-bg">
      <MainHeader />

      <BreadcrumbHero
        title="testimonials"
        subtitle="what students say about the experience."
        crumbs={[{ label: "HOME", href: "/" }, { label: "TESTIMONIALS" }]}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold tracking-widest text-white/76">TESTIMONIALS</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-white">what students say</h1>
        <p className="mt-4 max-w-2xl text-base text-white/84">
          student feedback and review highlights from verified delivery clients.
        </p>

        <div className="vsp-card rounded-3xl p-6 text-sm text-white/84">
          proof images are available from the homepage cards via &quot;view
          proof&quot;.
        </div>
      </section>

      <FooterSection />
    </main>
  );
}


