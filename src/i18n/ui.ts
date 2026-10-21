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
