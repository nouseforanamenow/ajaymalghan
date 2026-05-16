#!/usr/bin/env bash
# One-shot deploy for the SEO cleanup brief.
#   - Builds public/og-default.jpg (1200x630) from Urantia no. 13 via sharp
#   - Stages each workstream as its own commit with the brief's message
#   - Pushes to origin/<current branch>, which Vercel will auto-deploy
#
# Run from the repo root:
#   bash scripts/ship-seo-cleanup.sh
#
# Safe to re-run: each commit is skipped if it has nothing to commit.

set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
BRANCH="$(git symbolic-ref --short HEAD)"
echo "Repo:   $ROOT"
echo "Branch: $BRANCH"
echo

# 0. Ensure deps so `sharp` is available for the OG image build.
if [ ! -d node_modules/sharp ]; then
  echo "Installing dependencies (sharp is needed for the OG image)..."
  npm install
fi

# 1. Build the new 1200x630 OG default JPG.
echo "Building public/og-default.jpg from public/images/urantia/13.jpg..."
node scripts/build-og-default.mjs

# 2. Validate vercel.json before anything is committed.
echo "Validating vercel.json..."
node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))"
echo "  ok"

commit_if_dirty () {
  local message="$1"; shift
  local files=("$@")
  # Stage only files that exist and have changes.
  local staged=0
  for f in "${files[@]}"; do
    if [ -e "$f" ] && ! git diff --quiet -- "$f" 2>/dev/null || \
       [ -e "$f" ] && ! git diff --cached --quiet -- "$f" 2>/dev/null || \
       [ -e "$f" ] && [ -z "$(git ls-files -- "$f")" ]; then
      git add -- "$f"
      staged=1
    fi
  done
  # Also pick up anything already staged for these paths.
  if git diff --cached --quiet; then
    if [ "$staged" -eq 0 ]; then
      echo "  nothing to commit for: $message"
      return 0
    fi
  fi
  if git diff --cached --quiet; then
    echo "  nothing to commit for: $message"
    return 0
  fi
  git commit -m "$message"
}

# 3. Commit per workstream, in the order the brief specifies.

echo
echo "--- Workstream 1: redirects ---"
commit_if_dirty "Add 301 redirects for migration from Squarespace" \
  vercel.json

echo
echo "--- Workstream 2: OG image swap + dimensions ---"
commit_if_dirty "Swap OG default to JPG, add og:image dimensions" \
  public/og-default.jpg \
  scripts/build-og-default.mjs \
  src/layouts/Base.astro \
  src/content/light/time-video.mdx

echo
echo "--- Workstream 3: sitemap config ---"
commit_if_dirty "Configure sitemap: lastmod on all URLs, drop priority/changefreq" \
  astro.config.mjs

echo
echo "--- Workstream 4: JSON-LD ---"
commit_if_dirty "Add JSON-LD Person and VisualArtwork schema" \
  src/lib/schema.js \
  src/pages/photography/cameraless/\[slug\].astro \
  src/pages/photography/film/\[slug\].astro \
  src/pages/photography/light/\[slug\].astro \
  src/pages/photography/documentary/\[slug\].astro \
  src/pages/painting/\[slug\].astro

echo
echo "--- Workstream 5: meta cleanup ---"
commit_if_dirty "Remove meta-keywords, write section-specific descriptions" \
  src/pages/photography/index.astro \
  src/pages/photography/light/index.astro \
  src/pages/photography/cameraless/index.astro \
  src/pages/photography/film/index.astro \
  src/pages/photography/documentary/index.astro \
  src/pages/painting/index.astro \
  src/pages/music.astro

# 4. Push. Vercel handles the deploy from here.
echo
echo "Pushing to origin/$BRANCH..."
git push origin "$BRANCH"

echo
echo "Done. Verify the deploy at https://vercel.com — then run through the"
echo "brief's post-deploy checklist (redirect spot-checks, opengraph.xyz,"
echo "Rich Results test, GSC sitemap submission)."
