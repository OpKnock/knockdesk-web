"use client";

import { useRef, useState, type KeyboardEvent } from "react";

/**
 * The four layers of KnockDesk's data flow, as one quiet list.
 *
 * Each row is a button that opens one panel, and only one row is open at a
 * time, so the section reads as a single column instead of a deck of cards.
 * The last layer is the only one that leaves the machine, so it carries the
 * accent and starts open. Arrow keys move the selection.
 */

type Layer = {
  id: string;
  title: string;
  tag: string;
  blurb: string;
  points: string[];
};

const layers: Layer[] = [
  {
    id: "persona",
    title: "Persona and memory",
    tag: "Stays on your PC",
    blurb: "Plain files in your Documents folder. Open them, edit them, delete them.",
    points: [
      "SOUL.md and MEMORY.md are readable Markdown",
      "Custom skills and the file vault use the same plain format",
      "Nothing is locked inside a database you cannot open",
    ],
  },
  {
    id: "chats",
    title: "Chats and notes",
    tag: "Stays on your PC",
    blurb: "Your conversations, tasks, contacts, and notes, in the app's local data folder.",
    points: [
      "Readable by you, exportable, and deletable",
      "No KnockDesk server holds a copy",
      "Summaries are built from what you keep",
    ],
  },
  {
    id: "settings",
    title: "Settings and keys",
    tag: "Stays on your PC",
    blurb: "Your API keys never leave the machine. They are stored with your Windows account's protection.",
    points: [
      "Add a key in Settings, then AI Engine",
      "Rotate or remove it whenever you like",
      "Keys are redacted from logs and screenshots",
    ],
  },
  {
    id: "provider",
    title: "Prompts to your provider",
    tag: "Leaves, when you enable it",
    blurb: "Only this layer goes out, and only to a provider you chose and configured yourself.",
    points: [
      "Prompts and speech go to the provider you enabled",
      "News, map, and messaging features only when you turn them on",
      "That provider's own policy applies to its side",
    ],
  },
];

export function LayerFlow() {
  // -1 means nothing is open. The list starts fully collapsed, so the section
  // reads as a quiet index until the reader picks a layer.
  const [active, setActive] = useState(-1);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) refs.current[i]?.focus();
  };

  /** Clicking the open row closes it again. */
  const toggle = (i: number) => setActive((cur) => (cur === i ? -1 : i));

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const next = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!next) return;
    e.preventDefault();
    const focused = refs.current.findIndex((b) => b === document.activeElement);
    const from = focused >= 0 ? focused : active;
    select((from + next + layers.length) % layers.length, true);
  };

  return (
    <div
      className="kd-flow"
      role="group"
      aria-label="Data layers"
      onKeyDown={onKeyDown}
    >
      {layers.map((l, i) => (
        <div
          key={l.id}
          className="kd-flow-row"
          data-open={i === active}
          data-out={l.id === "provider"}
        >
          <button
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            className="kd-flow-btn"
            id={`kd-flow-btn-${l.id}`}
            aria-expanded={i === active}
            aria-controls={`kd-flow-panel-${l.id}`}
            onClick={() => toggle(i)}
          >
            <span className="kd-flow-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span className="kd-flow-title">{l.title}</span>
            <span className="kd-flow-tag">{l.tag}</span>
            <span className="kd-flow-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </button>
          <div
            className="kd-flow-panel"
            id={`kd-flow-panel-${l.id}`}
            role="region"
            aria-labelledby={`kd-flow-btn-${l.id}`}
            aria-hidden={i !== active}
          >
            <div className="kd-flow-panel-inner">
              <p className="kd-flow-blurb">{l.blurb}</p>
              <ul className="kd-flow-points">
                {l.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
