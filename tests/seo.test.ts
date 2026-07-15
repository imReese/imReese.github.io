import assert from 'node:assert/strict'
import test from 'node:test'

import {
  absoluteUrl,
  createArticleJsonLd,
  createPageMetadata,
  DEFAULT_SOCIAL_IMAGE_PATH,
  RSS_PATH,
  RSS_TITLE,
  serializeJsonLd,
} from '../src/lib/seo.ts'

test('builds a complete, canonical page metadata set', () => {
  const metadata = createPageMetadata({
    title: 'Projects',
    description: 'Verifiable systems work.',
    path: '/projects/',
  })
  const openGraph = metadata.openGraph as Record<string, unknown>
  const twitter = metadata.twitter as Record<string, unknown>
  const openGraphImages = openGraph.images as Array<Record<string, unknown>>

  assert.equal(metadata.alternates?.canonical, absoluteUrl('/projects/'))
  assert.equal(metadata.alternates?.languages, undefined)
  assert.equal(openGraph.title, 'Projects')
  assert.equal(openGraph.description, 'Verifiable systems work.')
  assert.equal(openGraph.url, absoluteUrl('/projects/'))
  assert.equal(openGraph.type, 'website')
  assert.equal(twitter.card, 'summary_large_image')
  assert.equal(twitter.title, 'Projects')
  assert.equal(twitter.description, 'Verifiable systems work.')
  assert.deepEqual(twitter.images, [absoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH)])
  assert.equal(openGraphImages[0].url, absoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH))
})

test('adds article publication, author, language, and share metadata', () => {
  const metadata = createPageMetadata({
    title: '文章',
    description: '文章摘要',
    path: '/blogs/example/',
    type: 'article',
    language: 'zh-CN',
    publishedTime: '2026-06-30',
    authors: ['Reese'],
  })
  const openGraph = metadata.openGraph as Record<string, unknown>

  assert.equal(openGraph.type, 'article')
  assert.equal(openGraph.locale, 'zh_CN')
  assert.equal(openGraph.publishedTime, '2026-06-30')
  assert.deepEqual(openGraph.authors, ['Reese'])
})

test('builds Article JSON-LD with the canonical Chinese article facts', () => {
  const article = createArticleJsonLd({
    title: '中文标题',
    description: '中文摘要',
    slug: 'example',
    publishedTime: '2026-06-30',
    author: 'Reese',
    language: 'zh-CN',
    topics: ['SGLang'],
  })

  assert.equal(article['@type'], 'Article')
  assert.equal(article.inLanguage, 'zh-CN')
  assert.equal(article.datePublished, '2026-06-30')
  assert.equal(article.url, absoluteUrl('/blogs/example/'))
  assert.equal(article.mainEntityOfPage, absoluteUrl('/blogs/example/'))
  assert.equal(article.image, absoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH))
})

test('uses the standard production RSS discovery identity', () => {
  assert.equal(absoluteUrl(RSS_PATH), 'https://imreese.github.io/rss.xml')
  assert.equal(RSS_TITLE, "Reese's Blog")
})

test('serializes JSON-LD without allowing a closing script injection', () => {
  assert.equal(
    serializeJsonLd({ value: '</script>' }),
    '{"value":"\\u003c/script>"}',
  )
})
