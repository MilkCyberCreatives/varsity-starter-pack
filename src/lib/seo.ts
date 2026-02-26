import type { Metadata } from "next";
import { siteConfig, siteUrl } from "@/lib/site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  imagePath?: string;
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  imagePath = "/hero/hero.jpg",
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const absoluteUrl = siteUrl(canonical);
  const imageUrl = imagePath.startsWith("http")
    ? imagePath
    : siteUrl(imagePath.startsWith("/") ? imagePath : `/${imagePath}`);

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: absoluteUrl,
      title: `${title} | ${siteConfig.shortName}`,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.shortName}`,
      description,
      images: [imageUrl],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}

