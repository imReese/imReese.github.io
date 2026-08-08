import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  formatHomepageViewCount,
  formatHomepageViewText,
  getHomepageViewCount,
} from '../src/lib/homepageStats.ts'

test('reads site-wide pageviews from the existing generated stats payload', () => {
  assert.equal(
    getHomepageViewCount({
      homepage: {
        scope: 'site',
        pageviews: 12345,
        visits: 2345,
        visitors: 1234,
        source: 'goatcounter',
        updatedAt: '2026-07-06T00:00:00.000Z',
      },
    }),
    12345,
  )
})

test('rejects malformed or legacy page-scoped stats without showing a false zero', () => {
  assert.equal(
    getHomepageViewCount({ homepage: { scope: 'site', pageviews: -1 } }),
    null,
  )
  assert.equal(
    getHomepageViewCount({ homepage: { scope: 'site', pageviews: '123' } }),
    null,
  )
  assert.equal(
    getHomepageViewCount({ homepage: { path: '/', pageviews: 123 } }),
    null,
  )
  assert.equal(getHomepageViewCount({}), null)
})

test('formats site-wide counts for English and Chinese readers', () => {
  assert.equal(formatHomepageViewCount(12345, 'en'), '12,345')
  assert.equal(formatHomepageViewCount(12345, 'zh'), '12,345')
})

test('describes the shared metric as site views in both languages', () => {
  assert.equal(formatHomepageViewText(12345, 'en'), '12,345 site views')
  assert.equal(formatHomepageViewText(12345, 'zh'), '本站浏览 12,345 次')
})

test('keeps the GoatCounter flow site-wide and the client read-only', () => {
  const updaterSource = readFileSync(
    '.github/scripts/update-homepage-stats.mjs',
    'utf8',
  )
  const analyticsSource = readFileSync(
    'src/components/analytics/goatcounter-analytics.tsx',
    'utf8',
  )
  const componentSource = readFileSync(
    'src/components/shared/HomepageViewStats.tsx',
    'utf8',
  )

  assert.match(updaterSource, /\/counter\/TOTAL\.json/)
  assert.match(updaterSource, /scope: 'site'/)
  assert.match(updaterSource, /source: 'goatcounter'/)
  assert.match(updaterSource, /pageviews,/)
  assert.equal(updaterSource.includes('pageviews = 0'), false)
  assert.match(analyticsSource, /data-goatcounter=\{/)
  assert.match(analyticsSource, /data-goatcounter-settings=/)
  assert.match(analyticsSource, /usePathname\(\)/)
  assert.match(analyticsSource, /goatcounter\.count/)
  assert.match(analyticsSource, /strategy="afterInteractive"/)
  assert.match(componentSource, /fetch\('\/stats\.json'/)
  assert.match(componentSource, /}, \[\]\)/)
  assert.match(componentSource, /import \{ Eye \} from 'lucide-react'/)
  assert.match(componentSource, /<Eye/)
  assert.match(componentSource, /min-h-5/)
  assert.equal(componentSource.includes("method: 'POST'"), false)
  assert.equal(componentSource.includes('setViewCount(0)'), false)
})
