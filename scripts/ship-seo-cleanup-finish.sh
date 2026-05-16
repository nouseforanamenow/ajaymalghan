#!/usr/bin/env bash
# Finish the SEO cleanup commits: stages the remaining edited files and
# commits them with the brief's messages, then pushes.
#
# Run from the repo root:
#   bash scripts/ship-seo-cleanup-finish.sh

set -euo pipefail

cd "$(dirname "$0")/.."
BRANCH="$(git symbolic-ref --short HEAD)"

commit_group () {
  local message="$1"; shift
  local any=0
  # Stage each requested path that actually exists.
  for f in "$@"; do
    if [ -e "$f" ]; then
      git add -- "$f"
      any=1
    fi
  done
  # If nothing was staged for these paths and the index is otherwise clean,
  # there's nothing to do.
  if [ "$any" -eq 0 ]; then
    echo "  skip (no files): $message"
    return 0
  fi
  if git diff --cached --quiet; then
    echo "  skip (no changes staged): $message"
    return 0
  fi
  git commit -m "$message"
}

echo "--- Workstream 3: sitemap config ---"
commit_group "Configure sitemap: lastmod on all URLs, drop priority/changefreq" \
  astro.config.mjs

echo
echo "--- Workstream 4: JSON-LD ---"
commit_group "Add JSON-LD Person and VisualArtwork schema" \
  src/lib/schema.js \
  "src/pages/photography/cameraless/[slug].astro" \
  "src/pages/photography/film/[slug].astro" \
  "src/pages/photography/light/[slug].astro" \
  "src/pages/photography/documentary/[slug].astro" \
  "src/pages/painting/[slug].astro"

echo
echo "--- Workstream 5: meta cleanup ---"
commit_group "Remove meta-keywords, write section-specific descriptions" \
  src/layouts/Base.astro \
  src/pages/photography/index.astro \
  src/pages/photography/light/index.astro \
  src/pages/photography/cameraless/index.astro \
  src/pages/photography/film/index.astro \
  src/pages/photography/documentary/index.astro \
  src/pages/painting/index.astro \
  src/pages/music.astro

echo
echo "--- Workstream 2 cleanup: og-default.svg fallback in time-video ---"
commit_group "Point time-video cover at new og-default.jpg" \
  src/content/light/time-video.mdx

# Anything else dirty that we missed? Show it so you can decide.
echo
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Uncommitted changes still pending:"
  git status --short
else
  echo "Working tree clean."
fi

echo
echo "Pushing to origin/$BRANCH..."
git push origin "$BRANCH"

echo
echo "Done."
