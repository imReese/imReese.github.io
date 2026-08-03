import { contentByLocale } from '@/config/content'
import { type Locale } from '@/lib/language'

type LocalizedPageKey = 'home' | 'about' | 'projects' | 'blog'

const pageKeyByPath: Record<string, LocalizedPageKey> = {
  '/': 'home',
  '/about': 'about',
  '/projects': 'projects',
  '/blogs': 'blog',
}

export function getLocalizedPageMetadata(locale: Locale, pathname: string) {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'
  const pageKey = pageKeyByPath[normalizedPath]

  if (!pageKey) {
    return null
  }

  const content = contentByLocale[locale]
  const pageMetadata = content.pages.metadata[pageKey]
  const documentTitle =
    pageKey === 'home'
      ? pageMetadata.title
      : `${pageMetadata.title} - ${content.site.site.name}`

  return {
    ...pageMetadata,
    documentTitle,
    openGraphLocale: locale === 'zh' ? 'zh_CN' : 'en_US',
    siteName: content.site.site.name,
  }
}
