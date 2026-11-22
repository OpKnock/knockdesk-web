/*
 * Accessibility pass with axe-core.
 *
 * Run with the server already listening (npm run start).
 * Checks every route in both colour schemes and at mobile width, because a
 * contrast or focus regression often only shows up in one of those.
 */
const fs = require("node:fs");
const { chromium } = require("playwright-core");

const BASE = process.env.KD_BASE || "http://127.0.0.1:3005";
const ROUTES = ["/", "/download", "/guide", "/about", "/contact", "/privacy", "/terms", "/cookies"];
const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

// Let axe judge the whole rule set; this is a static site with no exotic widgets.
const RUN = { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } };

const worst = (impact) =>
  ({ critical: 0, serious: 1, moderate: 2, minor: 3 })[impact] ?? 4;

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const contexts = [
    { name: "light/desktop", opts: { viewport: { width: 1440, height: 900 }, colorScheme: "light" } },
    { name: "dark/desktop", opts: { viewport: { width: 1440, height: 900 }, colorScheme: "dark" } },
    { name: "light/mobile", opts: { viewport: { width: 390, height: 844 }, colorScheme: "light" } },
  ];

  const all = [];
  for (const c of contexts) {
    const ctx = await browser.newContext(c.opts);
    const page = await ctx.newPage();
    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      // Reveal everything so hidden-until-scrolled content is audited too.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(500);
      await page.addScriptTag({ content: axeSource });
      const res = await page.evaluate((run) => window.axe.run(document, run), RUN);
      for (const v of res.violations) {
        all.push({
          context: c.name,
          route,
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.length,
          sample: v.nodes[0] ? v.nodes[0].target.join(" ") : "",
          help: v.help,
        });
      }
    }
    await ctx.close();
  }
  await browser.close();

  if (!all.length) {
    console.log("axe: no WCAG A/AA violations across " + ROUTES.length + " routes x " + contexts.length + " contexts");
    process.exit(0);
  }

  all.sort((a, b) => worst(a.impact) - worst(b.impact));
  console.log("axe violations (" + all.length + "):\n");
  for (const v of all) {
    console.log(`[${(v.impact || "n/a").toUpperCase()}] ${v.id}  (${v.nodes} node${v.nodes === 1 ? "" : "s"})`);
    console.log(`   ${v.context} ${v.route}`);
    console.log(`   ${v.help}`);
    console.log(`   e.g. ${v.sample}\n`);
  }
  process.exit(1);
})();