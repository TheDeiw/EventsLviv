import eventsUk from "../../data/events.json";
import organizationsUk from "../../data/organizations.json";
import topicsUk from "../../data/topics.json";
import eventsEn from "../../data/en/events.json";
import organizationsEn from "../../data/en/organizations.json";
import topicsEn from "../../data/en/topics.json";
import coverBg from "../../data/cover-bg.json";
import { DEFAULT_LANG, MON, type Lang, type Key, t } from "../i18n/ui";

// BASE_URL may or may not end with a slash depending on config
export const url = (p: string) => `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${p.replace(/^\//, "")}`;
// URL of a page in a language: Ukrainian lives at the root, English under /en/
export const href = (lang: Lang, p = "") => url(lang === DEFAULT_LANG ? p : `en/${p}`);

// Attributes for a .cover frame. The matte colour comes from data/cover-bg.json (npm run covers); `override` is an optional "coverBg" on the event.
export const coverAttrs = (path: string, override?: string) => {
  const c = (coverBg as Record<string, { mat: string | null; logo?: boolean }>)[path];
  return { class: c?.logo ? "cover logo" : "cover", style: `--mat:${override ?? c?.mat ?? "var(--neutral)"}` };
};

export type Event = (typeof eventsUk)[number] & { coverBg?: string };
type Link = { title: string; url: string; type: string };
type Org = (typeof organizationsUk)[number] & { spaces?: { name: string; logo: string }[] };

// data/en/*.json only holds the translated text, keyed by id; anything missing falls back to Ukrainian.
// links / spaces are lists of translated titles / names in the same order as in the base file.
const retitle = (links: Link[], titles?: string[]) => links.map((l, i) => ({ ...l, title: titles?.[i] ?? l.title }));
const cache = new Map<Lang, ReturnType<typeof build>>();

function build(lang: Lang) {
  const en = lang === "en";
  const ovE = (en ? eventsEn : {}) as Record<string, any>;
  const ovO = (en ? organizationsEn : {}) as Record<string, any>;
  const ovT = (en ? topicsEn : {}) as Record<string, string>;

  const events: Event[] = eventsUk.map((e) => ({ ...e, ...ovE[e.id], links: retitle(e.links, ovE[e.id]?.links) }));
  const organizations: Org[] = (organizationsUk as Org[]).map((o) => ({
    ...o,
    ...ovO[o.id],
    links: retitle(o.links, ovO[o.id]?.links),
    spaces: o.spaces?.map((s, i) => ({ ...s, name: ovO[o.id]?.spaces?.[i] ?? s.name })),
  }));
  const topics = topicsUk.map((x) => ({ ...x, name: ovT[x.id] ?? x.name }));
  return {
    events,
    organizations,
    topics,
    orgName: Object.fromEntries(organizations.map((o) => [o.id, o.name])) as Record<string, string>,
    topicById: Object.fromEntries(topics.map((x) => [x.id, x])),
    eventsOf: (orgId: string) => events.filter((e) => e.organizationId === orgId),
  };
}

// Events, organizations and topics with their text in the requested language
export const content = (lang: Lang) => cache.get(lang) ?? (cache.set(lang, build(lang)), cache.get(lang)!);

// "вер–жов", "бер–тра, вер–лис" / "Sep–Oct"; a run may wrap over the new year ("лис–лют")
export function when(e: { yearRound: boolean; months: number[] }, lang: Lang) {
  const T = t(lang);
  if (e.yearRound) return T("when.year");
  if (!e.months.length) return T("when.tbd");
  const names = MON[lang];
  const s = new Set(e.months);
  const runs: string[] = [];
  for (let m = 1; m <= 12; m++) {
    if (!s.has(m) || s.has(((m + 10) % 12) + 1)) continue;
    let n = m;
    while (s.has((n % 12) + 1)) n = (n % 12) + 1;
    runs.push(n === m ? names[m - 1] : `${names[m - 1]}–${names[n - 1]}`);
  }
  return runs.join(", ");
}

export const entryLabel = (lang: Lang, entry: string) => t(lang)(`entry.${entry}` as Key);
// brand names stay as they are, only "site" needs translating
export const linkLabel = (lang: Lang, type: string) =>
  type === "site" ? t(lang)("link.site") : ({ instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn", telegram: "Telegram", youtube: "YouTube" } as Record<string, string>)[type];
