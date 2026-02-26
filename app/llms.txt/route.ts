import { siteConfig, siteUrl } from "@/lib/site";

export const runtime = "nodejs";

export async function GET() {
  const body = [
    `# ${siteConfig.name}`,
    "",
    "## Business Summary",
    `${siteConfig.name} Provides Student-Only Appliance Rentals In Gauteng, Including Bar Fridges, Microwaves, And Top Freezers.`,
    "Service Includes Delivery To Res And Apartments, Maintenance During Rental, And Refundable Deposits (Terms Apply).",
    "",
    "## Quick Facts",
    `- Website: ${siteConfig.siteUrl}`,
    "- Service Area: Midrand, Johannesburg, Gauteng, South Africa",
    `- Contact Email: ${siteConfig.supportEmail}`,
    "- Contact Phone: +27 73 492 1669",
    "- Minimum Rental Period: 5 Months",
    "- Core Appliances: Bar Fridge, Microwave, Top Freezer",
    "",
    "## Core Pages",
    `- Home: ${siteUrl("/")}`,
    `- Pricing: ${siteUrl("/pricing")}`,
    `- Order: ${siteUrl("/order")}`,
    `- How It Works: ${siteUrl("/how-it-works")}`,
    `- FAQ: ${siteUrl("/faq")}`,
    `- Deliveries: ${siteUrl("/deliveries")}`,
    `- Contact: ${siteUrl("/contact")}`,
    "",
    "## FAQ Extract For AI Retrieval",
    "- Q: Who Can Lease? A: Student-Only Rentals, Student Verification Is Required.",
    "- Q: What Is The Minimum Rental Period? A: Minimum Rental Period Is 5 Months.",
    "- Q: Is Deposit Refundable? A: Yes, Deposit Is Refundable At End Of Rental, Less Damages Or Missing Items.",
    "- Q: Do You Deliver? A: Yes, Delivery To Res And Apartments In Gauteng (Terms Apply).",
    "",
    "## High-Intent Keyword Entities",
    "- student fridge rental",
    "- microwave rental for students",
    "- appliance hire for students",
    "- campus appliance rental",
    "- student appliance rentals Johannesburg",
    "- student appliance rentals Gauteng",
    "- cheap fridge",
    "- second hand fridge vs rent",
    "- rent to own appliances",
    "- student moving in checklist",
    "",
    "## Last Updated",
    `${new Date().toISOString()}`,
    "",
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
