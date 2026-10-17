/* Final compliance pass: axe-core accessibility (contrast, labels, keyboard, aria) + typography + meta checks. */
const fs = require("fs");
const { chromium } = require("playwright");
const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const PAGES = ["/", "/download", "/privacy", "/terms", "/contact", "/cookies"];
const KEYS = [
  "color-contrast", "label", "aria-valid-attr", "aria-valid-attr-value",
  "button-name", "link-name", "duplicate-id", "html-has-lang", "image-alt",
];

(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  const problems = {};

  for (const route of PAGES) {
    await p.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
    await p.addScriptTag({ content: axeSource });
    /** @type {{violations: Array<{id: string, impact: string, nodes: number[]}>}} */
    const { violations } = await p.evaluate((selectors) => {
      // window.axe injected; run with selected rules
      // eslint-disable-next-line no-undef
      return axe.run(document, { runOnly: { type: "rule", values: selectors } });
    }, KEYS);

    const rel = violations
      .filter((v) => v.impact === "critical" || v.impact === "serious")
      .map((v) => `${v.id}(${v.nodes.length})`);
    if (rel.length) problems[route] = rel;

    // title duplication check
    const title = await p.title();
    const canonical = await p.evaluate(() =>
      document.querySelector('link[rel="canonical"]')?.href || "MISSING");
    const ogTags = await p.evaluate(() => ({
      title: !!document.querySelector('meta[property="og:title"]'),
      img: !!document.querySelector('meta[property="og:image"]'),
      desc: !!document.querySelector('meta[property="og:description"]'),
    }));

    console.log(
      `${route} | title="${title}" | canonical=${canonical} | og:title=${ogTags.title} og:image=${ogTags.img} og:desc=${ogTags.desc}`
    );
  }

  console.log("\naxe violations (critical/serious):", Object.keys(problems).length === 0 ? "NONE" : JSON.stringify(problems, null, 1));
  await b.close();
})();
