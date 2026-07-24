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

test('project implementation links match the audited main-branch paths', () => {
  const expectedSglangLinks = [
    'https://github.com/imReese/sglang-rs#current-scope',
    'https://github.com/imReese/sglang-rs/blob/main/crates/sglang-srt/tests/request_lifecycle.rs',
    'https://github.com/imReese/sglang-rs/blob/main/crates/sglang-srt/tests/pd_transfer_plan.rs',
    'https://github.com/imReese/sglang-rs/blob/main/scripts/run_cpu_pd_smoke.sh',
  ]
  const expectedNexusLinks = [
    'https://github.com/imReese/NexusKV/blob/main/docs/architecture/target-platform.md',
    'https://github.com/imReese/NexusKV/blob/main/docs/architecture/migration-status.md',
    'https://github.com/imReese/NexusKV/blob/main/docs/design/python-rust-planner-bridge.md',
    'https://github.com/imReese/NexusKV/blob/main/docs/design/connector-lifecycle.md',
    'https://github.com/imReese/NexusKV/blob/main/docs/design/execution-boundary.md',
  ]

  for (const locale of locales) {
    const projects = parse(
      readFileSync(`content/${locale}/projects.yml`, 'utf8'),
    )
    const [sglang, nexus] = projects.items
    const sglangLinks = sglang.evidenceLinks.map(
      (link: { href: string }) => link.href,
    )
    const nexusLinks = nexus.evidenceLinks.map(
      (link: { href: string }) => link.href,
    )

    assert.deepEqual(sglangLinks, expectedSglangLinks)
    assert.deepEqual(nexusLinks, expectedNexusLinks)
    assert.equal(
      nexusLinks.some((href: string) =>
        href.includes('engine-connector-lifecycle.md'),
      ),
      false,
    )
  }
})

test('localized content uses trailing slashes for internal page links', () => {
  function collectHrefs(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.flatMap(collectHrefs)
    }
    if (!value || typeof value !== 'object') {
      return []
    }

    return Object.entries(value).flatMap(([key, child]) =>
      key === 'href' && typeof child === 'string'
        ? [child]
        : collectHrefs(child),
    )
  }

  for (const locale of locales) {
    for (const file of ['site', 'pages', 'profile', 'projects']) {
      const content = parse(
        readFileSync(`content/${locale}/${file}.yml`, 'utf8'),
      )

      for (const href of collectHrefs(content)) {
        if (!href.startsWith('/') || href === '/') {
          continue
        }
        const pathname = href.split(/[?#]/, 1)[0]
        const lastSegment = pathname.split('/').at(-1) ?? ''
        if (!lastSegment.includes('.')) {
          assert.ok(
            pathname.endsWith('/'),
            `${href} is missing a trailing slash`,
          )
        }
      }
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

test('RSS routes use the same published blog source as the site', () => {
  const feedSource = readFileSync('src/app/feed/route.ts', 'utf8')
  const rssSource = readFileSync('src/app/rss.xml/route.ts', 'utf8')

  assert.match(feedSource, /getAllBlogs/)
  assert.match(rssSource, /getAllBlogs/)
  assert.match(feedSource, /createRssResponse/)
  assert.match(rssSource, /createRssResponse/)
})

test('MDX math uses MathJax 4 CHTML with accessible and mobile-safe output', () => {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
  const mdxSource = readFileSync('src/lib/mdx.ts', 'utf8')
  const mathjaxSource = readFileSync('src/lib/rehypeMathjaxV4.ts', 'utf8')
  const mathjaxAssetsSource = readFileSync(
    'scripts/prepare-mathjax-assets.mjs',
    'utf8',
  )
  const globalStyles = readFileSync('src/styles/globals.css', 'utf8')
  const mdxComponentsSource = readFileSync(
    'src/components/shared/MdxComponents.tsx',
    'utf8',
  )

  assert.ok(packageJson.dependencies['remark-math'])
  assert.ok(packageJson.dependencies['remark-gfm'])
  assert.ok(packageJson.dependencies['@mathjax/src'])
  assert.ok(packageJson.dependencies['@mathjax/mathjax-newcm-font'])
  assert.equal(packageJson.dependencies['rehype-katex'], undefined)
  assert.equal(packageJson.dependencies.katex, undefined)
  assert.match(mdxSource, /remarkPlugins: \[remarkGfm, remarkMath\]/)
  assert.match(mdxSource, /rehypePlugins: \[rehypeMathjaxV4\]/)
  assert.match(mathjaxSource, /MathJaxNewcmFont/)
  assert.match(mathjaxSource, /AssistiveMmlHandler/)
  assert.match(mathjaxSource, /boldsymbol\/BoldsymbolConfiguration/)
  assert.match(mathjaxSource, /'boldsymbol'/)
  assert.match(mathjaxSource, /fontURL: FONT_URL/)
  assert.match(mathjaxSource, /tagName: 'math-jax'/)
  assert.match(mathjaxSource, /Undefined TeX command/)
  assert.match(mathjaxSource, /file\.fail/)
  assert.match(mathjaxAssetsSource, /public\/mathjax\/fonts\/newcm/)
  assert.match(globalStyles, /mjx-container\[jax='CHTML'\]/)
  assert.match(globalStyles, /\.mathjax-display-shell/)
  assert.match(globalStyles, /--blog-content-width: 72rem/)
  assert.match(globalStyles, /overflow-x: auto/)
  assert.match(mdxComponentsSource, /'math-jax': MathJaxMarkup/)
  assert.match(mdxComponentsSource, /table: ResponsiveTable/)
  assert.match(mdxComponentsSource, /style: TrustedStyle/)
  assert.match(mdxComponentsSource, /dangerouslySetInnerHTML/)
  assert.match(mdxComponentsSource, /min-w-\[48rem\]/)
})
