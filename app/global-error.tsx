"use client";

/**
 * Last-resort error boundary.
 *
 * `global-error.tsx` replaces the root layout, so it cannot rely on the
 * layout's <html>/<body> or on any component from the app tree. It must render
 * its own document shell and inline its own critical CSS, otherwise a failure
 * in the root layout would leave a blank page.
 *
 * Next 16 passes `retry` (it was called `reset` in Next 15).
 */
const styles = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;
    background:#ffffff;color:#0b0b0c;
    font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;line-height:1.65}
  main{max-width:56ch}
  p.eyebrow{font-size:.8125rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#c93a12;margin-bottom:16px}
  h1{font-size:clamp(2rem,6vw,3.25rem);font-weight:600;line-height:1.08;letter-spacing:-.03em;margin-bottom:16px}
  p.body{font-size:1.125rem;color:#3d3d44;margin-bottom:32px}
  .actions{display:flex;gap:16px;flex-wrap:wrap;align-items:center}
  button,a{font:600 1rem inherit;min-height:52px;padding:14px 28px;border-radius:4px;cursor:pointer;
    text-decoration:none;display:inline-flex;align-items:center}
  button{background:#c93a12;color:#fff;border:2px solid transparent}
  button:hover{background:#a82e0b}
  a{background:transparent;color:#0b0b0c;border:2px solid #0b0b0c}
  a:hover{background:#0b0b0c;color:#fff}
  :focus-visible{outline:3px solid #c93a12;outline-offset:3px}
  @media (prefers-color-scheme:dark){
    body{background:#0c0c0e;color:#f4f4f5}
    h1{color:#f4f4f5}
    p.body{color:#c4c4cc}
    button{background:#ff6b3d;color:#0c0c0e}
    button:hover{background:#ff8a63}
    a{color:#f4f4f5;border-color:#f4f4f5}
    a:hover{background:#f4f4f5;color:#0c0c0e}
  }
`;

export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  // Intentionally not console.error'd: global-error renders before hydration
  // completes, and logging here can itself throw and loop.
  void error;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title>KnockDesk — error</title>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </head>
      <body>
        <main>
          <p className="eyebrow">Something went wrong</p>
          <h1>KnockDesk could not start.</h1>
          <p className="body">
            An unexpected error stopped the page from loading. Reloading usually clears it.
          </p>
          <div className="actions">
            <button type="button" onClick={retry}>
              Try again
            </button>
            {/* A plain anchor, not next/link: this component replaces the root
                layout, so the App Router context may not exist. Rendering Link
                here could throw and re-trigger the boundary it is meant to
                escape. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/">Back to home</a>
          </div>
        </main>
      </body>
    </html>
  );
}