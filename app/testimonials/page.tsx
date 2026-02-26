import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Student Rental Testimonials",
  description:
    "Read what students say about Varsity Starter Pack appliance rental service and delivery support.",
  path: "/testimonials",
  keywords: [
    "student appliance rentals Johannesburg",
    "res fridge hire",
    "affordable student living appliances",
    "student moving in checklist",
    "campus appliance rental",
  ],
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl("/"),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Testimonials",
      item: siteUrl("/testimonials"),
    },
  ],
};

export default function TestimonialsPage() {
  return (
    <main className="flex min-h-screen flex-col vsp-page-bg">
      <JsonLd data={breadcrumbSchema} />
      <MainHeader />

      <BreadcrumbHero
        title="Testimonials"
        subtitle="What Students Say About The Experience."
        crumbs={[{ label: "HOME", href: "/" }, { label: "TESTIMONIALS" }]}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold tracking-widest text-white/76">TESTIMONIALS</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-white">What Students Say</h1>
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


