/*
 * Verification pass.
 *
 * Checks, in a real Chrome, the things a build cannot tell us:
 *   - the CSP does not block the pre-paint bootstrap, the app bundle or GSAP
 *   - structured data and fonts actually arrive
 *   - the scroll reveals resolve instead of leaving content invisible
 *   - no console errors on any route
 *
 * Runs against a server already listening on BASE.
 */
const { chromium } = require("playwright-core");

const BASE = process.env.KD_BASE || "http://127.0.0.1:3005";
const ROUTES = ["/", "/download", "/guide", "/about", "/contact", "/privacy", "/terms", "/cookies", "/does-not-exist"];

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  let failures = 0;
  const fail = (msg) => { failures++; console.log("  FAIL  " + msg); };
  const pass = (msg) => console.log("  ok    " + msg);

  console.log("=== CSP enforcement ===\n");
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  // 1. the pre-paint bootstrap ran
  const htmlClass = await page.getAttribute("html", "class");
  const dataTheme = await page.getAttribute("html", "data-theme");
  if (htmlClass && htmlClass.split(/\s+/).includes("js")) pass("theme-init.js ran (html.js present)");
  else fail(`theme-init.js did NOT run (html class=${JSON.stringify(htmlClass)})`);
  if (dataTheme === "light" || dataTheme === "dark") pass(`theme applied before paint (data-theme=${dataTheme})`);
  else fail(`data-theme missing (bootstrap blocked by CSP?) -> ${JSON.stringify(dataTheme)}`);

  // 2. GSAP actually loaded and drove the reveals.
  //    The reveals are scroll-triggered, so the page has to be scrolled through
  //    before every element is expected to have resolved. Anything still hidden
  //    at that point means content the visitor can never see.
  //    The scroll starts immediately after load on purpose: ScrollTrigger
  //    measures trigger positions at setup and the variable fonts reflow the
  //    page afterwards, so a fast scroll is the case most likely to leave a
  //    section stuck invisible.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 1200));
  });
  const reveal = await page.evaluate(() => {
    const all = [...document.querySelectorAll("[data-reveal]")];
    const hidden = all.filter((el) => getComputedStyle(el).visibility === "hidden");
    return { total: all.length, hidden: hidden.length, revealed: all.length - hidden.length };
  });
  if (reveal.total > 0 && reveal.hidden === 0)
    pass(`all ${reveal.total} [data-reveal] elements visible after a fast scroll through the page`);
  else
    fail(`${reveal.hidden}/${reveal.total} [data-reveal] elements still hidden after full scroll (revealed ${reveal.revealed})`);

  // 2a. Scrolling back to the top must not re-hide anything.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
  const backAtTop = await page.evaluate(() => {
    const all = [...document.querySelectorAll("[data-reveal]")];
    return all.filter((el) => getComputedStyle(el).visibility === "hidden").length;
  });
  if (backAtTop === 0) pass("nothing re-hides when scrolling back to the top");
  else fail(`${backAtTop} [data-reveal] elements re-hid after scrolling back to the top`);

  // 2b. reduced motion must show everything immediately, with no animation.
  const rmCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const rmPage = await rmCtx.newPage();
  await rmPage.goto(BASE + "/", { waitUntil: "networkidle" });
  await rmPage.waitForTimeout(900);
  const rm = await rmPage.evaluate(() => {
    const all = [...document.querySelectorAll("[data-reveal]")];
    return { total: all.length, hidden: all.filter((e) => getComputedStyle(e).visibility === "hidden").length };
  });
  if (rm.hidden === 0) pass(`reduced-motion: all ${rm.total} reveals visible without scrolling`);
  else fail(`reduced-motion: ${rm.hidden}/${rm.total} reveals hidden`);
  await rmCtx.close();

  // 3. no CSP violation reported for our own assets
  const cspViolations = [];
  page.on("console", (m) => { if (/Content Security Policy|Refused to/i.test(m.text())) cspViolations.push(m.text()); });
  for (const r of ROUTES) {
    await page.goto(BASE + r, { waitUntil: "networkidle" });
  }
  if (cspViolations.length === 0) pass("no CSP violations across all routes");
  else cspViolations.forEach((v) => fail("CSP: " + v));

  // 4. structured data survived
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const ldCount = await page.evaluate(() => document.querySelectorAll('script[type="application/ld+json"]').length);
  if (ldCount >= 2) pass(`${ldCount} JSON-LD blocks present in DOM`);
  else fail(`only ${ldCount} JSON-LD blocks found`);

  // 5. self-hosted fonts actually applied
  const fontOk = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return h1 ? getComputedStyle(h1).fontFamily : "";
  });
  if (/Space Grotesk/i.test(fontOk)) pass(`display font loaded (${fontOk.split(",")[0]})`);
  else fail(`display font not applied: ${fontOk}`);

  console.log("\n=== per-route console errors ===\n");
  for (const r of ROUTES) {
    const errs = [];
    const onErr = (e) => errs.push("pageerror: " + e.message);
    const onCon = (m) => { if (m.type() === "error") errs.push(m.text()); };
    page.on("pageerror", onErr);
    page.on("console", onCon);
    const resp = await page.goto(BASE + r, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    page.off("pageerror", onErr);
    page.off("console", onCon);
    const status = resp ? resp.status() : 0;
    // The 404 route legitimately logs a 404 for its own document request.
    const meaningful = errs.filter((e) => !(status === 404 && /status of 404/.test(e)));
    if (meaningful.length) meaningful.forEach((e) => fail(`${r} [${status}] ${e}`));
    else pass(`${r} [${status}] clean`);
  }

  await browser.close();
  console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : failures + " FAILURE(S)"}`);
  process.exit(failures === 0 ? 0 : 1);
})();