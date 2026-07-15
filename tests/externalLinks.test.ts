import assert from 'node:assert/strict'
import test from 'node:test'

import {
  normalizeExternalHref,
  withUtmSource,
} from '../src/lib/externalLinks.ts'

test('does not append a UTM parameter when no source is configured', () => {
  assert.equal(
    withUtmSource('https://github.com/imReese/sglang-rs'),
    'https://github.com/imReese/sglang-rs',
  )
  assert.equal(
    withUtmSource('https://github.com/imReese/sglang-rs', '  '),
    'https://github.com/imReese/sglang-rs',
  )
})

test('adds or replaces an encoded UTM source only on external HTTP links', () => {
  assert.equal(
    withUtmSource('https://example.com/docs?tab=runtime', 'personal site'),
    'https://example.com/docs?tab=runtime&utm_source=personal+site',
  )
  assert.equal(
    withUtmSource('https://example.com/?utm_source=old', 'new'),
    'https://example.com/?utm_source=new',
  )
  assert.equal(withUtmSource('/projects', 'site'), '/projects')
  assert.equal(
    withUtmSource('mailto:hello@example.com', 'site'),
    'mailto:hello@example.com',
  )
})

test('normalizes legacy project hostnames without duplicating protocols', () => {
  assert.equal(
    normalizeExternalHref('github.com/imReese/NexusKV'),
    'https://github.com/imReese/NexusKV',
  )
  assert.equal(
    normalizeExternalHref('https://github.com/imReese/NexusKV'),
    'https://github.com/imReese/NexusKV',
  )
})
