/* Full-site audit: console errors, horizontal scroll, tap targets, screenshots (desktop + mobile). */
const { chromium } = require("playwright");

const PAGES = ["/", "/download", "/privacy", "/terms", "/contact", "/cookies", "/404-test"];

(async () => {
  const browser = await chromium.launch();
  const results = [];

  for (const viewport of [
    { name: "desktop", width: 1920, height: 1080 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const ctx = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await ctx.newPage();
    const consoleErrors = [];
    page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
    page.on("pageerror", (e) => consoleErrors.push(`PAGEERROR: ${e.message}`));

    for (const route of PAGES) {
      consoleErrors.length = 0;
      await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });

      const hscroll = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      // h1 count
      const h1Count = await page.evaluate(() => document.querySelectorAll("h1").length);
      // tap target check (buttons + links under 44px on mobile)
      let smallTargets = 0;
      if (viewport.name === "mobile") {
        smallTargets = await page.evaluate(() => {
          let n = 0;
          document.querySelectorAll("a, button, input, [role=button]").forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.height < 40 && r.height > 0) n++;
          });
          return n;
        });
      }
      const slug = route.replace(/^\//, "").replace(/[^a-z0-9-]/g, "-") || "home";
      await page.screenshot({ path: `test/shots/${viewport.name}-${slug}.png`, fullPage: true });

      results.push({
        viewport: viewport.name,
        route,
        consoleErrors: [...consoleErrors],
        hscroll,
        h1Count,
        smallTargets,
      });
    }
    await ctx.close();
  }

  // navigation interaction test (mobile menu open)
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mp = await mctx.newPage();
  await mp.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await mp.click("button[aria-label='Open menu']");
  const menuVisible = await mp.evaluate(() =>
    !!document.querySelector("a[href='/download']") &&
    [...document.querySelectorAll("a")].some((a) => a.textContent.includes("Features") && a.offsetParent !== null)
  );
  await mp.screenshot({ path: "test/shots/mobile-menu-open.png" });
  results.push({ test: "mobile menu opens", pass: menuVisible });
  await mctx.close();

  // FAQ search filter test
  const fctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const fp = await fctx.newPage();
  await fp.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await fp.fill("#faq-search", "free");
  const visibleFaqs = await fp.evaluate(() => document.querySelectorAll("#faq details").length);
  results.push({ test: "faq search filters", pass: visibleFaqs > 0 && visibleFaqs < 6 });
  await fctx.close();

  // contact form validation test
  const cctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const cp = await cctx.newPage();
  await cp.goto("http://localhost:3000/contact", { waitUntil: "networkidle" });
  await cp.click("button[type=submit]");
  const hasError = await cp.evaluate(() => !!document.querySelector("[role=alert]"));
  results.push({ test: "contact form error state", pass: hasError });
  await cctx.close();

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
