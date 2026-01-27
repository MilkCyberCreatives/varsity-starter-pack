import { NextResponse } from "next/server";

export async function GET() {
  const url = new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
  const res = NextResponse.redirect(url);

  res.cookies.set("vsp_admin", "", { path: "/", maxAge: 0 });
  return res;
}
