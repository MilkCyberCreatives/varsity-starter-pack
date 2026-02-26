"use client";

import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import {
  CONSENT_KEY,
  getConsentState,
  type ConsentState,
} from "@/components/marketing/CookieBanner";
import { pushDataLayer } from "@/lib/analytics";

export default function AnalyticsProvider() {
  const [consent, setConsent] = useState<ConsentState>(null);

  useEffect(() => {
    const update = () => setConsent(getConsentState());
    update();
    window.addEventListener("vsp-consent-change", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("vsp-consent-change", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  useEffect(() => {
    if (consent === "accepted") pushDataLayer("consent_granted");
    if (consent === "declined") pushDataLayer("consent_declined");
  }, [consent]);

  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const bingUetId = process.env.NEXT_PUBLIC_BING_UET_ID;
  const linkedInPartnerId = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;
  const shouldLoad = consent === "accepted";

  const gaInit = useMemo(() => {
    if (!ga4Id) return "";
    return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('consent','default',{analytics_storage:'granted',ad_storage:'granted'});gtag('config','${ga4Id}',{anonymize_ip:true});`;
  }, [ga4Id]);

  const gtmInit = useMemo(() => {
    if (!gtmId) return "";
    return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
  }, [gtmId]);

  const metaInit = useMemo(() => {
    if (!metaPixelId) return "";
    return `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`;
  }, [metaPixelId]);

  const tikTokInit = useMemo(() => {
    if (!tiktokPixelId) return "";
    return `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))};};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e;};ttq.load=function(e,n){var i='https://analytics.tiktok.com/i18n/pixel/events.js';ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement('script');o.type='text/javascript';o.async=!0;o.src=i+'?sdkid='+e+'&lib='+t;var a=document.getElementsByTagName('script')[0];a.parentNode.insertBefore(o,a);};ttq.load('${tiktokPixelId}');ttq.page();}(window,document,'ttq');`;
  }, [tiktokPixelId]);

  const clarityInit = useMemo(() => {
    if (!clarityId) return "";
    return `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,'clarity','script','${clarityId}');`;
  }, [clarityId]);

  const bingUetInit = useMemo(() => {
    if (!bingUetId) return "";
    return `(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:'${bingUetId}',enableAutoSpaTracking:true};o.q=w[u],w[u]=new UET(o),w[u].push('pageLoad')},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=='loaded'&&s!=='complete'||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,'script','//bat.bing.com/bat.js','uetq');`;
  }, [bingUetId]);

  const linkedInInit = useMemo(() => {
    if (!linkedInPartnerId) return "";
    return `window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push('${linkedInPartnerId}');(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName('script')[0];var b=document.createElement('script');b.type='text/javascript';b.async=true;b.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';s.parentNode.insertBefore(b,s);})(window.lintrk);`;
  }, [linkedInPartnerId]);

  if (!shouldLoad) return null;

  return (
    <>
      <Script
        id="vsp-consent-state"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `localStorage.setItem('${CONSENT_KEY}','accepted');`,
        }}
      />

      {ga4Id ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script
            id="vsp-ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: gaInit }}
          />
        </>
      ) : null}

      {gtmId ? (
        <Script
          id="vsp-gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: gtmInit }}
        />
      ) : null}

      {metaPixelId ? (
        <Script
          id="vsp-meta-pixel-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: metaInit }}
        />
      ) : null}

      {tiktokPixelId ? (
        <Script
          id="vsp-tiktok-pixel-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: tikTokInit }}
        />
      ) : null}

      {clarityId ? (
        <Script
          id="vsp-clarity-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: clarityInit }}
        />
      ) : null}

      {bingUetId ? (
        <Script
          id="vsp-bing-uet-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: bingUetInit }}
        />
      ) : null}

      {linkedInPartnerId ? (
        <Script
          id="vsp-linkedin-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: linkedInInit }}
        />
      ) : null}
    </>
  );
}
