# KnockDesk Website

The marketing website for [KnockDesk](https://github.com/OpKnock/KnockDesk), a local-first desktop AI assistant for Windows.

The site presents the product, hosts the Windows download with checksum verification, and publishes the legal pages required for Microsoft Store submission and the SignPath code-signing application.

## Stack

- Next.js (App Router) with TypeScript
- Plain CSS design system in a single file (`app/globals.css`), no CSS framework
- Inter typeface, self-hosted at build time by Next.js (no third-party font requests)
- No analytics, no cookies, no third-party embeds
- Static output: every route is prerendered at build time

Node.js 22 or newer is required.

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:3000.

## Building

```bash
npm run build
npm run start
```

The production server listens on http://localhost:3000 and serves the prerendered routes.

## Pages

| Route       | Description                                                      |
|-------------|------------------------------------------------------------------|
| `/`         | Hero (canvas 3D point-sphere animation), features, FAQ with filter, download CTA |
| `/download` | Windows installer, SHA-256 verification steps, system requirements |
| `/privacy`  | Privacy policy, including an India DPDP Act disclosure          |
| `/cookies`  | Cookie policy: the site sets no cookies and runs no trackers    |
| `/terms`    | Terms of service (Apache-2.0, no warranty)                      |
| `/contact`  | Contact form; opens the visitor's own email client               |
| 404         | Custom not-found page                                            |

Additionally served: `robots.txt`, `sitemap.xml`, `llm.txt`, favicon and apple-touch icons, and a social share image generated at build time by `app/opengraph-image.tsx`.

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
node test/canvascheck.js # hero canvas sizing diagnostics
```

Latest results at time of writing: zero console errors on all routes, no horizontal scroll, 206 KB total transfer, sub-second load, every interactive target at least 24 CSS px except inline text links (which the guideline exempts).

Playwright and Chromium are dev dependencies used by these scripts only; they are not part of the shipped site.

## Deployment

Checkout the repo, then either:

- connect it to any hosting provider that builds Next.js from the repository, or
- build it yourself with `npm run build` and serve it with `npm run start` behind any HTTPS reverse proxy.

No page in the site references a specific hosting provider, so the choice of provider stays invisible to visitors.

## Configuration

The public base URL is set to `https://knockdesk.app` as a build-time constant. If the site is served under a different domain, update it in these files and rebuild:

| File                          | Field                                    |
|-------------------------------|------------------------------------------|
| `app/layout.tsx`              | `metadataBase`, canonical URLs           |
| `app/robots.ts`               | `Sitemap:` line                          |
| `app/sitemap.ts`              | page URLs                                |
| `app/components/Breadcrumbs.tsx` | JSON-LD breadcrumb URLs              |
| `app/opengraph-image.tsx`     | domain shown on the social card          |
| `public/llm.txt`              | page list                                |

## Design decisions

**No analytics.** The site deliberately ships no analytics. The privacy policy and cookie policy commit to zero tracking, and a privacy-first product should keep its own site consistent with that claim. No cookies are set, and fonts are self-hosted, so no third party receives request data. If cookieless, privacy-friendly analytics such as Plausible are ever added, the cookie policy is updated in the same deploy, as promised on that page.

**Serverless contact form.** The form composes a `mailto:` link to `wagdemehul@gmail.com` and hands it to the visitor's email client. There is no backend, no database, and nothing collected server-side, which keeps the privacy policy accurate without extra infrastructure. If a form backend is introduced later, the privacy policy must be updated in the same release.

**Outbound attribution.** Download and source links to GitHub carry `utm_source=knockdesk-website`, letting download sources be measured on the GitHub side without running any visitor-side tracking.

**3D-style hero without WebGL.** The hero animation is a rotating point sphere with perspective projection, drawn on a plain 2D canvas in `app/components/ParticleHero.tsx`. It respects `prefers-reduced-motion` by rendering a single static frame, and it keeps the site free of WebAssembly and WebGL dependencies.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md).

## Contact

Questions about the site or the product: [wagdemehul@gmail.com](mailto:wagdemehul@gmail.com)
