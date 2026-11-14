import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { existsSync, statSync } from 'node:fs';
import { resolve, basename } from 'node:path';

const text = z.string().trim().min(1);
const https = z.url().refine((url) => new URL(url).protocol === 'https:', 'Use an HTTPS URL');
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}, 'Use a valid YYYY-MM-DD calendar date');

const projects = defineCollection({
  loader: glob({
    pattern: '*.json', base: './src/content/projects',
    generateId: ({ entry, data }) => {
      const id = basename(entry, '.json');
      if (data.id !== id) throw new Error(`Project id must match filename: ${entry}`);
      return id;
    },
  }),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: text, summary: text,
    category: z.enum(['AI / ML', 'Web Development', 'Game', 'Research', 'Other']),
    tags: z.array(text).min(1).max(8).refine((tags) => new Set(tags.map((tag) => tag.toLowerCase())).size === tags.length, 'Tags must be distinct'),
    date, status: z.enum(['completed', 'in-progress', 'archived']), featured: z.boolean(),
    coverImage: text, coverAlt: text, overview: text, features: z.array(text).min(1), implementation: text, results: text,
    links: z.object({ github: https.nullish(), demo: https.nullish() }).strict().refine((links) => Boolean(links.github || links.demo), 'At least one verified working public URL is required'),
    gallery: z.array(z.object({ image: text, alt: text, caption: text.optional() }).strict()).optional(),
  }).strict().superRefine((project, ctx) => {
    const images = [{ path: ['coverImage'], image: project.coverImage }, ...(project.gallery ?? []).map((item, index) => ({ path: ['gallery', index, 'image'], image: item.image }))];
    for (const item of images) {
      const prefix = `/images/projects/${project.id}/`;
      const file = resolve('public', `.${item.image}`);
      if (!item.image.startsWith(prefix) || item.image.split('/').some((part) => part === '..' || part === '.') || /[\\?#%]/.test(item.image) || !existsSync(file) || !statSync(file).isFile()) {
        ctx.addIssue({ code: 'custom', path: item.path, message: `Image must be an existing file under ${prefix}` });
      }
    }
  }),
});
export const collections = { projects };
