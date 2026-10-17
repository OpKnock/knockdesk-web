const { chromium } = require("playwright");

(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext()).newPage();

  /** @type {Array<{type:string,size:number,resource:number,encoding:string}>} */
  const entries = [];
  const client = await p.context().newCDPSession(p);
  await client.send("Network.enable");
  client.on("Network.loadingFinished", (e) => {
    entries.push({ resource: e.encodedDataLength });
  });
  client.on("Network.responseReceived", (e) => {
    const r = e.response;
    entries.push({
      type: r.resourceType,
      size: r.encodedDataLength !== -1 ? r.encodedDataLength : 0,
      encoding: r.headers["content-encoding"] || "none",
    });
  });

  const t0 = Date.now();
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const loadMs = Date.now() - t0;

  const sum = (pred) => entries.filter(pred).reduce((a, x) => a + (x.resource || x.size || 0), 0);
  const js = sum((x) => x.type === "Script");
  const css = sum((x) => x.type === "Stylesheet");
  const font = sum((x) => x.type === "Font");
  const img = sum((x) => x.type === "Image");
  const doc = sum((x) => x.type === "Document");
  const other = entries.length ? sum((x) => !["Script", "Stylesheet", "Font", "Image", "Document"].includes(x.type)) : 0;
  const total = js + css + font + img + doc + other;

  console.log(JSON.stringify({
    loadMs,
    transferKB: {
      js: Math.round(js / 1024),
      css: Math.round(css / 1024),
      fonts: Math.round(font / 1024),
      images: Math.round(img / 1024),
      html: Math.round(doc / 1024),
      other: Math.round(other / 1024),
      total: Math.round(total / 1024),
    },
    requestCount: entries.length,
  }, null, 1));
  await b.close();
})();
