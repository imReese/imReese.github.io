import assert from 'node:assert/strict'
import test from 'node:test'
import { xml2js } from 'xml-js'

import { type BlogType } from '../src/lib/blogs.ts'
import { createRssResponse, createRssXml } from '../src/lib/rss.ts'

const author = { name: 'Reese', email: 'reese@example.com' }

type XmlNode = {
  _text?: string
  _cdata?: string
  rss?: XmlNode
  channel?: XmlNode
  item?: XmlNode | XmlNode[]
  title?: XmlNode
  description?: XmlNode
  link?: XmlNode
  guid?: XmlNode
  pubDate?: XmlNode
  author?: XmlNode
  language?: XmlNode
}

function blog(overrides: Partial<BlogType>): BlogType {
  return {
    title: 'Article',
    description: 'Description',
    author: 'Reese',
    date: '2026-01-01',
    slug: 'article',
    language: 'zh-CN',
    ...overrides,
  }
}

function value(node: XmlNode | undefined) {
  return node?._text ?? node?._cdata
}

function parseItems(xml: string) {
  const parsed = xml2js(xml, { compact: true }) as XmlNode
  const channel = parsed.rss?.channel
  assert.ok(channel)
  const items = channel.item

  return {
    channel,
    items: Array.isArray(items) ? items : items ? [items] : [],
  }
}

test('RSS is valid XML with published, unique articles in descending order', () => {
  const xml = createRssXml(
    [
      blog({
        title: 'Older',
        slug: 'older',
        date: '2025-01-02',
      }),
      blog({
        title: 'A & B <C>',
        description: 'Escapes <tags> & symbols',
        slug: 'newest',
        date: '2026-06-30',
      }),
      blog({
        title: 'Draft',
        slug: 'draft',
        date: '2027-01-01',
        draft: true,
      }),
      blog({
        title: 'Duplicate slug',
        slug: 'newest',
        date: '2024-01-01',
      }),
    ],
    author,
  )
  const { channel, items } = parseItems(xml)

  assert.equal(value(channel.language), 'zh-CN')
  assert.equal(items.length, 2)
  assert.deepEqual(
    items.map((item) => value(item.title)),
    ['A & B <C>', 'Older'],
  )
  assert.equal(value(items[0].description), 'Escapes <tags> & symbols')
  assert.equal(value(items[0].link), 'https://imreese.github.io/blogs/newest/')
  assert.equal(value(items[0].guid), 'https://imreese.github.io/blogs/newest/')
  assert.match(value(items[0].author) ?? '', /Reese/)
  assert.equal(
    new Date(value(items[0].pubDate) ?? '').toUTCString(),
    value(items[0].pubDate),
  )
  assert.equal(
    new Set(items.map((item) => value(item.guid))).size,
    items.length,
  )
  assert.equal(xml.includes('Draft'), false)
  assert.equal(xml.includes('Duplicate slug'), false)
})

test('RSS response exposes the standard content type and language', () => {
  const response = createRssResponse([blog({})], author)

  assert.equal(
    response.headers.get('content-type'),
    'application/rss+xml; charset=utf-8',
  )
  assert.equal(response.headers.get('content-language'), 'zh-CN')
})
