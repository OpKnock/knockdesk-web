import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === "development";

/*
 * Content Security Policy
 *
 * The site is fully static: every page is prerendered at build time and served
 * from a CDN. That rules out per-request nonces, which would force dynamic
 * rendering and throw away static generation and edge caching for a site that
 * has no user data and no server-side code.
 *
 * Two constraints shape this policy:
 *
 * 1. Every directive may appear at most once. A repeated directive is silently
 *    ignored by the browser (the first one wins), so the Plausible hosts are
 *    merged into script-src / connect-src / img-src rather than appended as
 *    their own directives.
 *
 * 2. `script-src` needs 'unsafe-inline'. The App Router ships the RSC payload
 *    as an inline script (self.__next_f.push) on every statically rendered
 *    page, so without it hydration never runs. 'unsafe-inline' does NOT allow
 *    loading scripts from another origin -- that stays locked to 'self' plus
 *    the analytics host -- and 'unsafe-eval' stays off. The alternative,
 *    per-request nonces, would mean giving up static generation, which is a
 *    far worse trade for a site with no user-supplied markup.
 *
 * The pre-paint theme bootstrap is still an external same-origin file
 * (public/theme-init.js) rather than an inline script, so that it is governed
 * by the origin allow-list and cannot be blocked by a mis-scoped inline rule.
 *
 * Style attributes stay allowed because React writes the `--d` stagger delays
 * and GSAP writes transforms; styles are not an XSS vector.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://plausible.io`,
  "style-src 'self' 'unsafe-inline'",
  // Inter and Space Grotesk are self-hosted; no external font CDN is used.
  "font-src 'self'",
  `img-src 'self' data: blob: https://plausible.io`,
  `connect-src 'self' https://plausible.io`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const headers = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  // Isolates the browsing context so a popup cannot reach window.opener.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Stops other origins from reading our responses cross-origin.
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Content-Security-Policy", value: csp },
];

/*
 * The document is prerendered at build time, so a browser that cached an old
 * copy would keep loading the old markup and the old asset hashes after a
 * deploy, and the page would look like nothing had changed. `no-cache` makes
 * the browser revalidate the document every time; `s-maxage` still lets a CDN
 * serve it from the edge without going back to the origin.
 *
 * The build output under /_next/static is content hashed, and Next already
 * serves those with an immutable one-year policy, so no custom rule is
 * needed there. Adding one is what makes Next warn about a custom
 * Cache-Control header.
 */
const documentCache = { key: "Cache-Control", value: "public, s-maxage=31536000, no-cache" };

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  // The project lives inside a OneDrive folder whose nearest package.json is
  // several levels up. Without an explicit root, Turbopack walks past the repo
  // and ignores this project's package-lock.json.
  turbopack: { root },
  outputFileTracingRoot: root,
  // The test harness drives the dev server over 127.0.0.1; Next blocks
  // cross-origin dev resources by default, which stops the client runtime
  // from loading. Dev only, so it never affects a production build.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async headers() {
    // The negative lookahead keeps Next's own routes (_next/data, RSC
    // payloads and the static assets handled below) on Next's own cache
    // policy. Covering them with the document's Cache-Control is what
    // makes Next emit "Custom Cache-Control headers detected": it
    // overrides the framework's revalidation and can serve a stale client
    // router cache after a deploy.
    return [
      { source: "/((?!_next/).*)", headers: [...headers, documentCache] },
    ];
  },
};

export default nextConfig;
