"use client";

import { useState } from "react";

export function FaqSection({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  const [query, setQuery] = useState("");
  const filtered = faqs.filter(
    (f) => f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="kd-section" id="faq">
      <div className="kd-container" style={{ maxWidth: "720px" }}>
        <h2 style={{ marginBottom: "16px" }}>Questions, answered</h2>
        <div style={{ marginBottom: "32px" }}>
          <label htmlFor="faq-search" className="kd-label">Search the FAQ</label>
          <input
            id="faq-search"
            type="search"
            className="kd-input"
            placeholder="Type a keyword, for example: free, offline, macOS"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <p style={{ marginTop: "8px", fontSize: "0.8125rem", color: "var(--kd-faint)" }} role="status">
              {filtered.length === 0
                ? "No answers match that search. Try a different keyword or contact us."
                : `${filtered.length} of ${faqs.length} questions match.`}
            </p>
          )}
        </div>
        {filtered.map((f) => (
          <details key={f.q} className="kd-faq-item">
            <summary>{f.q}</summary>
            <div className="kd-faq-body">
              <p style={{ fontSize: "0.9375rem" }}>{f.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
