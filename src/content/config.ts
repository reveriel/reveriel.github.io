import { defineCollection, z } from 'astro:content'

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    locale: z.string().default('zh-CN'),   // 'zh-CN' | 'en'
    draft: z.boolean().default(false),
    stage: z.number().default(1),
    prerequisites: z.array(z.string()).default([]),
    concepts: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    summary: z.string().optional(),
  }),
})

export const collections = { posts }
