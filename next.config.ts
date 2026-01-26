import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Fix: Next picked Desktop as workspace root because of an extra lockfile.
  // This forces tracing to use THIS project folder.
  outputFileTracingRoot: path.join(__dirname),

  async headers() {
    return [
      // Global security headers
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },

      // Cache Next static assets (hashed)
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },

      // Cache Next image optimizer responses
      {
        source: "/_next/image(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },

      // Cache common assets in /public (valid Next matcher syntax)
      {
        source: "/:path*.(svg|png|jpg|jpeg|webp|gif|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, immutable" },
        ],
      },
      {
        source: "/:path*.(css|js)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
