"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "./Mark";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/guide", label: "Guide" },
  { href: "/about", label: "About" },
  { href: "/download", label: "Download" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  const close = useCallback(() => setOpen(false), []);

  // The menu is a disclosure, not a modal: it closes on Escape and whenever the
  // route changes, so it can never be left hanging over a new page.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      // Keep Tab inside the header while the menu is open.
      const header = e.currentTarget as HTMLElement;
      const focusable = header.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Prevent the page behind the open menu from scrolling.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const isCurrent = (href: string) => {
    const [base, hash] = href.split("#");
    if (base && base !== path) return false;
    // Hash-only links are never "the current page"; they are in-page jumps.
    return !hash && base === path;
  };

  return (
    <header className="kd-nav">
      <div className="kd-container kd-nav-inner">
        <Link href="/" className="kd-logo-link" aria-label="KnockDesk home" onClick={close}>
          <Mark />
          <span>KnockDesk</span>
        </Link>
        <nav aria-label="Main">
          <ul className="kd-nav-links">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={isCurrent(l.href) ? "page" : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="kd-nav-tools">
          <ThemeToggle />
          <Link href="/download" className="kd-btn kd-btn-primary kd-nav-cta">
            Download
          </Link>
          <button
            type="button"
            className="kd-menu-btn"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="kd-mobile-menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="kd-mobile-menu" className="kd-mobile-menu" aria-label="Mobile">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={close}
                  aria-current={isCurrent(l.href) ? "page" : undefined}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/download" className="kd-btn kd-btn-primary kd-mobile-menu-cta" onClick={close}>
            Download for Windows
          </Link>
        </nav>
      )}
    </header>
  );
}