import { type Metadata } from 'next'

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://imreese.github.io'
).replace(/\/$/, '')

export const DEFAULT_SOCIAL_IMAGE_PATH = '/social-card.png'

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
