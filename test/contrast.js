const fs = require("fs");
const { chromium } = require("playwright");
const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();

  for (const route of ["/", "/download", "/contact", "/privacy"]) {
    await p.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
    await p.addScriptTag({ content: axeSource });
    const out = await p.evaluate(() =>
      // eslint-disable-next-line no-undef
      axe.run(document, { runOnly: { type: "rule", values: ["color-contrast"] } }).then((r) =>
        r.violations.flatMap((v) =>
          v.nodes.map((n) => {
            const el = document.querySelector(n.target[0]);
            const cs = el ? getComputedStyle(el) : null;
            return {
              sel: n.target.join(" "),
              color: cs ? cs.color : "?",
              bg: cs ? cs.backgroundColor : "?",
              fontSize: cs ? cs.fontSize : "?",
              weight: cs ? cs.fontWeight : "?",
              html: (el ? el.outerHTML : n.html).slice(0, 90),
            };
          })
        )
      )
    );
    console.log(`=== ${route} ===`);
    out.forEach((o) =>
      console.log(
        `${o.sel} | color:${o.color} size:${o.fontSize}/${o.weight} | ${o.html.replace(/\s+/g, " ")}`
      )
    );
  }
  await b.close();
})();
