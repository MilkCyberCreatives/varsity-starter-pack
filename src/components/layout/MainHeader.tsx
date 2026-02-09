"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";

const PRIMARY = "#c41a1a";

/** Premium cursor FX (site-wide because header is global) */
function CursorFX() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let raf = 0;
    let x = 0;
    let y = 0;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf) return;

      raf = window.requestAnimationFrame(() => {
        dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        raf = 0;
      });
    };

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest(
        "a, button, [role='button'], input, select, textarea"
      );
      ring.dataset.active = interactive ? "1" : "0";
    };

    const onDown = () => (ring.dataset.down = "1");
    const onUp = () => (ring.dataset.down = "0");

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="vsp-cursor-dot" aria-hidden="true" />
      <div
        ref={ringRef}
        className="vsp-cursor-ring"
        data-active="0"
        data-down="0"
        aria-hidden="true"
      />
    </>
  );
}

export default function MainHeader() {
  const pathname = usePathname();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const NAV = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Rental Rates", href: "/pricing" },
      { label: "Deliveries", href: "/how-it-works#deliveries" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Booking Steps", href: "/how-it-works" },
    ],
    []
  );

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const setHoverVars = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--mx", `${mx}%`);
    el.style.setProperty("--my", `${my}%`);
  };

  const isActive = (href: string) => {
    const base = href.split("#")[0];
    if (base === "/") return pathname === "/";
    return pathname?.startsWith(base);
  };

  return (
    <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: PRIMARY }}>
      <CursorFX />

      <div
        className={[
          "pointer-events-none absolute inset-0 transition-all duration-300",
          scrolled ? "backdrop-blur-md bg-black/10" : "bg-black/0",
        ].join(" ")}
        aria-hidden="true"
      >
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/15" />
      </div>

      <div className={["relative mx-auto max-w-6xl px-4", scrolled ? "py-3" : "py-4"].join(" ")}>
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
          {/* LEFT */}
          <Link
            href="/"
            aria-label="go to home"
            className="water-hover vsp-focus rounded-2xl p-2"
            onMouseMove={setHoverVars}
          >
            <div className="relative h-16 w-[210px] sm:h-[72px] sm:w-[240px]">
              <Image
                src="/varsity-logo.png"
                alt="Varsity Starter Pack"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 640px) 210px, 240px"
              />
            </div>
          </Link>

          {/* CENTER */}
          <nav className="hidden lg:flex items-center justify-center gap-4 xl:gap-6" aria-label="main navigation">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseMove={setHoverVars}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "vsp-navlink water-hover vsp-focus whitespace-nowrap",
                    "relative rounded-full px-4 py-2",
                    "text-[14px] font-semibold tracking-wide",
                    "transition-all duration-200",
                    active ? "text-white" : "text-white/90 hover:text-white",
                  ].join(" ")}
                >
                  <span className="relative z-10 whitespace-nowrap">
                    {item.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute inset-0 rounded-full transition-all duration-200",
                      active ? "bg-white/12 ring-1 ring-white/20" : "bg-transparent",
                    ].join(" ")}
                  />
                </Link>
              );
            })}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center justify-end gap-2">
            <Link
              href="/order"
              onMouseMove={setHoverVars}
              className={[
                "water-hover water-lift vsp-focus",
                "hidden sm:inline-flex items-center justify-center",
                "rounded-full bg-white px-6 py-3",
                "text-[13px] font-semibold tracking-wide text-black",
                "transition hover:bg-white/95",
              ].join(" ")}
            >
              Request Order
            </Link>

            <button
              type="button"
              className={[
                "lg:hidden",
                "water-hover vsp-focus",
                "inline-flex h-11 w-11 items-center justify-center",
                "rounded-full border border-white/25 bg-white/10 text-white",
                "transition hover:bg-white/15",
              ].join(" ")}
              onMouseMove={setHoverVars}
              onClick={() => setOpen((v) => !v)}
              aria-label="toggle menu"
              aria-expanded={open}
              aria-controls={menuId}
            >
              <span className="text-xl leading-none">{open ? "×" : "≡"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu untouched */}
      <div
        id={menuId}
        className={[
          "lg:hidden overflow-hidden border-t border-white/15 bg-white/10 backdrop-blur-md",
          "transition-[max-height,opacity] duration-300",
          open ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="mx-auto max-w-6xl px-4 py-4">
          <nav className="grid gap-2" aria-label="mobile navigation">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  onMouseMove={setHoverVars}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "water-hover vsp-focus",
                    "rounded-xl px-4 py-3",
                    "text-[14px] font-semibold tracking-wide",
                    "transition",
                    active
                      ? "bg-white/12 text-white ring-1 ring-white/15"
                      : "text-white/90 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
