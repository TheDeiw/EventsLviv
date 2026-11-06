import type { APIRoute } from "astro";
import { content, href } from "../lib/site";
import { LOCALES, type Lang } from "../i18n/ui";

// One <url> per page per language; each lists every language version of itself (hreflang), as Google expects.
const uk = content("uk");
const PAGES = ["", "events/", "organizations/", ...uk.events.map((e) => `events/${e.id}/`), ...uk.organizations.map((o) => `organizations/${o.id}/`)];

export const GET: APIRoute = ({ site }) => {
  const abs = (lang: Lang, p: string) => new URL(href(lang, p), site).href;
  const urls = PAGES.flatMap((p) =>
    LOCALES.map((l) => {
      const alternates = [...LOCALES.map((a) => ({ hreflang: a, url: abs(a, p) })), { hreflang: "x-default", url: abs("uk", p) }];
      return `<url><loc>${abs(l, p)}</loc>${alternates.map((a) => `<xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.url}"/>`).join("")}</url>`;
    }),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
