/**
 * Generates schema.org JSON-LD for art works, series, and artist.
 * This is what gets Cameraless / Chromaskedasic searches to surface
 * this site instead of stock-photo aggregators.
 */

const ARTIST = {
  '@type': 'Person',
  '@id': 'https://www.ajaymalghan.com/#artist',
  name: 'Ajay Malghan',
  jobTitle: 'Artist',
  url: 'https://www.ajaymalghan.com',
  sameAs: [
    // Add Instagram, gallery, etc. when ready
  ],
  knowsAbout: [
    'Cameraless Photography',
    'Chromaskedasic Photography',
    'Abstract Photography',
    'Documentary Photography',
    'Painting',
  ],
};

export function artistSchema() {
  return ARTIST;
}

export function seriesSchema(s) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWorkSeries',
    '@id': `https://www.ajaymalghan.com/photography/${s.category}/${s.slug}#series`,
    name: s.title,
    description: s.description,
    dateCreated: s.year,
    creator: ARTIST,
    keywords: s.keywords.join(', '),
    image: s.cover,
    url: `https://www.ajaymalghan.com/photography/${s.category}/${s.slug}`,
    hasPart: s.images.map((img, i) => ({
      '@type': 'VisualArtwork',
      name: img.title || `${s.title}, plate ${i + 1}`,
      creator: ARTIST,
      image: img.src,
      artMedium: img.medium || s.medium,
      artworkSurface: img.medium || s.medium,
      dateCreated: img.year || s.year,
      width: img.dimensions || undefined,
      description: img.caption || img.alt,
    })),
  };
}

export function artworkSchema(img, series) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: img.title,
    creator: ARTIST,
    image: img.src,
    artMedium: img.medium || series.medium,
    dateCreated: img.year || series.year,
    description: img.caption || img.alt,
    isPartOf: {
      '@type': 'CreativeWorkSeries',
      name: series.title,
      url: `https://www.ajaymalghan.com/photography/${series.category}/${series.slug}`,
    },
  };
}
