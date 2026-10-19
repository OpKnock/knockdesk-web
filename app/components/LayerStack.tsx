"use client";

import { useState } from "react";

/**
 * The data-flow diagram.
 *
 * The four layers of what KnockDesk holds, drawn as a vertical pipeline
 * running from your disk down to your AI provider. The three local layers sit
 * above a drawn network boundary and the one outbound layer sits below it, so
 * the point of the section is visible without reading anything: everything
 * stays here until the boundary, and only one thing crosses it.
 *
 * Selecting a layer opens it, showing what it holds and the files it is made
 * of. The content is the same as before; only the shape of it is new.
 */

type Layer = {
  id: string;
  title: string;
  tag: string;
  blurb: string;
  points: string[];
  /** The concrete files this layer is made of. Shown when the layer is open. */
  files: string[];
  /** The one layer that leaves the machine. */
  outbound?: boolean;
};

const layers: Layer[] = [
  {
    id: "persona",
    title: "Persona and memory",
    tag: "Stays on your PC",
    blurb: "Plain files in your Documents folder. Open them, edit them, delete them.",
    points: [
      "SOUL.md and MEMORY.md are readable Markdown",
      "Custom skills use the same plain format",
      "Nothing is locked inside a database you cannot open",
    ],
    files: ["SOUL.md", "MEMORY.md", "skills/"],
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
    files: ["chats/", "notes/", "contacts/"],
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
    files: ["settings.json", "keys (OS-protected)"],
  },
  {
    id: "provider",
    title: "Prompts to your provider",
    tag: "Leaves, when you enable it",
    blurb: "Only this layer goes out, and only to a provider you chose and configured yourself.",
    points: [
      "Nothing is sent until you add your own key",
      "You pick the provider per feature",
      "That provider's own policy applies to its side",
    ],
    files: ["to the provider you chose"],
    outbound: true,
  },
];

export function LayerStack() {
  const [active, setActive] = useState(layers.length - 1);
  const layer = layers[active];

  return (
    <div className="kd-layers" data-reveal>
      <div className="kd-flow" role="group" aria-label="Data layers">
        {layers.map((l, i) => {
          const isActive = i === active;
          return (
            <div key={l.id} className="kd-flow-slot">
              {l.outbound && (
                <p className="kd-flow-boundary">
                  <span>network boundary</span>
                </p>
              )}
              <button
                type="button"
                className={
                  "kd-flow-row" + (l.outbound ? " kd-flow-row-out" : "") + (isActive ? " is-active" : "")
                }
                onClick={() => setActive(i)}
                aria-pressed={isActive}
              >
                <span className="kd-flow-idx" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="kd-flow-body">
                  <span className="kd-flow-title">{l.title}</span>
                  <span className="kd-flow-tag">{l.tag}</span>
                </span>
                <span className="kd-flow-mark" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="kd-flow-detail" aria-live="polite">
        {/* Keyed so the panel re-animates when a different layer is opened. */}
        <div key={layer.id} className="kd-flow-detail-inner">
          <p className="kd-flow-blurb">{layer.blurb}</p>
          <ul className="kd-flow-points">
            {layer.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          {/* The files this layer is made of. They live in the panel rather than
              in the row, so opening a layer does not change the row's height.
              A row that resizes while it holds focus also resizes the focus
              ring around it, which is how the ring ends up drawn against the
              wrong box. */}
          <div className="kd-flow-files-wrap">
            <p className="kd-flow-files-label">Files</p>
            <ul className="kd-flow-files">
              {layer.files.map((f) => (
                <li key={f} className="kd-flow-file">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="kd-flow-hint">Select a layer to see what it holds.</p>
    </div>
  );
}
