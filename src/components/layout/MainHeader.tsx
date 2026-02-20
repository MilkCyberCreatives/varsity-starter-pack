"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Rental Rates", href: "/pricing" },
  { label: "Deliveries", href: "/deliveries" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Booking Steps", href: "/how-it-works" },
];

const FACEBOOK_URL =
  process.env.NEXT_PUBLIC_FACEBOOK_URL?.trim() || siteConfig.facebookUrl;

function setHoverVars(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const mx = ((e.clientX - rect.left) / rect.width) * 100;
  const my = ((e.clientY - rect.top) / rect.height) * 100;
  el.style.setProperty("--mx", `${mx}%`);
  el.style.setProperty("--my", `${my}%`);
}

export default function MainHeader() {
  const pathname = usePathname();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  const onNavClick = (item: NavItem) => {
    if (item.href === "/pricing") {
      trackEvent("open_pricing", { source: "header_nav" });
    }
  };

  return (
    <header
      className="vsp-red-sync sticky top-0 z-50"
      style={{
        backgroundColor: scrolled ? "rgb(var(--vsp-red-deep))" : "rgba(120,10,10,0.06)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(760px circle at 16% 0%, rgba(255,255,255,0.26), transparent 56%), radial-gradient(760px circle at 84% 0%, rgba(255,255,255,0.14), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-2.5 sm:py-3.5">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-4">
          <Link
            href="/"
            onMouseMove={setHoverVars}
            className="water-hover vsp-focus rounded-2xl p-1 lg:justify-self-start"
            aria-label="Go to home"
          >
            <div className="relative h-[78px] w-[256px] sm:h-[92px] sm:w-[310px]">
              <Image
                src="/varsity-logo.png"
                alt="Varsity Starter Pack"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 640px) 256px, 310px"
              />
            </div>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center justify-center lg:flex"
          >
            <div className="vsp-panel-soft rounded-full px-1.5 py-1">
              <ul className="flex flex-nowrap items-center gap-0.5 xl:gap-1">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => onNavClick(item)}
                        onMouseMove={setHoverVars}
                        aria-current={active ? "page" : undefined}
                        className={[
                          "water-hover vsp-focus relative inline-flex whitespace-nowrap rounded-full border px-2.5 py-2 text-[12px] font-semibold tracking-wide xl:px-3",
                          active
                            ? "border-white/40 bg-white/16 text-white"
                            : "border-transparent text-white/92 hover:border-white/24 hover:bg-white/10",
                        ].join(" ")}
                      >
                        <span className="relative z-10">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          <div className="flex items-center justify-end gap-2 lg:justify-self-end">
            <Link
              href="/order"
              onClick={() => trackEvent("open_order", { source: "header_cta" })}
              onMouseMove={setHoverVars}
              className="water-hover water-lift vsp-focus hidden rounded-full border border-white/26 bg-white px-5 py-2.5 text-xs font-semibold tracking-widest text-[rgb(var(--vsp-red))] sm:inline-flex"
            >
              REQUEST ORDER
            </Link>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Visit Facebook page"
              onClick={() => trackEvent("click_facebook", { source: "header_cta" })}
              onMouseMove={setHoverVars}
              className="water-hover water-lift vsp-focus hidden h-10 w-10 items-center justify-center rounded-full border border-white/26 bg-white text-[rgb(var(--vsp-red))] sm:inline-flex"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M14 8V6.7c0-.6.4-.7.7-.7h2V3h-2.9C11 3 10 5 10 7.2V8H8v3h2V21h4v-10h2.7l.3-3H14z" />
              </svg>
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              onMouseMove={setHoverVars}
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls={menuId}
              className="water-hover vsp-focus inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/26 bg-white/14 text-white hover:bg-white/20 lg:hidden"
            >
              <span className="sr-only">Menu</span>
              <div className="relative h-4 w-5">
                <span
                  className={[
                    "absolute left-0 h-0.5 w-5 bg-white transition",
                    open ? "top-2 rotate-45" : "top-0",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute left-0 top-2 h-0.5 w-5 bg-white transition",
                    open ? "opacity-0" : "opacity-100",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute left-0 h-0.5 w-5 bg-white transition",
                    open ? "top-2 -rotate-45" : "top-4",
                  ].join(" ")}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div
        id={menuId}
        className={[
          "overflow-hidden border-t border-white/20 bg-white/12 backdrop-blur-md transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-[560px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav className="mx-auto max-w-6xl px-4 py-4" aria-label="Mobile navigation">
          <ul className="grid gap-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      onNavClick(item);
                      setOpen(false);
                    }}
                    onMouseMove={setHoverVars}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "water-hover vsp-focus inline-flex w-full rounded-xl border px-4 py-3 text-[13px] font-semibold tracking-wide",
                      active
                        ? "border-white/36 bg-white/16 text-white"
                        : "border-white/12 text-white/92 hover:border-white/24 hover:bg-white/10",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/order"
                onClick={() => {
                  trackEvent("open_order", { source: "mobile_menu" });
                  setOpen(false);
                }}
                onMouseMove={setHoverVars}
                className="water-hover vsp-focus inline-flex w-full justify-center rounded-xl border border-white/24 bg-white px-4 py-3 text-xs font-semibold tracking-widest text-[rgb(var(--vsp-red))]"
              >
                REQUEST ORDER
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
