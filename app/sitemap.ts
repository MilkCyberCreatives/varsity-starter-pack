import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: siteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: siteUrl("/pricing"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    { url: siteUrl("/order"), lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    {
      url: siteUrl("/how-it-works"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: siteUrl("/faq"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    {
      url: siteUrl("/deliveries"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    { url: siteUrl("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    {
      url: siteUrl("/testimonials"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: siteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: siteUrl("/privacy"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    { url: siteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    {
      url: siteUrl("/llms.txt"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.2,
    },
  ];
}
