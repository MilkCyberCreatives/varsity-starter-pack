import type { Metadata, Viewport } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/layout/ClientProviders";
import GlobalFloatingItems from "@/components/layout/GlobalFloatingItems";
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
  title: {
    default: "Varsity Starter Pack | Student Appliance Rentals",
    template: "%s | Varsity Starter Pack",
  },
  description: siteConfig.description,
  keywords: [
    "student fridge rental",
    "microwave rental for students",
    "appliance hire for students",
    "res fridge hire",
    "campus appliance rental",
    "student appliance rentals Johannesburg",
    "student appliance rentals Gauteng",
  ],
  alternates: {
    canonical: "/",
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
