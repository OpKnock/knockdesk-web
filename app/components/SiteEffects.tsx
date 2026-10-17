"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function SiteEffects() {
  const path = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLButtonElement>(null);
  const contact = useRef<HTMLAnchorElement>(null);
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("kd-notice")) setNotice(true);
    } catch {
      setNotice(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("kd-notice-open", notice);
  }, [notice]);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tracked = Array.from(document.querySelectorAll<HTMLElement>("[data-progress]"));
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? clamp(y / max) : 0})`;
      top.current?.classList.toggle("visible", y > 400);
      contact.current?.classList.toggle("visible", y > 600);
      if (reduced) return;
      root.style.setProperty("--hero", clamp(y / (vh * 0.9)).toFixed(3));
      for (const el of tracked) {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--s", clamp((vh - r.top) / (vh + r.height) * 1.6 - 0.25).toFixed(3));
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    const revealed = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealed.forEach((el) => io.observe(el));

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [path]);

  return (
    <>
      <div ref={bar} className="kd-progress" aria-hidden="true" />
      <Link ref={contact} href="/contact" className="kd-fab kd-float-contact" aria-label="Contact support">
        <Icon name="chat" /> Contact
      </Link>
      <button ref={top} type="button" className="kd-fab kd-backtop" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <Icon name="arrow" />
      </button>
      {notice && (
        <div className="kd-notice" role="region" aria-label="Cookie notice">
          <p>This site sets no cookies and runs no trackers. <Link href="/cookies">Cookie policy</Link></p>
          <button type="button" onClick={() => { try { localStorage.setItem("kd-notice", "1"); } catch {} setNotice(false); }}>Got it</button>
        </div>
      )}
    </>
  );
}
