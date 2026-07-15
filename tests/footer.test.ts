import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const footerSource = readFileSync('src/components/layout/Footer.tsx', 'utf8')

test('footer shows the shared site view metric on every page', () => {
  assert.match(footerSource, /HomepageViewStats/)
  assert.equal(footerSource.includes('usePathname'), false)
  assert.equal(footerSource.includes("pathname === '/'"), false)
})

test('footer keeps the exact fixed copyright text across locales', () => {
  assert.match(footerSource, /&copy; 2026 Reese\. All rights reserved\./)
  assert.equal(footerSource.includes('new Date()'), false)
  assert.equal(footerSource.includes('useLocalizedContent'), false)
  assert.equal(footerSource.includes('site.name'), false)
  assert.equal(footerSource.includes('footer.rights'), false)
})
