import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";

export const metadata: Metadata = {
  title: "about",
  description:
    "learn more about varsity starter pack and our student-only appliance rentals designed for res life.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <MainHeader />
      <BreadcrumbHero
        title="about"
        subtitle="student-only appliance rentals designed for res life."
        crumbs={[{ label: "HOME", href: "/" }, { label: "ABOUT" }]}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold tracking-widest text-black/50">
          ABOUT
        </p>

        <h2 className="mt-3 text-4xl font-medium tracking-tight text-black">
          varsity starter pack
        </h2>

        <p className="mt-4 max-w-3xl text-base text-black/65">
          varsity starter pack provides student-only appliance rentals designed
          for res life — simple pricing, maintenance included, and delivery to
          your residence (t&cs apply).
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold tracking-widest text-black/50">
              OUR MISSION
            </p>
            <p className="mt-3 text-sm leading-relaxed text-black/65">
              make student living easier with affordable appliance rentals and a
              process that’s fast and stress-free.
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold tracking-widest text-black/50">
              WHAT WE OFFER
            </p>
            <p className="mt-3 text-sm leading-relaxed text-black/65">
              bar fridges, microwaves, and top freezers with support and
              maintenance included.
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold tracking-widest text-black/50">
              WHO IT’S FOR
            </p>
            <p className="mt-3 text-sm leading-relaxed text-black/65">
              students only — you may be asked for proof (student card) and a
              copy of your ID.
            </p>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
