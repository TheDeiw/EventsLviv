import { defineConfig } from "astro/config";

export default defineConfig({
  // Ukrainian at the root (/, /events/), English under /en/. Pages for both live in src/pages and src/pages/en.
  i18n: { locales: ["uk", "en"], defaultLocale: "uk", routing: { prefixDefaultLocale: false } },
});
