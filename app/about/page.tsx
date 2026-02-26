import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About Varsity Starter Pack",
  description:
    "Learn about Varsity Starter Pack and our student-only appliance rental service in Gauteng.",
  path: "/about",
  keywords: [
    "appliance hire for students",
    "student essentials",
    "affordable student living appliances",
  ],
});

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col vsp-page-bg">
      <MainHeader />
      <BreadcrumbHero
        title="About"
        subtitle="Student-Only Appliance Rentals Designed For Res Life."
        crumbs={[{ label: "HOME", href: "/" }, { label: "ABOUT" }]}
      />

      <section className="vsp-sync-fade-top mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold tracking-widest text-white/76">ABOUT</p>

        <h1 className="mt-3 text-4xl font-medium tracking-tight text-white">
          Varsity Starter Pack
        </h1>

        <p className="mt-4 max-w-3xl text-base text-white/84">
          varsity starter pack provides student-only appliance rentals designed for
          res life, simple pricing, maintenance included, and delivery to your
          residence (t&amp;cs apply).
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="vsp-card rounded-3xl p-6">
            <p className="text-xs font-semibold tracking-widest text-white/76">OUR MISSION</p>
            <p className="mt-3 text-sm leading-relaxed text-white/84">
              make student living easier with affordable appliance rentals and a
              process that is fast and stress-free.
            </p>
          </div>

          <div className="vsp-card rounded-3xl p-6">
            <p className="text-xs font-semibold tracking-widest text-white/76">WHAT WE OFFER</p>
            <p className="mt-3 text-sm leading-relaxed text-white/84">
              bar fridges, microwaves, and top freezers with support and
              maintenance included.
            </p>
          </div>

          <div className="vsp-card rounded-3xl p-6">
            <p className="text-xs font-semibold tracking-widest text-white/76">WHO IT IS FOR</p>
            <p className="mt-3 text-sm leading-relaxed text-white/84">
              students only, you may be asked for proof (student card) and a copy
              of your ID.
            </p>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}


