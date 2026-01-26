"use client";

import { motion, type Variants, easeOut } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";

const PRIMARY = "#c41a1a";
const SECONDARY = "#1374b8";

// Premium easing curve (Apple/Stripe style)
const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

export default function HowItWorksSection() {
  const steps = useMemo(
    () => [
      {
        n: "01",
        title: "choose your appliance",
        desc: "pick what you need for res life — simple options, student-friendly pricing.",
      },
      {
        n: "02",
        title: "submit your details",
        desc: "send your info and student proof. we’ll confirm availability quickly.",
      },
      {
        n: "03",
        title: "get your reference",
        desc: "every order gets a unique reference number for tracking and payment.",
      },
      {
        n: "04",
        title: "delivery + setup",
        desc: "we schedule delivery and make sure everything is running properly.",
      },
    ],
    []
  );

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-widest text-black/55">
            HOW IT WORKS
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
            a clean, quick rental process built for students
          </h2>
          <p className="mt-4 text-base leading-relaxed text-black/60">
            choose an appliance, submit your details, receive your reference
            number, then we schedule delivery.
          </p>
        </div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((s) => (
            <motion.div
              key={s.n}
              variants={item}
              whileHover={{
                y: -6,
                boxShadow: "0 30px 60px rgba(0,0,0,0.10)",
              }}
              transition={{ duration: 0.35, ease: premiumEase }}
              className="group relative overflow-hidden rounded-[22px] border border-black/10 bg-white p-6"
            >
              {/* subtle top accent line */}
              <div
                className="absolute left-0 top-0 h-[3px] w-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(19,116,184,0.75), rgba(196,26,26,0.75))",
                }}
              />

              {/* soft glow blobs */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-40 blur-2xl"
                style={{ backgroundColor: "rgba(19,116,184,0.16)" }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full opacity-30 blur-2xl"
                style={{ backgroundColor: "rgba(196,26,26,0.14)" }}
              />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold tracking-widest text-black/55">
                    STEP
                  </p>
                  <p className="text-sm font-semibold text-black/55">{s.n}</p>
                </div>

                <h3 className="mt-4 text-lg font-semibold tracking-tight text-black">
                  {s.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-black/60">
                  {s.desc}
                </p>

                {/* micro CTA (optional) */}
                <div className="mt-5 h-px w-full bg-black/10" />
                <p className="mt-4 text-xs font-semibold tracking-widest text-black/50">
                  varsity starter pack
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: easeOut }}
          className="mt-10 flex flex-col items-center justify-center gap-3 text-center"
        >
          <Link
            href="/rent"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            start rental
          </Link>
          <p className="text-xs text-black/55">
            questions? whatsapp us anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
