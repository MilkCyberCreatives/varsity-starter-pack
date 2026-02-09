import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

const COOKIE_NAME = "vsp_admin";

function getPasswordList() {
  const list = process.env.ADMIN_PASSWORDS || process.env.ADMIN_PASSWORD || "";
  return list
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function proxy(req: NextRequest) {
  const passwords = getPasswordList();

  if (passwords.length === 0 && process.env.NODE_ENV === "production") {
    return new NextResponse("Admin is not configured.", { status: 503 });
  }

  const url = req.nextUrl.clone();

  // Already logged in
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (cookie === "1") return NextResponse.next();

  // If key matches any password -> set cookie + redirect clean URL
  const provided = url.searchParams.get("key");
  if (provided && passwords.includes(provided)) {
    url.searchParams.delete("key");

    const res = NextResponse.redirect(url);
    res.cookies.set(COOKIE_NAME, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Admin Access</title>
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial; margin:0; background:#fff;}
    .wrap{max-width:520px; margin:72px auto; padding:0 16px;}
    .card{border:1px solid rgba(0,0,0,.12); border-radius:18px; padding:20px;}
    h1{margin:0 0 8px; font-size:24px;}
    p{margin:0 0 14px; color:rgba(0,0,0,.65); font-size:14px; line-height:1.5;}
    input{width:100%; padding:12px 14px; border:1px solid rgba(0,0,0,.15); border-radius:12px; font-size:14px;}
    button{margin-top:12px; width:100%; padding:12px 14px; border:0; border-radius:12px; background:#000; color:#fff; font-weight:700; letter-spacing:.08em; font-size:12px;}
    .hint{margin-top:12px; font-size:12px; color:rgba(0,0,0,.55);}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>admin access</h1>
      <p>enter your admin key to continue.</p>
      <form method="get" action="${url.pathname}">
        <input name="key" type="password" placeholder="admin key" autofocus />
        <button type="submit">continue</button>
      </form>
      <div class="hint">you will stay logged in for 7 days on this device.</div>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
