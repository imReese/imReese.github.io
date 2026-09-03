import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import test from 'node:test'
import matter from 'gray-matter'

import {
  getBlogMetaChips,
  getFilteredBlogs,
  matchesSeriesGroup,
} from '../src/lib/blogPresentation.ts'
import type { BlogType } from '../src/lib/blogs.ts'
import { getLocalizedBlogs } from '../src/lib/blogTranslations.ts'

const readingMap = {
  topics: [
    { label: 'Storage systems', value: 'storage-systems' },
    { label: 'Cloud tooling', value: 'cloud-tooling' },
  ],
}

test('deduplicates category, series, and topic labels case-insensitively', () => {
  const chips = getBlogMetaChips(
    {
      title: 'Runbook',
      description: 'Example',
      author: 'Reese',
      date: '2026-01-01',
      slug: 'runbook',
      language: 'zh-CN',
      category: 'runbooks',
      series: 'Practical Runbooks',
      topics: ['cloud-tooling'],
    },
    { runbooks: 'Runbooks', fallback: 'Notes' },
    { 'Practical Runbooks': 'Runbooks' },
    readingMap as never,
  )

  assert.deepEqual(
    chips.map((chip) => chip.label),
    ['Runbooks', 'Cloud tooling'],
  )
})

test('groups articles into system series without changing their URLs', () => {
  const blog = {
    title: 'KV path',
    description: 'Example',
    author: 'Reese',
    date: '2026-01-01',
    slug: 'stable-slug',
    language: 'zh-CN' as const,
    series: 'Mooncake / HiCache Internals',
    topics: ['kv-cache', 'distributed-systems'],
  }

  assert.equal(matchesSeriesGroup(blog, 'mooncake-hicache'), true)
  assert.equal(matchesSeriesGroup(blog, 'kv-cache-systems'), true)
  assert.equal(matchesSeriesGroup(blog, 'distributed-storage'), true)
  assert.equal(blog.slug, 'stable-slug')
})

test('selects one localized variant for each logical article', () => {
  const shared = {
    author: 'Reese',
    date: '2026-09-03',
    translationKey: 'cache-runtime-boundary',
  }
  const blogs: BlogType[] = [
    {
      ...shared,
      title: '中文标题',
      description: '中文简介',
      slug: 'cache-runtime-boundary',
      language: 'zh-CN',
    },
    {
      ...shared,
      title: 'English title',
      description: 'English description',
      slug: 'cache-runtime-boundary-en',
      language: 'en',
    },
    {
      title: 'Chinese-only note',
      description: 'Fallback note',
      author: 'Reese',
      date: '2026-09-02',
      slug: 'chinese-only',
      language: 'zh-CN',
    },
  ]

  const english = getLocalizedBlogs(blogs, 'en')
  const chinese = getLocalizedBlogs(blogs, 'zh')

  assert.deepEqual(
    english.map((blog) => blog.slug),
    ['cache-runtime-boundary-en', 'chinese-only'],
  )
  assert.deepEqual(
    chinese.map((blog) => blog.slug),
    ['cache-runtime-boundary', 'chinese-only'],
  )
})

test('keeps featured articles in the default archive', () => {
  const blogs = readdirSync('content/blogs')
    .filter((file) => file.endsWith('.mdx'))
    .map(
      (file) =>
        ({
          ...matter(readFileSync(`content/blogs/${file}`, 'utf8')).data,
          slug: file.replace(/\.mdx$/, ''),
        }) as BlogType,
    )
    .filter((blog) => blog.draft !== true)

  const archive = getFilteredBlogs(blogs, {
    year: null,
    topic: null,
    series: null,
  })

  assert.equal(archive.length, blogs.length)
  assert.deepEqual(
    archive.filter((blog) => blog.featured).map((blog) => blog.slug),
    blogs.filter((blog) => blog.featured).map((blog) => blog.slug),
  )
})
