/* Link check: every internal link on every route, plus every external URL. */
const { chromium } = require("playwright-core");
const BASE = process.env.KD_BASE || "http://127.0.0.1:3005";
const ROUTES = ["/", "/download", "/guide", "/about", "/contact", "/privacy", "/terms", "/cookies"];

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  let failures = 0;

  const fail = (message) => {
    failures += 1;
    console.log(`FAIL ${message}`);
  };

  try {
    const page = await browser.newPage();
    const internal = new Map();
    const external = new Set();

    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      const links = await page.evaluate(() =>
        [...document.querySelectorAll("a[href]")].map((a) => ({
          href: a.getAttribute("href"),
          abs: a.href,
          text: (a.textContent || "").trim().slice(0, 40),
        }))
      );
      for (const l of links) {
        if (!l.href || l.href.startsWith("#") || l.href.startsWith("mailto:")) continue;
        if (l.abs.startsWith(BASE)) {
          const path = l.abs.replace(BASE, "") || "/";
          if (!internal.has(path)) internal.set(path, new Set());
          internal.get(path).add(`${route} -> "${l.text}"`);
        } else {
          external.add(l.abs);
        }
      }
    }

    console.log("=== INTERNAL LINKS ===");
    for (const [path, sources] of internal) {
      // A path with a fragment is the same document, so page.goto would abort.
      // Load the bare path and then check the fragment target exists.
      const bare = path.split("#")[0] || "/";
      const res = await page.goto(BASE + bare, { waitUntil: "domcontentloaded" }).catch(() => null);
      const status = res ? res.status() : "ERR";
      if (path.includes("#")) {
        const frag = path.split("#")[1];
        const found = await page.evaluate((f) => !!document.getElementById(f), frag);
        if (!found) fail(`${status} ${path}   [${[...sources].join(" | ")}] (missing fragment)`);
        else console.log(`ok   ${status} ${path}   [${[...sources].join(" | ")}]`);
      } else {
        const ok = status === 200 || status === 304;
        if (!ok) fail(`${status} ${path}   [${[...sources].join(" | ")}]`);
        else console.log(`ok   ${status} ${path}   [${[...sources].join(" | ")}]`);
      }
    }

    console.log("\n=== EXTERNAL LINKS ===");
    for (const url of external) {
      try {
        let res = await fetch(url, { method: "HEAD", redirect: "follow" });
        // Some hosts reject HEAD but answer GET normally.
        if (res.status === 405 || res.status === 501) {
          res = await fetch(url, { method: "GET", redirect: "follow" });
        }
        if (res.ok) console.log(`ok   ${res.status} ${url}`);
        else fail(`${res.status} ${url}`);
      } catch (e) {
        fail(`ERR  ${url}  (${e.message})`);
      }
    }
  } finally {
    await browser.close();
  }

  if (failures) {
    console.log(`\n${failures} link check failure(s).`);
    process.exitCode = 1;
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
