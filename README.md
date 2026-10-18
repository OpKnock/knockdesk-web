# KnockDesk website

Next.js 16, static output, no UI libraries. Fonts (Inter, Space Grotesk) are self-hosted. Light and dark mode, 3D particle avatar (Core, Female, Male) drawn on a canvas with no 3D library.

    npm install
    npm run dev      # local preview
    npm run build && npm start

Replace the old `app/` folder with this one, or deploy this folder as is (Vercel, Netlify, Cloudflare Pages).

## Before launch
1. Set env vars (see `.env.example`): `NEXT_PUBLIC_SITE_URL`, and optionally `NEXT_PUBLIC_FORM_ENDPOINT` and `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
2. If you enable analytics or a form backend, update `/privacy` and `/cookies` first. They currently say nothing is collected.
3. Update `public/llms.txt` if your domain is not knockdesk.app.
4. Add the domain, confirm the HTTPS padlock, then test in Chrome and Safari.
5. Run PageSpeed Insights on mobile and fix anything under 90.
6. Enable automatic backups on your host and in GitHub.
