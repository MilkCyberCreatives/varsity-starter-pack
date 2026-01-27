import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function csvEscape(v: string) {
  const s = (v ?? "").toString();
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5000,
  });

  const header = [
    "createdAt",
    "reference",
    "appliance",
    "fullName",
    "email",
    "phone",
    "months",
    "university",
    "residence",
    "emailed",
    "notes",
  ].join(",");

  const rows = orders.map((o) =>
    [
      csvEscape(new Date(o.createdAt).toISOString()),
      csvEscape(o.reference),
      csvEscape(o.appliance),
      csvEscape(o.fullName),
      csvEscape(o.email),
      csvEscape(o.phone),
      csvEscape(String(o.months)),
      csvEscape(o.university ?? ""),
      csvEscape(o.residence ?? ""),
      csvEscape(o.emailed ? "yes" : "no"),
      csvEscape(o.notes ?? ""),
    ].join(",")
  );

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="vsp-orders.csv"`,
      "cache-control": "no-store",
    },
  });
}
