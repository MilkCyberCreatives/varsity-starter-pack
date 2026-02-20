import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import TrackedExternalLink from "@/components/marketing/TrackedExternalLink";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Varsity Starter Pack",
  description:
    "Contact Varsity Starter Pack by WhatsApp or email for student appliance rentals in Gauteng.",
  path: "/contact",
  keywords: [
    "student appliance rentals Johannesburg",
    "campus appliance rental",
    "appliance hire for students",
  ],
});

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col vsp-page-bg">
      <MainHeader />
      <BreadcrumbHero
        title="contact"
        subtitle="whatsapp is the fastest way to confirm availability."
        crumbs={[{ label: "HOME", href: "/" }, { label: "CONTACT" }]}
      />

      <section className="vsp-sync-fade-top mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold tracking-widest text-white/76">CONTACT</p>

        <h1 className="mt-3 text-4xl font-medium tracking-tight text-white">get in touch</h1>

        <p className="mt-4 max-w-2xl text-base text-white/84">
          have questions about rentals, deposits, or delivery? reach out and we will
          assist you as quickly as possible.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="vsp-card rounded-3xl p-6">
            <p className="text-xs font-semibold tracking-widest text-white/76">WHATSAPP</p>

            <p className="mt-3 text-sm text-white/84">
              fastest way to reach us for orders and confirmations.
            </p>

            <TrackedExternalLink
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              eventName="click_whatsapp"
              payload={{ source: "contact_page" }}
              className="water-hover water-lift vsp-focus mt-5 inline-flex items-center justify-center rounded-xl border border-transparent bg-[rgb(var(--vsp-red))] px-6 py-3 text-xs font-semibold tracking-widest text-white"
            >
              CHAT ON WHATSAPP
            </TrackedExternalLink>
          </div>

          <div className="vsp-card rounded-3xl p-6">
            <p className="text-xs font-semibold tracking-widest text-white/76">EMAIL</p>

            <p className="mt-3 text-sm text-white/84">for general enquiries and support.</p>

            <p className="mt-4 text-sm font-semibold text-white">{siteConfig.supportEmail}</p>
          </div>

          <div className="vsp-card rounded-3xl p-6 md:col-span-2">
            <p className="text-xs font-semibold tracking-widest text-white/76">REVIEWS</p>
            <p className="mt-3 text-sm text-white/84">
              See public reviews and profile updates on Google Business Profile.
            </p>

            <TrackedExternalLink
              href={siteConfig.gbpUrl}
              target="_blank"
              rel="noreferrer"
              eventName="view_google_reviews"
              payload={{ source: "contact_page" }}
              className="water-hover vsp-focus mt-5 inline-flex items-center justify-center rounded-xl border border-white/26 bg-white px-6 py-3 text-xs font-semibold tracking-widest text-[rgb(var(--vsp-red))] hover:opacity-95"
            >
              VIEW GOOGLE REVIEWS
            </TrackedExternalLink>
          </div>
        </div>

        <p className="mt-10 text-xs text-white/76">
          student-only service, proof of registration may be required, delivery
          terms apply
        </p>
      </section>

      <FooterSection />
    </main>
  );
}


