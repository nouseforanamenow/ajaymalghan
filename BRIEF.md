# Brief for Claude Code: build & deploy ajaymalghan.com

You are picking up a working Astro scaffold and taking it to production at https://www.ajaymalghan.com. Read this entire document before doing anything. Work through the phases in order. **Stop and confirm with me at each checkpoint marked ⏸.**

---

## Context

I'm Ajay Malghan. I'm replacing my Squarespace site with this Astro build. The scaffold is already structured, content collections are wired, SEO schema generators exist. Your job is to make it production-ready and deploy it.

- Current site (the one being replaced): https://www.ajaymalghan.com
- Domain: I own `ajaymalghan.com` and will switch DNS to point at the new host
- Host target: **Vercel** (free tier, GitHub integration)
- Repo: needs to be created at `github.com/<my-username>/ajaymalghan` — private to start

---

## What's already done (don't redo)

- 25-page Astro 4 + MDX site
- Content collections: `abstract`, `cameraless`, `film`, `documentary`, `painting`
- Nav with Photography (4 subcategories) / Painting / Music / About
- All 13 series have MDX placeholder files with frontmatter and `Statement to be added`
- SEO: per-page meta, OG tags (no Twitter), Person + CreativeWorkSeries + VisualArtwork JSON-LD, sitemap, canonical URLs
- About page has real bio in first person with all publications and collections, contact at bottom (ajaymalghan@gmail.com)
- Time / Video series with VideoPlate component for 9:16 vertical video clips

**Do not** redesign the aesthetic. Light theme, photo-first, Cormorant Garamond display, system sans body. That's set.

---

## Phase 1 — Sanity check (10 min)

```bash
npm install
npm run build
```

Expected: clean build, 25 pages, sitemap generated. If anything errors, fix it before continuing.

Then:

```bash
npm run dev
```

Open http://localhost:4321 in a browser. Walk through every page in the nav. Note anything broken (404s, layout breaks, missing components).

**⏸ Checkpoint 1:** report what you saw. If build is clean and pages render (even with gradient placeholders where images go), proceed.

---

## Phase 2 — Add the Bandcamp embed

I will paste the Bandcamp slim-embed iframe code here when you get to this step. Find the placeholder in `src/pages/music.astro`:

```html
<iframe ... src="https://bandcamp.com/EmbeddedPlayer/album=/..."
```

Replace the entire iframe element with the code I provide. Preserve the surrounding `<div class="music__embed">` and the existing `loading="lazy"` attribute. Rebuild and verify the player loads at /music.

**⏸ Checkpoint 2:** ask me for the embed code.

---

## Phase 3 — Polish before deploy

Do these in order. Don't skip any.

### 3.1 Image fallbacks

Every series MDX references images like `/images/atom-city/horizons-27.jpg` that don't exist yet (Ajay hasn't labeled and exported from Bridge). The site currently shows broken images on series pages.

Add a graceful fallback: in `src/components/Plate.astro`, add an `onerror` handler to the `<img>` tag that swaps to a CSS gradient placeholder of the same aspect ratio. The series page should still feel intentional even with no real images yet.

Implementation: replace the `<img>` with a wrapper div that has both the image and a fallback layer, hide the fallback when the image loads, show it on error. Use the same gradient family used in `src/pages/index.astro` so it's visually consistent with the home grid.

### 3.2 Real cover gradients on series index pages

The series listing pages (`/photography/abstract`, `/photography/cameraless`, etc.) currently show text only. Add small (60×75px) gradient thumbnails to the left of each series title in the list, using the same per-series gradients from the home grid. This gives the listing pages visual weight even before real images exist.

### 3.3 404 page

The current 404 is generic. Make it specifically Ajay's:

- A short, dry one-liner. Suggestion: *"That work isn't here. Try the index."*
- A single small CSS-gradient tile (like the home grid uses), not centered — placed asymmetrically
- A link back to `/`

Keep it under 50 lines.

### 3.4 robots.txt

Verify `public/robots.txt` exists, allows all, and references the sitemap URL `https://www.ajaymalghan.com/sitemap-index.xml`. If not, create it.

### 3.5 Favicon

Replace any default Astro favicon with a simple monogram. Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#ffffff"/>
  <text x="16" y="22" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif"
        font-size="20" font-weight="500" fill="#111111">am</text>
