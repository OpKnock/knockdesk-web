"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * A new page starts at the top, and an in-page link lands on its section.
 *
 * Two things have to be got right here:
 *
 *  1. The browser restores the previous scroll offset when the route changes,
 *     so opening Privacy from the bottom of the home page would otherwise
 *     land you halfway down a document you have not read yet.
 *
 *  2. A hash link has to land on its target. The router scrolls to the top
 *     on navigation and the motion layer then re-lays out the page, so a
 *     scroll issued once, at the moment the route changes, is measured against
 *     a document that is about to change shape. This waits for the layout to
 *     settle and re-aims until the target is actually in view.
 */
export function ScrollToTop() {
  const path = usePathname();

  useEffect(() => {
    const raw = window.location.hash;
    const id = raw ? decodeURIComponent(raw.slice(1)) : "";

    let raf = 0;
    let tries = 0;

    /** True once the target sits just under the sticky header. */
    const inPlace = (el: Element) => {
      const top = Math.round(el.getBoundingClientRect().top);
      return top >= -4 && top <= 140;
    };

    const settle = () => {
      if (id) {
        const el = document.getElementById(id);
        if (!el) {
          // The section has not been rendered yet.
          if (tries++ < 40) raf = requestAnimationFrame(settle);
          return;
        }
        if (inPlace(el)) return;
        el.scrollIntoView({ block: "start", behavior: "instant" as ScrollBehavior });
        if (tries++ < 40) raf = requestAnimationFrame(settle);
        return;
      }

      if (window.scrollY === 0) return;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      if (tries++ < 40) raf = requestAnimationFrame(settle);
    };

    raf = requestAnimationFrame(settle);
    return () => cancelAnimationFrame(raf);
  }, [path]);

  return null;
}
