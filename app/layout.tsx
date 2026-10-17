import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { FloatingContact } from "./components/FloatingContact";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const SITE_URL = "https://knockdesk.app"; // placeholder until domain is purchased

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KnockDesk: Your Local-First AI Assistant",
    template: "%s | KnockDesk",
  },
  description:
    "A privacy-respecting desktop AI assistant that runs entirely on your PC. Your keys, your data, your control. No cloud account required.",
  keywords: ["KnockDesk", "AI assistant", "desktop AI", "local AI", "privacy", "offline AI", "voice assistant"],
  authors: [{ name: "OpKnock" }],
  creator: "OpKnock",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "KnockDesk",
    title: "KnockDesk: Your Local-First AI Assistant",
    description: "A privacy-respecting desktop AI assistant that runs entirely on your PC.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KnockDesk: Your Local-First AI Assistant",
    description: "A privacy-respecting desktop AI assistant that runs entirely on your PC.",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05070b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "KnockDesk",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Windows 10, macOS",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "OpKnock" },
  };

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main" className="kd-skip">Skip to content</a>
        <div id="kd-progress" className="kd-scroll-progress" style={{ width: "0%" }} />
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
