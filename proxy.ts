import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

const COOKIE_NAME = "vsp_admin";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getPasswordList() {
  const list = process.env.ADMIN_PASSWORDS || process.env.ADMIN_PASSWORD || "";
  return list
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function getSessionSecret(passwords: string[]) {
  return process.env.ADMIN_SESSION_SECRET?.trim() || passwords.join("|");
}

function safeEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function signSession(expiresAt: number, secret: string) {
  const payload = String(expiresAt);
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function validSession(token: string | undefined, secret: string) {
  if (!token || !secret) return false;

  const [expiresRaw, signature] = token.split(".");
  if (!expiresRaw || !signature) return false;

  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return false;

  const expected = signSession(expiresAt, secret);
  return safeEqual(token, expected);
}

function noStoreHeaders() {
  return {
    "cache-control": "no-store, max-age=0",
    "content-type": "text/html; charset=utf-8",
    "referrer-policy": "no-referrer",
  };
}

export async function proxy(req: NextRequest) {
  const passwords = getPasswordList();

  if (passwords.length === 0 && process.env.NODE_ENV === "production") {
    return new NextResponse("Admin is not configured.", {
      status: 503,
      headers: {
        "cache-control": "no-store, max-age=0",
        "content-type": "text/plain; charset=utf-8",
      },
    });
  }

  const secret = getSessionSecret(passwords);
  const url = req.nextUrl.clone();
  const cookie = req.cookies.get(COOKIE_NAME)?.value;

  if (validSession(cookie, secret)) return NextResponse.next();

  if (req.method === "POST") {
    const formData = await req.formData();
    const provided = String(formData.get("key") ?? "");
    const matched = provided && passwords.some((password) => safeEqual(provided, password));

    if (matched) {
      const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
      const res = NextResponse.redirect(url, 303);
      res.cookies.set(COOKIE_NAME, signSession(expiresAt, secret), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      });
      res.headers.set("cache-control", "no-store, max-age=0");
      res.headers.set("referrer-policy", "no-referrer");
      return res;
    }
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
    input{box-sizing:border-box; width:100%; padding:12px 14px; border:1px solid rgba(0,0,0,.15); border-radius:12px; font-size:14px;}
    button{margin-top:12px; width:100%; padding:12px 14px; border:0; border-radius:12px; background:#000; color:#fff; font-weight:700; letter-spacing:.08em; font-size:12px;}
    .hint{margin-top:12px; font-size:12px; color:rgba(0,0,0,.55);}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>admin access</h1>
      <p>enter your admin key to continue.</p>
      <form method="post" action="${url.pathname}">
        <input name="key" type="password" placeholder="admin key" autocomplete="current-password" autofocus />
        <button type="submit">continue</button>
      </form>
      <div class="hint">you will stay logged in for 7 days on this device.</div>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 401,
    headers: noStoreHeaders(),
  });
}
