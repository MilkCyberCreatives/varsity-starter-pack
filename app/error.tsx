"use client";

import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col vsp-page-bg">
      <MainHeader />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold tracking-widest text-white/76">ERROR</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-white">
          something went wrong
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/84">
          please try again. if it keeps happening, use WhatsApp and we will help.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="water-hover water-lift vsp-focus inline-flex items-center justify-center rounded-xl border border-transparent bg-[rgb(var(--vsp-red))] px-6 py-3 text-xs font-semibold tracking-widest text-white"
          >
            TRY AGAIN
          </button>
          <Link
            href="https://wa.me/27734921669"
            target="_blank"
            className="water-hover vsp-focus inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/14 px-6 py-3 text-xs font-semibold tracking-widest text-white hover:bg-white/20"
          >
            WHATSAPP
          </Link>
        </div>
      </section>
      <FooterSection />
    </main>
  );
}


