import type { Metadata, Viewport } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/layout/ClientProviders";
import GlobalFloatingItems from "@/components/layout/GlobalFloatingItems";
import { GLOBAL_SEO_KEYWORDS } from "@/lib/keywords";
import { siteConfig } from "@/lib/site";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const headingFont = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  process.env.GOOGLE_SITE_VERIFICATION;
const bingVerification =
  process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ||
  process.env.BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  manifest: "/manifest.webmanifest",
  applicationName: siteConfig.name,
  category: "student appliance rentals",
  creator: "Varsity Starter Pack",
  publisher: "Varsity Starter Pack",
  authors: [{ name: "Varsity Starter Pack" }],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  title: {
    default: "Varsity Starter Pack | Student Appliance Rentals",
    template: "%s | Varsity Starter Pack",
  },
  description: siteConfig.description,
  keywords: GLOBAL_SEO_KEYWORDS,
  alternates: {
    canonical: "/",
    languages: {
      "en-ZA": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    title: "Varsity Starter Pack | Student Appliance Rentals",
    description: siteConfig.description,
    images: [
      {
        url: "/hero/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Varsity Starter Pack student appliance rentals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Varsity Starter Pack | Student Appliance Rentals",
    description: siteConfig.description,
    images: ["/hero/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "ZA-GP",
    "geo.placename": "Midrand",
    ICBM: "-25.9992, 28.1263",
  },
  verification: {
    google: googleVerification,
    other: bingVerification ? { "msvalidate.01": bingVerification } : undefined,
  },
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.svg" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-ZA">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>
        <GlobalFloatingItems />
        {children}
        <ClientProviders />
      </body>
    </html>
  );
}
