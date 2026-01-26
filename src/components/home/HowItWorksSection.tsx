"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants, easeOut } from "framer-motion";

const PRIMARY = "#c41a1a";
const SECONDARY = "#1374b8";

const STEPS = [
  {
    n: "1",
    title: "choose your appliance",
    desc: "select a bar fridge, microwave, or top freezer based on what you need at res.",
  },
  {
    n: "2",
    title: "request an order",
    desc: "submit your details and rental period (minimum 5 months).",
  },
  {
    n: "3",
    title: "get your reference",
    desc: "we send a unique reference number and payment steps via email.",
  },
  {
    n: "4",
    title: "delivery to your res",
    desc: "once payment and documents are confirmed, we schedule delivery (t&cs apply).",
  },
];

// Premium easing (Apple/Stripe-like)
const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

export default function HowItWorksSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Full-width background image */}
      <div className="absolute inset-0">
        <Image
          src="/how-it-works/bg.jpg"
          alt="how it works background"
          fill
          className="object-cover"
          priority={false}
        />

        {/* Premium overlay: less milky, more crisp */}
        <div className="absolute inset-0 bg-white/60" />

        {/* Subtle brand wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px circle at 15% 15%, rgba(196,26,26,0.10), transparent 60%), radial-gradient(900px circle at 85% 20%, rgba(19,116,184,0.10), transparent 60%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Full screen height */}
      <div className="relative flex min-h-[100vh] w-full items-center">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          {/* Main glass panel */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: premiumEase }}
            className="
              mx-auto w-full max-w-5xl
              rounded-[32px] border border-black/10
              bg-white/75 backdrop-blur-xl
              p-6 sm:p-10
            "
            style={{
              boxShadow: "0 30px 70px rgba(0,0,0,0.08)",
            }}
          >
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p
                  className="text-xs font-semibold tracking-widest"
                  style={{ color: SECONDARY }}
                >
                  HOW IT WORKS
                </p>

                <h2 className="mt-2 text-2xl font-medium tracking-tight text-black sm:text-3xl">
                  simple steps, zero stress
                </h2>

                {/* tiny accent line */}
                <div
                  className="mt-4 h-[3px] w-16 rounded-full"
                  style={{ backgroundColor: PRIMARY }}
                />
              </div>

              <Link
                href="/order"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-xs font-semibold tracking-widest text-white transition hover:opacity-90"
                style={{ backgroundColor: PRIMARY }}
              >
                REQUEST ORDER
              </Link>
            </div>

            {/* Steps */}
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="mt-8 grid gap-5 md:grid-cols-2"
            >
              {STEPS.map((s) => (
                <motion.div
                  key={s.n}
                  variants={item}
                  whileHover={{
                    y: -6,
                    boxShadow: "0 30px 60px rgba(0,0,0,0.10)",
                  }}
                  transition={{ duration: 0.45, ease: premiumEase }}
                  className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-6"
                >
                  {/* subtle corner glow */}
                  <div
                    className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full blur-2xl"
                    style={{ backgroundColor: "rgba(19,116,184,0.10)" }}
                    aria-hidden="true"
                  />

                  <div className="relative flex items-start gap-4">
                    {/* Number */}
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold"
                      style={{
                        backgroundColor: "rgba(196,26,26,0.08)",
                        color: PRIMARY,
                      }}
                    >
                      {s.n}.
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-black">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-black/60">
                        {s.desc}
                      </p>
                    </div>

                    {/* right marker */}
                    <div
                      className="hidden h-10 w-10 items-center justify-center rounded-2xl sm:flex"
                      style={{ backgroundColor: "rgba(19,116,184,0.10)" }}
                      aria-hidden="true"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: SECONDARY }}
                      />
                    </div>
                  </div>

                  {/* animated premium underline */}
                  <motion.div
                    className="mt-6 h-[2px] w-full bg-black/5"
                    initial={{ opacity: 0.7 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.35, ease: premiumEase }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom note */}
            <p className="mt-8 text-xs text-black/55">
              minimum rental is 5 months • delivery is free to res/apartment
              (t&cs apply) • excluding uj soweto campus (fee applies)
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
