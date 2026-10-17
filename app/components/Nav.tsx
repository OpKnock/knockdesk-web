"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function Nav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progress = document.getElementById("kd-progress");
    const onScroll = () => {
      if (!progress) return;
      const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      progress.style.width = `${scrolled}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="kd-nav" ref={ref}>
      <div className="kd-container kd-nav-inner">
        <Link href="/" className="kd-logo-link" aria-label="KnockDesk home">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="#00E5FF" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4" stroke="#00E5FF" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="1.5" fill="#00E5FF" />
          </svg>
          <span style={{ color: "var(--kd-text)", fontWeight: 500, fontSize: "1.0625rem", letterSpacing: "0.06em" }}>
            KnockDesk
          </span>
        </Link>

        <ul className="kd-nav-links">
          <li><Link href="/#features">Features</Link></li>
          <li><a href="/download">Download</a></li>
          <li><a href="/privacy">Privacy</a></li>
          <li><a href="/terms">Terms</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>

        <a href="/download" className="kd-btn kd-btn-primary kd-mobile-only" style={{ padding: "10px 20px", minHeight: "40px", fontSize: "0.8125rem" }}>
          Get KnockDesk
        </a>

        {/* Mobile menu button */}
        <button
          className="kd-mobile-only"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--kd-text)" strokeWidth="1.5">
            {open ? (
              <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="kd-mobile-menu" style={{ borderTop: "1px solid var(--kd-border)", padding: "16px 24px" }}>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
            <li><Link href="/#features" onClick={() => setOpen(false)} style={{ color: "var(--kd-muted)", textDecoration: "none", fontSize: "1rem" }}>Features</Link></li>
            <li><a href="/download" onClick={() => setOpen(false)} style={{ color: "var(--kd-muted)", textDecoration: "none", fontSize: "1rem" }}>Download</a></li>
            <li><a href="/privacy" onClick={() => setOpen(false)} style={{ color: "var(--kd-muted)", textDecoration: "none", fontSize: "1rem" }}>Privacy</a></li>
            <li><a href="/terms" onClick={() => setOpen(false)} style={{ color: "var(--kd-muted)", textDecoration: "none", fontSize: "1rem" }}>Terms</a></li>
            <li><a href="/contact" onClick={() => setOpen(false)} style={{ color: "var(--kd-muted)", textDecoration: "none", fontSize: "1rem" }}>Contact</a></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
