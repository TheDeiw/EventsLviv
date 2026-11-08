// Refreshes the titles of website links in data/ from the pages themselves (og:title, else <title>).
// Runs weekly from .github/workflows/link-titles.yml; by hand: node scripts/refresh-link-titles.mjs [--dry]
// Only "site" links whose title is tied to one edition: a year, "#10", or dates like "4-5 жовтня". Those go stale every
// year; plain names ("DataArt", "Bookforum") don't, and a page's own <title> is usually a worse, longer SEO line.
// Instagram and Facebook are skipped: they block bots, and their titles are just the page names.
// The English title follows when the new title has no Cyrillic in it; otherwise the old English one stays and the log
// asks for a translation.
import { readFileSync, writeFileSync } from "node:fs";

const dry = process.argv.includes("--dry");
const path = (name) => new URL(`../data/${name}.json`, import.meta.url);
const read = (name) => JSON.parse(readFileSync(path(name), "utf8"));
const write = (name, data) => !dry && writeFileSync(path(name), JSON.stringify(data, null, 2) + "\n");

// pages that answer, but not with themselves: bot walls, logins, errors
const JUNK = /just a moment|attention required|access denied|forbidden|not found|page not found|сторінку не знайдено|^error|log ?in|sign ?in|captcha|^\d{3}\b/i;
const DATED = /\b20\d\d\b|#\s?\d+|\d{1,2}\s*[-–]\s*\d{1,2}\s+\p{L}+/u;
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", laquo: "«", raquo: "»", ndash: "–", mdash: "—", hellip: "…" };
const decode = (s) =>
  s.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (m, e) =>
    e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : (ENTITIES[e.toLowerCase()] ?? m),
  );

async function titleOf(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36", "Accept-Language": "uk,en;q=0.8" },
    });
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, 300_000);
    const og = html.match(/<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']*)["']/i) ?? html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*property=["']og:title["']/i);
    const raw = og?.[1] || html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || "";
    // "Дайс Кон 2026 | Головна" -> "Дайс Кон 2026"
    const title = decode(raw).replace(/\s+/g, " ").trim().replace(/\s*[|–—-]\s*(головна( сторінка)?|home( page)?|main page)$/i, "");
    return title && title.length <= 140 && !JUNK.test(title) ? title : null;
  } catch {
    return null; // timeouts, DNS, TLS: try again next week
  }
}

const sets = [
  { name: "events", en: read("en/events"), data: read("events") },
  { name: "organizations", en: read("en/organizations"), data: read("organizations") },
];
const jobs = sets.flatMap((s) => s.data.flatMap((item) => item.links.map((link, i) => ({ s, item, link, i })))).filter((j) => j.link.type === "site" && DATED.test(j.link.title));
const cache = new Map();
const fetchOnce = (url) => (cache.has(url) ? cache.get(url) : (cache.set(url, titleOf(url)), cache.get(url)));

// a few at a time, so no site sees a burst
let changed = 0, failed = 0;
for (let k = 0; k < jobs.length; k += 6) {
  await Promise.all(
    jobs.slice(k, k + 6).map(async ({ s, item, link, i }) => {
      const title = await fetchOnce(link.url);
      if (!title) return void failed++;
      if (title === link.title) return;
      const en = s.en[item.id]?.links;
      console.log(`${item.id}: "${link.title}" -> "${title}"`);
      if (en && !/\p{Script=Cyrillic}/u.test(title)) en[i] = title;
      else if (en) console.log(`  translate by hand in data/en/${s.name}.json: "${en[i]}"`);
      link.title = title;
      changed++;
    }),
  );
}
if (changed) for (const s of sets) write(s.name, s.data), write(`en/${s.name}`, s.en);
console.log(`${jobs.length} links checked, ${changed} titles updated, ${failed} pages did not answer${dry ? " (dry run, nothing written)" : ""}`);
