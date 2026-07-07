import test from 'node:test'
import assert from 'node:assert/strict'

import {
  formatHomepageViewCount,
  formatHomepageViewLabel,
  getHomepageViewCount,
} from '../src/lib/homepageStats'

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

test('rejects malformed homepage stats', () => {
  assert.equal(getHomepageViewCount({ homepage: { pageviews: -1 } }), null)
  assert.equal(getHomepageViewCount({ homepage: { pageviews: '123' } }), null)
  assert.equal(getHomepageViewCount({}), null)
})

test('formats homepage counts for English and Chinese readers', () => {
  assert.equal(formatHomepageViewCount(12345, 'en'), '12,345')
  assert.equal(formatHomepageViewCount(12345, 'zh'), '12,345')
})

test('formats compact footer view labels', () => {
  assert.equal(formatHomepageViewLabel(1, 'en'), 'view')
  assert.equal(formatHomepageViewLabel(2, 'en'), 'views')
  assert.equal(formatHomepageViewLabel(0, 'en'), 'views')
  assert.equal(formatHomepageViewLabel(1, 'zh'), '次访问')
  assert.equal(formatHomepageViewLabel(2, 'zh'), '次访问')
})
