import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { MarkSprite } from "./components/Mark";
import { SiteEffects } from "./components/SiteEffects";
import { ScrollToTop } from "./components/ScrollToTop";
import { Motion } from "./components/Motion";
import { Analytics } from "./components/Analytics";
import { SITE_URL, EMAIL, GITHUB } from "./lib/site";

const DESC = "KnockDesk is a local-first desktop AI assistant with voice, persona, memory, skills and resident agents. Your files stay on your PC and you choose the AI provider.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "KnockDesk: Your Local-First AI Assistant", template: "%s | KnockDesk" },
  description: DESC,
  applicationName: "KnockDesk",
  keywords: ["KnockDesk", "AI assistant", "desktop AI", "local AI", "privacy", "offline AI", "voice assistant"],
  authors: [{ name: "OpKnock" }],
  creator: "OpKnock",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_US", url: SITE_URL, siteName: "KnockDesk", title: "KnockDesk: Your Local-First AI Assistant", description: DESC },
  twitter: { card: "summary_large_image", title: "KnockDesk: Your Local-First AI Assistant", description: DESC },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }, { media: "(prefers-color-scheme: dark)", color: "#0c0c0e" }] };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: "OpKnock", url: SITE_URL, logo: `${SITE_URL}/logo.svg`, email: EMAIL, sameAs: [GITHUB] },
      { "@type": "WebSite", "@id": `${SITE_URL}/#site`, url: SITE_URL, name: "KnockDesk", publisher: { "@id": `${SITE_URL}/#org` } },
      {
        "@type": "SoftwareApplication",
        name: "KnockDesk",
        applicationCategory: "ProductivityApplication",
        operatingSystem: "Windows 10, Windows 11, macOS (source build)",
        description: DESC,
        license: "https://www.apache.org/licenses/LICENSE-2.0",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@id": `${SITE_URL}/#org` },
      },
    ],
  };

  return (
    <html lang="en" className="js" suppressHydrationWarning>
      <body>
        {/* The pre-paint bootstrap. It has to run before the browser paints, so
            it is a blocking script rather than async. It is an external
            same-origin file rather than an inline one so the Content Security
            Policy can stay strict: no inline script hash to drift out of sync
            with this markup. */}
        <script src="/theme-init.js" async={false} />
        {/* The `js` class is on <html> in the server markup, so `[data-reveal]`
            starts hidden on the very first paint. It used to be added by the
            script above, which meant the page painted fully visible, then went
            blank a moment later, then faded back in - a flash on every visit.
            A visitor without JavaScript never gets that class, so the
            reveals are released explicitly here. */}
        <noscript><style>{`[data-reveal],[data-reveal="stagger"]>*{opacity:1 !important;visibility:visible !important;transform:none !important}`}</style></noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <MarkSprite />
        <a href="#main" className="kd-skip">Skip to content</a>
        <Nav />
        {children}
        <Footer />
        <SiteEffects />
        <ScrollToTop />
        <Motion />
        <Analytics />
      </body>
    </html>
  );
}
