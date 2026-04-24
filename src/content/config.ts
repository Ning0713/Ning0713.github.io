import { defineCollection, z } from 'astro:content';

export const blogCategories = ['technical', 'life-and-talk', 'journal'] as const;

const baseSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  cover: z.string().optional(),
});

const blog = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    category: z.enum(blogCategories),
    collection: z.string().default('未分类'),
  }),
});

const academic = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    institution: z.string().optional(),
    period: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    status: z.enum(['active', 'archived', 'research']).default('active'),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  blog,
  academic,
  projects,
};
