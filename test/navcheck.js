const { chromium } = require("playwright");

(async () => {
  const b = await chromium.launch();

  const p = await (await b.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const vis = await p.evaluate(() => ({
    cta: getComputedStyle(document.querySelector("a.kd-mobile-only")).display,
    burger: getComputedStyle(document.querySelector("button[aria-label='Open menu']")).display,
    navLinks: getComputedStyle(document.querySelector(".kd-nav-links")).display,
  }));
  console.log("desktop:", JSON.stringify(vis));
  await p.screenshot({ path: "test/shots/desktop-home.png" });

  const m = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await m.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const mvis = await m.evaluate(() => ({
    cta: getComputedStyle(document.querySelector("a.kd-mobile-only")).display,
    burger: getComputedStyle(document.querySelector("button[aria-label='Open menu']")).display,
    navLinks: getComputedStyle(document.querySelector(".kd-nav-links")).display,
  }));
  console.log("mobile:", JSON.stringify(mvis));
  await b.close();
})();