</svg>
```

### 3.6 OG default image

Create `public/og-default.jpg` — a 1200×630 image with the wordmark "Ajay Malghan" in serif on a warm cream background. If you can't generate an image, create a 1200×630 SVG saved as `public/og-default.svg` and update the Base layout's `ogImage` default from `/og-default.jpg` to `/og-default.svg`.

### 3.7 Build

```bash
npm run build
```

Should still produce 25 pages cleanly. Sitemap should list every series.

**⏸ Checkpoint 3:** show me what changed. I'll spot-check before we push.

---

## Phase 4 — GitHub

```bash
git init
git add .
git commit -m "Initial commit: Astro rebuild of ajaymalghan.com"
```

Then create a private GitHub repo via `gh` CLI:

```bash
gh auth status         # verify I'm logged in; if not, run: gh auth login
gh repo create ajaymalghan --private --source=. --remote=origin --push
```

If `gh` isn't installed, walk me through installing it (`brew install gh` on macOS) instead of falling back to the web UI.

**⏸ Checkpoint 4:** confirm the repo is up at github.com/<my-username>/ajaymalghan.

---

## Phase 5 — Vercel deploy

```bash
npm install -g vercel
vercel login          # uses GitHub auth
vercel link           # link the local repo to a new Vercel project
vercel --prod         # first production deploy
```

When prompted:
- Project name: `ajaymalghan`
- Framework preset: Astro (Vercel should auto-detect)
- Build command: `npm run build` (default)
- Output directory: `dist` (default)
- Override settings: no

Vercel will return a preview URL like `ajaymalghan-xxx.vercel.app`. Verify the site loads there. Walk through the nav, click into a series page, test the Music embed.

**⏸ Checkpoint 5:** report the preview URL. We test before pointing DNS.

---

## Phase 6 — DNS / custom domain

On the Vercel dashboard:

1. Go to the project → Settings → Domains
2. Add `ajaymalghan.com` and `www.ajaymalghan.com`
3. Vercel will show two DNS records I need to add at my registrar:
   - An A record for the apex (`ajaymalghan.com → 76.76.21.21`)
   - A CNAME for www (`www → cname.vercel-dns.com`)

Print these instructions cleanly for me. I'll go log in to my registrar (it's currently with Squarespace — they're the registrar AND the old host) and add the records. **Tell me when to do this.**

Once DNS records are added, Vercel auto-provisions an SSL cert. Usually takes 5–30 minutes.

**⏸ Checkpoint 6:** wait for me to confirm DNS is configured, then verify https://www.ajaymalghan.com resolves to the new site.

---

## Phase 7 — Post-launch verification

Once the domain resolves:

1. **Lighthouse audit:** run on the home page and one series page. Targets: Performance 95+, Accessibility 95+, Best Practices 100, SEO 100. Report scores.
2. **JSON-LD validation:** use Google's Rich Results test (https://search.google.com/test/rich-results) on:
   - The home page
   - `/photography/cameraless/atom-city`
   - `/about`
   Confirm Person and CreativeWorkSeries schemas are detected with zero errors.
3. **Mobile check:** verify the hamburger menu opens on mobile, dropdowns are reachable, video player works on iOS Safari.
4. **Sitemap submission:** print the steps for me to submit `https://www.ajaymalghan.com/sitemap-index.xml` to:
   - Google Search Console
   - Bing Webmaster Tools
5. **301 redirects from old Squarespace URLs:** because old links (NPR, Vice, Wired articles) point at specific Squarespace paths, set up redirects in `vercel.json` for at least the most-linked old URLs. Ask me which old paths exist; if I don't know, run a quick `wget --spider` or check Squarespace's analytics for top traffic URLs. Common ones to plan for:
   - `/work` → `/photography`
   - `/bio` → `/about`
   - any `/work/<series-name>` → the matching new URL

**⏸ Checkpoint 7:** post results. We're done when all four checks pass.

---

## What NOT to do in this session

- Don't redesign anything. The design is set.
- Don't add a CMS, analytics, or comment system. We launch without.
- Don't try to fill in series statements or alt text — that's Ajay's job, in Bridge.
- Don't add a blog, newsletter, or commerce. Out of scope for v1.
- Don't change the URL structure or content collection schema without asking.

---

## Tone / interaction

- Be direct. Don't pad with "Great question!" or "I'll be happy to help."
- Walk through phases in order. Don't jump ahead.
- At each checkpoint, **wait** for my confirmation before moving on.
- When showing code changes, show diffs not whole files.
- If you hit something ambiguous, ask one specific question rather than guessing.
- I don't drink alcohol — keep tone neutral on that front, no "let's grab a beer to celebrate" jokes.

---

## Reference docs (read if needed)

- `README.md` in this folder — covers the architecture and content schema
- `src/content/config.ts` — the schema enforced on every series
- `src/lib/schema.js` — JSON-LD generators
- `src/styles/global.css` — the design system

Now: start with Phase 1.
