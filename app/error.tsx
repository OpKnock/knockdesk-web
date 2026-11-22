"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-segment error boundary.
 *
 * Without this, any runtime error during render replaces the page with a
 * blank screen. This keeps the chrome intact and offers a way out.
 *
 * Next 16 passes `retry` (it was called `reset` in Next 15).
 */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // No third-party error reporting is configured, so surface it locally
    // rather than silently swallowing it.
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="kd-container kd-errorpage">
      <p className="kd-eyebrow">Something went wrong</p>
      <h1>This page could not be displayed.</h1>
      <p className="kd-lead">
        An unexpected error interrupted rendering. Reloading usually clears it. If it keeps happening, please tell us what you were doing.
      </p>
      <div className="kd-hero-actions">
        <button type="button" className="kd-btn kd-btn-primary" onClick={retry}>
          Try again
        </button>
        <Link href="/" className="kd-btn kd-btn-secondary">
          Back to home
        </Link>
        <Link href="/contact" className="kd-link">
          Report this
        </Link>
      </div>
    </main>
  );
}