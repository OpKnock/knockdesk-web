"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const readTheme = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

// Cross-tab sync, plus same-tab sync via the storage event other tabs fire.
const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};

/**
 * The theme is applied by a pre-paint script in the root layout, so it is
 * already on the DOM before React hydrates. Reading it with useState plus a
 * useEffect would render the wrong icon first and then correct it, which shows
 * up as a visible flash. useSyncExternalStore reads it on the first client
 * render instead, and keeps the server snapshot during hydration so React does
 * not report a mismatch.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, () => "light");

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "dark" ? "#0c0c0e" : "#ffffff");
    try {
      localStorage.setItem("kd-theme", next);
    } catch {
      // Private browsing or a full quota. The theme still applies for this page
      // view, it just will not be remembered.
    }
    // Tell useSyncExternalStore's store that the value changed.
    window.dispatchEvent(new Event("storage"));
  };

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button type="button" className="kd-theme" onClick={toggle} aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {theme === "dark" ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z" />
        )}
      </svg>
    </button>
  );
}