"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DELIVERY_IMAGES, type DeliveryImage } from "@/data/deliveries";

const PRIMARY = "#c41a1a";
const SHOW_COUNT = 12;

function randomSeed() {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const a = new Uint32Array(1);
    crypto.getRandomValues(a);
    return a[0].toString(16);
  }
  return String(Math.floor(Math.random() * 1e9));
}

function shuffleWithSeed<T>(arr: T[], seedStr: string) {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;

  const rand = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 4294967296;
  };

  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function DeliveriesMasonry() {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<DeliveryImage[]>([]);

  // Lightbox
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const all = useMemo(() => DELIVERY_IMAGES, []);

  const reshuffle = () => {
    const seed = randomSeed();
    const shuffled = shuffleWithSeed(all, seed);
    setItems(shuffled.slice(0, Math.min(SHOW_COUNT, shuffled.length)));
    setActiveIndex(0);
  };

  useEffect(() => {
    setMounted(true);

    // ✅ reshuffle on first mount
    reshuffle();

    // ✅ reshuffle when user returns to tab
    const onVis = () => {
      if (document.visibilityState === "visible") reshuffle();
    };

    // ✅ reshuffle when navigating back/forward (bfcache)
    const onPageShow = () => reshuffle();

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pageshow", onPageShow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all]);

  const totalShowing = Math.min(SHOW_COUNT, DELIVERY_IMAGES.length);

  const openAt = (i: number) => {
    setActiveIndex(i);
    setOpen(true);
  };

  const close = () => setOpen(false);

  const next = () => setActiveIndex((v) => (v + 1) % items.length);
  const prev = () => setActiveIndex((v) => (v - 1 + items.length) % items.length);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, items.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0]?.clientX ?? null;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0]?.clientX ?? null;
  };
  const onTouchEnd = () => {
    const start = touchStartX.current;
    const end = touchEndX.current;
    if (start == null || end == null) return;

    const diff = start - end;
    if (Math.abs(diff) < 50) return;

    if (diff > 0) next();
    else prev();
  };

  const active = items[activeIndex];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        {/* Heading */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-black/50">DELIVERIES</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black sm:text-4xl">Recent Deliveries</h2>
            <p className="mt-3 max-w-2xl text-base text-black/65">
              A quick look at deliveries to res and apartments. This gallery reshuffles every time you open/return to this page.
            </p>
            <div className="mt-5 h-[3px] w-16 rounded-full" style={{ backgroundColor: PRIMARY }} />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold tracking-widest text-black/50">
              Showing {totalShowing} of {DELIVERY_IMAGES.length}
            </div>

            <button
              type="button"
              onClick={reshuffle}
              className="water-hover vsp-focus rounded-full border border-black/10 bg-white px-4 py-2 text-[11px] font-semibold tracking-widest text-black transition hover:bg-black/5"
            >
              RESHUFFLE
            </button>
          </div>
        </div>

        {/* Masonry */}
        <div className="mt-10">
          {!mounted ? (
            <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
              {Array.from({ length: SHOW_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className="mb-4 break-inside-avoid rounded-3xl border border-black/10 bg-black/[0.03]"
                  style={{ height: 160 + (i % 4) * 50 }}
                />
              ))}
            </div>
          ) : (
            <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
              {items.map((img, i) => (
                <motion.button
                  key={`${img.src}-${i}`}
                  type="button"
                  onClick={() => openAt(i)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className={[
                    "mb-4 break-inside-avoid w-full text-left",
                    "rounded-3xl border border-black/10 bg-white overflow-hidden",
                    "water-hover vsp-sheen water-lift vsp-focus",
                  ].join(" ")}
                  aria-label="open image preview"
                >
                  <div className="relative w-full" style={{ height: 220 + (i % 5) * 38 }}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      priority={i < 4}
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open && active ? (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
          >
            <button type="button" aria-label="close preview" onClick={close} className="absolute inset-0 bg-black/70" />

            <motion.div
              initial={{ opacity: 0, scale: 0.985, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.985, y: 10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative z-[101] w-[92vw] max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-black"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div className="text-xs font-semibold tracking-widest text-white/70">
                  DELIVERY GALLERY • {activeIndex + 1}/{items.length}
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold tracking-widest text-white transition hover:bg-white/15"
                >
                  CLOSE
                </button>
              </div>

              <div className="relative h-[64vh] w-full">
                <Image src={active.src} alt={active.alt} fill className="object-contain" sizes="92vw" priority />
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
                <button
                  type="button"
                  onClick={prev}
                  className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-semibold tracking-widest text-white transition hover:bg-white/15"
                >
                  PREV
                </button>

                <div className="text-[11px] text-white/55">Swipe • ← → • Esc</div>

                <button
                  type="button"
                  onClick={next}
                  className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-semibold tracking-widest text-white transition hover:bg-white/15"
                >
                  NEXT
                </button>
              </div>

              <div className="border-t border-white/10 px-4 py-4">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {items.map((img, i) => {
                    const selected = i === activeIndex;
                    return (
                      <button
                        key={`${img.src}-thumb-${i}`}
                        type="button"
                        onClick={() => setActiveIndex(i)}
                        className={[
                          "relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-xl border transition",
                          selected ? "border-white/50" : "border-white/15 hover:border-white/30",
                        ].join(" ")}
                        aria-label={`view image ${i + 1}`}
                      >
                        <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="64px" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
