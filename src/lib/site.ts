import events from "../../data/events.json";
import organizations from "../../data/organizations.json";
import topics from "../../data/topics.json";

import coverBg from "../../data/cover-bg.json";

export { events, organizations, topics };

// BASE_URL may or may not end with a slash depending on config
export const url = (p: string) => `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${p.replace(/^\//, "")}`;

// Attributes for a .cover frame. The matte colour comes from data/cover-bg.json (npm run covers); `override` is an optional "coverBg" on the event.
export const coverAttrs = (path: string, override?: string) => {
  const c = (coverBg as Record<string, { mat: string | null; logo?: boolean }>)[path];
  return { class: c?.logo ? "cover logo" : "cover", style: `--mat:${override ?? c?.mat ?? "var(--neutral)"}` };
};

export const orgName: Record<string, string> = Object.fromEntries(organizations.map((o) => [o.id, o.name]));
export const topicById = Object.fromEntries(topics.map((t) => [t.id, t]));
export const ENTRY: Record<string, string> = { free: "Безкоштовно", paid: "Платно", mixed: "Залежить" };
export const LINK: Record<string, string> = { site: "Сайт", instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn", telegram: "Telegram", youtube: "YouTube" };
export const eventsOf = (orgId: string) => events.filter((e) => e.organizationId === orgId);
// 1 подія, 2–4 події, 5+ та 11–14 подій
export const eventsWord = (n: number) => (n % 100 > 10 && n % 100 < 15 ? "подій" : n % 10 === 1 ? "подія" : n % 10 > 1 && n % 10 < 5 ? "події" : "подій");
export const MON =["січ", "лют", "бер", "кві", "тра", "чер", "лип", "сер", "вер", "жов", "лис", "гру"];

// "вер–жов", "бер–тра, вер–лис"; a run may wrap over the new year ("лис–лют")
export function when(e: { yearRound: boolean; months: number[] }) {
  if (e.yearRound) return "протягом року";
  if (!e.months.length) return "дата уточнюється";
  const s = new Set(e.months);
  const runs: string[] = [];
  for (let m = 1; m <= 12; m++) {
    if (!s.has(m) || s.has(((m + 10) % 12) + 1)) continue;
    let n = m;
    while (s.has((n % 12) + 1)) n = (n % 12) + 1;
    runs.push(n === m ? MON[m - 1] : `${MON[m - 1]}–${MON[n - 1]}`);
  }
  return runs.join(", ");
}
