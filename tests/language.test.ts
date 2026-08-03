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

test('server defaults to English UI without inventing language routes', () => {
  const rootLayout = readFileSync('src/app/layout.tsx', 'utf8')

  assert.match(rootLayout, /<html[\s\S]*lang="en"/)
  assert.equal(rootLayout.includes('hreflang'), false)
  assert.equal(rootLayout.includes('/en/'), false)
  assert.equal(rootLayout.includes('/zh/'), false)
})

test('localizes the 404 page and its return action', () => {
  const notFound = readFileSync('src/app/not-found.tsx', 'utf8')
  const translations = readFileSync(
    'src/components/shared/LanguageProvider.tsx',
    'utf8',
  )

  assert.match(notFound, /useLanguage\(\)/)
  assert.match(notFound, /t\('notFound\.title'\)/)
  assert.match(notFound, /t\('notFound\.description'\)/)
  assert.match(notFound, /t\('notFound\.backHome'\)/)
  assert.match(translations, /'notFound\.title': 'Page not found'/)
  assert.match(translations, /'notFound\.title': '页面不存在'/)
  assert.match(translations, /'notFound\.backHome': '返回首页'/)
})
