"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const PRIMARY = "#c41a1a";
const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const LINKS = [
  { label: "HOME", href: "/" },
  { label: "PRICING", href: "/pricing" },
  { label: "HOW IT WORKS", href: "/how-it-works" },
  { label: "FAQ", href: "/faq" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

export default function FooterSection() {
  return (
    <footer className="relative bg-black">
      {/* subtle premium background texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px circle at 15% 10%, rgba(196,26,26,0.12), transparent 60%), radial-gradient(900px circle at 85% 10%, rgba(19,116,184,0.10), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 pt-14">
        {/* MAIN FOOTER */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: premiumEase }}
          className="grid gap-10 border-t border-white/10 pt-12 md:grid-cols-12"
        >
          {/* BRAND */}
          <div className="md:col-span-5">
            <Image src="/logo2.svg" alt="VARSITY STARTER PACK" width={130} height={24} priority />

            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65">
              student-only appliance rentals in gauteng. fridge and microwave hire
              with maintenance included and reliable delivery.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://wa.me/27734921669"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-xs font-semibold tracking-widest text-white transition hover:opacity-90"
                style={{ backgroundColor: PRIMARY }}
              >
                WHATSAPP US
              </a>

              <Link
                href="/order"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-transparent px-6 py-3 text-xs font-semibold tracking-widest text-white transition hover:bg-white/10"
              >
                REQUEST ORDER
              </Link>
            </div>

            <p className="mt-5 text-xs text-white/45">
              minimum rental: 5 months • deposits refundable (less damages)
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="md:col-span-3">
            <p className="text-xs font-semibold tracking-widest text-white/50">
              QUICK LINKS
            </p>

            <ul className="mt-4 space-y-3">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-medium text-white/70 transition hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="md:col-span-4">
            <p className="text-xs font-semibold tracking-widest text-white/50">
              CONTACT
            </p>

            <div className="mt-4 space-y-3 text-sm text-white/70">
              <p>
                <span className="font-semibold text-white">location:</span>{" "}
                gauteng, south africa
              </p>

              <p>
                <span className="font-semibold text-white">whatsapp:</span>{" "}
                <a href="tel:0734921669" className="hover:text-white">
                  073 492 1669
                </a>{" "}
                /{" "}
                <a href="tel:0712708068" className="hover:text-white">
                  071 270 8068
                </a>
              </p>

              <p>
                <span className="font-semibold text-white">email:</span>{" "}
                <a
                  href="mailto:Varsitystarterpack@gmail.com"
                  className="hover:text-white"
                >
                  Varsitystarterpack@gmail.com
                </a>
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/60 p-4">
              <p className="text-xs font-semibold tracking-widest text-white/50">
                NOTE
              </p>
              <p className="mt-2 text-sm text-white/65">
                delivery is free to res/apartment (t&cs apply). excluding uj soweto
                campus (fee applies).
              </p>
            </div>
          </div>
        </motion.div>

        {/* BOTTOM BAR */}
        <div className="mt-12 border-t border-white/10 py-6">
          <div className="flex flex-col gap-3 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} varsity starter pack. all rights reserved.
            </p>

            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-white">
                privacy
              </Link>
              <Link href="/terms" className="hover:text-white">
                terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
