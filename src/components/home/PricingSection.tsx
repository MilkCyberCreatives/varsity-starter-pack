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

function cardTag(slug: string, featured?: boolean) {
  if (featured) return "Best Value";
  if (slug === "bar-fridge") return "Student Pick";
  if (slug === "microwave") return "Best Seller";
  return "Popular";
}

function HeartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current"
      focusable="false"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z" />
    </svg>
  );
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
    <section className="vsp-sync-fade-top relative overflow-hidden bg-transparent py-16" aria-label="rental rates and pricing">
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
          className="mt-10 grid gap-5 lg:grid-cols-3"
        >
          {PLANS.map((plan, planIndex) => {
            const image = pickImage(plan.slug, plan.name);
            const bullets = plan.bullets
              .filter((bullet) => !shouldRemoveBullet(bullet))
              .map((bullet) => capFirstWord(bullet));
            const tag = cardTag(plan.slug, plan.featured);

            return (
              <motion.article
                key={plan.slug}
                variants={card}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.28, ease: premiumEase }}
                className="group vsp-sheen flex h-full flex-col overflow-hidden rounded-[36px] border border-white/50 bg-[#f1f1f1]"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(245,245,245,0.98), rgba(236,236,236,0.96))",
                }}
              >
                <div className="p-3">
                  <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-[#e4e4e4] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full border border-black/12 bg-[#f4f4f4] px-3 py-1 text-[12px] font-medium tracking-wide text-black/70">
                        {tag}
                      </span>
                      <span
                        aria-hidden="true"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/12 bg-[#f4f4f4] text-[rgb(var(--vsp-red))]"
                      >
                        <HeartIcon />
                      </span>
                    </div>

                    <div className="relative mt-3 h-44 w-full overflow-hidden rounded-[22px] bg-white/20 sm:h-48">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        priority={plan.featured}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2">
                      {Array.from({ length: 3 }).map((_, dotIndex) => {
                        const active = dotIndex === planIndex % 3;
                        return (
                          <span
                            key={`${plan.slug}-dot-${dotIndex}`}
                            className="h-2.5 w-2.5 rounded-full border border-black/8 transition"
                            style={{
                              backgroundColor: active
                                ? "rgb(var(--vsp-red))"
                                : "rgba(255,255,255,0.78)",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col px-5 pb-3 text-black">
                  <p className="text-[15px] font-medium text-[rgb(var(--vsp-red))]">Appliance</p>

                  <h3 className="mt-1 text-[clamp(1.75rem,2.8vw,2.5rem)] font-semibold leading-[0.98] tracking-tight">
                    {plan.name}
                  </h3>

                  <p className="mt-3 text-[clamp(2rem,3.1vw,2.75rem)] font-semibold leading-none tracking-tight">
                    {plan.monthly}
                  </p>
                  <p className="mt-1.5 text-base text-black/72">{plan.deposit}</p>

                  {plan.note ? (
                    <div className="mt-4 rounded-2xl border border-black/10 bg-white/72 px-3 py-2">
                      <p className="text-sm text-black/72">{plan.note}</p>
                    </div>
                  ) : null}

                  {bullets.length ? (
                    <ul className="mt-4 space-y-1.5 text-sm text-black/74">
                      {bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[rgb(var(--vsp-red))]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className="mt-2 grid gap-2 px-5 pb-5">
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
                    className="water-hover vsp-focus inline-flex h-12 w-full items-center justify-center rounded-full border border-black/80 bg-black px-5 text-sm font-semibold tracking-wide text-white"
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
                    className="water-hover vsp-focus inline-flex h-10 w-full items-center justify-center rounded-full border border-black/16 bg-white px-5 text-xs font-semibold tracking-widest text-black/80"
                  >
                    WHATSAPP
                  </a>

                  <p className="text-center text-[11px] text-black/55">
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
