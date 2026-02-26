import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Varsity Starter Pack",
    short_name: "Varsity Starter Pack",
    description:
      "Student-Only Appliance Rentals In Gauteng For Bar Fridges, Microwaves, And Top Freezers.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#8e0c0c",
    theme_color: "#b01414",
    icons: [
      {
        src: "/logo.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/logo.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
    shortcuts: [
      {
        name: "Pricing",
        short_name: "Pricing",
        url: siteUrl("/pricing"),
      },
      {
        name: "Order",
        short_name: "Order",
        url: siteUrl("/order"),
      },
      {
        name: "Contact",
        short_name: "Contact",
        url: siteUrl("/contact"),
      },
    ],
  };
}
