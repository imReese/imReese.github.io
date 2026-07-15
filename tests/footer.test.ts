import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const footerSource = readFileSync('src/components/layout/Footer.tsx', 'utf8')

test('footer shows the existing homepage pageview metric only on the homepage', () => {
  assert.match(footerSource, /usePathname/)
  assert.match(footerSource, /pathname === '\/'/)
  assert.match(footerSource, /HomepageViewStats/)
  assert.equal(footerSource.includes('site views'), false)
})

test('footer keeps the copyright text fixed across locales with a current year', () => {
  assert.match(footerSource, /new Date\(\)\.getFullYear\(\)/)
  assert.match(footerSource, /Reese\. All rights/)
  assert.match(footerSource, /reserved\./)
  assert.equal(footerSource.includes('useLocalizedContent'), false)
  assert.equal(footerSource.includes('site.name'), false)
  assert.equal(footerSource.includes('footer.rights'), false)
})
