import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import Link from "next/link";
import BreadcrumbHero from "@/components/layout/BreadcrumbHero";

export const metadata: Metadata = {
  title: "contact",
  description:
    "contact varsity starter pack for student appliance rentals. reach us via whatsapp or email for enquiries and orders.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <MainHeader />
      <BreadcrumbHero
        title="contact"
        subtitle="whatsapp is the fastest way to confirm availability."
        crumbs={[{ label: "HOME", href: "/" }, { label: "CONTACT" }]}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold tracking-widest text-black/50">
          CONTACT
        </p>

        <h2 className="mt-3 text-4xl font-medium tracking-tight text-black">
          get in touch
        </h2>

        <p className="mt-4 max-w-2xl text-base text-black/65">
          have questions about rentals, deposits, or delivery? reach out and
          we’ll assist you as quickly as possible.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold tracking-widest text-black/50">
              WHATSAPP
            </p>

            <p className="mt-3 text-sm text-black/65">
              fastest way to reach us for orders and confirmations.
            </p>

            <Link
              href="https://wa.me/27734921669"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-xs font-semibold tracking-widest text-white transition hover:opacity-90"
            >
              CHAT ON WHATSAPP
            </Link>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold tracking-widest text-black/50">
              EMAIL
            </p>

            <p className="mt-3 text-sm text-black/65">
              for general enquiries and support.
            </p>

            <p className="mt-4 text-sm font-semibold text-black">
              info@varsitystarterpack.co.za
            </p>
          </div>
        </div>

        <p className="mt-10 text-xs text-black/50">
          student-only service • proof of registration may be required • delivery
          terms apply
        </p>
      </section>

      <FooterSection />
    </main>
  );
}
