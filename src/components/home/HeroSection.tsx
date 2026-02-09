"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const PRIMARY = "#c41a1a";

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-white" aria-label="varsity starter pack hero">
      <div
        className="relative overflow-hidden rounded-b-[36px]"
        style={{ backgroundColor: PRIMARY }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(900px circle at 15% 20%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(900px circle at 85% 10%, rgba(19,116,184,0.18), transparent 60%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-14 pb-14 sm:pt-16 sm:pb-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* LEFT */}
            <motion.div
              initial={reduceMotion ? false : "hidden"}
              whileInView={reduceMotion ? undefined : "show"}
              viewport={{ once: true, margin: "-120px" }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
              className="max-w-2xl"
            >
              <motion.h1
                variants={{
                  hidden: reduceMotion ? {} : { opacity: 0, y: 16 },
                  show: reduceMotion
                    ? {}
                    : { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
                }}
                className="text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl"
              >
                <span className="block uppercase tracking-wide">
                  FRIDGE AND MICROWAVE HIRE FOR STUDENTS
                </span>
              </motion.h1>

              <motion.div
                variants={{
                  hidden: reduceMotion ? {} : { opacity: 0, y: 14 },
                  show: reduceMotion
                    ? {}
                    : { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
                }}
                className="mt-7 flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  href="/order"
                  className="water-hover water-lift vsp-focus inline-flex items-center justify-center rounded-xl bg-white px-7 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-white/90"
                >
                  REQUEST ORDER
                </Link>

                <a
                  href="https://wa.me/27734921669"
                  target="_blank"
                  rel="noreferrer"
                  className="water-hover vsp-focus inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-3 text-xs font-semibold tracking-widest text-white transition hover:bg-white/10"
                >
                  WHATSAPP
                </a>
              </motion.div>
            </motion.div>

            {/* RIGHT */}
            <div className="relative z-20 flex items-center justify-center">
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
                transition={
                  reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }
                }
                className="relative"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-12 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.25), transparent 60%)",
                    filter: "blur(14px)",
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.18))" }}
                />

                {/* shift image slightly left on desktop */}
                <div className="relative h-[320px] w-[320px] sm:h-[420px] sm:w-[420px] lg:h-[520px] lg:w-[520px] lg:-translate-x-6">
                  <Image
                    src="/hero/hero.png"
                    alt="Fridge and microwave rental package"
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 640px) 320px, (max-width: 1024px) 420px, 520px"
                  />
                </div>

                {/* ✅ balloons INSIDE hero, far right, no overflow */}
                <div className="pointer-events-none absolute right-0 top-12 z-30 hidden sm:block">
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                    className="translate-x-6"
                  >
                    <div className="relative">
                      <div className="rounded-2xl bg-white px-4 py-2 text-[12px] font-extrabold tracking-wide text-black shadow-[0_18px_40px_rgba(0,0,0,0.18)] ring-1 ring-black/5 sm:text-[13px]">
                        DELIVERED FOR FREE
                      </div>
                      <div className="absolute left-4 -bottom-2 h-4 w-4 rotate-45 rounded-[4px] bg-white shadow-[0_12px_24px_rgba(0,0,0,0.12)] ring-1 ring-black/5" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
                    className="mt-3 translate-x-6"
                  >
                    <div className="relative max-w-[260px]">
                      <div className="rounded-2xl bg-white/95 px-4 py-3 text-[11px] font-semibold leading-snug text-black shadow-[0_18px_40px_rgba(0,0,0,0.16)] ring-1 ring-black/5">
                        Free delivery to res/apartment (T&amp;Cs apply). Excluding UJ Soweto Campus (fee applies).
                      </div>
                      <div className="absolute left-4 -bottom-2 h-4 w-4 rotate-45 rounded-[4px] bg-white/95 shadow-[0_12px_24px_rgba(0,0,0,0.10)] ring-1 ring-black/5" />
                    </div>
                  </motion.div>
                </div>

                {/* Mobile fallback */}
                <div className="absolute right-3 top-6 z-30 sm:hidden">
                  <div className="rounded-2xl bg-white px-3 py-2 text-[11px] font-extrabold tracking-wide text-black shadow-[0_18px_40px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
                    DELIVERED FOR FREE
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-10"
          style={{ background: "linear-gradient(to bottom, rgba(196,26,26,0), rgba(255,255,255,0.10))" }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
