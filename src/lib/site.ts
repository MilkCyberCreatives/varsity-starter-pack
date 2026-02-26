export const siteConfig = {
  name: "Varsity Starter Pack",
  shortName: "varsity starter pack",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://varsitystarterpack.co.za",
  description:
    "Student-only appliance rentals in Gauteng with fridge, microwave, and top freezer hire, maintenance included, and delivery to res or apartments.",
  locale: "en_ZA",
  gbpUrl: "https://share.google/qytd6nibrfEpkrKjT",
  facebookUrl: "https://www.facebook.com/varsitystarterpack/",
  supportEmail: "info@varsitystarterpack.co.za",
  whatsappNumber: "27734921669",
  phonePrimary: "+27 73 492 1669",
  phoneSecondary: "+27 71 270 8068",
  address: {
    addressLocality: "Johannesburg",
    addressRegion: "Gauteng",
    addressCountry: "ZA",
  },
};

export function siteUrl(path = "/") {
  if (!path.startsWith("/")) return `${siteConfig.siteUrl}/${path}`;
  return `${siteConfig.siteUrl}${path}`;
}

