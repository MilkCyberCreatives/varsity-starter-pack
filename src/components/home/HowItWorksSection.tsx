"use client";

import Link from "next/link";
import { motion, type Variants, useReducedMotion } from "framer-motion";

const PRIMARY = "#c41a1a";
const SECONDARY = "#1374b8";

const STEPS = [
  {
    n: "1",
    title: "Select Your Appliance",
    desc: "Choose a bar fridge, microwave, or top freezer based on what you need at res.",
  },
  {
    n: "2",
    title: "Request An Order",
    desc: "Submit your details and confirm your rental period (minimum 5 months).",
  },
  {
    n: "3",
    title: "Receive The Lease",
    desc: "We send your lease agreement and the next steps for approval.",
  },
  {
    n: "4",
    title: "Pay Deposit And Submit Supporting Documents",
    desc: "Pay the deposit and send the required supporting documents for verification.",
  },
  {
    n: "5",
    title: "Schedule Delivery Date",
    desc: "Once everything is confirmed, we agree on a delivery date for delivery to your res/apartment (T&Cs apply).",
  },
];

// Premium easing
const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const wrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: premiumEase } },
};

function StepRow({
  n,
  title,
  desc,
  isLast,
}: {
  n: string;
  title: string;
  desc: string;
  isLast?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={fadeUp}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -6,
              transition: { duration: 0.28, ease: premiumEase },
            }
      }
      className={[
        "group relative rounded-3xl border bg-white",
        "border-black/10",
        "px-5 py-5 sm:px-6 sm:py-6",
        "water-hover water-lift vsp-focus", // ✅ your requested effects
        isLast ? "md:col-span-2" : "",
      ].join(" ")}
      style={{
        // keep it crisp, no shadows
        boxShadow: "none",
      }}
    >
      {/* Border highlight on hover (no shadow) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          border: "1px solid rgba(196,26,26,0.25)",
        }}
      />

      <div className="relative flex items-start gap-4">
        {/* Number pill with subtle float animation */}
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -2, 0],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : { duration: 3.8, repeat: Infinity, ease: "easeInOut" }
          }
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold"
          style={{ backgroundColor: "rgba(196,26,26,0.10)", color: PRIMARY }}
        >
          {n}
        </motion.div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold tracking-tight text-black">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-black/60">{desc}</p>

          {/* Animated divider line (clean, subtle) */}
          <motion.div
            className="mt-4 h-px w-full bg-black/5"
            initial={false}
            whileHover={
              reduceMotion
                ? undefined
                : {
                    backgroundColor: "rgba(196,26,26,0.22)",
                    transition: { duration: 0.25, ease: premiumEase },
                  }
            }
          />
        </div>

        {/* Marker */}
        <div className="hidden sm:flex items-center justify-center">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: SECONDARY }}
            aria-hidden="true"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function HowItWorksSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative w-full bg-white py-20" aria-label="booking steps">
      {/* Premium background (subtle animated wash) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        initial={false}
        animate={
          reduceMotion
            ? undefined
            : {
                opacity: [0.9, 1, 0.9],
              }
        }
        transition={
          reduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }
        style={{
          background:
            "radial-gradient(900px circle at 15% 0%, rgba(196,26,26,0.08), transparent 55%), radial-gradient(900px circle at 85% 10%, rgba(19,116,184,0.06), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: premiumEase }}
          className="flex flex-col gap-5 sm:flex-row triggering-widest sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-widest" style={{ color: SECONDARY }}>
              BOOKING STEPS
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
              Simple Steps, Zero Stress
            </h2>

            <p className="mt-3 max-w-2xl text-sm text-black/65">
              Follow these steps to secure your appliance hire quickly and smoothly.
            </p>

            {/* Accent line animation */}
            <motion.div
              className="mt-5 h-[3px] rounded-full"
              style={{ backgroundColor: PRIMARY }}
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 64, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: premiumEase }}
            />
          </div>

          {/* CTA with hover effects */}
          <Link
            href="/order"
            className="water-hover water-lift vsp-focus inline-flex items-center justify-center rounded-xl px-6 py-3 text-xs font-semibold tracking-widest text-white transition hover:opacity-90"
            style={{ backgroundColor: PRIMARY }}
          >
            REQUEST ORDER
          </Link>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={wrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 grid gap-4 md:grid-cols-2"
        >
          <StepRow {...STEPS[0]} />
          <StepRow {...STEPS[1]} />
          <StepRow {...STEPS[2]} />
          <StepRow {...STEPS[3]} />
          <StepRow {...STEPS[4]} isLast />
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: premiumEase }}
          className="mt-10 text-xs text-black/55"
        >
          Minimum rental is 5 months • Delivery is free to res/apartment (T&amp;Cs apply) • Excluding UJ Soweto Campus (fee applies)
        </motion.p>
      </div>
    </section>
  );
}
