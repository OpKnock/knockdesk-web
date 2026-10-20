"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, SplitText } from "../lib/gsap";

/**
 * Scroll motion for the whole site, driven by GSAP ScrollTrigger.
 *
 * Markup opts in with data attributes, so pages stay plain server components:
 *
 *   data-reveal="split"    heading text rises line by line out of a mask
 *   data-reveal="card"     batched per row, so a grid cascades instead of popping
 *   data-reveal="stagger"  the element's children enter one after another
 *   data-reveal            (bare) a short fade and lift
 *   data-hero              plays on load instead of on scroll, in DOM order
 *   data-parallax="6"      drifts against the scroll, value is +/- % of its height
 *
 * How it stays safe:
 *  - The stylesheet hides [data-reveal] only while `.js` is set and
 *    `.kd-motion-off` is not. If this file never runs, or throws, the page
 *    falls back to fully visible content (see the timeout in layout.tsx).
 *  - Reduced motion: nothing is animated, nothing is hidden.
 *  - Scroll-linked parallax only runs on wide screens. Phones and tablets get
 *    the cheap reveals only, which keeps scrolling smooth on low-end devices.
 *  - Only transform and opacity are animated. Once an element has played, its
 *    inline styles are cleared so hover and tilt effects own it again.
 */

const OUT = "expo.out";
const SOFT = "power3.out";

type El = HTMLElement;

const all = <T extends El = El>(sel: string, scope: ParentNode = document) =>
  gsap.utils.toArray<T>(scope.querySelectorAll(sel));

/** Mark an element as revealed and hand its styles back to the stylesheet. */
function settle(el: Element) {
  el.setAttribute("data-revealed", "");
  gsap.set(el, { clearProps: "transform,opacity,visibility,willChange" });
}

/** Elements in the same visual row get a small stagger between them. */
function rowDelay(el: El) {
  const row = Array.from(el.parentElement?.children ?? []).filter(
    (c): c is El => c instanceof HTMLElement && c.dataset.reveal === el.dataset.reveal && Math.abs(c.offsetTop - el.offsetTop) < 8,
  );
  return Math.max(0, row.indexOf(el)) * 0.12;
}

