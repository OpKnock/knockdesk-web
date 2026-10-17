const { chromium } = require("playwright");

const PAGES = ["/", "/download", "/privacy", "/terms", "/contact", "/cookies"];

(async () => {
  const b = await chromium.launch();
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  let total = 0;
  for (const route of PAGES) {
    await m.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
    const small = await m.evaluate(() => {
      const out = [];
      document.querySelectorAll("a, button, input, [role=button], summary").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height < 24 && r.height > 0) {
          out.push(`${el.tagName} h=${Math.round(r.height)} "${(el.textContent || "").trim().slice(0, 30)}"`);
        }
      });
      return out;
    });
    total += small.length;
    console.log(`${route}: ${small.length === 0 ? "OK (all targets >= 24px)" : JSON.stringify(small)}`);
  }
  console.log(total === 0 ? "PASS" : `total under-24px targets: ${total}`);
  await b.close();
})();
