# ajaymalghan.com

Astro + MDX rebuild. Replaces Squarespace. Editorial monograph aesthetic, dark by default, image-first, content-collection-driven.

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to ./dist
npm run preview  # preview the production build
```

Deploy: drop `./dist` on Vercel, Netlify, or Cloudflare Pages. Free tier on any of them. Domain costs ~$12/yr. Total cost: domain only.

## Adding a new series

1. Drop optimized images into `public/images/<series-slug>/`.
2. Filenames matter for SEO. Use `malghan-<series>-<year>-<descriptor>.jpg`, not camera defaults like `IMG_1227.jpg`.
3. Create an MDX file in `src/content/abstract/` or `src/content/documentary/` (or `painting/`) with frontmatter:
   - `title`, `slug`, `year`, `medium`, `category`
   - `description` (used for meta description, 140–160 chars)
   - `keywords` (array — what someone would type to find this)
   - `cover` (path to lead image)
   - `images` (array of `{ src, alt, title, year, medium, dimensions, caption }`)
4. Write the artist statement below the frontmatter in MDX. Markdown works. Use `<SeriesIntro />` for the masthead.
5. `npm run build` regenerates sitemap, JSON-LD, and image-optimized routes automatically.

## SEO architecture

- **Per-page meta + OG + Twitter cards** via `src/layouts/Base.astro`.
- **JSON-LD** auto-generated per series via `src/lib/schema.js`:
  - `Person` schema for Ajay on every page
  - `CreativeWorkSeries` schema for each series
  - `VisualArtwork` schema for each plate
- **Sitemap** auto-built by `@astrojs/sitemap` (excludes drafts).
- **Image alt text** is structurally required by the content schema — you can't ship a series without it.
- **Filenames** of images become part of Google Images ranking — keep them descriptive.

## Niche keyword strategy (low-competition wins)

These are the searches where this site should rank top 3 within 3–6 months:

- "cameraless photography artist"
- "chromaskedasic photography"
- "chromaskedasic prints"
- "ajay malghan cameraless"
- "atom city photography series"
- "horizon abstract photography prints"

How to win them:
1. Each term gets a dedicated series page or paragraph with the term used naturally 2–4 times.
2. The `/cameraless` page becomes the canonical source on the technique — write 600+ words on history (Blyth, Birgit), process, materials, your specific approach.
3. Link internally from About → Cameraless and from each cameraless image caption to the technique page.
4. Submit to Google Search Console + Bing Webmaster Tools on launch.

## Stack

- Astro 4 (zero JS by default)
- MDX (artist statements with embedded components)
- Sharp (image optimization)
- @astrojs/sitemap (auto sitemap)
- No CSS framework — handwritten CSS variables + a tight design system

## File map

```
src/
  content/
    abstract/        # cameraless.mdx, atom-city.mdx, urantia.mdx, ...
    documentary/     # 12-days.mdx, time.mdx, ...
    painting/        # painting series
    config.ts        # content schema (enforces SEO fields)
  pages/
    index.astro                            # landing
    photography/
      index.astro                          # split: abstract / documentary
      abstract/
        index.astro                        # list of abstract series
        [slug].astro                       # any abstract series
      documentary/
        index.astro
        [slug].astro
    painting/index.astro
    about/index.astro
    contact.astro
  layouts/Base.astro                       # SEO + OG + JSON-LD
  components/
    Nav.astro                              # painting + photography dropdown
    Footer.astro
    SeriesIntro.astro                      # series masthead
    Plate.astro                            # individual artwork w/ gallery label
  lib/schema.js                            # JSON-LD generators
  styles/global.css                        # design system
public/
  images/                                  # series images
  robots.txt
```

## What's intentionally not here

- No Instagram embed. The site is the destination.
- No newsletter modal. The work is the offering.
- No carousels. One image per viewport on series pages — scroll-driven, like a book.
- No analytics by default (add Plausible or Vercel Analytics if you want — both privacy-friendly).
- No blog. If you want writing, add a `/journal` collection later in the same pattern.

## Cost

- Domain: ~$12/yr (already own ajaymalghan.com)
- Hosting: $0 on Vercel/Netlify/Cloudflare Pages free tier
- Total: ~$1/month

Squarespace Business plan: $276/yr. You save ~$264/yr, get faster pages, full design control, real SEO, and a site that actually feels like the work.
