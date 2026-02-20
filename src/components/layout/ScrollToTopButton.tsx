"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const CONSENT_KEY = "vsp_cookie_consent_v1";

function hasCookieDecision() {
  if (typeof window === "undefined") return true;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "accepted" || value === "declined";
}

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [cookieSet, setCookieSet] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 280);
    };

    const updateCookieState = () => {
      setCookieSet(hasCookieDecision());
    };

    onScroll();
    updateCookieState();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("storage", updateCookieState);
    window.addEventListener("vsp-consent-change", updateCookieState);

    return () => {
      window.removeEventListener("scroll", onScroll);
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
        "water-hover water-lift vsp-focus fixed right-5 z-[95] inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/28 bg-white/16 text-white backdrop-blur-md sm:right-7",
        cookieSet ? "bottom-5 sm:bottom-7" : "bottom-24 sm:bottom-28",
      ].join(" ")}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M12 5l7 7-1.4 1.4L13 8.8V20h-2V8.8l-4.6 4.6L5 12z" />
      </svg>
    </button>
  );
}
