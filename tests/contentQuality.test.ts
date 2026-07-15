import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import test from 'node:test'
import { parse } from 'yaml'
import matter from 'gray-matter'

const locales = ['en', 'zh'] as const

test('social links contain no WeChat placeholder or empty external URL', () => {
  for (const locale of locales) {
    const site = parse(readFileSync(`content/${locale}/site.yml`, 'utf8'))
    const socialLinks = site.socialLinks as Array<{
      name: string
      href: string
    }>

    assert.equal(
      socialLinks.some((link) => link.name.toLowerCase() === 'wechat'),
      false,
    )
    for (const link of socialLinks) {
      assert.ok(link.href)
      assert.doesNotThrow(() => new URL(link.href))
    }
  }
})

test('footer WeChat contact opens the repository QR asset instead of a placeholder URL', () => {
  const socialLinksSource = readFileSync(
    'src/components/home/SocialLinks.tsx',
    'utf8',
  )

  assert.match(
    socialLinksSource,
    /import wechatQrImage from '@\/images\/wechat\.jpg'/,
  )
  assert.match(socialLinksSource, /href=\{wechatQrImage\.src\}/)
  assert.equal(socialLinksSource.includes('reese-personal-website'), false)
})

test('tracked forks are labeled and paired with their upstream repositories', () => {
  for (const locale of locales) {
    const projects = parse(
      readFileSync(`content/${locale}/projects.yml`, 'utf8'),
    )
    const forkSection = projects.workSections[0]

    for (const item of forkSection.items) {
      assert.match(item.relation, /Tracked fork/)
      assert.match(item.relation, /Source study/)
      assert.ok(item.upstream?.href)
      assert.notEqual(item.upstream.href, item.href)
      assert.doesNotThrow(() => new URL(item.href))
      assert.doesNotThrow(() => new URL(item.upstream.href))
    }
  }
})

test('blog frontmatter has unique SEO fields and valid publication facts', () => {
  const files = readdirSync('content/blogs').filter((file) =>
    file.endsWith('.mdx'),
  )
  const titles = new Set<string>()
  const descriptions = new Set<string>()

  for (const file of files) {
    const { data } = matter(readFileSync(`content/blogs/${file}`, 'utf8'))

    assert.equal(typeof data.title, 'string')
    assert.equal(typeof data.description, 'string')
    assert.equal(data.author, 'Reese')
    assert.match(data.date, /^\d{4}-\d{2}-\d{2}$/)
    assert.equal(
      titles.has(data.title),
      false,
      `duplicate title: ${data.title}`,
    )
    assert.equal(
      descriptions.has(data.description),
      false,
      `duplicate description: ${data.description}`,
    )
    titles.add(data.title)
    descriptions.add(data.description)
  }
})

test('localized profile prose keeps scalar text shapes', () => {
  for (const locale of locales) {
    const profile = parse(readFileSync(`content/${locale}/profile.yml`, 'utf8'))

    assert.ok(
      profile.aboutParagraphs.every(
        (paragraph: unknown) => typeof paragraph === 'string',
      ),
    )
    assert.ok(
      profile.selectedWork.every(
        (work: { description: unknown; problem: unknown }) =>
          typeof work.description === 'string' &&
          typeof work.problem === 'string',
      ),
    )
  }
})

test('RSS generation uses the same date-sorted blog index as the site', () => {
  const feedSource = readFileSync('src/app/feed/route.ts', 'utf8')

  assert.match(feedSource, /getAllBlogs/)
  assert.match(feedSource, /for \(const blog of blogs\)/)
})
