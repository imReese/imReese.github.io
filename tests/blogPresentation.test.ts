import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getBlogMetaChips,
  matchesSeriesGroup,
} from '../src/lib/blogPresentation.ts'

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
