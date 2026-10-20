const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = "C:\\Users\\wagde\\OneDrive\\Pictures\\Screenshots";
const OUT = path.join(__dirname, "..", "public", "shots");

const jobs = [
  { from: "Screenshot 2026-10-20 164103.png", to: "app-cyan.webp" },
  { from: "Screenshot 2026-10-20 164108.png", to: "app-emerald.webp" },
  { from: "Screenshot 2026-10-20 164116.png", to: "app-cyberpunk.webp" },
  { from: "Screenshot 2026-10-20 164120.png", to: "app-crimson.webp" },
  { from: "Screenshot 2026-10-20 164710.png", to: "agent-town.webp" },
  { from: "Screenshot 2026-10-20 164755.png", to: "voice-assistant.webp" },
  { from: "Screenshot 2026-10-20 164821.png", to: "world-monitor.webp" },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const j of jobs) {
    const src = path.join(SRC, j.from);
    const dest = path.join(OUT, j.to);
    const meta = await sharp(src).metadata();
    await sharp(src)
      .resize({ width: 1917, withoutEnlargement: true, fit: "inside" })
      .webp({ quality: 84, effort: 6 })
      .toFile(dest);
    const kb = (fs.statSync(dest).size / 1024).toFixed(0);
    console.log(
      `${j.to.padEnd(24)} ${meta.width}x${meta.height} -> ${kb} KB`,
    );
  }
})();
