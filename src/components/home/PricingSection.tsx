"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants, easeOut } from "framer-motion";
import { useMemo } from "react";
import { PLANS } from "@/lib/plans";

const PRIMARY = "#c41a1a";
const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

function capFirstWord(s: string) {
  const t = (s ?? "").trim();
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function shouldRemoveBullet(b: string) {
  const t = (b ?? "").toLowerCase();
  return t.includes("minimum") && t.includes("5");
}

export default function PricingSection() {
  /**
   * NEW images (not reusing hero / bar-fridge)
   * Put these files in: /public/images/pricing/
   */
  const planImages = useMemo(() => {
    return {
      fridge: { src: "/images/pricing/fridge.jpg", alt: "Student fridge rental" },
      microwave: { src: "/images/pricing/microwave.jpg", alt: "Student microwave rental" },
      combo: { src: "/images/pricing/combo.jpg", alt: "Fridge and microwave combo rental" },
    };
  }, []);

  const pickImage = (slug: string, name: string) => {
    const s = (slug || "").toLowerCase();
    const n = (name || "").toLowerCase();

    // try by slug first
    if (s.includes("microwave")) return planImages.microwave;
    if (s.includes("fridge")) return planImages.fridge;
    if (s.includes("combo") || s.includes("bundle") || s.includes("set")) return planImages.combo;

    // fallback by name keywords
    if (n.includes("microwave")) return planImages.microwave;
    if (n.includes("fridge")) return planImages.fridge;
    return planImages.combo;
  };

  return (
    <section className="relative bg-white py-20" aria-label="rental rates and pricing">
      {/* Clean, premium background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px circle at 18% 10%, rgba(196,26,26,0.06), transparent 55%), radial-gradient(900px circle at 82% 0%, rgba(0,0,0,0.04), transparent 55%)",
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
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-widest text-black/50">PRICING</p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
              2026 Rental Rates
            </h2>

            {/* The 3 lines you requested (clean + readable) */}
            <div className="mt-4 grid max-w-2xl gap-2">
              <p className="text-sm text-black/70">
                Deposits are once off and refundable. If the appliance is not damaged, will get full refund.
              </p>
              <p className="text-sm text-black/70">
                Minimum of 5 months. Can only lease for more than 5 months.
              </p>
              <p className="text-sm text-black/70">
                Monthly rental discount when leasing more than one appliance
              </p>
            </div>

            <div className="mt-6 h-[3px] w-[84px] rounded-full" style={{ backgroundColor: PRIMARY }} />
          </div>

          <a
            href="https://wa.me/27734921669"
            target="_blank"
            rel="noreferrer"
            className="water-hover water-lift vsp-focus inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-black/5"
          >
            WHATSAPP TO CONFIRM
          </a>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.22 }}
          className="mt-12 grid gap-6 lg:grid-cols-3"
        >
          {PLANS.map((p) => {
            const img = pickImage(p.slug, p.name);
            const bullets = (p.bullets ?? [])
              .filter((b) => !shouldRemoveBullet(b))
              .map((b) => capFirstWord(b));

            return (
              <motion.article
                key={p.slug}
                variants={card}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, ease: premiumEase }}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
              >
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden bg-black/5">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority={p.featured}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.04), transparent 55%, rgba(255,255,255,0.08))",
                    }}
                    aria-hidden="true"
                  />
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold tracking-widest text-black/50">Appliance</p>
                      <h3 className="mt-2 text-lg font-semibold tracking-tight text-black">{p.name}</h3>
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
                        Best Value
                      </span>
                    ) : (
                      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-black/30" />
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-5">
                    <p className="text-2xl font-semibold text-black">{p.monthly}</p>
                    <p className="mt-1 text-sm text-black/55">{p.deposit}</p>
                  </div>

                  {/* Note */}
                  {!!p.note && (
                    <div className="mt-5 rounded-2xl border border-black/10 bg-white px-4 py-3">
                      <p className="text-sm text-black/70">{p.note}</p>
                    </div>
                  )}

                  {/* Bullets */}
                  {bullets.length > 0 && (
                    <ul className="mt-5 space-y-2 text-sm text-black/65">
                      {bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <span className="mt-2 h-2 w-2 rounded-full" style={{ backgroundColor: PRIMARY }} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-auto grid gap-3 border-t border-black/5 p-6">
                  <Link
                    href={`/order?appliance=${encodeURIComponent(p.slug)}`}
                    className="water-hover water-lift vsp-focus inline-flex items-center justify-center rounded-xl px-5 py-3 text-xs font-semibold tracking-widest text-white transition hover:opacity-90"
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
                    className="water-hover water-lift vsp-focus inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-black/5"
                  >
                    WHATSAPP
                  </a>

                  <p className="text-[11px] text-black/45">
                    Receive a unique reference number after requesting.
                  </p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Footer note (clean) */}
        <p className="mt-12 text-xs text-black/50">
          Delivery is free to res/apartment (T&amp;Cs apply). Excluding UJ Soweto Campus (fee applies).
        </p>
      </div>
    </section>
  );
}
