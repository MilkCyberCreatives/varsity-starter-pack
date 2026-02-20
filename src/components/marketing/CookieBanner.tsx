"use client";

import Link from "next/link";
import { useState } from "react";

export const CONSENT_KEY = "vsp_cookie_consent_v1";
export type ConsentState = "accepted" | "declined" | null;

function readConsent(): ConsentState {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CONSENT_KEY);
  if (raw === "accepted" || raw === "declined") return raw;
  return null;
}

function writeConsent(value: Exclude<ConsentState, null>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new Event("vsp-consent-change"));
}

export function getConsentState() {
  return readConsent();
}

function setHoverVars(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const mx = ((e.clientX - rect.left) / rect.width) * 100;
  const my = ((e.clientY - rect.top) / rect.height) * 100;
  el.style.setProperty("--mx", `${mx}%`);
  el.style.setProperty("--my", `${my}%`);
}

export default function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState>(() => readConsent());

  if (consent) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[80] w-[min(94vw,420px)] sm:bottom-6 sm:right-6">
      <div className="rounded-3xl border border-white/30 bg-white/14 p-4 backdrop-blur-md sm:p-5">
        <p className="text-xs font-semibold tracking-widest text-white/76">
          COOKIE NOTICE
        </p>
        <p className="mt-2 text-sm text-white/84">
          We use cookies for analytics and marketing performance. You can accept
          or decline optional tracking.
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/privacy"
            onMouseMove={setHoverVars}
            className="water-hover vsp-focus inline-flex items-center rounded-xl border border-white/24 px-4 py-2 text-xs font-semibold tracking-widest text-white/88 transition hover:bg-white/16"
          >
            PRIVACY POLICY
          </Link>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                writeConsent("declined");
                setConsent("declined");
              }}
              onMouseMove={setHoverVars}
              className="water-hover vsp-focus rounded-xl border border-white/24 px-4 py-2 text-xs font-semibold tracking-widest text-white/88 transition hover:bg-white/16"
            >
              DECLINE
            </button>
            <button
              type="button"
              onClick={() => {
                writeConsent("accepted");
                setConsent("accepted");
              }}
              onMouseMove={setHoverVars}
              className="water-hover vsp-focus rounded-xl border border-white/26 bg-white px-4 py-2 text-xs font-semibold tracking-widest text-[rgb(var(--vsp-red))] transition hover:opacity-95"
            >
              ACCEPT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
