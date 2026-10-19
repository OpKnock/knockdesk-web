const { chromium } = require("playwright-core");
const BASE = process.env.KD_BASE || "http://127.0.0.1:3005";

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  let fails = 0;
  const check = (name, ok, extra) => {
    console.log((ok ? "PASS  " : "FAIL  ") + name + (extra ? "  " + extra : ""));
    if (!ok) fails++;
  };

  // The Source button lives in the nav on every route.
  for (const route of ["/", "/download", "/guide", "/about", "/contact"]) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    const btn = page.locator(".kd-nav-tools a.kd-btn-github");
    const n = await btn.count();
    const visible = n ? await btn.first().isVisible() : false;
    const href = n ? await btn.first().getAttribute("href") : null;
    const label = n ? await btn.first().getAttribute("aria-label") : null;
    check(`nav Source button on ${route}`, n === 1 && visible && href === "https://github.com/OpKnock/KnockDesk" && !!label, `n=${n} visible=${visible} href=${href}`);
  }

  // It is a real button and it navigates. The navigation is asserted from the
  // request rather than the loaded page, so the check does not depend on
  // github.com being reachable or fast.
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const box = await page.locator(".kd-btn-github").boundingBox();
  const dl = await page.locator(".kd-nav-cta").boundingBox();
  check("Source button sits next to Download", Math.abs(box.x + box.width - dl.x) < 24, `source right edge ${Math.round(box.x + box.width)}, download left ${Math.round(dl.x)}`);
  check("Source button is a comfortable tap target", box.height >= 44, `h=${Math.round(box.height)}`);

  const [req] = await Promise.all([
    page.waitForRequest((r) => r.url().startsWith("https://github.com/OpKnock/KnockDesk"), { timeout: 15000 }).catch(() => null),
    page.locator(".kd-btn-github").click(),
  ]);
  check("Source button navigates to GitHub", !!req, req ? req.url() : "no request to github.com was made");

  // Anchor links land on the section, not the top of the page.
  // "Features" lives in the nav, "FAQ" in the footer.
  for (const [label, hash, sel] of [
    ["Features", "#features", '.kd-nav-links a[href="/#features"]'],
    ["FAQ", "#faq", '.kd-footer a[href="/#faq"]'],
  ]) {
    await page.goto(BASE + "/download", { waitUntil: "networkidle" });
    await page.click(sel);
    await page.waitForTimeout(2200);
    const r = await page.evaluate((h) => {
      const el = document.querySelector(h);
      return { top: el ? Math.round(el.getBoundingClientRect().top) : null, y: Math.round(window.scrollY) };
    }, hash);
    check(`"${label}" link scrolls to the section`, r.top !== null && r.top >= 0 && r.top < 140, `target top=${r.top} scrollY=${r.y}`);
  }

  // The scrollbar is hidden but the page still scrolls.
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const bar = await page.evaluate(() => {
    const el = document.scrollingElement;
    return { w: el.clientWidth, sw: el.scrollWidth, hidden: getComputedStyle(document.documentElement).scrollbarWidth };
  });
  check("scrollbar is hidden", bar.hidden === "none" || bar.w === bar.sw, JSON.stringify(bar));
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(600);
  const y = await page.evaluate(() => Math.round(window.scrollY));
  check("page still scrolls with the wheel", y > 400, "scrollY=" + y);

  // Navigating to another page must land at the top of that page. The browser
  // used to leave the visitor near the bottom of the new page, because
  // `scroll-behavior: smooth` turned the reset into an animation measured
  // against the outgoing page.
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  await page.click('.kd-footer a[href="/terms"]');
  await page.waitForTimeout(1200);
  const afterNav = await page.evaluate(() => ({ path: location.pathname, y: Math.round(window.scrollY) }));
  check("navigating to another page lands at the top", afterNav.path === "/terms" && afterNav.y === 0, JSON.stringify(afterNav));

  // The same for a link in the nav rather than the footer.
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(500);
  await page.click('.kd-nav-links a[href="/about"]');
  await page.waitForTimeout(1200);
  const afterNav2 = await page.evaluate(() => ({ path: location.pathname, y: Math.round(window.scrollY) }));
  check("a nav link also lands at the top", afterNav2.path === "/about" && afterNav2.y === 0, JSON.stringify(afterNav2));

  // The nav must fit at every width. Adding the Source button used to push
  // the links past the edge of the bar below about 980px.
  let navOverflows = [];
  for (const w of [1440, 1280, 1200, 1100, 1025, 1024, 980, 900, 820, 640, 390]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(220);
    const o = await page.evaluate(() => {
      const inner = document.querySelector(".kd-nav-inner");
      return Math.round(inner.scrollWidth - inner.clientWidth);
    });
    if (o > 1) navOverflows.push(`${w}px over by ${o}px`);
  }
  check("the nav fits at every width", navOverflows.length === 0, navOverflows.join(", "));
  await page.setViewportSize({ width: 1440, height: 900 });

  await browser.close();
  console.log(fails === 0 ? "\nALL CHECKS PASSED" : `\n${fails} FAILURE(S)`);
  process.exit(fails === 0 ? 0 : 1);
})();