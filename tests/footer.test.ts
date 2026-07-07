import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const footerSource = readFileSync('src/components/layout/Footer.tsx', 'utf8')

test('renders the same footer stats block on every page', () => {
  assert.equal(
    footerSource.includes("import { usePathname } from 'next/navigation'"),
    false,
  )
  assert.equal(footerSource.includes("pathname === '/'"), false)
  assert.match(footerSource, /<HomepageViewStats[\s\S]*className=/)
})
