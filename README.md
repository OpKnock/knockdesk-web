# KnockDesk Website

The marketing website for [KnockDesk](https://github.com/OpKnock/KnockDesk), a local-first desktop AI assistant for Windows.

The site presents the product, hosts the Windows download with checksum verification, and publishes the legal pages required for Microsoft Store submission and the SignPath code-signing application.

## Stack

- Next.js (App Router) with TypeScript
- Plain CSS design system in a single file (`app/globals.css`), no CSS framework
- Inter and Space Grotesk variable typefaces, self-hosted via Fontsource (no third-party font requests)
- No analytics by default, no cookies, no third-party embeds
- Static output: every route is prerendered at build time

Node.js 22 or newer is required.

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:3004.

## Building

```bash
npm run build
npm run start
```

The production server listens on http://localhost:3004 and serves the prerendered routes.

## Pages

| Route       | Description                                                      |
|-------------|------------------------------------------------------------------|
| `/`         | Hero (CSS/SVG brand-mark scene with scroll-linked effects), features, FAQ, download CTA |
| `/download` | Windows installer, SHA-256 verification steps, system requirements |
| `/privacy`  | Privacy policy, including an India DPDP Act disclosure          |
| `/cookies`  | Cookie policy: the site sets no cookies and runs no trackers    |
| `/terms`    | Terms of service (Apache-2.0, no warranty)                      |
| `/contact`  | Contact form; opens the visitor's own email client               |
| 404         | Custom not-found page                                            |

Additionally served: `robots.txt`, `sitemap.xml`, `llms.txt`, favicon and apple-touch icons, a web app manifest, and a social share image generated at build time by `app/opengraph-image.tsx`.

## SEO and structured data

- Unique title, meta description, and canonical URL for every page
- JSON-LD: `WebSite` and `SoftwareApplication` in the root layout, `FAQPage` on the home page, `BreadcrumbList` on all subpages
- Visible breadcrumbs on every subpage, mirroring the structured data
- One `h1` per page, enforced by the browser audit in `test/audit.js`

## Testing

The `test/` directory contains Playwright scripts that run against a locally started production server (`npm run start`):

```bash
node test/audit.js      # full audit: console errors, horizontal-scroll check, single-h1 check,
                        # mobile and desktop screenshots, mobile menu, FAQ filter, form error state
node test/tapcheck.js   # WCAG 2.5.8 tap-target size check
node test/weight.js     # total transfer weight of the home page
node test/navcheck.js   # responsive nav visibility rules
```

Note: `test/canvascheck.js` targeted the previous hero animation (a `<canvas>` particle sphere) and is now obsolete — the new hero is pure CSS/SVG.

Playwright and Chromium are dev dependencies used by these scripts only; they are not part of the shipped site.

## Deployment

Checkout the repo, then either:

- connect it to any hosting provider that builds Next.js from the repository, or
- build it yourself with `npm run build` and serve it with `npm run start` behind any HTTPS reverse proxy.

No page in the site references a specific hosting provider, so the choice of provider stays invisible to visitors.

## Configuration

All public settings come from environment variables loaded at build time (see `.env.example`):

| Variable                    | Purpose                                                        |
|-----------------------------|----------------------------------------------------------------|
| `NEXT_PUBLIC_SITE_URL`      | Public base URL, used for canonical URLs, sitemap, and JSON-LD (defaults to `https://knockdesk.app`) |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Optional form backend (Formspree/Web3Forms). Empty = the contact form opens the visitor's email client |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional cookieless analytics via Plausible. Empty = no analytics script loads |

The product email address, GitHub URL, and version string are constants in `app/lib/site.ts`.

## Design decisions

**No analytics by default.** The site ships no analytics unless `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set, in which case only cookieless Plausible loads. The privacy policy and cookie policy commit to zero tracking; if either analytics or a form backend is enabled, those pages must be updated in the same deploy, as promised on the cookies page. Fonts are self-hosted, so no third party receives request data.

**Serverless contact form.** The form composes a `mailto:` link to `wagdemehul@gmail.com` and hands it to the visitor's email client. There is no backend, no database, and nothing collected server-side, which keeps the privacy policy accurate without extra infrastructure. If a form backend is introduced later, the privacy policy must be updated in the same release.

**Outbound attribution.** Download and source links to GitHub carry `utm_source=knockdesk-website`, letting download sources be measured on the GitHub side without running any visitor-side tracking.

**Scroll-linked hero without WebGL.** The hero is a layered CSS/SVG scene (fifteen copies of the brand mark in `app/page.tsx`, driven by a `--hero` scroll variable set in `app/components/SiteEffects.tsx`). It respects `prefers-reduced-motion`, and it keeps the site free of WebAssembly and WebGL dependencies.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md).

## Contact

Questions about the site or the product: [wagdemehul@gmail.com](mailto:wagdemehul@gmail.com)
