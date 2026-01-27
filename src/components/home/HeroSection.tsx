"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const PRIMARY = "#c41a1a";

export default function HeroSection() {
  return (
    <section className="bg-white">
      {/* Unified red hero block with bottom-only rounding */}
      <div
        className="relative overflow-hidden rounded-b-[36px]"
        style={{ backgroundColor: PRIMARY }}
      >
        {/* Subtle premium gradients */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(900px circle at 15% 20%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(900px circle at 85% 10%, rgba(19,116,184,0.18), transparent 60%)",
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-24 pb-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* LEFT: text (UNCHANGED) */}
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
                <span className="block text-white/80">
                  DELIVERED TO YOUR RES
                </span>
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
                Student-only monthly rentals in Gauteng. Maintenance included.
                Minimum 5 months.
              </motion.p>

              {/* Buttons (UNCHANGED + stays directly under paragraph) */}
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
                <Link
                  href="/order"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-white/90"
                >
                  REQUEST ORDER
                </Link>

                <a
                  href="https://wa.me/27734921669"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-xs font-semibold tracking-widest text-white transition hover:bg-white/10"
                >
                  WHATSAPP
                </a>
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
                className="mt-10 text-xs text-white/70"
              >
                *Free delivery to res/apartment (T&Cs apply). Excluding UJ Soweto
                Campus (fee applies).
              </motion.p>

              {/* ✅ MOBILE IMAGE (ADDED) — placed AFTER everything so layout stays like your attachment */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: "easeOut" },
                  },
                }}
                className="mt-10 flex justify-center lg:hidden"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  {/* glow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-10 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255,255,255,0.25), transparent 60%)",
                      filter: "blur(12px)",
                    }}
                  />

                  {/* shadow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      filter: "drop-shadow(0 26px 34px rgba(0,0,0,0.18))",
                    }}
                  />

                  <div className="relative h-[320px] w-[320px]">
                    <Image
                      src="/hero/hero.png"
                      alt="fridge and microwave rental"
                      fill
                      priority
                      className="object-contain"
                      sizes="320px"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* RIGHT: desktop image (float + glow + shadow) */}
            <div className="relative z-20 hidden lg:flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                {/* glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-12 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.25), transparent 60%)",
                    filter: "blur(14px)",
                  }}
                />

                {/* soft shadow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.18))",
                  }}
                />

                <div className="relative h-[520px] w-[520px]">
                  <Image
                    src="/hero/hero.png"
                    alt="fridge and microwave rental"
                    fill
                    priority
                    className="object-contain"
                    sizes="520px"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
