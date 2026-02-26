# Search Engine + Growth Stack Setup

## Must-Have Accounts
1. Google Search Console
2. Bing Webmaster Tools
3. Google Analytics 4
4. Google Tag Manager
5. Google Business Profile
6. Google Ads
7. Microsoft Clarity
8. Microsoft Ads (Bing UET)
9. Meta Business Manager + Meta Pixel
10. TikTok Ads Manager + TikTok Pixel
11. LinkedIn Campaign Manager + Insight Tag
12. Resend (Transactional Email Delivery)
13. Vercel (Production Hosting + Domains)
14. Neon (Database Hosting)

## Domain + Canonical Setup
1. Set Primary Domain To `https://varsitystarterpack.co.za`.
2. Force Single Canonical Host (No Mixed `www`/Root Duplication).
3. Redirect HTTP To HTTPS.
4. Redirect Non-Canonical Host To Canonical Host.

## Search Console + Webmaster Verification
1. Add Domain Property In Google Search Console.
2. Add Site In Bing Webmaster Tools.
3. Insert Verification Tokens In Environment Variables:
   - `GOOGLE_SITE_VERIFICATION`
   - `BING_SITE_VERIFICATION`
4. Validate `robots.txt` And `sitemap.xml` Submission In Both Consoles.

## Analytics + Ads Sync
1. Configure GA4 Property And Web Data Stream.
2. Configure GTM Container And Link GA4.
3. Configure Google Ads Conversion Import From GA4.
4. Configure Microsoft Ads UET Tag.
5. Configure Meta Pixel.
6. Configure TikTok Pixel.
7. Configure LinkedIn Insight Tag.
8. Configure Clarity Session Recording.

## Required Environment Variables
- `NEXT_PUBLIC_GA4_ID`
- `NEXT_PUBLIC_GA4_CONVERSION_LABEL`
- `NEXT_PUBLIC_GTM_ID`
- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_TIKTOK_PIXEL_ID`
- `NEXT_PUBLIC_CLARITY_ID`
- `NEXT_PUBLIC_BING_UET_ID`
- `NEXT_PUBLIC_LINKEDIN_PARTNER_ID`
- `GOOGLE_SITE_VERIFICATION`
- `BING_SITE_VERIFICATION`

## Event Mapping To Keep Platform Data Synced
- `select_appliance`
- `open_pricing`
- `click_whatsapp`
- `submit_order`
- `view_delivery_gallery`
- `submit_contact`
- `open_order`
- `click_facebook`
- `view_google_reviews`

## SEO / AEO / GEO Assets Already Implemented
1. Unique Metadata Per Page (Title, Description, Keywords, Canonical).
2. Open Graph + Twitter Cards.
3. `sitemap.xml` + `robots.txt`.
4. Structured Data:
   - `Organization`
   - `LocalBusiness`
   - `WebSite` + `SearchAction`
   - `BreadcrumbList`
   - `FAQPage`
   - `Service` / `OfferCatalog`
   - `Product` Offers For Appliance Rates
5. `llms.txt` For AI Retrieval Readiness.
6. Internal Linking Through Header, Footer, And Conversion CTAs.

## Indexing And Crawl Monitoring
1. Submit Updated Sitemap After Every Major Content Release.
2. Request Reindex For `/`, `/pricing`, `/order`, `/faq` After Significant Changes.
3. Monitor Coverage, Enhancements, Rich Results, And Core Web Vitals Weekly.
4. Fix Soft 404/Redirect/Canonical Conflicts Immediately.

## Local SEO Alignment
1. Keep Business Name, Address, And Phone Consistent Across Website + GBP.
2. Link GBP In Footer/Contact/Reviews CTA.
3. Keep Service Area Mentions Consistent (`Midrand`, `Johannesburg`, `Gauteng`).
4. Publish Fresh Delivery/Testimonial Updates Regularly.
