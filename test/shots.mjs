/*
 * Screenshot capture.
 *
 * Uses viewport-sized captures taken section by section. A single full-page
 * capture is not trustworthy here: Chromium's captureBeyondViewport
 * re-composites the page from a stale surface, and the scroll-revealed
 * sections come out blank even though the DOM is correct. Viewport captures
 * reflect what a visitor actually sees.
 */
import { chromium } from "playwright-core";
import fs from "node:fs";

const base = "http://127.0.0.1:3005";
const out = "test/shots";
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });

const CAPTURES = [
  { name: "01-hero", route: "/", sel: ".kd-hero" },
  { name: "02-proof", route: "/", sel: ".kd-proof" },
  { name: "03-features", route: "/", sel: "#features" },
  { name: "04-safety", route: "/", sel: ".kd-safety" },
  { name: "05-more", route: "/", sel: ".kd-section-flush" },
  { name: "06-layers", route: "/", sel: "#layers" },
  { name: "07-steps", route: "/", sel: ".kd-steps" },
  { name: "08-faq", route: "/", sel: "#faq" },
  { name: "09-cta", route: "/", sel: ".kd-cta" },
  { name: "10-download", route: "/download", sel: "main" },
  { name: "11-guide", route: "/guide", sel: "main" },
  { name: "12-contact", route: "/contact", sel: "main" },
  { name: "13-404", route: "/nope", sel: "main" },
];

for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme });
  const page = await ctx.newPage();
  for (const c of CAPTURES) {
    if (scheme === "dark" && !["01-hero", "06-layers", "09-cta"].includes(c.name)) continue;
    await page.goto(base + c.route, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    // Walk the page so every reveal has fired before we frame the section.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 110));
      }
    });
    await page.waitForTimeout(900);
    await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (el) window.scrollTo(0, Math.max(0, el.getBoundingClientRect().top + window.scrollY - 24));
    }, c.sel);
    await page.waitForTimeout(800);
    const suffix = scheme === "dark" ? "-dark" : "";
    await page.screenshot({ path: `${out}/${c.name}${suffix}.png` });
    console.log("wrote", `${c.name}${suffix}.png`);
  }
  await ctx.close();
}

// Mobile
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "light" });
const mp = await mctx.newPage();
for (const c of [{ name: "m01-hero", sel: ".kd-hero" }, { name: "m02-features", sel: "#features" }, { name: "m03-layers", sel: "#layers" }]) {
  await mp.goto(base + "/", { waitUntil: "networkidle" });
  await mp.waitForTimeout(700);
  await mp.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 110));
    }
  });
  await mp.waitForTimeout(900);
  await mp.evaluate((s) => {
    const el = document.querySelector(s);
    if (el) window.scrollTo(0, Math.max(0, el.getBoundingClientRect().top + window.scrollY - 12));
  }, c.sel);
  await mp.waitForTimeout(700);
  await mp.screenshot({ path: `${out}/${c.name}.png` });
  console.log("wrote", `${c.name}.png`);
}
await mp.goto(base + "/", { waitUntil: "networkidle" });
await mp.click("button[aria-label='Open menu']");
await mp.waitForTimeout(500);
await mp.screenshot({ path: `${out}/m04-menu.png` });
console.log("wrote m04-menu.png");
await mctx.close();

await browser.close();