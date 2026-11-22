import { CopyButton } from "./CopyButton";

/**
 * A code sample with a copy button.
 *
 * The <pre> scrolls horizontally on narrow screens, so it is given
 * tabindex="0" and an accessible name: without that it is a scrollable region
 * that keyboard users cannot reach or scroll, which fails WCAG 2.1.1.
 */
export function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="kd-code">
      <pre tabIndex={0} role="region" aria-label={`${label} code sample`}><code>{code}</code></pre>
      <CopyButton text={code} label={label} />
    </div>
  );
}