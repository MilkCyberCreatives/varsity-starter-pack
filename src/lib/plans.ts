export type ApplianceSlug = "bar-fridge" | "microwave" | "top-freezer";

export type Plan = {
  slug: ApplianceSlug;
  name: string;
  monthly: string;
  deposit: string;
  note: string;
  bullets: string[];
  featured?: boolean;
};

export const PLANS: Plan[] = [
  {
    slug: "bar-fridge",
    name: "BAR FRIDGE",
    monthly: "R250 / MONTH",
    deposit: "R400 refundable deposit",
    note: "best for res rooms and shared apartments",
    bullets: ["maintenance included", "student-only rentals", "minimum 5 months"],
  },
  {
    slug: "microwave",
    name: "MICROWAVE",
    monthly: "R160 / MONTH",
    deposit: "R300 refundable deposit",
    note: "fast meals without the hassle",
    bullets: ["maintenance included", "easy setup", "minimum 5 months"],
    featured: true,
  },
  {
    slug: "top-freezer",
    name: "TOP FREEZER",
    monthly: "R360 / MONTH",
    deposit: "R600 refundable deposit",
    note: "extra storage for meal prep and sharing",
    bullets: ["maintenance included", "ideal for sharing", "minimum 5 months"],
  },
];

export function isApplianceSlug(v: string): v is ApplianceSlug {
  return v === "bar-fridge" || v === "microwave" || v === "top-freezer";
}

export function getPlanBySlug(slug?: string) {
  if (!slug) return null;
  const s = slug.trim().toLowerCase();
  if (!isApplianceSlug(s)) return null;
  return PLANS.find((p) => p.slug === s) ?? null;
}
