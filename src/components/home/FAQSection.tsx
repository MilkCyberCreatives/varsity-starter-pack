"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const PRIMARY = "#c41a1a";
const SECONDARY = "#1374b8";
const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FAQS = [
  {
    q: "who can rent from varsity starter pack?",
    a: "our rentals are for students only. you may be asked for student proof (student card) and a copy of your id.",
  },
  {
    q: "what is the minimum rental period?",
    a: "the minimum rental period is 5 months. this helps keep pricing affordable and predictable.",
  },
  {
    q: "is the deposit refundable?",
    a: "yes. the deposit is once-off and refundable at the end of the rental period (less damages if any).",
  },
  {
    q: "do you deliver to res?",
    a: "yes. delivery is free to res/apartment (t&cs apply). excluding uj soweto campus where a fee applies.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: premiumEase }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-widest" style={{ color: SECONDARY }}>
              FAQ
            </p>

            <h2 className="mt-3 text-3xl font-medium tracking-tight text-black sm:text-4xl">
              quick answers
            </h2>

            <p className="mt-3 max-w-2xl text-base text-black/65">
              clear answers before you request an order.
            </p>

            {/* simple premium accent */}
            <div className="mt-5 h-[3px] w-16 rounded-full" style={{ backgroundColor: PRIMARY }} />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
              href="/faq"
              className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-black/5"
            >
              VIEW ALL FAQ
            </Link>
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-10 grid gap-5 md:grid-cols-2"
        >
          {FAQS.map((f, i) => {
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={f.q}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: premiumEase } },
                }}
                className="rounded-3xl border border-black/10 bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-black">{f.q}</span>

                  {/* clean premium icon */}
                  <motion.span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white text-black/70"
                    animate={{ rotate: isOpen ? 45 : 0 }}
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
                      <div className="px-6 pb-5 text-sm leading-relaxed text-black/65">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* crisp divider to finish the card */}
                <div className="h-[2px] w-full bg-black/5" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
