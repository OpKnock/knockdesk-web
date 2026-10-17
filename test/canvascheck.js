const { chromium } = require("playwright");

(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const info = await p.evaluate(() => {
    const c = document.querySelector(".kd-hero-canvas");
    const cs = getComputedStyle(c);
    const sec = c.parentElement;
    return {
      canvasOffset: [c.offsetWidth, c.offsetHeight],
      canvasAttr: [c.width, c.height],
      position: cs.position,
      inset: cs.inset,
      secSize: [sec.offsetWidth, sec.offsetHeight],
      secPosition: getComputedStyle(sec).position,
      cssHref: [...document.styleSheets].map((s) => s.href),
    };
  });
  console.log(JSON.stringify(info, null, 1));
  await b.close();
})();
