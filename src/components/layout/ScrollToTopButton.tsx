"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { trackEvent } from "@/lib/analytics";

const CONSENT_KEY = "vsp_cookie_consent_v1";

function hasCookieDecision() {
  if (typeof window === "undefined") return true;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "accepted" || value === "declined";
}

function getScrollTop() {
  if (typeof window === "undefined") return 0;
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function isHeroInView() {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  const hero = document.querySelector<HTMLElement>("[data-vsp-hero='1']");
  if (!hero) return false;
  const rect = hero.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [cookieSet, setCookieSet] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setVisible(getScrollTop() > 0);
      setHeroVisible(isHeroInView());
    };

    const onScrollIntent = () => {
      setVisible(true);
      setHeroVisible(isHeroInView());
    };

    const updateCookieState = () => {
      setCookieSet(hasCookieDecision());
    };

    const onResize = () => {
      setHeroVisible(isHeroInView());
    };

    onScroll();
    updateCookieState();

    let observer: IntersectionObserver | null = null;
    const hero = document.querySelector<HTMLElement>("[data-vsp-hero='1']");
    if (hero && typeof window !== "undefined" && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const nextVisible = entries[0]?.isIntersecting ?? false;
          setHeroVisible(nextVisible);
        },
        { threshold: 0.01 }
      );
      observer.observe(hero);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onScrollIntent, { passive: true });
    window.addEventListener("touchmove", onScrollIntent, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("storage", updateCookieState);
    window.addEventListener("vsp-consent-change", updateCookieState);

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onScrollIntent);
      window.removeEventListener("touchmove", onScrollIntent);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("storage", updateCookieState);
      window.removeEventListener("vsp-consent-change", updateCookieState);
    };
  }, [pathname]);

  if (!visible || heroVisible || typeof document === "undefined") return null;
  const rightInset = "max(24px, env(safe-area-inset-right))";
  const bottomInset = cookieSet ? "16px" : "112px";

  return createPortal(
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => {
        trackEvent("scroll_to_top", { source: "floating_button" });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="water-hover water-lift vsp-focus z-[140] inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/28 bg-white/16 text-white backdrop-blur-md"
      style={{
        position: "fixed",
        right: rightInset,
        left: "unset",
        bottom: bottomInset,
        insetInlineStart: "unset",
        insetInlineEnd: rightInset,
        transform: "none",
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M12 5l7 7-1.4 1.4L13 8.8V20h-2V8.8l-4.6 4.6L5 12z" />
      </svg>
    </button>,
    document.body
  );
}
