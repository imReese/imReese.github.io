import assert from 'node:assert/strict'
import test from 'node:test'

import {
  absoluteUrl,
  createPageMetadata,
  DEFAULT_SOCIAL_IMAGE_PATH,
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

  assert.equal(metadata.alternates?.canonical, absoluteUrl('/projects/'))
  assert.equal(openGraph.title, 'Projects')
  assert.equal(openGraph.description, 'Verifiable systems work.')
  assert.equal(openGraph.url, absoluteUrl('/projects/'))
  assert.equal(openGraph.type, 'website')
  assert.equal(twitter.card, 'summary_large_image')
  assert.deepEqual(twitter.images, [absoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH)])
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

test('serializes JSON-LD without allowing a closing script injection', () => {
  assert.equal(
    serializeJsonLd({ value: '</script>' }),
    '{"value":"\\u003c/script>"}',
  )
})
