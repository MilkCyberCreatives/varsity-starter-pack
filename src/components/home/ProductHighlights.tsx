"use client";

import Link from "next/link";
import { motion, type Variants, easeOut } from "framer-motion";

const PRIMARY = "#b01414";
const SECONDARY = "#1374b8";

type Product = {
  slug: "bar-fridge" | "microwave" | "top-freezer";
  name: string;
  price: string;
  deposit: string;
  highlight: string;
  bullets: string[];
};

const PRODUCTS: Product[] = [
  {
    slug: "bar-fridge",
    name: "BAR FRIDGE",
    price: "R250 / MONTH",
    deposit: "R400 refundable deposit",
    highlight: "Perfect for res rooms & shared apartments",
    bullets: ["Compact & practical", "Maintenance included", "Student-only rentals"],
  },
  {
    slug: "microwave",
    name: "MICROWAVE",
    price: "R160 / MONTH",
    deposit: "R300 refundable deposit",
    highlight: "Fast meals without the hassle",
    bullets: ["Quick setup", "Maintenance included", "Ideal for student living"],
  },
  {
    slug: "top-freezer",
    name: "TOP FREEZER",
    price: "R360 / MONTH",
    deposit: "R600 refundable deposit",
    highlight: "More space for meal prep & sharing",
    bullets: ["Extra storage", "Maintenance included", "Reliable & convenient"],
  },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

export default function ProductHighlights() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
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
              PRODUCT HIGHLIGHTS
            </p>

            <h2 className="mt-3 text-3xl font-medium tracking-tight text-black sm:text-4xl">
              Choose your appliance
            </h2>

            <p className="mt-3 max-w-2xl text-base text-black/65">
              Clear pricing, student-friendly process, and rentals built for res
              life. Minimum rental is{" "}
              <span className="font-semibold text-black">5 months</span>.
              Discounts apply when renting more than one appliance.
            </p>
          </div>

          <Link
            href="/order"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-xs font-semibold tracking-widest text-white transition hover:opacity-90"
            style={{ backgroundColor: PRIMARY }}
          >
            REQUEST ORDER
          </Link>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 grid gap-6 lg:grid-cols-3"
        >
          {PRODUCTS.map((p, idx) => {
            const isFeatured = idx === 1; // highlight microwave slightly
            return (
              <motion.div
                key={p.slug}
                variants={item}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
                className="group rounded-3xl border border-black/10 bg-white p-6"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-widest text-black/50">
                      2026 RATE
                    </p>
                    <h3 className="mt-2 text-lg font-semibold tracking-widest text-black">
                      {p.name}
                    </h3>
                  </div>

                  {/* Small badge */}
                  <div
                    className="rounded-full border px-3 py-1 text-[11px] font-semibold tracking-widest"
                    style={{
                      borderColor: "rgba(0,0,0,0.10)",
                      color: isFeatured ? PRIMARY : "rgba(0,0,0,0.55)",
                      background: isFeatured ? "rgba(196,26,26,0.06)" : "white",
                    }}
                  >
                    {isFeatured ? "MOST POPULAR" : "STUDENT-READY"}
                  </div>
                </div>

                {/* Price */}
                <div className="mt-5">
                  <p className="text-2xl font-semibold text-black">{p.price}</p>
                  <p className="mt-1 text-sm text-black/55">{p.deposit}</p>
                </div>

                {/* Highlight line */}
                <div className="mt-5 rounded-2xl border border-black/10 bg-white px-4 py-3">
                  <p className="text-sm text-black/70">{p.highlight}</p>
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

                {/* Actions */}
                <div className="mt-6 grid gap-3">
                  <Link
                    href={`/order?appliance=${encodeURIComponent(p.slug)}`}
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-xs font-semibold tracking-widest text-white transition hover:opacity-90"
                    style={{ backgroundColor: PRIMARY }}
                  >
                    SELECT & REQUEST
                  </Link>

                  <a
                    href={`https://wa.me/27734921669?text=${encodeURIComponent(
                      `Hi, I would like to rent a ${p.name}. Please send me the requirements.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-black/5"
                  >
                    WHATSAPP TO CONFIRM
                  </a>
                </div>

                {/* Subtle hover accent */}
                <div
                  className="mt-6 h-[2px] w-0 rounded-full transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: SECONDARY }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="mt-10 text-xs text-black/50"
        >
          Delivery is free to res/apartment (T&Cs apply). Excluding UJ Soweto
          Campus (delivery + collection fee applies). Deposits are refundable at
          the end of the rental period (less damages).
        </motion.p>
      </div>
    </section>
  );
}
