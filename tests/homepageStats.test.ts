import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  formatHomepageViewCount,
  formatHomepageViewText,
  getHomepageViewCount,
} from '../src/lib/homepageStats.ts'

test('reads homepage pageviews from generated stats json', () => {
  assert.equal(
    getHomepageViewCount({
      homepage: {
        path: '/',
        pageviews: 12345,
        visits: 2345,
        visitors: 1234,
        source: 'plausible',
        updatedAt: '2026-07-06T00:00:00.000Z',
      },
    }),
    12345,
  )
})

test('rejects malformed homepage stats without showing a false zero', () => {
  assert.equal(getHomepageViewCount({ homepage: { pageviews: -1 } }), null)
  assert.equal(getHomepageViewCount({ homepage: { pageviews: '123' } }), null)
  assert.equal(getHomepageViewCount({}), null)
})

test('formats homepage counts for English and Chinese readers', () => {
  assert.equal(formatHomepageViewCount(12345, 'en'), '12,345')
  assert.equal(formatHomepageViewCount(12345, 'zh'), '12,345')
})

test('describes the homepage metric as page views in both languages', () => {
  assert.equal(formatHomepageViewText(12345, 'en'), '12,345 page views')
  assert.equal(formatHomepageViewText(12345, 'zh'), '本页浏览 12,345 次')
})

test('keeps the existing Plausible homepage pageview source and read-only client', () => {
  const updaterSource = readFileSync(
    '.github/scripts/update-homepage-stats.mjs',
    'utf8',
  )
  const componentSource = readFileSync(
    'src/components/shared/HomepageViewStats.tsx',
    'utf8',
  )

  assert.match(updaterSource, /metrics: \['pageviews', 'visits', 'visitors'\]/)
  assert.match(updaterSource, /filters: \[\['is', 'event:page', \['\/'\]\]\]/)
  assert.match(componentSource, /fetch\('\/stats\.json'/)
  assert.match(componentSource, /}, \[\]\)/)
  assert.equal(componentSource.includes("method: 'POST'"), false)
})
