"use client";

import { useState } from "react";

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          setCopied(false);
        }
      }}
      aria-label={`Copy ${label} to clipboard`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 14px",
        background: "var(--kd-surface2)",
        border: "1px solid var(--kd-border)",
        borderRadius: "4px",
        color: copied ? "var(--kd-acc)" : "var(--kd-muted)",
        fontSize: "0.8125rem",
        cursor: "pointer",
        transition: "color 0.15s ease, border-color 0.15s ease",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        {copied ? <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /> : <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 012-2h8" /></>}
      </svg>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
