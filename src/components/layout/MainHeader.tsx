"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const PRIMARY = "#c41a1a";

const NAV = [
  { label: "HOME", href: "/" },
  { label: "PRICING", href: "/pricing" },
  { label: "HOW IT WORKS", href: "/how-it-works" },
  { label: "FAQ", href: "/faq" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

export default function MainHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: PRIMARY }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* White logo */}
        <Link href="/" className="flex items-center">
          <div className="relative h-9 w-[170px] sm:h-10 sm:w-[210px]">
            <Image
              src="/logo2.svg"
              alt="VARSITY STARTER PACK"
              fill
              priority
              className="object-contain"
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 lg:flex">
          <nav className="flex items-center gap-7">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-xs font-semibold tracking-widest text-white/85 transition hover:text-white"
              >
                {item.label}
                <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-white/30 transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA (single color, no gradient, no shadow) */}
          <Link
            href="/order"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-xs font-semibold tracking-widest text-black transition hover:bg-white/90"
            aria-label="request order"
          >
            REQUEST ORDER
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/order"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-xs font-semibold tracking-widest text-black transition hover:bg-white/90"
          >
            REQUEST
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="toggle menu"
            aria-expanded={open}
          >
            <span className="text-lg leading-none">{open ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/15 bg-white/10 backdrop-blur-md lg:hidden">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="grid gap-2">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 text-xs font-semibold tracking-widest text-white/90 transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 grid gap-2">
              <Link
                href="/order"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-white/90"
              >
                REQUEST ORDER
              </Link>

              <a
                href="https://wa.me/27734921669"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/25 bg-white/5 px-4 py-3 text-xs font-semibold tracking-widest text-white transition hover:bg-white/10"
              >
                WHATSAPP
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
