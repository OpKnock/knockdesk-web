"use client";

import { useId, useState } from "react";

/**
 * The FAQ.
 *
 * This used to be built on <details>/<summary>. Chrome paints the native
 * disclosure marker for a summary on top of the first letter, and it ignores
 * list-style: none, ::marker { content: none } and
 * ::-webkit-details-marker { display: none }, so every question opened with a
 * stray triangle sitting on its first character. A button with an explicit
 * plus mark gives the same behaviour, the same keyboard and screen reader
 * support, and no marker at all.
 *
 * Without JavaScript the answers are all visible: the collapsing is driven by
 * the `js` class the pre-paint script sets, so the content is never hidden
 * from a visitor who has it turned off.
 */
export function FaqSection({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();
  const term = query.toLowerCase();
  const filtered = faqs.filter((f) => f.q.toLowerCase().includes(term) || f.a.toLowerCase().includes(term));

  return (
    <section className="kd-section" id="faq">
      <div className="kd-container kd-copy-wide">
        <h2 data-reveal style={{ marginBottom: 40 }}>Questions, answered</h2>
        <div className="kd-faq-search">
          <label htmlFor="faq-search" className="kd-label">Search the FAQ</label>
          <input id="faq-search" type="search" className="kd-input" placeholder="Type a keyword, for example: free, offline, macOS" value={query} onChange={(e) => setQuery(e.target.value)} />
          {query && (
            <p className="kd-faq-status" role="status">
              {filtered.length === 0 ? "No answers match that search. Try a different keyword or contact us." : `${filtered.length} of ${faqs.length} questions match.`}
            </p>
          )}
        </div>

        <ul className="kd-faq-list">
          {filtered.map((f) => {
            const isOpen = open === f.q;
            const panelId = `${uid}-${f.q.replace(/\W+/g, "-").toLowerCase()}`;
            return (
              <li key={f.q} className="kd-faq-item">
                <h3 className="kd-faq-heading">
                  <button
                    type="button"
                    className="kd-faq-q"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : f.q)}
                  >
                    <span className="kd-faq-q-text">{f.q}</span>
                    <span className="kd-faq-mark" aria-hidden="true" />
                  </button>
                </h3>
                <div className="kd-faq-panel" id={panelId} data-open={isOpen ? "true" : "false"}>
                  <div className="kd-faq-panel-inner">
                    <p>{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
