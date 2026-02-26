type AnalyticsValue = string | number | boolean | undefined;
type AnalyticsPayload = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: { track?: (event: string, payload?: AnalyticsPayload) => void };
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function pushDataLayer(event: string, payload: AnalyticsPayload = {}) {
  if (!isBrowser()) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}

export function trackEvent(event: string, payload: AnalyticsPayload = {}) {
  if (!isBrowser()) return;

  pushDataLayer(event, payload);

  if (window.gtag) window.gtag("event", event, payload);
  if (window.fbq) window.fbq("trackCustom", event, payload);
  if (window.ttq?.track) window.ttq.track(event, payload);
}

export function trackOrderConversion(reference: string) {
  trackEvent("submit_order", { reference });

  if (!isBrowser() || !window.gtag) return;
  const conversionLabel = process.env.NEXT_PUBLIC_GA4_CONVERSION_LABEL;
  if (!conversionLabel) return;

  window.gtag("event", "conversion", {
    send_to: conversionLabel,
    value: 1,
    currency: "ZAR",
    reference,
  });
}

