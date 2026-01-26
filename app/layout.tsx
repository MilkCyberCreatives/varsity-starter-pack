import type { Metadata } from "next";
import "./globals.css";
import ScrollToTop from "@/components/layout/ScrollToTop";

export const metadata: Metadata = {
  title: {
    default: "varsity starter pack | appliance hire",
    template: "%s | varsity starter pack",
  },
  description:
    "student-only appliance rentals in gauteng. fridge and microwave hire delivered to your res. maintenance included. minimum 5 months.",
  icons: {
    icon: "/logo.svg", // ✅ red main logo as website icon
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* ✅ global scroll-to-top */}
        <ScrollToTop />
      </body>
    </html>
  );
}
