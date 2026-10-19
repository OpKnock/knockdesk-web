"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

// The cookie notice is dismissed permanently once acknowledged. Reading the
// flag through useSyncExternalStore keeps it out of an effect: the server
// snapshot is "not dismissed", so the first client render already knows the
// real answer instead of flashing the notice in and then hiding it.
const NOTICE_KEY = "kd-notice";

const subscribeToNotice = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};

const noticeDismissed = () => {
  try {
    return localStorage.getItem(NOTICE_KEY) === "1";
  } catch {
    // Storage unavailable: treat as not dismissed so the notice still shows.
    return false;
  }
};

const dismissNotice = () => {
  try {
    localStorage.setItem(NOTICE_KEY, "1");
  } catch {
    // Best effort; the notice still closes for this page view.
  }
  window.dispatchEvent(new Event("storage"));
};

export function SiteEffects() {
  const path = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLButtonElement>(null);
  const contact = useRef<HTMLAnchorElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const dismissed = useSyncExternalStore(subscribeToNotice, noticeDismissed, () => false);
  const notice = !dismissed;

  useEffect(() => {
    document.documentElement.classList.toggle("kd-notice-open", notice);
  }, [notice]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const motion = gsap.matchMedia();
    const revealed = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    const stories = gsap.utils.toArray<HTMLElement>("[data-story]");
    let refreshFrame = 0;
    let utilityFrame = 0;

    // Keep non-animated UI behaviour separate from motion: the progress bar and
    // floating actions still work for visitors who prefer reduced motion.
    const updateUtilities = () => {
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, y / max)})`;
      top.current?.classList.toggle("visible", y > 400);
      contact.current?.classList.toggle("visible", y > 600);
      rescueStuck();
    };
    const scheduleUtilities = () => {
      if (utilityFrame) return;
      utilityFrame = requestAnimationFrame(() => {
        utilityFrame = 0;
        updateUtilities();
      });
    };

    const scheduleRefresh = () => ScrollTrigger.refresh();

    const markRevealed = (items: HTMLElement[]) => {
      items.forEach((el) => el.classList.add("in"));
    };

    // `[data-reveal]` starts at `visibility: hidden`, so an element whose
    // trigger never fires would stay invisible forever. This is the safety net
    // for that: anything currently on screen but still hidden is revealed
    // directly. Elements below the fold are left alone, because they are
    // waiting on a legitimate scroll trigger.
    //
    // It runs on every scroll frame, not once, because ScrollTrigger measures
    // trigger positions at setup and the self-hosted variable fonts reflow the
    // page after first paint. A trigger can therefore be missed entirely if
    // the visitor scrolls through quickly, and the cost of that being a blank
    // section is far too high to accept.
    const rescueStuck = () => {
      for (const el of revealed) {
        if (el.classList.contains("in")) continue;
        const r = el.getBoundingClientRect();
        if (r.top > window.innerHeight || r.bottom < 0) continue;
        gsap.set(el, { autoAlpha: 1, clearProps: "opacity,visibility,transform" });
        el.classList.add("in");
      }
    };

    motion.add("(prefers-reduced-motion: reduce)", () => {
      // No hidden content, parallax, count-up or scroll-linked transitions in
      // reduced-motion mode. Content remains fully available immediately.
      gsap.set(revealed, { autoAlpha: 1, clearProps: "opacity,visibility,transform" });
      markRevealed(revealed);
      gsap.set("[data-hero-copy], [data-hero-copy] > *, [data-hero-panel]", {
        autoAlpha: 1,
        clearProps: "opacity,visibility,transform",
      });
      stories.forEach((story) => {
        story.style.setProperty("--sp", "1");
        const steps = gsap.utils.toArray<HTMLElement>("[data-story-step]", story);
        steps.forEach((step, index) => step.classList.toggle("on", index === 0));
      });
    });

    motion.add("(prefers-reduced-motion: no-preference)", () => {
      // Give sibling cards and steps one shared trigger so their entrances are
      // staggered as a sequence instead of firing as unrelated animations.
      const groups = new Map<HTMLElement, HTMLElement[]>();
      revealed.forEach((el) => {
        const parent = el.parentElement;
        if (!parent) return;
        const siblings = Array.from(parent.children).filter(
          (child): child is HTMLElement => child instanceof HTMLElement && child.matches("[data-reveal]"),
        );
        if (siblings.length > 1) groups.set(parent, siblings);
      });

      const grouped = new Set<HTMLElement>();
      groups.forEach((items, parent) => {
        items.forEach((el) => grouped.add(el));
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 26, scale: 0.99 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.82,
            ease: "power3.out",
            stagger: { each: 0.105, from: "start" },
            clearProps: "opacity,visibility,transform",
            onComplete: () => markRevealed(items),
            scrollTrigger: {
              trigger: parent,
              start: "top 84%",
              once: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      revealed.filter((el) => !grouped.has(el)).forEach((el) => {
        const rawDelay = getComputedStyle(el).getPropertyValue("--d").trim();
        const parsedDelay = Number.parseFloat(rawDelay);
        const delay = rawDelay.endsWith("ms") ? parsedDelay / 1000 : parsedDelay;
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 24, scale: 0.992 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.78,
            delay: Number.isFinite(delay) ? Math.min(Math.max(delay, 0), 0.24) : 0,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
            onComplete: () => el.classList.add("in"),
            scrollTrigger: {
              trigger: el,
              start: "top 87%",
              once: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      // The hero has a more immediate, editorial entrance than the content
      // sections below it.
      const heroCopy = document.querySelector<HTMLElement>("[data-hero-copy]");
      const heroPanel = document.querySelector<HTMLElement>("[data-hero-panel]");
      if (heroCopy) {
        const copyParts = Array.from(heroCopy.children).filter(
          (child): child is HTMLElement => child instanceof HTMLElement,
        );
        gsap.fromTo(
          copyParts,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.09, delay: 0.1, ease: "power3.out", clearProps: "opacity,visibility,transform" },
        );
      }
      if (heroPanel) {
        gsap.fromTo(
          heroPanel,
          { autoAlpha: 0, scale: 0.975 },
          { autoAlpha: 1, scale: 1, duration: 1, delay: 0.2, ease: "power3.out", clearProps: "opacity,visibility" },
        );
      }

      // Scroll-linked parallax and the hero fade are intentionally limited to
      // larger viewports; on phones and tablets the layout stays still.
      const desktopMotion = gsap.matchMedia();
      desktopMotion.add("(min-width: 961px)", () => {
        if (heroCopy) {
          gsap.to(heroCopy, {
            y: -20,
            opacity: 0.28,
            ease: "none",
            scrollTrigger: {
              trigger: ".kd-hero",
              start: "top top",
              end: "bottom top",
              scrub: 0.45,
              invalidateOnRefresh: true,
            },
          });
        }
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 10 },
            {
              y: -22,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.55,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });

      // Count the proof figures once when they reach the viewport.
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number.parseFloat(el.dataset.count || "");
        if (!Number.isFinite(target)) return;
        const counter = { value: 0 };
        el.textContent = "0";
        gsap.to(counter, {
          value: target,
          duration: 0.9,
          ease: "power2.out",
          onUpdate: () => { el.textContent = String(Math.round(counter.value)); },
          scrollTrigger: { trigger: el, start: "top 91%", once: true },
        });
      });

      // Steps share a single scroll progress signal, with exactly one active
      // state at a time and a rail that fills smoothly between them.
      stories.forEach((story) => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-story-step]", story);
        if (!steps.length) return;
        const setActive = (index: number) => {
          const safeIndex = Math.max(0, Math.min(steps.length - 1, index));
          steps.forEach((step, i) => step.classList.toggle("on", i === safeIndex));
        };
        ScrollTrigger.create({
          trigger: story,
          start: "top 76%",
          end: "bottom 62%",
          onUpdate: (self: { progress: number }) => {
            story.style.setProperty("--sp", self.progress.toFixed(3));
            setActive(Math.min(steps.length - 1, Math.floor(self.progress * steps.length)));
          },
          onRefresh: (self: { progress: number }) => {
            story.style.setProperty("--sp", self.progress.toFixed(3));
            setActive(Math.min(steps.length - 1, Math.floor(self.progress * steps.length)));
          },
        });
      });

      // The nested media query has its own lifecycle, so release its listeners
      // when the site-wide motion query changes or the route unmounts.
      return () => desktopMotion.revert();
    });

    updateUtilities();
    window.addEventListener("scroll", scheduleUtilities, { passive: true });
    window.addEventListener("resize", scheduleUtilities);
    refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());

    // ScrollTrigger measures trigger positions once, at setup. The self-hosted
    // variable fonts swap in after first paint and reflow every section, which
    // leaves those measurements pointing at the wrong scroll offsets and the
    // affected sections never revealing. Refreshing once the fonts have settled
    // -- and again on window load for late images -- puts the offsets back.
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    window.addEventListener("load", scheduleRefresh);

    // Safety net for a missed trigger: anything on screen but still hidden is
    // revealed. The scroll handler calls this on every frame, and this timer
    // covers the case where the visitor never scrolls at all.
    const failsafe = window.setTimeout(() => {
      ScrollTrigger.refresh();
      requestAnimationFrame(() => {
        rescueStuck();
      });
    }, 1500);

    return () => {
      window.removeEventListener("scroll", scheduleUtilities);
      window.removeEventListener("resize", scheduleUtilities);
      window.removeEventListener("load", scheduleRefresh);
      window.clearTimeout(failsafe);
      if (refreshFrame) cancelAnimationFrame(refreshFrame);
      if (utilityFrame) cancelAnimationFrame(utilityFrame);
      motion.revert();
    };
  }, [path]);

  // Anchor navigation across routes, and the scroll reset between routes.
  //
  // The browser resolves a #fragment against the layout as it exists at the
  // moment it handles the navigation. On a statically prerendered site the
  // target section has not laid out yet at that point, the variable fonts
  // have not loaded, and the scroll-reveal system has not run, so the offset
  // the browser computes is wrong and the page lands at the top instead of on
  // the section. Re-resolve the target once the page has settled.
  //
  // The same applies in reverse: navigating to a different page has to land
  // at the top of that page. The browser does not do that on its own here,
  // because `scroll-behavior: smooth` turns the reset into an animation that
  // is measured against the outgoing page and is then abandoned part way,
  // leaving the visitor stranded near the bottom of the new page. The reset is
  // done here instead, instantly.
  useEffect(() => {
    const hash = window.location.hash;
    let cancelled = false;

    const scrollToHash = () => {
      if (cancelled) return;
      const target = document.querySelector(hash);
      if (!target) return;
      target.scrollIntoView({ block: "start", behavior: "auto" });
    };

    if (hash && hash !== "#") {
      scrollToHash();
      const soon = window.setTimeout(scrollToHash, 80);
      const later = window.setTimeout(scrollToHash, 400);
      document.fonts?.ready.then(scrollToHash).catch(() => {});
      return () => {
        cancelled = true;
        window.clearTimeout(soon);
        window.clearTimeout(later);
      };
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    return () => {
      cancelled = true;
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

    const interactive = 'a, button, summary, input, [role="button"], .kd-flow-row';
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
          // Take the target's own corner radius so the ring follows its shape.
          const radius = getComputedStyle(hit).borderTopLeftRadius;
          r.style.setProperty("--rr", radius && radius !== "0px" ? radius : "6px");
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
          <div className="kd-notice-inner">
            <p>
              This site sets no cookies and runs no trackers. <Link href="/cookies">Cookie policy</Link>
            </p>
            <button type="button" onClick={dismissNotice}>Got it</button>
          </div>
        </div>
      )}
    </>
  );
}
