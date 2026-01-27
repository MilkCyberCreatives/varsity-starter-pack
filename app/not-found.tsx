import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white">
      <MainHeader />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold tracking-widest text-black/50">
          404
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-black">
          page not found
        </h1>
        <p className="mt-4 max-w-2xl text-base text-black/65">
          the page you’re looking for doesn’t exist. use the links below.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-xs font-semibold tracking-widest text-white transition hover:bg-black/90"
          >
            GO HOME
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-black/5"
          >
            VIEW PRICING
          </Link>
        </div>
      </section>
      <FooterSection />
    </main>
  );
}
