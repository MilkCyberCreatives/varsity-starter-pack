export const DIRECT_INTENT_KEYWORDS = [
  "student fridge rental",
  "microwave rental for students",
  "appliance hire for students",
  "res fridge hire",
  "campus appliance rental",
  "student appliance rentals Johannesburg",
  "student appliance rentals Gauteng",
  "student appliance rentals Midrand",
];

export const ENTITY_KEYWORDS = [
  "Varsity Starter Pack",
  "student appliance rental company",
  "fridge rental",
  "microwave rental",
  "top freezer rental",
  "Johannesburg student rentals",
  "Gauteng student rentals",
  "Midrand student rentals",
];

export const GLOBAL_SEO_KEYWORDS = [
  ...DIRECT_INTENT_KEYWORDS,
  ...ENTITY_KEYWORDS,
];

export function mergeKeywords(...groups: Array<string[] | undefined>) {
  const values = groups.flatMap((group) => group ?? []);
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}
