"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const PRIMARY = "#c41a1a";
const SECONDARY = "#1374b8";

export default function HeroSection() {
  return (
    <section className="bg-white">
      {/* Unified red hero block with bottom-only rounding */}
      <div
        className="relative overflow-hidden rounded-b-[36px]"
        style={{ backgroundColor: PRIMARY }}
      >
        {/* Subtle premium gradients inside the red */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(900px circle at 15% 20%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(900px circle at 85% 10%, rgba(19,116,184,0.18), transparent 60%)",
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center px-4 py-12">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12 } },
            }}
            className="max-w-2xl"
          >
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: "easeOut" },
                },
              }}
              className="text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl"
            >
              FRIDGE AND MICROWAVE HIRE
              <span className="block text-white/80">DELIVERED TO YOUR RES</span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: "easeOut" },
                },
              }}
              className="mt-4 max-w-xl text-base leading-relaxed text-white/80"
            >
              Student-only monthly rentals in Gauteng. Maintenance included. Minimum 5 months.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: "easeOut" },
                },
              }}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              {/* Primary CTA */}
              <Link
                href="/order"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-white/90"
              >
                REQUEST ORDER
              </Link>

              {/* Secondary CTA */}
              <a
                href="https://wa.me/27734921669"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-xs font-semibold tracking-widest text-white transition hover:bg-white/10"
              >
                WHATSAPP
              </a>
            </motion.div>

            {/* Micro row */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: "easeOut" },
                },
              }}
              className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/80"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-white">R160+</span>
                <span className="text-white/70">monthly</span>
              </div>

              <span className="hidden h-4 w-px bg-white/25 sm:inline-block" />

              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-white">5+</span>
                <span className="text-white/70">months</span>
              </div>

              <span className="hidden h-4 w-px bg-white/25 sm:inline-block" />

              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold" style={{ color: "#D7EEFF" }}>
                  FREE*
                </span>
                <span className="text-white/70">delivery</span>
              </div>
            </motion.div>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: "easeOut" },
                },
              }}
              className="mt-5 text-xs text-white/70"
            >
              *Free delivery to res/apartment (T&Cs apply). Excluding UJ Soweto Campus (fee applies).
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
