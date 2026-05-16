/**
 * Generates schema.org JSON-LD for the artist, art works, and series.
 * This is what gets cameraless / chromaskedasic searches to surface this
 * site instead of stock-photo aggregators, and what feeds Google Knowledge
 * Panel and LLM citation.
 */

const SITE = 'https://www.ajaymalghan.com';

const ARTIST = {
  '@type': 'Person',
  '@id': `${SITE}/#artist`,
  name: 'Ajay Malghan',
  url: `${SITE}/`,
  image: `${SITE}/images/about/studio.jpg`,
  jobTitle: 'Artist',
  description:
    'Indian-American artist working in cameraless and chromaskedasic photography, abstract and documentary image-making, film, and painting.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Rockville',
    addressRegion: 'MD',
    addressCountry: 'US',
  },
  sameAs: [
    'https://www.instagram.com/ajaymalghan/',
    'https://ajaymalghan.bandcamp.com/',
  ],
  knowsAbout: [
    'Cameraless Photography',
    'Chromaskedasic Photography',
    'Abstract Photography',
    'Documentary Photography',
    'Painting',
  ],
};

/** Canonical URL for a series page, given category + slug. */
function seriesUrl(category, slug) {
  if (category === 'painting') return `${SITE}/painting/${slug}`;
  return `${SITE}/photography/${category}/${slug}`;
}

/** Resolve an asset path (e.g. /images/foo/cover.jpg) to an absolute URL. */
function absUrl(path) {
  if (!path) return undefined;
  if (/^https?:/i.test(path)) return path;
  return `${SITE}${path.startsWith('/') ? path : `/${path}`}`;
}

/** The full Person schema. Emitted via Base.astro on every page. */
export function artistSchema() {
  return { '@context': 'https://schema.org', ...ARTIST };
}

/** Alias — explicit name for the /about page. */
export function personSchema() {
  return artistSchema();
}

/**
 * Top-level VisualArtwork for a series page. Matches the SEO brief
 * template: name, creator, url, image, description, artMedium, dateCreated.
 */
export function visualArtworkSchema(data, slug) {
  const out = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: data.title,
    creator: {
      '@type': 'Person',
      name: ARTIST.name,
      url: `${SITE}/`,
    },
    url: seriesUrl(data.category, slug),
    image: absUrl(data.cover),
    description: data.description,
  };
  if (data.medium) out.artMedium = data.medium;
  if (data.year) out.dateCreated = data.year;
  return out;
}

/**
 * Rich CreativeWorkSeries — kept alongside VisualArtwork because it lists
 * every plate via hasPart, which is useful for image search.
 */
export function seriesSchema(s) {
  const url = seriesUrl(s.category, s.slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWorkSeries',
    '@id': `${url}#series`,
    name: s.title,
    description: s.description,
    dateCreated: s.year,
    creator: ARTIST,
    keywords: (s.keywords || []).join(', '),
    image: absUrl(s.cover),
    url,
    hasPart: (s.images || []).map((img, i) => ({
      '@type': 'VisualArtwork',
      name: img.title || `${s.title}, plate ${i + 1}`,
      creator: ARTIST,
      image: absUrl(img.src),
      artMedium: img.medium || s.medium,
      artworkSurface: img.medium || s.medium,
      dateCreated: img.year || s.year,
      width: img.dimensions || undefined,
      description: img.caption || img.alt,
    })),
  };
}

/** Single artwork schema, for use inside a series. */
export function artworkSchema(img, series) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: img.title,
    creator: ARTIST,
    image: absUrl(img.src),
    artMedium: img.medium || series.medium,
    dateCreated: img.year || series.year,
    description: img.caption || img.alt,
    isPartOf: {
      '@type': 'CreativeWorkSeries',
      name: series.title,
      url: seriesUrl(series.category, series.slug),
    },
  };
}
