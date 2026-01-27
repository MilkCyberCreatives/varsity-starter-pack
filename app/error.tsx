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
    <main className="min-h-screen bg-white">
      <MainHeader />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold tracking-widest text-black/50">
          ERROR
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-black">
          something went wrong
        </h1>
        <p className="mt-4 max-w-2xl text-base text-black/65">
          please try again. if it keeps happening, use WhatsApp and we’ll help.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-xs font-semibold tracking-widest text-white transition hover:bg-black/90"
          >
            TRY AGAIN
          </button>
          <Link
            href="https://wa.me/27734921669"
            target="_blank"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-black/5"
          >
            WHATSAPP
          </Link>
        </div>
      </section>
      <FooterSection />
    </main>
  );
}
