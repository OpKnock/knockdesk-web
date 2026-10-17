import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { MarkSprite } from "./components/Mark";
import { SiteEffects } from "./components/SiteEffects";
import { Analytics } from "./components/Analytics";
import { SITE_URL, EMAIL, GITHUB } from "./lib/site";

const DESC = "A privacy-respecting desktop AI assistant that runs entirely on your PC. Your keys, your data, your control. No cloud account required.";

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

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

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
        operatingSystem: "Windows 10 or later",
        description: DESC,
        license: "https://www.apache.org/licenses/LICENSE-2.0",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@id": `${SITE_URL}/#org` },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <MarkSprite />
        <a href="#main" className="kd-skip">Skip to content</a>
        <Nav />
        {children}
        <Footer />
        <SiteEffects />
        <Analytics />
      </body>
    </html>
  );
}
