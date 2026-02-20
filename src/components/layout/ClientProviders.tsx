"use client";

import dynamic from "next/dynamic";

const CookieBanner = dynamic(() => import("@/components/marketing/CookieBanner"), {
  ssr: false,
});

const AnalyticsProvider = dynamic(
  () => import("@/components/marketing/AnalyticsProvider"),
  { ssr: false }
);
const ScrollToTopButton = dynamic(
  () => import("@/components/layout/ScrollToTopButton"),
  { ssr: false }
);
const VirtualAssistantButton = dynamic(
  () => import("@/components/layout/VirtualAssistantButton"),
  { ssr: false }
);
const CursorHalo = dynamic(() => import("@/components/layout/CursorHalo"), {
  ssr: false,
});

export default function ClientProviders() {
  return (
    <>
      <CursorHalo />
      <VirtualAssistantButton />
      <ScrollToTopButton />
      <CookieBanner />
      <AnalyticsProvider />
    </>
  );
}
