import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="kd-container" style={{ padding: "128px var(--kd-pad)" }}>
      <p className="kd-eyebrow">Error 404</p>
      <h1 style={{ marginBottom: 24 }}>Page not found</h1>
      <p style={{ marginBottom: 40, fontSize: "1.25rem" }}>The page you are looking for does not exist or has been moved.</p>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "center" }}>
        <Link href="/" className="kd-btn kd-btn-primary">Back to home</Link>
        <Link href="/contact" className="kd-link">Report a broken link</Link>
      </div>
    </main>
  );
}
