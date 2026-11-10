// Picks the matte colour that sits around each cover, so every image can be shown whole (no crop, no blur).
// Run after adding or replacing images:  npm run covers   (sharp comes with Astro)
//   - transparent logo   -> pale tile for dark logos, dark tile for light ones, drawn with padding ("logo": true)
//   - plain white logo   -> also "mono": true, so in the light theme it turns dark on a pale tile, like the site logo
//   - flat edges         -> the edge colour, so a banner continues into the frame without a seam
//   - busy edges (photo) -> null, the page falls back to the neutral theme colour
// To override one event, set "coverBg": "#rrggbb" on it in data/events.json.
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const read = (name) => JSON.parse(readFileSync(new URL(`../data/${name}.json`, import.meta.url), "utf8"));
const paths = new Set();
for (const e of read("events")) paths.add(e.cover);
for (const o of read("organizations")) {
  paths.add(o.logo);
  for (const s of o.spaces ?? []) paths.add(s.logo);
}

const hex = (v) => "#" + v.map((x) => Math.round(x).toString(16).padStart(2, "0")).join("");
const LIGHT_TILE = "#efece6";
const DARK_TILE = "#1c1c20";
const out = {};

for (const path of [...paths].sort()) {
  const { data, info } = await sharp(fileURLToPath(new URL(`../public/${path}`, import.meta.url))).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const ring = Math.max(2, Math.floor(Math.min(w, h) / 40));
  let clear = 0, lumSum = 0, lumN = 0, tinted = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 250) clear++;
    if (data[i + 3] > 40) {
      lumSum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      lumN++;
      if (Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2]) > 24) tinted++;
    }
  }
  if (clear / (w * h) > 0.15) {
    const lum = lumN ? lumSum / lumN : 0;
    out[path] = { mat: lum < 100 ? LIGHT_TILE : DARK_TILE, logo: true, ...(lum > 235 && tinted / lumN < 0.01 && { mono: true }) };
    continue;
  }
  const edge = [];
  for (let y = 0; y < h; y++) {
    const band = y < ring || y >= h - ring;
    for (let x = 0; x < w; x++) {
      const p = (y * w + x) * 4;
      if ((band || x < ring || x >= w - ring) && data[p + 3] > 250) edge.push([data[p], data[p + 1], data[p + 2]]);
    }
  }
  const px = edge.length ? edge : [[0, 0, 0]];
  const mean = [0, 1, 2].map((c) => px.reduce((s, v) => s + v[c], 0) / px.length);
  const spread = [0, 1, 2].map((c) => Math.sqrt(px.reduce((s, v) => s + (v[c] - mean[c]) ** 2, 0) / px.length)).reduce((a, b) => a + b) / 3;
  out[path] = { mat: spread < 25 ? hex(mean) : null };
}

writeFileSync(new URL("../data/cover-bg.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");
const n = Object.values(out);
console.log(`${n.length} images: ${n.filter((c) => c.logo).length} logos (${n.filter((c) => c.mono).length} plain white), ${n.filter((c) => !c.logo && c.mat).length} matched to their edges, ${n.filter((c) => !c.logo && !c.mat).length} neutral`);
