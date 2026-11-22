"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero visual: the real KnockDesk window, rotating through its themes.
 *
 * Four screenshots cross-fade on a fixed hold. Auto-advance stops on hover,
 * when the visitor prefers reduced motion, when the tab is hidden, and when
 * the showcase scrolls out of view. The dots are real buttons: click one to
 * jump to a theme.
 */

type Shot = {
  id: string;
  label: string;
  file: string;
  accent: string;
  alt: string;
};

const shots: Shot[] = [
  {
    id: "cyan",
    label: "Cyan",
    file: "/shots/app-cyan.webp",
    accent: "#22d3ee",
    alt: "The KnockDesk command center in the Cyan theme: a satellite feed panel with a live globe, the assistant core with memory, skills, character and settings, and a voice panel.",
  },
  {
    id: "emerald",
    label: "Emerald",
    file: "/shots/app-emerald.webp",
    accent: "#2ee07a",
    alt: "The KnockDesk command center in the Emerald theme.",
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    file: "/shots/app-cyberpunk.webp",
    accent: "#ff3fd0",
    alt: "The KnockDesk command center in the Cyberpunk theme.",
  },
  {
    id: "crimson",
    label: "Crimson",
    file: "/shots/app-crimson.webp",
    accent: "#ff5340",
    alt: "The KnockDesk command center in the Crimson theme.",
  },
];

const HOLD = 2000;

export function AppShowcase() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(true);
  const [tabOpen, setTabOpen] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hold, setHold] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);

  // stop advancing once the showcase scrolls out of view
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // stop advancing while the tab is in the background
  useEffect(() => {
    const onVis = () => setTabOpen(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const paused = hovered || reducedMotion || !inView || !tabOpen;

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % shots.length), HOLD);
    return () => window.clearInterval(id);
  }, [paused, hold]);

  /** Pick a theme by hand and give it a full hold before moving on. */
  const go = (i: number) => {
    setActive(i);
    setHold((h) => h + 1);
  };

  const current = shots[active];

  return (
    <div
      ref={wrap}
      className="kd-showcase"
      style={{ ["--acc" as string]: current.accent }}
      data-active={active}
      data-paused={paused ? "true" : "false"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="kd-showcase-frame">
        {shots.map((s, i) => (
          <img
            key={s.id}
            src={s.file}
            alt={i === active ? s.alt : ""}
            aria-hidden={i !== active}
            width={1917}
            height={1078}
            className="kd-showcase-shot"
            data-on={i === active}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
          />
        ))}
      </div>

      <div className="kd-showcase-bar">
        <ul className="kd-showcase-dots">
          {shots.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-pressed={i === active}
                style={{ ["--dot" as string]: s.accent }}
              >
                <span className="kd-showcase-dot" aria-hidden="true" />
                <span className="kd-showcase-name">{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="kd-showcase-caption">
          One command center, four themes. Switch it any time.
        </p>
      </div>
    </div>
  );
}
