"use client";

import { useEffect, useState } from "react";
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

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [cookieSet, setCookieSet] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setVisible(getScrollTop() > 0);
    };

    const onScrollIntent = () => {
      setVisible(true);
    };

    const updateCookieState = () => {
      setCookieSet(hasCookieDecision());
    };

    onScroll();
    updateCookieState();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onScrollIntent, { passive: true });
    window.addEventListener("touchmove", onScrollIntent, { passive: true });
    window.addEventListener("storage", updateCookieState);
    window.addEventListener("vsp-consent-change", updateCookieState);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onScrollIntent);
      window.removeEventListener("touchmove", onScrollIntent);
      window.removeEventListener("storage", updateCookieState);
      window.removeEventListener("vsp-consent-change", updateCookieState);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => {
        trackEvent("scroll_to_top", { source: "floating_button" });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={[
        "water-hover water-lift vsp-focus fixed !left-auto !right-6 z-[140] inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/28 bg-white/16 text-white backdrop-blur-md sm:!right-8",
        cookieSet ? "bottom-20 sm:bottom-24" : "bottom-32 sm:bottom-36",
      ].join(" ")}
      style={{
        left: "auto",
        right: "max(24px, env(safe-area-inset-right))",
        insetInlineStart: "auto",
        insetInlineEnd: "max(24px, env(safe-area-inset-right))",
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M12 5l7 7-1.4 1.4L13 8.8V20h-2V8.8l-4.6 4.6L5 12z" />
      </svg>
    </button>
  );
}
