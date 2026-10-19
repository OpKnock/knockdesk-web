"use client";

import { useState } from "react";

/**
 * Overlapping layers of the app's data flow.
 *
 * The four slips sit on top of each other; selecting one brings it forward
 * and shows what that layer actually means. The last slip is the one that
 * leaves the machine, so it is the accent and starts selected.
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
    points: ["SOUL.md and MEMORY.md are readable Markdown", "Custom skills use the same plain format", "Nothing is locked inside a database you cannot open"],
  },
  {
    id: "chats",
    title: "Chats and notes",
    tag: "Stays on your PC",
    blurb: "Your conversations, tasks, contacts, and notes, in the app's local data folder.",
    points: ["Readable by you, exportable, and deletable", "No KnockDesk server holds a copy", "Summaries are built from what you keep"],
  },
  {
    id: "settings",
    title: "Settings and keys",
    tag: "Stays on your PC",
    blurb: "Your API keys never leave the machine. They are stored with your Windows account's protection.",
    points: ["Add a key in Settings, then AI Engine", "Rotate or remove it whenever you like", "Keys are redacted from logs and screenshots"],
  },
  {
    id: "provider",
    title: "Prompts to your provider",
    tag: "Leaves, when you enable it",
    blurb: "Only this layer goes out, and only to a provider you chose and configured yourself.",
    points: ["Nothing is sent until you add your own key", "You pick the provider per feature", "That provider's own policy applies to its side"],
  },
];

export function LayerStack() {
  const [active, setActive] = useState(layers.length - 1);
  const layer = layers[active];

  return (
    <div className="kd-layers">
      <div className="kd-layers-stack" role="group" aria-label="Data layers">
        {layers.map((l, i) => (
          <button
            key={l.id}
            type="button"
            className="kd-slip"
            data-active={i === active}
            data-out={l.id === "provider"}
            style={{ ["--i" as string]: i }}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
          >
            <span className="kd-slip-tag">{l.tag}</span>
            <span className="kd-slip-title">{l.title}</span>
          </button>
        ))}
      </div>

      <div className="kd-layers-info" aria-live="polite">
        <p className="kd-layers-blurb">{layer.blurb}</p>
        <ul>
          {layer.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p className="kd-layers-hint">Select a layer to see what it means.</p>
      </div>
    </div>
  );
}
