"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FAQS = [
  {
    q: "Who can lease from us?",
    a: "Our rentals are strictly for students. You will be asked for a student card copy.",
  },
  {
    q: "Lease period?",
    a: "The minimum rental period is 5 months. One cannot lease for a short period less than 5 months.",
  },
  {
    q: "Why is deposit required?",
    a: "The deposit is once off and refundable at the end of the lease period.",
  },
  {
    q: "Do you deliver?",
    a: "Yes, we deliver for free to your res/apartment (T&Cs apply). Excluding UJ Soweto campus, a delivery fee applies.",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.99 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.58, ease: premiumEase } },
};

function setHoverVars(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const mx = ((e.clientX - rect.left) / rect.width) * 100;
  const my = ((e.clientY - rect.top) / rect.height) * 100;
  el.style.setProperty("--mx", `${mx}%`);
  el.style.setProperty("--my", `${my}%`);
}

export default function FAQSection() {
  const reduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="vsp-sync-fade-top relative overflow-hidden bg-transparent py-16" aria-label="frequently asked questions">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px circle at 12% 10%, rgba(255,255,255,0.1), transparent 55%), radial-gradient(900px circle at 88% 0%, rgba(255,255,255,0.1), transparent 55%)",
        }}
        aria-hidden="true"
      />

      {!reduceMotion && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-10 top-16 h-2 w-2 rounded-full bg-white/30"
            animate={{ y: [0, -8, 0], opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute right-14 top-28 h-3 w-3 rounded-full bg-white/24"
            animate={{ y: [0, 10, 0], opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: premiumEase }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-widest text-white/78">FAQ</p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Quick Answers
            </h2>

            <p className="mt-3 max-w-2xl text-base text-white/82">
              Clear answers before you request an order.
            </p>

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 80, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: premiumEase }}
              className="vsp-fade-line mt-5 h-[3px]"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <a
              href="https://wa.me/27734921669"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("click_whatsapp", { source: "faq_section" })}
              onMouseMove={setHoverVars}
              className="water-hover vsp-focus inline-flex items-center justify-center rounded-xl border border-white/28 bg-white px-6 py-3 text-xs font-semibold tracking-widest text-[rgb(var(--vsp-red))] transition hover:opacity-95"
            >
              WHATSAPP US
            </a>

            <Link
              href="/faq"
              onMouseMove={setHoverVars}
              className="water-hover vsp-focus inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/12 px-6 py-3 text-xs font-semibold tracking-widest text-white transition hover:bg-white/18"
            >
              VIEW ALL FAQ
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.22 }}
          className="mt-10 grid gap-5 md:grid-cols-2"
        >
          {FAQS.map((f, i) => {
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={f.q}
                variants={card}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -6,
                        scale: 1.006,
                        transition: { duration: 0.25, ease: premiumEase },
                      }
                }
                onMouseMove={setHoverVars}
                className={[
                  "water-hover vsp-panel rounded-3xl transition-colors duration-200",
                  isOpen ? "border-white/36" : "hover:border-white/32",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-2 h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: isOpen
                          ? "rgba(255,255,255,0.9)"
                          : "rgba(255,255,255,0.44)",
                      }}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-semibold text-white">{f.q}</span>
                  </div>

                  <motion.span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/24 bg-white/14 text-white/82"
                    animate={{ rotate: isOpen ? 45 : 0, scale: isOpen ? 1.02 : 1 }}
                    transition={{ duration: 0.35, ease: premiumEase }}
                    aria-hidden="true"
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: premiumEase }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-sm leading-relaxed text-white/84">
                        {f.a}
                      </div>

                      <div className="px-6 pb-6">
                        <motion.div
                          initial={{ width: 0, opacity: 0.5 }}
                          animate={{ width: "100%", opacity: 1 }}
                          transition={{ duration: 0.6, ease: premiumEase }}
                          className="vsp-fade-line h-[2px]"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="h-[2px] w-full bg-white/10" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
