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
  const glow = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
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
    const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const stories = Array.from(document.querySelectorAll<HTMLElement>("[data-story]"));
    const heroCopy = document.querySelector<HTMLElement>("[data-hero-copy]");
    const heroPanel = document.querySelector<HTMLElement>("[data-hero-panel]");
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

      // hero: the copy lifts and fades, the panel drifts down slower (parallax)
      root.style.setProperty("--hero", clamp(y / (vh * 0.9)).toFixed(3));
      if (heroCopy) {
        const h = clamp(1 - y / (vh * 0.72));
        heroCopy.style.opacity = (0.25 + h * 0.75).toFixed(3);
        heroCopy.style.setProperty("--hp", h.toFixed(3));
      }
      if (heroPanel) heroPanel.style.setProperty("--hp", clamp(y / (vh * 0.9)).toFixed(3));

      // per-element scroll-linked progress, 0 at entry to 1 at exit
      for (const el of tracked) {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--s", clamp((vh - r.top) / (vh + r.height) * 1.6 - 0.25).toFixed(3));
      }
      for (const el of parallax) {
        const r = el.getBoundingClientRect();
        const p = clamp((vh - r.top) / (vh + r.height));
        el.style.setProperty("--p", p.toFixed(4));
      }

      // scrollytelling: the section is one row, so the active step advances
      // with scroll progress through the section rather than per-step position
      for (const story of stories) {
        const steps = Array.from(story.querySelectorAll<HTMLElement>("[data-story-step]"));
        if (!steps.length) continue;
        const r = story.getBoundingClientRect();
        const span = Math.max(1, r.height + vh * 0.5);
        const fill = clamp((vh * 0.5 - r.top) / span);
        const active = Math.min(steps.length - 1, Math.floor(fill * steps.length));
        steps.forEach((s, i) => s.classList.toggle("on", i === active));
        story.style.setProperty("--sp", fill.toFixed(3));
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    const revealed = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    // stagger by position in the DOM, so groups cascade instead of popping
    revealed.forEach((el, i) => {
      if (!el.style.getPropertyValue("--d")) {
        const sameParent = Array.from(el.parentElement?.children || []).indexOf(el);
        el.style.setProperty("--d", `${Math.max(0, sameParent) * 80}ms`);
      }
    });
    const countUp = (el: HTMLElement) => {
      const target = parseFloat(el.dataset.count || "");
      if (!Number.isFinite(target) || el.dataset.counted === "1") return;
      el.dataset.counted = "1";
      if (reduced) { el.textContent = String(target); return; }
      const dur = 900;
      const t0 = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = String(Math.round(target * eased));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add("in");
          countUp(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      }),
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

  // Cursor atmosphere: a soft backdrop that follows the pointer, and a ring
  // that snaps to whatever interactive thing is under it. Both are decorative
  // and pointer-transparent, and both stand down for touch and reduced motion.
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const g = glow.current;
    const r = ring.current;
    if (coarse || still || !g || !r) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let raf = 0;
    let hovering: Element | null = null;
    let tiltCard: HTMLElement | null = null;

    const interactive = 'a, button, summary, input, [role="button"], .kd-slip';
    const tiltable = '.kd-feature, .kd-card, .kd-build, .kd-step';

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      g.style.opacity = "1";
      const hit = (e.target as Element | null)?.closest?.(interactive) || null;
      if (hit !== hovering) {
        hovering = hit;
        if (hit) {
          const b = hit.getBoundingClientRect();
          r.style.setProperty("--rx", `${b.left + b.width / 2}px`);
          r.style.setProperty("--ry", `${b.top + b.height / 2}px`);
          r.style.setProperty("--rw", `${b.width + 14}px`);
          r.style.setProperty("--rh", `${b.height + 14}px`);
          r.dataset.on = "true";
        } else {
          delete r.dataset.on;
        }
      }

      // magnetic tilt: cards lean toward the cursor and carry a spotlight
      const card = (e.target as Element | null)?.closest?.(tiltable) as HTMLElement | null;
      if (card && card !== tiltCard) {
        if (tiltCard) resetTilt();
        tiltCard = card;
      }
      if (tiltCard) {
        const b = tiltCard.getBoundingClientRect();
        const nx = (e.clientX - b.left) / b.width;
        const ny = (e.clientY - b.top) / b.height;
        tiltCard.style.setProperty("--mx", `${(nx * 100).toFixed(1)}%`);
        tiltCard.style.setProperty("--my", `${(ny * 100).toFixed(1)}%`);
        tiltCard.style.transform = `perspective(900px) rotateX(${((0.5 - ny) * 3.2).toFixed(2)}deg) rotateY(${((nx - 0.5) * 3.2).toFixed(2)}deg) translateY(-3px)`;
      }

      if (!raf) raf = requestAnimationFrame(tick);
    };

    const resetTilt = () => {
      if (!tiltCard) return;
      tiltCard.style.transform = "";
      tiltCard = null;
    };

    const tick = () => {
      raf = 0;
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      g.style.setProperty("--gx", `${cx.toFixed(1)}px`);
      g.style.setProperty("--gy", `${cy.toFixed(1)}px`);
      if (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) raf = requestAnimationFrame(tick);
    };

    // keep the ring glued while the page scrolls under a hovered control
    const reflow = () => {
      if (!hovering || !hovering.isConnected) return;
      const b = hovering.getBoundingClientRect();
      r.style.setProperty("--rx", `${b.left + b.width / 2}px`);
      r.style.setProperty("--ry", `${b.top + b.height / 2}px`);
      r.style.setProperty("--rw", `${b.width + 14}px`);
      r.style.setProperty("--rh", `${b.height + 14}px`);
    };

    const onLeave = () => {
      g.style.opacity = "0";
      hovering = null;
      delete r.dataset.on;
      resetTilt();
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("scroll", reflow, { passive: true });
    window.addEventListener("resize", reflow);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onMove);
      window.removeEventListener("scroll", reflow);
      window.removeEventListener("resize", reflow);
      document.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={bar} className="kd-progress" aria-hidden="true" />
      <div ref={glow} className="kd-cursor-glow" aria-hidden="true" />
      <div ref={ring} className="kd-cursor-ring" aria-hidden="true" />
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
