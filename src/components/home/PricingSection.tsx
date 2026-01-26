"use client";

import Link from "next/link";
import { motion, type Variants, easeOut, easeInOut } from "framer-motion";
import { PLANS } from "@/lib/plans";

const PRIMARY = "#c41a1a";
const SECONDARY = "#1374b8";

// Premium easing
const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

export default function PricingSection() {
  return (
    <section className="relative bg-white py-20">
      {/* Subtle background wash (no container) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px circle at 15% 15%, rgba(19,116,184,0.06), transparent 55%), radial-gradient(900px circle at 85% 15%, rgba(196,26,26,0.05), transparent 55%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: easeOut }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p
              className="text-xs font-semibold tracking-widest"
              style={{ color: SECONDARY }}
            >
              PRICING
            </p>

            <h2 className="mt-3 text-3xl font-medium tracking-tight text-black sm:text-4xl">
              2026 rental rates
            </h2>

            <p className="mt-3 max-w-2xl text-base text-black/65">
              deposits are once-off and refundable (less damages). minimum rental
              is <span className="font-semibold text-black">5 months</span>.
              discounts apply when renting more than one appliance.
            </p>

            {/* Accent line */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 84, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: premiumEase }}
              className="mt-5 h-[3px] rounded-full"
              style={{ backgroundColor: PRIMARY }}
            />
          </div>

          <a
            href="https://wa.me/27734921669"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-black/5"
          >
            WHATSAPP TO CONFIRM
          </a>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-12 grid gap-6 lg:grid-cols-3"
        >
          {PLANS.map((p) => (
            <motion.div
              key={p.slug}
              variants={item}
              whileHover={{
                y: -6,
                boxShadow: "0 30px 60px rgba(0,0,0,0.10)",
              }}
              transition={{ duration: 0.45, ease: premiumEase }}
              className="relative flex h-full flex-col rounded-3xl border border-black/10 bg-white"
            >
              {/* Featured soft glow */}
              {p.featured && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-28 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full"
                  style={{ backgroundColor: "rgba(196,26,26,0.10)" }}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: easeInOut }}
                />
              )}

              <div className="relative p-6">
                {/* Top */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-widest text-black/50">
                      APPLIANCE
                    </p>
                    <h3 className="mt-2 text-lg font-semibold tracking-widest text-black">
                      {p.name}
                    </h3>
                  </div>

                  {p.featured ? (
                    <span
                      className="rounded-full border px-3 py-1 text-[11px] font-semibold tracking-widest"
                      style={{
                        borderColor: "rgba(0,0,0,0.10)",
                        backgroundColor: "rgba(196,26,26,0.06)",
                        color: PRIMARY,
                      }}
                    >
                      BEST VALUE
                    </span>
                  ) : (
                    <span
                      className="mt-2 h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: SECONDARY }}
                    />
                  )}
                </div>

                {/* Price */}
                <div className="mt-5">
                  <p className="text-2xl font-semibold text-black">{p.monthly}</p>
                  <p className="mt-1 text-sm text-black/55">{p.deposit}</p>
                </div>

                {/* Note */}
                <div className="mt-5 rounded-2xl border border-black/10 px-4 py-3">
                  <p className="text-sm text-black/70">{p.note}</p>
                </div>

                {/* Bullets */}
                <ul className="mt-5 space-y-2 text-sm text-black/65">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: SECONDARY }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="mt-auto grid gap-3 border-t border-black/5 p-6">
                <Link
                  href={`/order?appliance=${encodeURIComponent(p.slug)}`}
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-xs font-semibold tracking-widest text-white transition hover:opacity-90"
                  style={{ backgroundColor: PRIMARY }}
                >
                  SELECT & REQUEST
                </Link>

                <a
                  href={`https://wa.me/27734921669?text=${encodeURIComponent(
                    `Hi, I would like to rent a ${p.name}. Please send me the requirements and next steps.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-black/5"
                >
                  WHATSAPP
                </a>

                <p className="text-[11px] text-black/45">
                  receive a unique reference number after requesting.
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <p className="mt-12 text-xs text-black/50">
          delivery is free to res/apartment (t&cs apply). excluding uj soweto
          campus (fee applies).
        </p>
      </div>
    </section>
  );
}
