import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: siteUrl("/pricing"), changeFrequency: "weekly", priority: 0.95 },
    { url: siteUrl("/order"), changeFrequency: "weekly", priority: 0.95 },
    { url: siteUrl("/how-it-works"), changeFrequency: "monthly", priority: 0.8 },
    { url: siteUrl("/faq"), changeFrequency: "monthly", priority: 0.8 },
    { url: siteUrl("/deliveries"), changeFrequency: "weekly", priority: 0.7 },
    { url: siteUrl("/about"), changeFrequency: "yearly", priority: 0.6 },
    { url: siteUrl("/testimonials"), changeFrequency: "monthly", priority: 0.6 },
    { url: siteUrl("/contact"), changeFrequency: "monthly", priority: 0.6 },
    { url: siteUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
    { url: siteUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
    { url: siteUrl("/llms.txt"), changeFrequency: "weekly", priority: 0.2 },
  ];
}
