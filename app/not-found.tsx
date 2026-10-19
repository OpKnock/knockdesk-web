import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="kd-container kd-errorpage">
      <p className="kd-eyebrow">Error 404</p>
      <h1>Page not found</h1>
      <p className="kd-lead">The page you are looking for does not exist or has been moved.</p>
      <div className="kd-actions">
        <Link href="/" className="kd-btn kd-btn-primary">Back to home</Link>
        <Link href="/contact" className="kd-link">Report a broken link</Link>
      </div>
    </main>
  );
}
