import type { APIRoute } from "astro";
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import coverBg from "../../../data/cover-bg.json";
import { content, inSeason, SEASONS, type Event, type Season } from "../../lib/site";

// Share previews (og:image), 1200x630 JPG, made at build time from the covers in public/.
// Social networks handle JPG everywhere, WebP and SVG covers not always.
const W = 1200, H = 630;
const DARK = "#1c1c20";
const { events, organizations, topics } = content("uk");
const pub = (p: string) => fileURLToPath(new URL(`../../../public/${p}`, import.meta.url));
const bg = (p: string) => (coverBg as Record<string, { mat: string | null; logo?: boolean }>)[p] ?? { mat: null };

// one picture into a w x h box, whole and on its matte, the way the site shows covers (no crop); logos get room around
async function tile(path: string, w: number, h: number, mat?: string) {
  const c = bg(path);
  const pad = c.logo ? Math.round(Math.min(w, h) * 0.18) : 0;
  const img = await sharp(pub(path), { density: 300 }).resize(w - pad * 2, h - pad * 2, { fit: "inside" }).png().toBuffer();
  return sharp({ create: { width: w, height: h, channels: 3, background: mat ?? c.mat ?? DARK } }).composite([{ input: img }]).png().toBuffer();
}

// 3 x 2 grid of covers, photos first, for pages about many events
async function collage(list: Event[]) {
  const covers = [...list].sort((a, b) => Number(!!bg(a.cover).logo) - Number(!!bg(b.cover).logo)).slice(0, 6).map((e) => e.cover);
  const w = W / 3, h = H / 2;
  const parts = await Promise.all(covers.map(async (c, i) => ({ input: await tile(c, w, h), left: (i % 3) * w, top: Math.floor(i / 3) * h })));
  return sharp({ create: { width: W, height: H, channels: 3, background: DARK } }).composite(parts);
}

const jobs: Record<string, () => Promise<sharp.Sharp>> = {
  site: () => collage(events.filter((e) => ["it-arena", "lviv-bookforum", "street-food-so-good", "lviv-jazz-days", "rizdvianyi-yarmarok", "lviv-half-marathon"].includes(e.id))),
};
for (const e of events) jobs[`event-${e.id}`] = async () => sharp(await tile(e.cover, W, H, e.coverBg));
for (const o of organizations) jobs[`org-${o.id}`] = async () => sharp(await tile(o.logo, W, H));
for (const t of topics) jobs[`topic-${t.id}`] = () => collage(events.filter((e) => e.topics.includes(t.id)));
for (const s of Object.keys(SEASONS) as Season[]) jobs[`season-${s}`] = () => collage(events.filter((e) => inSeason(e, s)));

export const getStaticPaths = () => Object.keys(jobs).map((name) => ({ params: { name } }));

export const GET: APIRoute = async ({ params }) => {
  const img = await (await jobs[params.name!]()).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(img), { headers: { "Content-Type": "image/jpeg" } });
};
