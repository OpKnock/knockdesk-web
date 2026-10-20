"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { ScrollTrigger } from "../lib/gsap";

export function SiteEffects() {
  const path = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLButtonElement>(null);
  const contact = useRef<HTMLAnchorElement>(null);
  const glow = useRef<HTMLDivElement>(null);
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

  // Scroll progress bar and the floating buttons. Page animation lives in
  // Motion.tsx; these are state indicators, so they stay on under reduced motion.
  useEffect(() => {
    const triggers = [
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
        },
      }),
      ScrollTrigger.create({
        start: 400,
        end: "max",
        onToggle: (self) => top.current?.classList.toggle("visible", self.isActive),
      }),
      ScrollTrigger.create({
        start: 600,
        end: "max",
        onToggle: (self) => contact.current?.classList.toggle("visible", self.isActive),
      }),
    ];
    return () => triggers.forEach((t) => t.kill());
  }, [path]);

  // Cursor atmosphere: a soft backdrop that follows the pointer. Decorative
  // and pointer-transparent, and stands down for touch and reduced motion.
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const g = glow.current;
    if (coarse || still || !g) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let raf = 0;
    let tiltCard: HTMLElement | null = null;

    const tiltable = '.kd-feature, .kd-card, .kd-build, .kd-step';

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      g.style.opacity = "1";

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

    const onLeave = () => {
      g.style.opacity = "0";
      resetTilt();
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={bar} className="kd-progress" aria-hidden="true" />
      <div ref={glow} className="kd-cursor-glow" aria-hidden="true" />
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
