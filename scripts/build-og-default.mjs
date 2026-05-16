/**
 * Build /public/og-default.jpg — the 1200x630 fallback Open Graph image.
 *
 * Source: Urantia no. 13, the homepage hero. Cropped to a 1200x630 frame
 * (cover fit, centered) so it matches what Facebook, LinkedIn, iMessage,
 * Slack, and X want.
 *
 * Run with:  node scripts/build-og-default.mjs
 * Requires:  sharp (already in dependencies)
 */

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const SOURCE = resolve(repoRoot, 'public/images/urantia/13.jpg');
const OUT = resolve(repoRoot, 'public/og-default.jpg');

const W = 1200;
const H = 630;

await mkdir(dirname(OUT), { recursive: true });

await sharp(SOURCE)
  .resize(W, H, {
    fit: 'cover',
    position: 'attention',
  })
  .jpeg({ quality: 86, progressive: true, mozjpeg: true })
  .toFile(OUT);

console.log(`Wrote ${OUT} at ${W}x${H}`);
