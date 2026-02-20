"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

function setHoverVars(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const mx = ((e.clientX - rect.left) / rect.width) * 100;
  const my = ((e.clientY - rect.top) / rect.height) * 100;
  el.style.setProperty("--mx", `${mx}%`);
  el.style.setProperty("--my", `${my}%`);
}

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const bgOffset = useTransform(scrollY, [0, 500], [0, -14]);

  return (
    <section className="relative overflow-hidden" aria-label="varsity starter pack hero">
      <div className="vsp-red-sync relative overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-90"
          style={
            reduceMotion
              ? undefined
              : {
                  y: bgOffset,
                  background:
                    "radial-gradient(980px circle at 14% 10%, rgba(255,255,255,0.24), transparent 58%), radial-gradient(900px circle at 86% 8%, rgba(255,255,255,0.14), transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0))",
                }
          }
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-12 sm:pb-16 sm:pt-14">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:gap-10"
          >
            <div className="py-3 sm:py-5 lg:py-6">
              <div className="max-w-2xl lg:max-w-3xl">
                <h1 className="max-w-[14ch] text-balance text-4xl font-semibold leading-[0.94] tracking-tight text-white sm:text-5xl lg:text-[70px]">
                  FRIDGE AND MICROWAVE HIRE FOR STUDENTS
                </h1>

                <p className="mt-4 max-w-xl text-sm text-white/88 sm:text-base">
                  Student appliance rentals with maintenance included and delivery to your res or apartment.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/order"
                    onClick={() => trackEvent("open_order", { source: "hero_cta" })}
                    onMouseMove={setHoverVars}
                    className="water-hover water-lift vsp-focus inline-flex items-center justify-center rounded-xl border border-white/26 bg-white px-7 py-3 text-xs font-semibold tracking-widest text-[rgb(var(--vsp-red))]"
                  >
                    REQUEST ORDER
                  </Link>

                  <a
                    href="https://wa.me/27734921669"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent("click_whatsapp", { source: "hero" })}
                    onMouseMove={setHoverVars}
                    className="water-hover vsp-focus inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/14 px-7 py-3 text-xs font-semibold tracking-widest text-white hover:bg-white/20"
                  >
                    WHATSAPP
                  </a>
                </div>
              </div>
            </div>

            <div className="relative z-20 flex items-center justify-center lg:justify-end">
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 7, repeat: Infinity, ease: "easeInOut" }
                }
                className="relative w-full max-w-[560px]"
              >
                <div className="relative h-[330px] w-full sm:h-[430px] lg:h-[520px]">
                  <Image
                    src="/hero/hero.png"
                    alt="Fridge and microwave rental package"
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 640px) 88vw, (max-width: 1024px) 520px, 560px"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
