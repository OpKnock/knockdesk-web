const sharp = require("sharp");
const path = require("path");

const SHOTS = path.join(__dirname, "..", "public", "shots");

async function load(file) {
  const { data, info } = await sharp(path.join(SHOTS, file))
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
}
const lum = (d, i) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];

(async () => {
  // ---- world monitor: true globe disc -----------------------------------
  {
    const { data, w, h, ch } = await load("world-monitor.webp");
    const bg = [data[2 * ch], data[2 * ch + 1], data[2 * ch + 2]]; // top-left corner = space
    let minX = w, maxX = -1, minY = h, maxY = -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * ch;
        const d = Math.abs(data[i] - bg[0]) + Math.abs(data[i + 1] - bg[1]) + Math.abs(data[i + 2] - bg[2]);
        if (d > 26) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    const gw = maxX - minX + 1, gh = maxY - minY + 1;
    console.log(`globe disc: x ${minX}..${maxX} (w ${gw})  y ${minY}..${maxY} (h ${gh})  image ${w}x${h}`);
    console.log(`  -> left ${(minX / w * 100).toFixed(2)}%  top ${(minY / h * 100).toFixed(2)}%  width ${(gw / w * 100).toFixed(2)}%`);
    console.log(`  -> centre ${((minX + maxX) / 2 / w * 100).toFixed(2)}% , ${((minY + maxY) / 2 / h * 100).toFixed(2)}%  diameter(px) ${gw}`);
  }

  // ---- voice assistant: the orb, banded ---------------------------------
  {
    const { data, w, h, ch } = await load("voice-assistant.webp");
    const x0 = Math.floor(w * 0.55);
    const rows = [];
    for (let y = 55; y < 205; y++) {
      let c = 0, first = -1, last = -1;
      for (let x = x0; x < w; x++) {
        if (lum(data, (y * w + x) * ch) > 55) { c++; if (first < 0) first = x; last = x; }
      }
      if (c > 0) rows.push({ y, c, first, last });
    }
    const widest = rows.reduce((a, b) => (b.c > a.c ? b : a));
    console.log(`orb rows ${rows[0].y}..${rows[rows.length - 1].y}  widest row y=${widest.y} count=${widest.c} x ${widest.first}..${widest.last}`);
    console.log(`  -> orb centre ~ ${(((widest.first + widest.last) / 2) / w * 100).toFixed(2)}% , ${(widest.y / h * 100).toFixed(2)}%`);
    console.log(`  -> orb span ~ ${(((widest.last - widest.first) / w) * 100).toFixed(2)}% of width`);
  }
})();
