import { type Metadata } from 'next'

export const SITE_URL = 'https://imreese.github.io'

export const DEFAULT_SOCIAL_IMAGE_PATH = '/social-card.png'
export const RSS_PATH = '/rss.xml'
export const RSS_TITLE = "Reese's Blog"

export function absoluteUrl(pathname: string) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${SITE_URL}${path}`
}

type PageMetadataInput = {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  language?: 'en' | 'zh-CN'
  publishedTime?: string
  authors?: string[]
  absoluteTitle?: boolean
}

export function createPageMetadata({
  title,
  description,
  path,
  type = 'website',
  language = 'en',
  publishedTime,
  authors,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path)
  const image = absoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH)

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type,
      siteName: 'Reese',
      locale: language === 'zh-CN' ? 'zh_CN' : 'en_US',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: 'Reese — LLM inference and systems engineering',
        },
      ],
      ...(type === 'article'
        ? {
            publishedTime,
            authors,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

type ArticleJsonLdInput = {
  title: string
  description: string
  slug: string
  publishedTime: string
  author: string
  language: 'zh-CN'
  topics?: string[]
}

export function createArticleJsonLd({
  title,
  description,
  slug,
  publishedTime,
  author,
  language,
  topics,
}: ArticleJsonLdInput) {
  const canonical = absoluteUrl(`/blogs/${slug}/`)

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: canonical,
    datePublished: publishedTime,
    inLanguage: language,
    mainEntityOfPage: canonical,
    image: absoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH),
    author: {
      '@type': 'Person',
      name: author,
      url: absoluteUrl('/about/'),
    },
    publisher: {
      '@type': 'Person',
      name: author,
      url: absoluteUrl('/'),
    },
    ...(topics?.length ? { keywords: topics } : {}),
  }
}
