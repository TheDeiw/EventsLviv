import type { APIRoute } from "astro";

// Everything is open to search engines and AI crawlers; the sitemap address comes from `site` in astro.config.mjs.
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL("sitemap.xml", site).href}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
