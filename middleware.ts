import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

export function middleware(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;

  // If no password is set, block access in production (safer)
  if (!password && process.env.NODE_ENV === "production") {
    return new NextResponse("Admin is not configured.", { status: 503 });
  }

  const url = req.nextUrl.clone();
  const provided = url.searchParams.get("key");

  // If key matches, allow
  if (password && provided === password) {
    return NextResponse.next();
  }

  // Otherwise show a simple auth page (basic prompt style)
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
        <input name="key" type="password" placeholder="admin key" />
        <button type="submit">continue</button>
      </form>
      <div class="hint">tip: bookmark the final URL after login.</div>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
