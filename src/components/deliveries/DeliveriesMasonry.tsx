"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DELIVERY_IMAGES, type DeliveryImage } from "@/data/deliveries";
import { trackEvent } from "@/lib/analytics";

const SHOW_COUNT = 12;

function setHoverVars(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const mx = ((e.clientX - rect.left) / rect.width) * 100;
  const my = ((e.clientY - rect.top) / rect.height) * 100;
  el.style.setProperty("--mx", `${mx}%`);
  el.style.setProperty("--my", `${my}%`);
}

function randomSeed() {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const bytes = new Uint32Array(1);
    crypto.getRandomValues(bytes);
    return bytes[0].toString(16);
  }
  return String(Math.floor(Math.random() * 1e9));
}

function shuffleWithSeed<T>(values: T[], seedText: string) {
  let seed = 0;
  for (let i = 0; i < seedText.length; i += 1) {
    seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
  }

  const rand = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 4294967296;
  };

  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function DeliveriesMasonry() {
  const all = useMemo(() => DELIVERY_IMAGES, []);
  const initialItems = useMemo(
    () => all.slice(0, Math.min(SHOW_COUNT, all.length)),
    [all]
  );

  const [items, setItems] = useState<DeliveryImage[]>(initialItems);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const reshuffle = useCallback(() => {
    const seed = randomSeed();
    const shuffled = shuffleWithSeed(all, seed);
    setItems(shuffled.slice(0, Math.min(SHOW_COUNT, shuffled.length)));
    setActiveIndex(0);
  }, [all]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      reshuffle();
    }, 0);

    const onVisibility = () => {
      if (document.visibilityState === "visible") reshuffle();
    };

    const onPageShow = () => reshuffle();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [reshuffle]);

  const next = useCallback(() => {
    setActiveIndex((value) => (value + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setActiveIndex((value) => (value - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, next, prev]);

  const totalShowing = Math.min(SHOW_COUNT, DELIVERY_IMAGES.length);

  const openAt = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
    trackEvent("view_delivery_gallery", {
      source: "deliveries_grid",
      index: index + 1,
    });
  };

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.targetTouches[0]?.clientX ?? null;
    touchEndX.current = null;
  };

  const onTouchMove = (event: React.TouchEvent) => {
    touchEndX.current = event.targetTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = () => {
    const start = touchStartX.current;
    const end = touchEndX.current;
    if (start == null || end == null) return;

    const delta = start - end;
    if (Math.abs(delta) < 50) return;

    if (delta > 0) next();
    else prev();
  };

  const active = items[activeIndex];

  return (
    <section className="vsp-sync-fade-top relative overflow-hidden bg-transparent">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px circle at 15% 10%, rgba(255,255,255,0.1), transparent 58%), radial-gradient(1000px circle at 85% 5%, rgba(255,255,255,0.1), transparent 58%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-white/76">DELIVERIES</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Recent Deliveries
            </h2>
            <p className="mt-3 max-w-2xl text-base text-white/84">
              A quick look at deliveries to res and apartments. This gallery
              reshuffles every time you open or return to this page.
            </p>
            <div className="vsp-fade-line mt-5 h-[3px] w-20" />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold tracking-widest text-white/76">
              Showing {totalShowing} of {DELIVERY_IMAGES.length}
            </div>

            <button
              type="button"
              onClick={() => {
                reshuffle();
                trackEvent("reshuffle_delivery_gallery", { source: "deliveries" });
              }}
              onMouseMove={setHoverVars}
              className="water-hover vsp-focus rounded-full border border-white/30 bg-white/12 px-4 py-2 text-[11px] font-semibold tracking-widest text-white hover:bg-white/18"
            >
              RESHUFFLE
            </button>
          </div>
        </div>

        <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4">
          {items.map((image, index) => (
            <motion.button
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => openAt(index)}
              onMouseMove={setHoverVars}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="water-hover vsp-sheen water-lift vsp-focus vsp-panel mb-4 w-full break-inside-avoid rounded-3xl text-left"
              aria-label="Open image preview"
            >
              <div className="relative w-full" style={{ height: 220 + (index % 5) * 36 }}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={index < 4}
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && active ? (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center px-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              aria-label="Close preview"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-[rgb(var(--vsp-red))/0.84] backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.985 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="vsp-panel relative z-[101] w-[92vw] max-w-5xl rounded-3xl"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/14 px-4 py-3">
                <div className="text-xs font-semibold tracking-widest text-white/80">
                  DELIVERY GALLERY {activeIndex + 1}/{items.length}
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  onMouseMove={setHoverVars}
                  className="water-hover vsp-focus rounded-xl border border-white/28 bg-white/14 px-3 py-2 text-xs font-semibold tracking-widest text-white"
                >
                  CLOSE
                </button>
              </div>

              <div className="relative h-[62vh] w-full bg-white/8">
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  className="object-contain"
                  sizes="92vw"
                  priority
                />
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-white/14 px-4 py-3">
                <button
                  type="button"
                  onClick={prev}
                  onMouseMove={setHoverVars}
                  className="water-hover vsp-focus rounded-xl border border-white/28 bg-white/14 px-4 py-3 text-xs font-semibold tracking-widest text-white"
                >
                  PREV
                </button>

                <div className="text-[11px] text-white/72">Swipe, arrow keys, or Esc</div>

                <button
                  type="button"
                  onClick={next}
                  onMouseMove={setHoverVars}
                  className="water-hover vsp-focus rounded-xl border border-white/28 bg-white/14 px-4 py-3 text-xs font-semibold tracking-widest text-white"
                >
                  NEXT
                </button>
              </div>

              <div className="border-t border-white/14 px-4 py-4">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {items.map((image, index) => {
                    const selected = index === activeIndex;
                    return (
                      <button
                        key={`${image.src}-thumb-${index}`}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={[
                          "relative h-12 w-16 shrink-0 overflow-hidden rounded-xl border transition",
                          selected
                            ? "border-white/76"
                            : "border-white/24 hover:border-white/46",
                        ].join(" ")}
                        aria-label={`View image ${index + 1}`}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
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
