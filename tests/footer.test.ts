import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const footerSource = readFileSync('src/components/layout/Footer.tsx', 'utf8')

test('footer does not present homepage-only analytics as a site-wide count', () => {
  assert.equal(footerSource.includes('HomepageViewStats'), false)
  assert.equal(footerSource.includes('stats.json'), false)
  assert.equal(footerSource.includes('views'), false)
})

test('footer localizes the site name and rights copy', () => {
  assert.match(footerSource, /useLocalizedContent/)
  assert.match(footerSource, /site\.name/)
  assert.match(footerSource, /footer\.rights/)
})
