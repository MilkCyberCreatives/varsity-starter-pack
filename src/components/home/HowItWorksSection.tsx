"use client";

import Link from "next/link";
import { motion, type Variants, useReducedMotion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

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

const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const wrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.99 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.56, ease: premiumEase } },
};

function setHoverVars(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const mx = ((e.clientX - rect.left) / rect.width) * 100;
  const my = ((e.clientY - rect.top) / rect.height) * 100;
  el.style.setProperty("--mx", `${mx}%`);
  el.style.setProperty("--my", `${my}%`);
}

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
          : { y: -7, scale: 1.005, transition: { duration: 0.26, ease: premiumEase } }
      }
      onMouseMove={setHoverVars}
      className={[
        "group water-hover water-lift vsp-focus vsp-panel relative rounded-3xl px-5 py-5 sm:px-6 sm:py-6",
        isLast ? "md:col-span-2" : "",
      ].join(" ")}
    >
      <div className="relative flex items-start gap-4">
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -2, 0] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
          }
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/28 bg-white/16 text-sm font-semibold text-white"
        >
          {n}
        </motion.div>

        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold tracking-tight text-white">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-white/84">{desc}</p>
          <div className="vsp-fade-line mt-4 h-[2px] w-full" />
        </div>

        <div className="hidden items-center justify-center sm:flex">
          <span className="h-2.5 w-2.5 rounded-full bg-white/65" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );
}

export default function HowItWorksSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="vsp-sync-fade-top relative w-full overflow-hidden bg-transparent py-20" aria-label="booking steps">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        initial={false}
        animate={reduceMotion ? undefined : { opacity: [0.9, 1, 0.9] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }
        style={{
          background:
            "radial-gradient(900px circle at 15% 0%, rgba(255,255,255,0.12), transparent 55%), radial-gradient(900px circle at 85% 10%, rgba(255,255,255,0.12), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: premiumEase }}
          className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-widest text-white/78">
              BOOKING STEPS
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Simple Steps, Zero Stress
            </h2>

            <p className="mt-3 max-w-2xl text-sm text-white/84">
              Follow these steps to secure your appliance hire quickly and smoothly.
            </p>

            <motion.div
              className="vsp-fade-line mt-5 h-[3px] rounded-full"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 64, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: premiumEase }}
            />
          </div>

          <Link
            href="/order"
            prefetch={false}
            onClick={() => trackEvent("open_order", { source: "how_it_works" })}
            onMouseMove={setHoverVars}
            className="water-hover water-lift vsp-focus inline-flex items-center justify-center rounded-xl border border-white/26 bg-white px-6 py-3 text-xs font-semibold tracking-widest text-[rgb(var(--vsp-red))]"
          >
            REQUEST ORDER
          </Link>
        </motion.div>

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

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: premiumEase }}
          className="mt-10 text-xs text-white/80"
        >
          Minimum rental is 5 months, delivery is free to res/apartment (T&amp;Cs apply), excluding UJ Soweto Campus (fee applies)
        </motion.p>
      </div>
    </section>
  );
}
