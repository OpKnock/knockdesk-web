/** @type {import('next').NextConfig} */
import path from "node:path";
import { fileURLToPath } from "node:url";

// Next.js walks up the folder tree looking for a lockfile. A stray
// package-lock.json in the home folder made it treat C:\Users\<you> as the
// workspace root, which broke the dev server's client bundle (no hydration).
// Pin the root to this folder so `npm run dev` behaves like a normal project.
const rootDir = path.dirname(fileURLToPath(import.meta.url));

const headers = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];
export default {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  turbopack: { root: rootDir },
  outputFileTracingRoot: rootDir,
  // The test harness drives the dev server over 127.0.0.1; Next blocks
  // cross-origin dev resources by default, which stops the client runtime
  // from loading. Dev only, so it never affects a production build.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async headers() {
    return [{ source: "/:path*", headers }];
  },
};
