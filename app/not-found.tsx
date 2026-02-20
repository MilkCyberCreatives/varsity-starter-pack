import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col vsp-page-bg">
      <MainHeader />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold tracking-widest text-white/76">404</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-white">page not found</h1>
        <p className="mt-4 max-w-2xl text-base text-white/84">
          the page you are looking for does not exist. use the links below.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="water-hover water-lift vsp-focus inline-flex items-center justify-center rounded-xl border border-transparent bg-[rgb(var(--vsp-red))] px-6 py-3 text-xs font-semibold tracking-widest text-white"
          >
            GO HOME
          </Link>
          <Link
            href="/pricing"
            className="water-hover vsp-focus inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/14 px-6 py-3 text-xs font-semibold tracking-widest text-white hover:bg-white/20"
          >
            VIEW PRICING
          </Link>
        </div>
      </section>
      <FooterSection />
    </main>
  );
}


