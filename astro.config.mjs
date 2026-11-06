import { defineConfig } from "astro/config";

export default defineConfig({
  // production address; canonical, hreflang, sitemap.xml and robots.txt are built from it (change it when a custom domain is attached)
  site: "https://events-lviv.vercel.app",
  // Ukrainian at the root (/, /events/), English under /en/. Pages for both live in src/pages and src/pages/en.
  i18n: { locales: ["uk", "en"], defaultLocale: "uk", routing: { prefixDefaultLocale: false } },
});
