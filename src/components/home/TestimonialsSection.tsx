"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const PRIMARY = "#c41a1a";
const SECONDARY = "#1374b8";
const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const testimonials = [
  {
    name: "Joseph Z Moyo",
    source: "Google Review",
    rating: 5,
    text: "Very professional service, reliable in service delivery!",
  },
  {
    name: "Khumbuleni Nengovhela",
    source: "Google Review",
    rating: 5,
    text: "Great service. The fridges are in good condition and they deliver on time.",
  },
  {
    name: "Lungelo Mathebula",
    source: "WhatsApp Client",
    rating: 5,
    text: "Thank you for the amazing service, everything was quick and simple. The customer service is great too. I will definitely be referring people.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: premiumEase } },
};

export default function TestimonialsSection() {
  return (
    <section className="relative bg-white py-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px circle at 15% 20%, rgba(196,26,26,0.05), transparent 55%), radial-gradient(900px circle at 85% 20%, rgba(19,116,184,0.06), transparent 55%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: premiumEase }}
          className="text-center"
        >
          <p className="text-xs font-semibold tracking-widest" style={{ color: SECONDARY }}>
            TESTIMONIALS
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-black sm:text-4xl">
            what students are saying
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-black/65">
            trusted by students across gauteng for reliable appliance rentals.
          </p>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 84, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: premiumEase }}
            className="mx-auto mt-6 h-[3px] rounded-full"
            style={{ backgroundColor: PRIMARY }}
          />
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              whileHover={{ y: -6, boxShadow: "0 30px 60px rgba(0,0,0,0.10)" }}
              transition={{ duration: 0.45, ease: premiumEase }}
              className="relative rounded-3xl border border-black/10 bg-white p-7"
            >
              {/* subtle corner sheen */}
              <div
                className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full blur-2xl"
                style={{ backgroundColor: "rgba(19,116,184,0.07)" }}
                aria-hidden="true"
              />

              {/* Rating */}
              <div className="relative flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} style={{ color: SECONDARY }}>
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="relative mt-4 text-sm leading-relaxed text-black/70">
                “{t.text}”
              </p>

              {/* Footer */}
              <div className="relative mt-6 border-t border-black/5 pt-4">
                <p className="text-sm font-semibold text-black">{t.name}</p>
                <p className="text-xs text-black/50">{t.source}</p>
              </div>

              <div className="mt-6 h-[2px] w-full bg-black/5" />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: premiumEase }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="https://wa.me/27734921669"
            target="_blank"
            className="inline-flex items-center justify-center rounded-xl px-8 py-3 text-xs font-semibold tracking-widest text-white transition hover:opacity-90"
            style={{ backgroundColor: PRIMARY }}
          >
            CHAT WITH US ON WHATSAPP
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
