/**
 * UI string translations.
 *
 * Usage:
 *   import { t } from '@i18n/ui'
 *   const strings = t(Astro.currentLocale)
 *   strings.nav.posts  →  文章 (zh-CN) / Posts (en)
 */

type Locale = 'zh-CN' | 'en'

interface UIStrings {
  site: {
    name: string
    tagline: string
    description: string
  }
  nav: {
    posts: string
    graph: string
  }
  footer: {
    motto: string
  }
  home: {
    heading: string
    tagline: string
    empty: string
  }
  posts: {
    heading: string
  }
  graph: {
    heading: string
    description: string
    seriesHint: string
    seriesReadOrder: string
    prerequisite: string
    stageView: string
    empty: string
  }
  post: {
    prerequisite: string
    concepts: string
  }
  lang: {
    label: string
    zhCN: string
    en: string
  }
}

const dict: Record<Locale, UIStrings> = {
  'zh-CN': {
    site: {
      name: 'Reveriel',
      tagline: 'Interactive Knowledge',
      description: '知识是游戏，阅读是游玩。比书更好。',
    },
    nav: {
      posts: '文章',
      graph: '知识图谱',
    },
    footer: {
      motto: '知识是游戏，阅读是游玩。',
    },
    home: {
      heading: 'Reveriel · Interactive Knowledge',
      tagline: '知识是游戏，阅读是游玩。比书更好。',
      empty: '还没有文章。',
    },
    posts: {
      heading: '文章',
    },
    graph: {
      heading: '知识图谱',
      description: '每篇文章教给你一些概念，每个概念都有前置依赖。选择一个系列查看线性阅读顺序，或按 Stage 查看递进难度。',
      seriesHint: '',
      seriesReadOrder: '本系列按推荐阅读顺序排列。',
      prerequisite: '前置',
      stageView: '📊 按 Stage',
      empty: '还没有文章，所以图谱是空的。',
    },
    post: {
      prerequisite: '前置知识',
      concepts: '本文概念',
    },
    lang: {
      label: '语言',
      zhCN: '中文',
      en: 'English',
    },
  },

  en: {
    site: {
      name: 'Reveriel',
      tagline: 'Interactive Knowledge',
      description: 'Knowledge is play. Reading is gameplay. Better than a book.',
    },
    nav: {
      posts: 'Posts',
      graph: 'Graph',
    },
    footer: {
      motto: 'Knowledge is play. Reading is gameplay.',
    },
    home: {
      heading: 'Reveriel · Interactive Knowledge',
      tagline: 'Knowledge is play. Reading is gameplay. Better than a book.',
      empty: 'No posts yet.',
    },
    posts: {
      heading: 'Posts',
    },
    graph: {
      heading: 'Knowledge Graph',
      description: 'Every post teaches concepts. Every concept has prerequisites. Pick a series to read in order, or browse by Stage.',
      seriesHint: '',
      seriesReadOrder: 'Read in this order:',
      prerequisite: 'Prerequisites',
      stageView: '📊 By Stage',
      empty: 'No posts yet — the graph is empty.',
    },
    post: {
      prerequisite: 'Prerequisites',
      concepts: 'Concepts',
    },
    lang: {
      label: 'Language',
      zhCN: '中文',
      en: 'English',
    },
  },
}

/** Get UI strings for a locale. Falls back to zh-CN. */
export function t(locale?: string): UIStrings {
  return dict[locale as Locale] || dict['zh-CN']
}

export type { Locale, UIStrings }
