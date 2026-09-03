import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { localeToHtmlLang } from '../src/lib/language.ts'

const languageProviderSource = readFileSync(
  'src/components/shared/LanguageProvider.tsx',
  'utf8',
)
const localizedMetadataSource = readFileSync(
  'src/lib/localizedPageMetadata.ts',
  'utf8',
)
const englishPagesSource = readFileSync('content/en/pages.yml', 'utf8')
const chinesePagesSource = readFileSync('content/zh/pages.yml', 'utf8')

test('maps navigation locale to a valid document language tag', () => {
  assert.equal(localeToHtmlLang('en'), 'en')
  assert.equal(localeToHtmlLang('zh'), 'zh-CN')
})

test('keeps article content language independent from navigation locale', () => {
  const blogLoader = readFileSync('src/lib/blogs.ts', 'utf8')
  const blogLayout = readFileSync(
    'src/components/layout/BlogLayout.tsx',
    'utf8',
  )

  assert.match(blogLoader, /export type BlogLanguage = 'zh-CN' \| 'en'/)
  assert.match(
    blogLoader,
    /data\.language === 'en' \? 'en' : 'zh-CN'/,
  )
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

test('keeps page metadata synchronized with the selected UI language', () => {
  assert.match(englishPagesSource, /title: About/)
  assert.match(englishPagesSource, /title: Projects/)
  assert.match(chinesePagesSource, /title: 关于/)
  assert.match(chinesePagesSource, /title: 项目/)
  assert.match(chinesePagesSource, /title: 技术博客/)
  assert.match(localizedMetadataSource, /documentTitle/)
  assert.match(localizedMetadataSource, /openGraphLocale/)
  assert.match(
    languageProviderSource,
    /document\.title = metadata\.documentTitle/,
  )
  assert.match(languageProviderSource, /meta\[property="og:title"\]/)
  assert.match(languageProviderSource, /meta\[name="twitter:title"\]/)
})

test('localizes the 404 page and its return action', () => {
  const notFound = readFileSync('src/app/not-found.tsx', 'utf8')
  const translations = languageProviderSource

  assert.match(notFound, /useLanguage\(\)/)
  assert.match(notFound, /t\('notFound\.title'\)/)
  assert.match(notFound, /t\('notFound\.description'\)/)
  assert.match(notFound, /t\('notFound\.backHome'\)/)
  assert.match(translations, /'notFound\.title': 'Page not found'/)
  assert.match(translations, /'notFound\.title': '页面不存在'/)
  assert.match(translations, /'notFound\.backHome': '返回首页'/)
})
