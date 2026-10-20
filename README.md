# KnockDesk website

The public marketing site for KnockDesk, a local-first desktop AI assistant.

Next.js 16 (App Router), fully static, no UI framework. Scroll reveals and
parallax run on GSAP + ScrollTrigger, scoped behind
`prefers-reduced-motion`. Inter and Space Grotesk are self-hosted, so the site
makes no third-party font requests. Light and dark themes are set before first
paint, so there is no flash of the wrong theme.

## Running it

    npm install
    npm run dev            # http://localhost:3005
    npm run build && npm start

The site is fully static: every route is prerendered at build time, so it can
be deployed to Vercel, Netlify, Cloudflare Pages, or any static host.

## Checks

    npm run lint           # ESLint (next/core-web-vitals + next/typescript)
    npm run test:verify    # CSP, reveals, hydration, console errors
    npm run test:a11y      # axe-core, WCAG A/AA, light + dark + mobile
    npm run test:nav       # nav Source button, anchor links, scrollbar
    npm run test:motion    # scroll reveals, parallax, count-up, reduced motion
    npm run test:interactions  # cursor, nav, layer deck, keyboard
    npm run test:links     # every internal and external link on the site
    npm run audit:prod     # dependency audit, production dependencies only
    npm test               # lint + verify + a11y + nav

The test scripts drive a real Chrome through `playwright-core` and expect a
server already listening on port 3005 (`npm run build && npm start`).

## Configuration

All configuration is through environment variables, see `.env.example`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for canonical links, sitemap and structured data. |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Optional form backend. Empty means the contact form opens the visitor's mail app. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional cookieless analytics. Empty means no analytics script loads. |

## Security

- A Content Security Policy is set in `next.config.mjs`. `script-src` is
  `'self' 'unsafe-inline'`; the inline allowance is required because the App
  Router ships the RSC payload as an inline script on every prerendered page.
  `'unsafe-eval'` is off, and scripts may only load from this origin.
- The pre-paint theme bootstrap lives in `public/theme-init.js` as a same-origin
  file rather than an inline script, so it is governed by the origin allow-list
  and cannot be broken by a mis-scoped inline rule.
- `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` and
  `Cross-Origin-Resource-Policy` are all set.
- Every `dangerouslySetInnerHTML` in the codebase holds static, developer
  controlled content. No user input is ever rendered as HTML.
- `npm run audit:prod` gates on production dependencies. These are currently
  clean. The dev tree pulls in `braces` through `eslint-config-next` →
  `fast-glob` → `micromatch`; that advisory
  ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm))
  has no upstream patched release, affects only the linter at build time, and
  is not reachable from the deployed site.

## Accessibility

The site targets WCAG 2.1 AA and is checked with axe-core across every route in
light mode, dark mode and at mobile width. Scroll reveals are disabled under
`prefers-reduced-motion`, and every animated element has a visible static
state. The layer deck is operable from the keyboard.

## App captures

The hero and the "Inside the app" section use real captures of the app, kept in `public/shots/`:

- `app-cyan` / `app-emerald` / `app-cyberpunk` / `app-crimson.webp` — the command center in four themes. The hero (`app/components/AppShowcase.tsx`) cross-fades between them every 2.6s and pauses on hover, when the tab is hidden, when it scrolls out of view, and under `prefers-reduced-motion`.
- `agent-town.webp`, `voice-assistant.webp`, `world-monitor.webp` — the three feature blocks (`app/components/AppFeatures.tsx`). Each keeps its native ratio, so nothing is cropped or stretched.

To refresh them from new screenshots, drop the PNGs into `C:\Users\wagde\OneDrive\Pictures\Screenshots` and run:

    node tools/prep-shots.cjs

It converts them to WebP and writes them into `public/shots/`.

## Before launch

1. Set `NEXT_PUBLIC_SITE_URL` to the real domain.
2. If you enable analytics or a form backend, update `/privacy` and
   `/cookies` first. They currently say nothing is collected.
3. Update `public/llms.txt` if the domain is not `knockdesk.app`.
4. Add the domain, confirm the HTTPS padlock, then test in Chrome and Safari.
5. Run PageSpeed Insights on mobile and fix anything under 90.
6. Enable automatic backups on your host and in GitHub.
