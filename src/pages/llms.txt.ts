import type { APIRoute } from "astro";
import { content, href, when, SEASONS } from "../lib/site";

// llms.txt (llmstxt.org): a plain-text map of the site for AI assistants, built from the same data as the pages.
// English text with links to both languages, since that is what most models read best.
const en = content("en");

export const GET: APIRoute = ({ site }) => {
  const abs = (p: string) => new URL(p, site).href;
  const both = (p: string) => `${abs(href("en", p))} (Ukrainian: ${abs(href("uk", p))})`;
  const lines = [
    "# Events Lviv",
    "",
    "> A volunteer-run list of annual events in Lviv, Ukraine: festivals, forums, conferences, fairs and community initiatives, with who organizes them, roughly when they happen, where and whether entry is free. It has no exact dates or tickets; the Calendar page lists where to find those.",
    "",
    "The site is in Ukrainian (default, at the root) and English (under /en/).",
    "",
    "## Pages",
    "",
    `- [All events](${abs(href("en", "events/"))}): every event, filterable by topic, organizer, entry and season`,
    `- [Organizations](${abs(href("en", "organizations/"))}): the organizers and their events`,
    `- [Calendar](${abs(href("en", "calendar/"))}): listings and channels with exact dates and tickets`,
    "",
    "## Topics",
    "",
    ...en.topics.map((t) => `- [${t.name}](${abs(href("en", `topics/${t.id}/`))})`),
    "",
    "## Seasons",
    "",
    ...Object.keys(SEASONS).map((s) => `- [${s[0].toUpperCase() + s.slice(1)}](${abs(href("en", `seasons/${s}/`))})`),
    "",
    "## Events",
    "",
    ...en.events.map((e) => `- [${e.name}](${both(`events/${e.id}/`)}): ${when(e, "en")}${e.organizationId ? `, by ${en.orgName[e.organizationId]}` : ""}. ${e.description[0].split(/(?<=\.)\s/)[0]}`),
    "",
    "## Organizations",
    "",
    ...en.organizations.map((o) => `- [${o.name}](${both(`organizations/${o.id}/`)}): ${o.description[0].split(/(?<=\.)\s/)[0]}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
