import type { Metadata, Viewport } from "next";
import "./globals.css";
import ScrollToTop from "@/components/layout/ScrollToTop";

export const metadata: Metadata = {
  metadataBase: new URL("https://varsitystarterpack.co.za"),
  title: {
    default: "varsity starter pack | appliance hire",
    template: "%s | varsity starter pack",
  },
  description:
    "student-only appliance rentals in gauteng. fridge and microwave hire delivered to your res. maintenance included. minimum 5 months.",
  icons: {
    icon: "/logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
