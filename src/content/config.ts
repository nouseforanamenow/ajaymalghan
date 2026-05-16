import { defineCollection, z } from 'astro:content';

const seriesSchema = z.object({
  title: z.string(),
  year: z.string(),
  medium: z.string(),
  category: z.enum(['light', 'cameraless', 'film', 'documentary', 'painting']),
  process: z.string().optional(),
  description: z.string(),
  keywords: z.array(z.string()),
  ogImage: z.string().optional(),
  cover: z.string(),
  images: z.array(z.object({
    src: z.string(),
    alt: z.string(),
    title: z.string().optional(),
    year: z.string().optional(),
    medium: z.string().optional(),
    dimensions: z.string().optional(),
    caption: z.string().optional(),
  })),
  videos: z.array(z.object({
    src: z.string().optional(),
    vimeo: z.string().optional(),
    poster: z.string().optional(),
    alt: z.string(),
    title: z.string().optional(),
    year: z.string().optional(),
    medium: z.string().optional(),
    caption: z.string().optional(),
    aspectRatio: z.string().optional(),
  }).refine((v) => v.src || v.vimeo, {
    message: 'Each video must have either `src` or `vimeo`',
  })).optional(),
  order: z.number().optional(),
  draft: z.boolean().default(false),
});

export const collections = {
  light: defineCollection({ type: 'content', schema: seriesSchema }),
  cameraless: defineCollection({ type: 'content', schema: seriesSchema }),
  film: defineCollection({ type: 'content', schema: seriesSchema }),
  documentary: defineCollection({ type: 'content', schema: seriesSchema }),
  painting: defineCollection({ type: 'content', schema: seriesSchema }),
};
