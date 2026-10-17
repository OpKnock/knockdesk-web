"use client";

import { useEffect, useState } from "react";

export function StackScene({ planes, out }: { planes: string[]; out: string }) {
  const [focused, setFocused] = useState<number | null>(null);

  // Escape closes the focused slip
  useEffect(() => {
    if (focused === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocused(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused]);

  const items = [
    ...planes.map((label, i) => ({ label, i, out: false })),
    { label: out, i: planes.length, out: true },
  ];

  return (
    <div className="kd-stack" data-progress data-reveal>
      <div className={focused === null ? "kd-stack-inner" : "kd-stack-inner has-focus"}>
        {items.map(({ label, i, out: isOut }) => (
          <span key={label} className={"kd-plane-w" + (isOut ? " out" : "")} style={{ "--i": i } as React.CSSProperties}>
            <button
              type="button"
              className={"kd-plane" + (isOut ? " out" : "") + (focused === i ? " focused" : "")}
              aria-pressed={focused === i}
              onClick={() => setFocused(focused === i ? null : i)}
            >
              <span className="kd-plane-text">{label}</span>
              <span className="kd-plane-x" aria-hidden="true">&times;</span>
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
