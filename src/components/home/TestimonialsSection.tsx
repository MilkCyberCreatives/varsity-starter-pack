"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

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
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 1, y: 0 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: premiumEase },
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

export default function TestimonialsSection() {
  return (
    <section className="vsp-sync-fade-top relative overflow-hidden bg-transparent py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px circle at 15% 20%, rgba(255,255,255,0.11), transparent 55%), radial-gradient(900px circle at 85% 20%, rgba(255,255,255,0.11), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: premiumEase }}
          className="text-center"
        >
          <p className="text-xs font-semibold tracking-widest text-white/78">
            TESTIMONIALS
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            What Other Students Are Saying
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/84">
            Trusted by students across Gauteng for reliable appliance rentals.
          </p>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 84, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: premiumEase }}
            className="vsp-fade-line mx-auto mt-6 h-[3px]"
          />
        </motion.div>

        <motion.div
          variants={container}
          initial="show"
          whileInView="show"
          viewport={{ once: true, amount: 0.24 }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <motion.article
              key={testimonial.name}
              variants={item}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.35, ease: premiumEase }}
              onMouseMove={setHoverVars}
              className="water-hover vsp-panel rounded-3xl p-7"
            >
              <div className="relative flex items-center gap-1 text-white/92">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <span key={`${testimonial.name}-${index}`} aria-hidden="true">
                    &#9733;
                  </span>
                ))}
              </div>

              <p className="relative mt-4 text-sm leading-relaxed text-white/84">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="relative mt-6 border-t border-white/16 pt-4">
                <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                <p className="text-xs text-white/66">{testimonial.source}</p>
              </div>

              <div className="vsp-fade-line mt-6 h-[2px] w-full" />
            </motion.article>
          ))}
        </motion.div>

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
            onClick={() => trackEvent("click_whatsapp", { source: "testimonials_section" })}
            onMouseMove={setHoverVars}
            className="water-hover water-lift vsp-focus inline-flex items-center justify-center rounded-xl border border-white/28 bg-white px-8 py-3 text-xs font-semibold tracking-widest text-[rgb(var(--vsp-red))]"
          >
            CHAT WITH US ON WHATSAPP
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