export function Motion() {
  const path = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("kd-motion-off")) return;

    let alive = true;
    const splits: SplitText[] = [];
    const mm = gsap.matchMedia();

    /** Heading text rises line by line. The text itself is never hidden from
     *  assistive tech: SplitText keeps an aria-label on the heading. */
    const splitReveal = (el: El, { delay = 0, scroll = true } = {}) => {
      let played = false;
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true, // re-splits if the width or a late font changes the wrapping
        onSplit(self) {
          if (played) return;
          // Tight headline leading would clip descenders inside the mask, so
          // give each mask breathing room and cancel it out in the layout.
          self.masks.forEach((m) => {
            (m as El).style.paddingBlock = "0.14em";
            (m as El).style.marginBlock = "-0.14em";
          });
          // The lines start below their masks, so the heading can show now.
          const tween = gsap.from(self.lines, {
            yPercent: 112,
            duration: 1.25,
            ease: OUT,
            stagger: 0.09,
            delay,
            scrollTrigger: scroll ? { trigger: el, start: "top 88%", once: true } : undefined,
            onComplete() {
              played = true;
              self.revert(); // restore the original markup once it has played
            },
          });
          el.setAttribute("data-revealed", "");
          return tween;
        },
      });
      splits.push(split);
    };

    const build = (wide: boolean) => {
      const revealEls = all("[data-reveal]");
      const heroEls = revealEls.filter((el) => el.hasAttribute("data-hero"));
      const sceneEls = revealEls.filter((el) => !el.hasAttribute("data-hero"));

      // ---- hero: one orchestrated entrance on load ------------------------
      heroEls.forEach((el, i) => {
        const delay = 0.12 + i * 0.11;
        if (el.dataset.reveal === "split") {
          splitReveal(el, { delay, scroll: false });
          return;
        }
        const panel = el.dataset.hero === "panel";
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: panel ? 64 : 22, scale: panel ? 0.975 : 1 },
          { autoAlpha: 1, y: 0, scale: 1, duration: panel ? 1.5 : 1, delay: panel ? 0.35 : delay, ease: OUT, onComplete: () => settle(el) },
        );
      });

      // ---- everything below the fold, on scroll ---------------------------
      const cards: El[] = [];
      sceneEls.forEach((el) => {
        const kind = el.dataset.reveal || "fade";

        if (kind === "split") {
          splitReveal(el);
        } else if (kind === "card") {
          cards.push(el);
        } else if (kind === "stagger") {
          const kids = Array.from(el.children) as El[];
          gsap.fromTo(
            kids,
            { autoAlpha: 0, y: 26 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.95,
              ease: SOFT,
              stagger: 0.1,
              delay: rowDelay(el),
              scrollTrigger: { trigger: el, start: "top 86%", once: true },
              onComplete: () => {
                gsap.set(kids, { clearProps: "transform,opacity,visibility,willChange" });
                settle(el);
              },
            },
          );
          el.setAttribute("data-revealed", ""); // children are hidden by the tween now, not by CSS
        } else {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1.05,
              ease: SOFT,
              delay: rowDelay(el),
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
              onComplete: () => settle(el),
            },
          );
        }
      });

      if (cards.length) {
        gsap.set(cards, { autoAlpha: 0, y: 42 });
        ScrollTrigger.batch(cards, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: SOFT,
              stagger: 0.09,
              overwrite: true,
              onComplete: () => batch.forEach(settle),
            }),
        });
      }

      // ---- hairlines draw in as each section arrives ----------------------
      all(".kd-section").forEach((sec) => {
        gsap.fromTo(
          sec,
          { "--line": 0 },
          { "--line": 1, duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: sec, start: "top 90%", once: true } },
        );
      });

      // ---- count-up figures -----------------------------------------------
      const counters = all("[data-count]");
      counters.forEach((el) => {
        const target = parseFloat(el.dataset.count || "");
        if (!Number.isFinite(target)) return;
        const n = { v: 0 };
        el.textContent = "0";
        ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () =>
            gsap.to(n, {
              v: target,
              duration: 1.5,
              ease: "power2.out",
              onUpdate: () => { el.textContent = String(Math.round(n.v)); },
              onComplete: () => { el.textContent = String(target); },
            }),
        });
      });

      // ---- the layer list settles in as the section arrives ----------------
      const flow = document.querySelector<El>(".kd-flow");
      if (flow) {
        const rows = all(".kd-flow-row", flow);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: flow, start: "top 82%", once: true },
          onComplete: () => { gsap.set(rows, { clearProps: "transform,opacity,visibility,willChange" }); },
        });
        tl.from(rows, { y: 24, autoAlpha: 0, duration: 0.9, ease: OUT, stagger: 0.09 });
      }

      // ---- "how it works": the active step follows the scroll -------------
      const story = document.querySelector<El>("[data-story]");
      if (story) {
        const steps = all("[data-story-step]", story);
        const setOn = (i: number) => steps.forEach((s, k) => s.classList.toggle("on", k === i));
        if (wide) {
          setOn(0);
          ScrollTrigger.create({
            trigger: story,
            start: "top 78%",
            end: "bottom 42%",
            onUpdate: (self) => {
              story.style.setProperty("--sp", self.progress.toFixed(3));
              setOn(Math.min(steps.length - 1, Math.floor(self.progress * steps.length)));
            },
          });
        } else {
          // stacked layout: each step lights up as it crosses the middle of the screen
          steps.forEach((step) =>
            ScrollTrigger.create({ trigger: step, start: "top 68%", end: "bottom 42%", toggleClass: { targets: step, className: "on" } }),
          );
        }
      }

      // ---- parallax: wide screens only ------------------------------------
      if (wide) {
        const hero = document.querySelector<El>(".kd-hero");
        const copy = document.querySelector<El>("[data-hero-copy]");
        const panel = document.querySelector<El>("[data-hero-panel]");
        if (hero) {
          const trigger = { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 };
          if (copy) gsap.to(copy, { y: -56, opacity: 0.25, ease: "none", scrollTrigger: trigger });
          if (panel) gsap.to(panel, { y: 84, ease: "none", scrollTrigger: trigger });
        }
        all("[data-parallax]").forEach((el) => {
          const amt = parseFloat(el.dataset.parallax || "") || 6;
          gsap.fromTo(
            el,
            { yPercent: -amt },
            { yPercent: amt, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } },
          );
        });
      }

      // ---- header gains a shadow once the page moves ----------------------
      const nav = document.querySelector<El>(".kd-nav");
      if (nav) {
        ScrollTrigger.create({ start: 8, end: "max", onToggle: (self) => nav.classList.toggle("scrolled", self.isActive) });
      }

      return () => {
        counters.forEach((el) => { if (el.dataset.count) el.textContent = el.dataset.count; });
        nav?.classList.remove("scrolled");
      };
    };

    const start = () => {
      if (!alive) return;
      try {
        mm.add(
          { motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 961px)" },
          (ctx) => {
            const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean };
            // Reduced motion: leave everything exactly as the stylesheet shows it.
            if (!motion) return;
            return build(wide);
          },
        );
        root.classList.add("kd-motion-on");
        ScrollTrigger.refresh();
      } catch (err) {
        console.error("Motion disabled:", err);
        mm.revert();
        root.classList.add("kd-motion-off");
      }
    };

    // Wait briefly for fonts so line splits measure the real typeface, but
    // never hold the page hostage to a slow font.
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.race([fonts, new Promise((r) => setTimeout(r, 1200))]).then(start);

    return () => {
      alive = false;
      mm.revert();
      splits.forEach((s) => s.revert());
      document.querySelectorAll("[data-revealed]").forEach((el) => el.removeAttribute("data-revealed"));
    };
  }, [path]);

  return null;
}
