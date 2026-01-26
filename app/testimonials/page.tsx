import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";

export const metadata: Metadata = {
  title: "testimonials",
  description: "what students say about varsity starter pack rentals.",
};

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-white">
      <MainHeader />

      <BreadcrumbHero
        title="testimonials"
        subtitle="what students say about the experience."
        crumbs={[{ label: "HOME", href: "/" }, { label: "TESTIMONIALS" }]}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold tracking-widest text-black/50">
          TESTIMONIALS
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-black">
          what students say
        </h1>
        <p className="mt-4 max-w-2xl text-base text-black/65">
          we’ll expand this page with more reviews and proof screenshots.
        </p>

        <div className="mt-10 rounded-3xl border border-black/10 bg-white p-6 text-sm text-black/70">
          proof images are available from the homepage cards via “view proof”.
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
