"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants, easeOut } from "framer-motion";
import { useMemo } from "react";
import { PLANS } from "@/lib/plans";
import { trackEvent } from "@/lib/analytics";

const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

function setHoverVars(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const mx = ((e.clientX - rect.left) / rect.width) * 100;
  const my = ((e.clientY - rect.top) / rect.height) * 100;
  el.style.setProperty("--mx", `${mx}%`);
  el.style.setProperty("--my", `${my}%`);
}

function capFirstWord(value: string) {
  if (!value.trim()) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function shouldRemoveBullet(bullet: string) {
  const text = bullet.toLowerCase();
  return text.includes("minimum") && text.includes("5");
}

export default function PricingSection() {
  const planImages = useMemo(
    () => ({
      fridge: { src: "/images/pricing/fridge.jpg", alt: "Student fridge rental" },
      microwave: {
        src: "/images/pricing/microwave.jpg",
        alt: "Student microwave rental",
      },
      combo: {
        src: "/images/pricing/combo.jpg",
        alt: "Fridge and microwave combo rental",
      },
    }),
    []
  );

  const pickImage = (slug: string, name: string) => {
    const s = slug.toLowerCase();
    const n = name.toLowerCase();

    if (s.includes("microwave") || n.includes("microwave")) return planImages.microwave;
    if (s.includes("fridge") || n.includes("fridge")) return planImages.fridge;
    return planImages.combo;
  };

  return (
    <section className="vsp-sync-fade-top relative overflow-hidden bg-transparent py-20" aria-label="rental rates and pricing">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(980px circle at 18% 10%, rgba(255,255,255,0.12), transparent 56%), radial-gradient(980px circle at 82% 0%, rgba(255,255,255,0.11), transparent 56%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: premiumEase }}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-widest text-white/75">PRICING</p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              2026 Rental Rates
            </h2>

            <div className="mt-4 grid max-w-2xl gap-2">
              <p className="text-sm text-white/84">
                Deposits are once off and refundable. If the appliance is not damaged, will get full refund.
              </p>
              <p className="text-sm text-white/84">
                Minimum of 5 months. Can only lease for more than 5 months.
              </p>
              <p className="text-sm text-white/84">
                Monthly rental discount when leasing more than one appliance
              </p>
            </div>

            <div className="vsp-fade-line mt-6 h-[3px] w-[96px]" />
          </div>

          <a
            href="https://wa.me/27734921669"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("click_whatsapp", { source: "pricing_section" })}
            onMouseMove={setHoverVars}
            className="water-hover water-lift vsp-focus inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/12 px-6 py-3 text-xs font-semibold tracking-widest text-white hover:bg-white/18"
          >
            WHATSAPP TO CONFIRM
          </a>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-6 lg:grid-cols-3"
        >
          {PLANS.map((plan) => {
            const image = pickImage(plan.slug, plan.name);
            const bullets = plan.bullets
              .filter((bullet) => !shouldRemoveBullet(bullet))
              .map((bullet) => capFirstWord(bullet));

            return (
              <motion.article
                key={plan.slug}
                variants={card}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.28, ease: premiumEase }}
                className="group vsp-sheen flex h-full flex-col overflow-hidden rounded-3xl border border-white/22"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.15), rgba(255,255,255,0.06) 58%, rgba(122,10,10,0.22))",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="relative h-44 w-full overflow-hidden bg-white/8">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority={plan.featured}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(255,255,255,0.06), transparent 54%, rgba(255,255,255,0.16))",
                    }}
                  />
                </div>

                <div className="flex flex-1 flex-col px-6 pb-6 pt-6">
                  <p className="text-xs font-semibold tracking-widest text-white/76">APPLIANCE</p>

                  <h3 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-[54px] sm:leading-[0.92]">
                    {plan.name}
                  </h3>

                  {plan.featured ? (
                    <span className="mt-4 inline-flex w-fit rounded-full border border-white/38 bg-white/14 px-3 py-1 text-[10px] font-semibold tracking-widest text-white">
                      BEST VALUE
                    </span>
                  ) : null}

                  <div className="mt-5">
                    <p className="text-[52px] font-semibold leading-none tracking-tight text-white">
                      {plan.monthly}
                    </p>
                    <p className="mt-2 text-base text-white/78">{plan.deposit}</p>
                  </div>

                  {plan.note ? (
                    <div className="mt-5 rounded-2xl border border-white/22 bg-white/10 px-4 py-3">
                      <p className="text-sm text-white/84">{plan.note}</p>
                    </div>
                  ) : null}

                  {bullets.length ? (
                    <ul className="mt-5 space-y-2 text-sm text-white/84">
                      {bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/86" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className="px-6">
                  <div className="vsp-fade-line h-[1px] w-full opacity-80" />
                </div>

                <div
                  className="mt-auto grid gap-3 rounded-b-3xl px-6 pb-6 pt-5"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(112,10,10,0.18))",
                  }}
                >
                  <Link
                    href={`/order?appliance=${encodeURIComponent(plan.slug)}`}
                    prefetch={false}
                    onClick={() =>
                      trackEvent("select_appliance", {
                        appliance: plan.slug,
                        source: "pricing_card",
                      })
                    }
                    onMouseMove={setHoverVars}
                    className="water-hover vsp-sheen water-lift vsp-focus inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/28 bg-white px-5 text-xs font-semibold tracking-widest text-[rgb(var(--vsp-red))]"
                  >
                    SELECT AND REQUEST
                  </Link>

                  <a
                    href={`https://wa.me/27734921669?text=${encodeURIComponent(
                      `Hi, I would like to rent a ${plan.name}. Please send me the requirements and next steps.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      trackEvent("click_whatsapp", {
                        source: "pricing_card",
                        appliance: plan.slug,
                      })
                    }
                    onMouseMove={setHoverVars}
                    className="water-hover vsp-sheen vsp-focus inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/30 bg-white/12 px-5 text-xs font-semibold tracking-widest text-white hover:bg-white/18"
                  >
                    WHATSAPP
                  </a>

                  <p className="text-[11px] text-white/70">
                    Receive a unique reference number after requesting.
                  </p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <p className="mt-12 text-xs text-white/78">
          Delivery is free to res/apartment (T&amp;Cs apply). Excluding UJ Soweto Campus (fee applies).
        </p>
      </div>
    </section>
  );
}
