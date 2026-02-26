"use client";

import dynamic from "next/dynamic";

const CookieBanner = dynamic(() => import("@/components/marketing/CookieBanner"), {
  ssr: false,
});

const AnalyticsProvider = dynamic(
  () => import("@/components/marketing/AnalyticsProvider"),
  { ssr: false }
);
const CursorHalo = dynamic(() => import("@/components/layout/CursorHalo"), {
  ssr: false,
});

export default function ClientProviders() {
  return (
    <>
      <CursorHalo />
      <CookieBanner />
      <AnalyticsProvider />
    </>
  );
}
