# KnockDesk Website

Marketing site for [KnockDesk](https://github.com/OpKnock/KnockDesk), a local-first desktop AI assistant for Windows.

Built with Next.js (App Router) + TypeScript. No Tailwind, no analytics, no third-party embeds. All styles are plain CSS in one design system (`app/globals.css`).

## Pages

| Route      | Purpose                                            |
| ---------- | -------------------------------------------------- |
| `/`        | Hero, features, how it works, FAQ (searchable), CTA |
| `/download`| Windows installer + checksum verify, macOS roadmap |
| `/privacy` | Privacy policy (incl. India DPDP disclosure)       |
| `/cookies` | Cookie policy (site sets no cookies)               |
| `/terms`   | Terms of service                                   |
| `/contact` | Contact form (opens the visitor's email client)    |
| 404        | Custom not-found page                              |

## SEO

- Per-page unique titles, meta descriptions, and canonical URLs (`alternates.canonical`)
- JSON-LD: WebSite, SoftwareApplication (layout), FAQPage (home), BreadcrumbList (subpages)
- `sitemap.xml` + `robots.txt` generated from `app/sitemap.ts` / `app/robots.ts`
- `llm.txt` served from `public/llm.txt`
- `opengraph-image` generated at build time (social share card)

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build and test locally

```bash
npm run build
npm run start
node test/audit.js        # browser audit: console errors, h-scroll, h1 count, mobile layout, interactions
node test/tapcheck.js     # WCAG 2.5.8 tap-target check
node test/weight.js       # transfer-weight measurement
```

Playwright and Chromium are dev dependencies used by the test scripts only.

## Deploying

Any Next.js host works (server render or static output both fine). Steps:

1. Push this repository to GitHub.
2. Connect the repo to a host, or build with `npm run build` and serve with `npm run start` on a Node machine.
3. Point the domain at the host and enable HTTPS (handled automatically by the host).

Nothing in the site copy references the host, so it works on any provider.

### Before you deploy (domain checklist)

The domain name `https://knockdesk.app` is currently a placeholder. Once you own the final domain, search-and-replace it in these files:

- `app/layout.tsx` (metadata base + canonical)
- `app/robots.ts`
- `app/sitemap.ts`
- `app/components/Breadcrumbs.tsx`
- `public/llm.txt`
- `app/opengraph-image.tsx` (domain shown in the social card)

## Analytics (documented decision)

The site ships with **no analytics** by design: the privacy policy and cookie policy are written to promise zero tracking, and the product's pitch is privacy-first. No tracking code, no cookies, no third-party requests. Fonts are self-hosted at build time.

If you later want privacy-friendly, cookieless page-view counts:

1. Buy the domain first, then create a [Plausible](https://plausible.io) account for it.
2. Add the Plausible script tag to `app/layout.tsx` (`<head>`), deferred.
3. Update `app/cookies/page.tsx` and `public/llm.txt` before it goes live (the cookie policy promises this), then redeploy.

## Contact form

Serverless by design: the form builds a `mailto:` link to `wagdemehul@gmail.com` and opens the visitor's email client. There is no backend, no data store, and no server-side collection. The message itself is end-to-end between the visitor and the mailbox, which keeps the privacy policy fully honest.

When traffic grows, replace `handleSubmit` in `app/contact/page.tsx` with a POST to a form backend, and update the privacy policy the same day you deploy it.

## Outbound tracking

GitHub links on the download page carry `utm_source=knockdesk-website` so download sources can be measured GitHub-side if you ever enable that.
