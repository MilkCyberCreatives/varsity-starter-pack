"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const PRIMARY = "#c41a1a";
const SECONDARY = "#1374b8";

function CountUp({
  to,
  suffix,
  duration = 850,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });

  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 120, damping: 20 });

  useEffect(() => {
    if (!isInView) return;

    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      mv.set(to * p);
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, mv, to, duration]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      if (!ref.current) return;
      ref.current.textContent = `${Math.round(v)}${suffix ?? ""}`;
    });
    return () => unsub();
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix ?? ""}</span>;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Premium easing curve (Apple/Stripe style)
const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function HowItWorksNumbersSection() {
  const [active, setActive] = useState<number | null>(null);

  // Smoother, more premium expansion ratios
  const grow = (i: number) => {
    if (active === null) return 1;
    return active === i ? 1.35 : 0.96;
  };

  // Lift hovered panel above the rest
  const z = (i: number) => (active === i ? 50 : 10 + i);

  // Shared hover feel
  const panelMotion = (i: number) => ({
    flexGrow: grow(i),
    y: active === i ? -6 : 0,
    boxShadow:
      active === i
        ? "0 30px 60px rgba(0,0,0,0.12)"
        : "0 10px 30px rgba(0,0,0,0.06)",
  });

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Chips */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-6 flex flex-wrap items-center justify-center gap-2"
        >
          {["student-only", "maintenance included", "free delivery* (t&cs)"].map(
            (x) => (
              <span
                key={x}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold tracking-widest text-black/60"
              >
                {x}
              </span>
            )
          )}
        </motion.div>

        {/* Overlapping strip */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="overflow-visible"
        >
          {/* Mobile: stacked. Desktop: overlap */}
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-0">
            {/* PANEL 1 — BLUE */}
            <motion.div
              layout
              variants={item}
              onMouseEnter={() => setActive(0)}
              onMouseLeave={() => setActive(null)}
              animate={panelMotion(0)}
              transition={{ duration: 0.55, ease: premiumEase }}
              style={{ zIndex: z(0) }}
              className="relative cursor-pointer overflow-hidden rounded-[28px] border border-black/10 bg-white lg:min-w-[260px] lg:-mr-10"
              whileHover={{ scale: 1.01 }}
            >
              <div
                className="absolute inset-0"
                style={{ backgroundColor: "rgba(19,116,184,0.10)" }}
              />
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full"
                style={{ backgroundColor: "rgba(19,116,184,0.18)" }}
                animate={{ x: [0, 10, 0], y: [0, 6, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative p-7">
                <p className="text-xs font-semibold tracking-widest text-black/55">
                  HOW IT WORKS
                </p>

                <p className="mt-4 text-5xl font-semibold tracking-tight text-black">
                  <CountUp to={3} />
                </p>

                <p className="mt-2 text-sm font-medium text-black/70">
                  appliances available
                </p>

                <p className="mt-4 text-sm leading-relaxed text-black/60">
                  bar fridge • microwave • top freezer
                </p>
              </div>
            </motion.div>

            {/* PANEL 2 — WHITE (5+) */}
            <motion.div
              layout
              variants={item}
              onMouseEnter={() => setActive(1)}
              onMouseLeave={() => setActive(null)}
              animate={panelMotion(1)}
              transition={{ duration: 0.55, ease: premiumEase }}
              style={{ zIndex: z(1) }}
              className="relative cursor-pointer overflow-hidden rounded-[28px] border border-black/10 bg-white lg:min-w-[320px] lg:-mr-10"
              whileHover={{ scale: 1.01 }}
            >
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(700px circle at 30% 40%, rgba(19,116,184,0.08), transparent 55%), radial-gradient(700px circle at 70% 40%, rgba(196,26,26,0.06), transparent 55%)",
                }}
                animate={{ opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative p-7">
                <p className="text-4xl font-semibold tracking-tight text-black">
                  <CountUp to={5} suffix="+" />
                </p>
                <p className="mt-2 text-sm font-medium text-black/70">
                  months minimum rental
                </p>
                <p className="mt-3 text-sm leading-relaxed text-black/60">
                  keeps pricing stable and the process simple for students.
                </p>
              </div>
            </motion.div>

            {/* PANEL 3 — WHITE (1) */}
            <motion.div
              layout
              variants={item}
              onMouseEnter={() => setActive(2)}
              onMouseLeave={() => setActive(null)}
              animate={panelMotion(2)}
              transition={{ duration: 0.55, ease: premiumEase }}
              style={{ zIndex: z(2) }}
              className="relative cursor-pointer overflow-hidden rounded-[28px] border border-black/10 bg-white lg:min-w-[320px] lg:-mr-10"
              whileHover={{ scale: 1.01 }}
            >
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(700px circle at 30% 40%, rgba(19,116,184,0.06), transparent 55%), radial-gradient(700px circle at 70% 40%, rgba(196,26,26,0.05), transparent 55%)",
                }}
                animate={{ opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative p-7">
                <p className="text-4xl font-semibold tracking-tight text-black">
                  <CountUp to={1} />
                </p>
                <p className="mt-2 text-sm font-medium text-black/70">
                  reference number
                </p>
                <p className="mt-3 text-sm leading-relaxed text-black/60">
                  every order gets a unique reference for tracking and payment.
                </p>
              </div>
            </motion.div>

            {/* PANEL 4 — RED (summary) */}
            <motion.div
              layout
              variants={item}
              onMouseEnter={() => setActive(3)}
              onMouseLeave={() => setActive(null)}
              animate={panelMotion(3)}
              transition={{ duration: 0.55, ease: premiumEase }}
              style={{ zIndex: z(3) }}
              className="relative cursor-pointer overflow-hidden rounded-[28px] border border-black/10 lg:min-w-[300px]"
              whileHover={{ scale: 1.01 }}
            >
              <div
                className="absolute inset-0"
                style={{ backgroundColor: "rgba(196,26,26,0.95)" }}
              />
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-white/10"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative p-7 text-white">
                <p className="text-xs font-semibold tracking-widest text-white/80">
                  QUICK SUMMARY
                </p>

                <h3 className="mt-4 text-xl font-semibold tracking-tight">
                  fast, student-friendly process
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  choose an appliance, submit your details, receive your reference
                  number, then we schedule delivery.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
