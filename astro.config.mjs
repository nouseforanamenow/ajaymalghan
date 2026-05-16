import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.ajaymalghan.com',
  integrations: [
    mdx(),
    sitemap({
      // Drop <priority> and <changefreq> — Google ignores them.
      // Emit a build-time <lastmod> on every <url> so crawlers have a date.
      serialize(item) {
        delete item.priority;
        delete item.changefreq;
        if (!item.lastmod) item.lastmod = new Date().toISOString();
        return item;
      },
    }),
  ],
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
