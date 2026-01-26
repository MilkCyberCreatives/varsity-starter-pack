import type { MetadataRoute } from "next";

function getBaseUrl() {
  // Vercel provides this automatically in production
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (vercelUrl) return `https://${vercelUrl}`;

  // Your custom domain fallback
  return "https://varsitystarterpack.co.za";
}

export default function robots(): MetadataRoute.Robots {
  const base = getBaseUrl();

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
  };
}
