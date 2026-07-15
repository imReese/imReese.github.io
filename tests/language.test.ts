import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { localeToHtmlLang } from '../src/lib/language.ts'

test('maps navigation locale to a valid document language tag', () => {
  assert.equal(localeToHtmlLang('en'), 'en')
  assert.equal(localeToHtmlLang('zh'), 'zh-CN')
})

test('keeps Chinese article content language independent from navigation locale', () => {
  const blogLoader = readFileSync('src/lib/blogs.ts', 'utf8')
  const blogLayout = readFileSync(
    'src/components/layout/BlogLayout.tsx',
    'utf8',
  )

  assert.match(blogLoader, /language:\s*'zh-CN'/)
  assert.match(blogLayout, /<article[^>]+lang=\{blog\.language\}/)
  assert.match(blogLayout, /formatDate\(blog\.date, locale\)/)
})
