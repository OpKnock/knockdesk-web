const sharp = require("sharp");
const path = require("path");

const SHOTS = path.join(__dirname, "..", "public", "shots");
const OUT = "C:/Users/wagde/AppData/Local/Temp/opencode";

function gridSvg(w, h) {
  const lines = [];
  for (let p = 0; p <= 100; p += 5) {
    const x = Math.round((p / 100) * w);
    const y = Math.round((p / 100) * h);
    const major = p % 10 === 0;
    lines.push(
      `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${major ? "#00ff00" : "#00ff0055"}" stroke-width="1"/>`,
      `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${major ? "#00ff00" : "#00ff0055"}" stroke-width="1"/>`,
    );
    if (major) {
      lines.push(`<text x="${x + 3}" y="16" fill="#00ff00" font-size="13" font-family="monospace">${p}</text>`);
      lines.push(`<text x="3" y="${y - 3}" fill="#ff00ff" font-size="13" font-family="monospace">${p}</text>`);
    }
  }
  return Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${lines.join("")}</svg>`,
  );
}

(async () => {
  for (const f of ["world-monitor", "voice-assistant"]) {
    const src = path.join(SHOTS, `${f}.webp`);
    const img = sharp(src);
    const { width, height } = await img.metadata();
    const g = await gridSvg(width, height);
    await sharp(src).composite([{ input: g, blend: "over" }]).png().toFile(path.join(OUT, `grid-${f}.png`));
    console.log(`${f}: ${width}x${height} -> grid-${f}.png`);
  }
})();
