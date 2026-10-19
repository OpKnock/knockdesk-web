"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero visual: a live mock of the KnockDesk window.
 *
 * It follows the pointer with a shallow parallax and a highlight that tracks
 * the cursor, the assistant line types itself out, and the voice meter and
 * agent chips animate. Everything degrades to a static, complete panel when
 * the visitor prefers reduced motion, and none of it blocks the copy that
 * carries the actual message.
 */

const rail = [
  { id: "core", label: "Core", note: "Neutral, direct" },
  { id: "jarvis", label: "Jarvis", note: "Dry wit" },
  { id: "mentor", label: "Mentor", note: "Steady" },
  { id: "bestie", label: "Bestie", note: "Warm" },
];

const ask = "What did the garage quote me?";
const reply = "Brake pads and a rear sensor. Thursday morning, £410.";

const agents = [
  { name: "Recall", state: "indexing" },
  { name: "Computer", state: "idle" },
  { name: "World Monitor", state: "idle" },
];

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function HeroPanel() {
  const wrap = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(reply);
  const [who, setWho] = useState(rail[0].id);

  // parallax + pointer highlight
  useEffect(() => {
    const el = wrap.current;
    if (!el || reduced()) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      el.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(2)}%`);
      el.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(2)}%`);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      raf = 0;
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.setProperty("--px", cx.toFixed(4));
      el.style.setProperty("--py", cy.toFixed(4));
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick); };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // the reply types itself, then the persona rail steps on
  useEffect(() => {
    if (reduced()) return;
    let i = 0;
    let hold = 0;
    const id = window.setInterval(() => {
      if (i <= reply.length) {
        setTyped(reply.slice(0, i));
        i += 1;
        return;
      }
      hold += 1;
      if (hold < 6) return;
      hold = 0;
      i = 0;
      setTyped("");
      setWho((w) => rail[(rail.findIndex((r) => r.id === w) + 1) % rail.length].id);
    }, 32);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div ref={wrap} className="kd-panel" aria-hidden="true">
      <div className="kd-panel-window">
        <div className="kd-panel-bar">
          <span className="kd-panel-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="kd-panel-title">KnockDesk</span>
          <span className="kd-panel-chip">v3.1.12</span>
        </div>
        <div className="kd-panel-body">
          <ul className="kd-panel-rail">
            {rail.map((p) => (
              <li key={p.id} className={p.id === who ? "on" : ""}>
                <span className="kd-panel-ava" data-k={p.id} />
                <span className="kd-panel-rail-text">
                  <strong>{p.label}</strong>
                  <em>{p.note}</em>
                </span>
              </li>
            ))}
            <li className="kd-panel-rail-foot">
              <span className="kd-panel-live" />
              Local files readable
            </li>
          </ul>
          <div className="kd-panel-thread">
            <p className="you">{ask}</p>
            <p className="kd">
              {typed}
              <span className="kd-panel-caret" />
            </p>
            <div className="kd-panel-meter">
              {Array.from({ length: 9 }, (_, n) => (
                <i key={n} style={{ ["--n" as string]: n }} />
              ))}
            </div>
            <ul className="kd-panel-agents">
              {agents.map((a) => (
                <li key={a.name}>
                  <span className="kd-panel-dot" data-s={a.state} />
                  {a.name}
                  <em>{a.state}</em>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="kd-panel-caption">The workspace: voice, memory, and agents in one window.</p>
    </div>
  );
}
