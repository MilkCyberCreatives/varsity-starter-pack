"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

// Premium easing curve
const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ProductGallerySection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="
            grid gap-4
            md:grid-cols-4 md:auto-rows-[190px]
          "
        >
          {TILES.map((t) => (
            <motion.div
              key={t.src}
              variants={item}
              className={t.className}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.45, ease: premiumEase }}
            >
              <Link
                href={t.href}
                className="group relative block h-full w-full overflow-hidden rounded-3xl bg-black/5"
                aria-label="open order page"
              >
                {/* image */}
                <Image
                  src={t.src}
                  alt={t.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />

                {/* premium overlay (soft) */}
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/12" />

                {/* edge highlight (feels premium) */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/0 transition duration-500 group-hover:ring-black/10" />

                {/* subtle corner sheen */}
                <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/0 blur-2xl transition duration-500 group-hover:bg-white/12" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
