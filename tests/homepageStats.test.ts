import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  formatHomepageViewCount,
  formatHomepageViewText,
  getGoatCounterViewCount,
} from '../src/lib/homepageStats.ts'

test('reads GoatCounter total views from its public counter payload', () => {
  assert.equal(getGoatCounterViewCount({ count: '12,345' }), 12345)
  assert.equal(getGoatCounterViewCount({ count: 0 }), 0)
})

test('rejects malformed GoatCounter counts without showing a false zero', () => {
  assert.equal(getGoatCounterViewCount({ count: -1 }), null)
  assert.equal(getGoatCounterViewCount({ count: 'not-a-count' }), null)
  assert.equal(getGoatCounterViewCount({}), null)
})

test('formats site-wide counts for English and Chinese readers', () => {
  assert.equal(formatHomepageViewCount(12345, 'en'), '12,345')
  assert.equal(formatHomepageViewCount(12345, 'zh'), '12,345')
})

test('describes the shared metric as site views in both languages', () => {
  assert.equal(formatHomepageViewText(12345, 'en'), '12,345 site views')
  assert.equal(formatHomepageViewText(12345, 'zh'), '本站浏览 12,345 次')
})

test('reads GoatCounter dynamically while keeping the client read-only', () => {
  const analyticsSource = readFileSync(
    'src/components/analytics/goatcounter-analytics.tsx',
    'utf8',
  )
  const componentSource = readFileSync(
    'src/components/shared/HomepageViewStats.tsx',
    'utf8',
  )

  assert.match(analyticsSource, /data-goatcounter=\{/)
  assert.match(analyticsSource, /data-goatcounter-settings=/)
  assert.match(analyticsSource, /usePathname\(\)/)
  assert.match(analyticsSource, /goatcounter\.count/)
  assert.match(analyticsSource, /strategy="afterInteractive"/)
  assert.match(componentSource, /\/counter\/TOTAL\.json/)
  assert.match(componentSource, /NEXT_PUBLIC_GOATCOUNTER_URL/)
  assert.match(componentSource, /getGoatCounterViewCount/)
  assert.match(componentSource, /import \{ Eye \} from 'lucide-react'/)
  assert.match(componentSource, /<Eye/)
  assert.match(componentSource, /min-h-5/)
  assert.equal(componentSource.includes("method: 'POST'"), false)
  assert.equal(componentSource.includes('setViewCount(0)'), false)
})
