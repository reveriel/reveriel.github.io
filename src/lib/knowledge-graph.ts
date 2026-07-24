/**
 * Knowledge Graph — maps how concepts relate to each other.
 *
 * Each post has:
 *   prerequisites: concepts you should understand before reading
 *   concepts:      concepts this post teaches
 *
 * The graph is a DAG: prerequisites → concepts across all posts.
 * Supports locale filtering.
 */

import { getCollection, type CollectionEntry } from 'astro:content'

export interface ConceptNode {
  id: string
  label: string
  taughtIn: string[]       // post slugs that teach this concept
  prerequisites: string[]  // concept IDs this depends on
  dependents: string[]     // concept IDs that depend on this
}

export interface PostNode {
  slug: string
  title: string
  stage: number
  series?: string
  seriesOrder?: number
  concepts: string[]
  prerequisites: string[]
  url: string
  locale: string
}

export interface KnowledgeGraph {
  concepts: Map<string, ConceptNode>
  posts: PostNode[]
  edges: Array<{ from: string; to: string }>
  stages: Map<number, PostNode[]>
  series: Map<string, PostNode[]>
}

export async function buildGraph(locale?: string): Promise<KnowledgeGraph> {
  const allPosts = await getCollection('posts')
  const posts = allPosts
    .filter(p => !p.data.draft)
    .filter(p => !locale || (p.data.locale || 'zh-CN') === locale)

  function cleanSlug(id: string) {
    return id.replace(/\/index\.(mdx|md)$/, '').replace(/\.(mdx|md)$/, '')
  }

  const conceptMap = new Map<string, ConceptNode>()
  const postNodes: PostNode[] = []

  for (const post of posts) {
    const slug = cleanSlug(post.id)
    const postLocale = post.data.locale || 'zh-CN'
    const pn: PostNode = {
      slug,
      title: post.data.title,
      stage: post.data.stage,
      series: post.data.series,
      seriesOrder: post.data.seriesOrder,
      concepts: post.data.concepts,
      prerequisites: post.data.prerequisites,
      url: `${postLocale === 'en' ? '/en' : ''}/posts/${slug}`,
      locale: postLocale,
    }
    postNodes.push(pn)

    // Register concepts this post teaches
    for (const cid of post.data.concepts) {
      if (!conceptMap.has(cid)) {
        conceptMap.set(cid, {
          id: cid,
          label: cid,
          taughtIn: [],
          prerequisites: post.data.prerequisites,
          dependents: [],
        })
      }
      conceptMap.get(cid)!.taughtIn.push(slug)
    }
  }

  // Link dependents: who needs me?
  for (const [cid, node] of conceptMap) {
    for (const [cid2, node2] of conceptMap) {
      if (cid2 === cid) continue
      if (node2.prerequisites.includes(cid)) {
        node.dependents.push(cid2)
      }
    }
  }

  // Build edges
  const edges: Array<{ from: string; to: string }> = []
  for (const post of postNodes) {
    for (const prereq of post.prerequisites) {
      const teacher = postNodes.find(p => p.concepts.includes(prereq))
      edges.push({
        from: teacher?.slug || `unknown:${prereq}`,
        to: post.slug,
      })
    }
  }

  // Group by stage
  const stages = new Map<number, PostNode[]>()
  for (const p of postNodes) {
    const arr = stages.get(p.stage) || []
    arr.push(p)
    stages.set(p.stage, arr)
  }

  // Group by series
  const seriesMap = new Map<string, PostNode[]>()
  for (const p of postNodes) {
    if (p.series) {
      const arr = seriesMap.get(p.series) || []
      arr.push(p)
      seriesMap.set(p.series, arr)
    }
  }
  for (const [, arr] of seriesMap) {
    arr.sort((a, b) => (a.seriesOrder ?? 99) - (b.seriesOrder ?? 99))
  }

  return { concepts: conceptMap, posts: postNodes, edges, stages, series: seriesMap }
}
