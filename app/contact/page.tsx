import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";

export const metadata: Metadata = {
  title: "contact",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <MainHeader />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold tracking-widest text-black/50">
          CONTACT
        </p>

        <h1 className="mt-3 text-4xl font-medium tracking-tight text-black">
          get in touch
        </h1>

        <p className="mt-4 max-w-2xl text-base text-black/65">
          for quick assistance, use WhatsApp. you can also email us for formal
          queries and requirements.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <a
            href="https://wa.me/27734921669"
            target="_blank"
            rel="noreferrer"
            className="rounded-3xl border border-black/10 bg-white p-6 transition hover:bg-black/5"
          >
            <p className="text-xs font-semibold tracking-widest text-black/50">
              WHATSAPP
            </p>
            <p className="mt-3 text-sm font-semibold text-black">
              +27 73 492 1669
            </p>
            <p className="mt-2 text-sm text-black/65">
              fastest way to confirm availability and next steps.
            </p>
          </a>

          <a
            href="mailto:info@varsitystarterpack.co.za"
            className="rounded-3xl border border-black/10 bg-white p-6 transition hover:bg-black/5"
          >
            <p className="text-xs font-semibold tracking-widest text-black/50">
              EMAIL
            </p>
            <p className="mt-3 text-sm font-semibold text-black">
              info@varsitystarterpack.co.za
            </p>
            <p className="mt-2 text-sm text-black/65">
              send requirements, campus/res details, and questions.
            </p>
          </a>

          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold tracking-widest text-black/50">
              HOURS
            </p>
            <p className="mt-3 text-sm font-semibold text-black">
              mon–sat
            </p>
            <p className="mt-2 text-sm text-black/65">
              response times may vary during peak res intake.
            </p>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
