export type ApplianceSlug = "bar-fridge" | "microwave" | "top-freezer";

export type Plan = {
  slug: ApplianceSlug;
  name: string;

  // display strings
  monthly: string;
  deposit: string;

  // ✅ numeric values for calculations
  monthlyAmount: number;
  depositAmount: number;

  note: string;
  bullets: string[];
  featured?: boolean;
};

export const PLANS: Plan[] = [
  {
    slug: "bar-fridge",
    name: "Bar Fridge",
    monthly: "R250 / Month",
    deposit: "R400 refundable deposit",
    monthlyAmount: 250,
    depositAmount: 400,
    note: "Best for res rooms and shared apartments",
    bullets: ["Maintenance included", "Student-only rentals", "Minimum 5 months"],
  },
  {
    slug: "microwave",
    name: "Microwave",
    monthly: "R160 / Month",
    deposit: "R300 refundable deposit",
    monthlyAmount: 160,
    depositAmount: 300,
    note: "Fast meals without the hassle",
    bullets: ["Maintenance included", "Easy setup", "Minimum 5 months"],
    featured: true,
  },
  {
    slug: "top-freezer",
    name: "Top Freezer",
    monthly: "R360 / Month",
    deposit: "R600 refundable deposit",
    monthlyAmount: 360,
    depositAmount: 600,
    note: "Extra storage for meal prep and sharing",
    bullets: ["Maintenance included", "Ideal for sharing", "Minimum 5 months"],
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

export function getPlansBySlugs(slugs: string[]) {
  const clean = slugs.map((s) => s.trim().toLowerCase()).filter(Boolean);
  const valid = clean.filter((s): s is ApplianceSlug => isApplianceSlug(s));
  return valid.map((s) => PLANS.find((p) => p.slug === s)!).filter(Boolean);
}
