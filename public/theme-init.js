/**
 * Pre-paint bootstrap. Served as a plain static file and loaded synchronously
 * as the first element in <body>.
 *
 * It does two things before the browser paints, neither of which can wait for
 * React:
 *   1. Marks the document as scripted so CSS can safely hide elements that are
 *      about to be revealed by JS. Without the marker, a visitor without JS
 *      would never see them.
 *   2. Applies the stored colour scheme so the first paint is already correct
 *      rather than flashing light and then switching.
 *
 * This lives in its own file on purpose. As an inline script it would force the
 * Content-Security-Policy to allow either 'unsafe-inline' or an exact SHA-256
 * hash, and a hash silently stops matching the moment this file is edited --
 * which would take the theme and every scroll reveal down with it. A
 * same-origin external script is allowed by `script-src 'self'`, so the policy
 * can stay strict with no hashes and no inline escape hatch.
 */
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  try {
    var stored = localStorage.getItem("kd-theme");
    if (!stored) {
      stored = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    root.setAttribute("data-theme", stored);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", stored === "dark" ? "#0c0c0e" : "#ffffff");
    }
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). The default
    // light theme still applies and the page stays readable.
  }
})();