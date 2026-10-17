# KnockDesk Website Third-Party Notices

This repository (the KnockDesk marketing website) contains first-party application code and the following third-party components. This notice is an attribution aid, not legal advice. Third-party components retain their own terms.

## Website dependencies

| Component | Version | License | Upstream |
|---|---|---|---|
| Next.js | 16.4.2 | MIT | https://github.com/vercel/next.js |
| React / React DOM | 19.3.0 | MIT | https://github.com/facebook/react |
| Inter typeface | variable | SIL Open Font License 1.1 | https://rsms.me/inter/ |
| ESLint + eslint-config-next | dev only | MIT | https://eslint.org |
| Playwright + Chromium (headless shell) | dev only, test scripts | Apache-2.0 / corresponding browser licenses | https://github.com/microsoft/playwright |

## Fonts

The Inter typeface is served to visitors self-hosted under the SIL Open Font License 1.1. No font or asset is fetched from a third-party domain at runtime.

## Related repositories

The KnockDesk desktop application, its bundled runtimes (Electron, Python, Playwright payloads), and its third-party notices are documented separately in the desktop repository: https://github.com/OpKnock/KnockDesk (see LICENSE and NOTICE.md there).
