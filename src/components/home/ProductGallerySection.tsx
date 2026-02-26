"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants, easeOut } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

type Tile = {
  src: string;
  alt: string;
  href: string;
  className: string;
};

const TILES: Tile[] = [
  {
    src: "/products/gallery/bar-fridge-1.jpg",
    alt: "bar fridge rental",
    href: "/order?appliance=bar-fridge",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/products/gallery/microwave-1.jpg",
    alt: "microwave rental",
    href: "/order?appliance=microwave",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/products/gallery/top-freezer-1.jpg",
    alt: "top freezer rental",
    href: "/order?appliance=top-freezer",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/products/gallery/bar-fridge-2.jpg",
    alt: "bar fridge rental in res",
    href: "/order?appliance=bar-fridge",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/products/gallery/microwave-2.jpg",
    alt: "microwave rental for students",
    href: "/order?appliance=microwave",
    className: "md:col-span-1 md:row-span-1",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.54, ease: easeOut },
  },
};

const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

function setHoverVars(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const mx = ((e.clientX - rect.left) / rect.width) * 100;
  const my = ((e.clientY - rect.top) / rect.height) * 100;
  el.style.setProperty("--mx", `${mx}%`);
  el.style.setProperty("--my", `${my}%`);
}

export default function ProductGallerySection() {
  return (
    <section className="vsp-sync-fade-top relative overflow-hidden bg-transparent">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[190px] md:grid-cols-4"
        >
          {TILES.map((tile) => (
            <motion.div
              key={tile.src}
              variants={item}
              className={tile.className}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.34, ease: premiumEase }}
            >
              <Link
                href={tile.href}
                prefetch={false}
                onClick={() =>
                  trackEvent("select_appliance", {
                    source: "gallery",
                    href: tile.href,
                  })
                }
                onMouseMove={setHoverVars}
                className="water-hover vsp-focus vsp-panel group relative block h-[220px] w-full rounded-3xl sm:h-[240px] md:h-full"
                aria-label="open order page"
              >
                <Image
                  src={tile.src}
                  alt={tile.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />

                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(255,255,255,0.18))",
                  }}
                />

                <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/0 transition duration-500 group-hover:border-white/26" />

                <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-white/0 blur-2xl transition duration-500 group-hover:bg-white/16" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
