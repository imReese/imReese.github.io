import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import fg from 'fast-glob'

const outputDir = path.resolve(process.argv[2] ?? 'out')
const checkExternal = process.argv.includes('--external')
const siteOrigin = 'https://imreese.github.io'
const rssUrl = `${siteOrigin}/rss.xml`
const htmlFiles = await fg('**/*.html', { cwd: outputDir, absolute: true })
const errors = []
const externalLinks = new Set()
const canonicalOwners = new Map()
const titleOwners = new Map()
const descriptionOwners = new Map()

function capture(html, expression) {
  return [...html.matchAll(expression)].map((match) => match[1])
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))
  return match?.[1]
}

function decodeHtmlAttribute(value) {
  return value
    ?.replace(/&#x27;|&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, '&')
}

function expectedCanonicalPath(relativeFile) {
  if (relativeFile === 'index.html') {
    return '/'
  }

  if (relativeFile.endsWith('/index.html')) {
    return `/${relativeFile.slice(0, -'index.html'.length)}`
  }

  return `/${relativeFile.replace(/\.html$/, '/')}`
}

function isDirectoryPage(pathname) {
  if (pathname === '/' || pathname.endsWith('/')) {
    return false
  }

  const lastSegment = pathname.split('/').at(-1) ?? ''
  return !lastSegment.includes('.')
}

async function internalTargetExists(pathname) {
  const decoded = decodeURIComponent(pathname)
  const relative = decoded.replace(/^\//, '')
  const candidates =
    decoded === '/'
      ? ['index.html']
      : decoded.endsWith('/')
        ? [`${relative}index.html`]
        : [relative, `${relative}.html`, `${relative}/index.html`]

  for (const candidate of candidates) {
    try {
      await readFile(path.join(outputDir, candidate))
      return true
    } catch {
      // Try the next static-export shape.
    }
  }

  return false
}

for (const file of htmlFiles) {
  const relativeFile = path.relative(outputDir, file)
  if (relativeFile === '404.html' || relativeFile === '404/index.html') {
    continue
  }

  const html = await readFile(file, 'utf8')
  const hrefs = capture(html, /<a\b[^>]*\bhref=["']([^"']*)["']/gi)
  const canonicals = capture(
    html,
    /<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["']/gi,
  )
  const titles = capture(html, /<title>([^<]+)<\/title>/gi)
  const descriptions = capture(
    html,
    /<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=["']([^"']+)["']/gi,
  )
  const htmlLanguages = capture(html, /<html\b[^>]*\blang=["']([^"']+)["']/gi)
  const linkTags = capture(html, /(<link\b[^>]*>)/gi)
  const rssLinks = linkTags.filter(
    (tag) =>
      attribute(tag, 'rel') === 'alternate' &&
      attribute(tag, 'type') === 'application/rss+xml',
  )

  if (canonicals.length !== 1) {
    errors.push(
      `${relativeFile}: expected one canonical URL, found ${canonicals.length}`,
    )
  }
  if (titles.length !== 1) {
    errors.push(`${relativeFile}: expected one title, found ${titles.length}`)
  }
  if (descriptions.length !== 1) {
    errors.push(
      `${relativeFile}: expected one description, found ${descriptions.length}`,
    )
  }
  if (htmlLanguages.length !== 1 || htmlLanguages[0] !== 'en') {
    errors.push(
      `${relativeFile}: expected one server-rendered html lang="en", found ${htmlLanguages.join(', ') || 'none'}`,
    )
  }
  if (/\bhreflang=/i.test(html)) {
    errors.push(`${relativeFile}: unexpected hreflang without language routes`)
  }
  if (rssLinks.length !== 1) {
    errors.push(
      `${relativeFile}: expected one RSS discovery link, found ${rssLinks.length}`,
    )
  } else {
    const rssHref = attribute(rssLinks[0], 'href')
    const rssTitle = decodeHtmlAttribute(attribute(rssLinks[0], 'title'))
    if (rssHref !== rssUrl) {
      errors.push(`${relativeFile}: incorrect RSS discovery URL (${rssHref})`)
    }
    if (rssTitle !== "Reese's Blog") {
      errors.push(
        `${relativeFile}: incorrect RSS discovery title (${rssTitle})`,
      )
    }
  }

  const expectedCanonical = `${siteOrigin}${expectedCanonicalPath(relativeFile)}`
  if (canonicals[0] && canonicals[0] !== expectedCanonical) {
    errors.push(
      `${relativeFile}: canonical ${canonicals[0]} does not match ${expectedCanonical}`,
    )
  }

  for (const [value, owners, label] of [
    [canonicals[0], canonicalOwners, 'canonical'],
    [titles[0], titleOwners, 'title'],
    [descriptions[0], descriptionOwners, 'description'],
  ]) {
    if (!value) continue
    if (owners.has(value)) {
      errors.push(
        `${relativeFile}: duplicate ${label} also used by ${owners.get(value)}`,
      )
    } else {
      owners.set(value, relativeFile)
    }
  }

  for (const required of [
    'property="og:title"',
    'property="og:description"',
    'property="og:url"',
    'property="og:type"',
    'property="og:image"',
    'name="twitter:card"',
    'name="twitter:title"',
    'name="twitter:description"',
    'name="twitter:image"',
  ]) {
    if (!html.includes(required)) {
      errors.push(`${relativeFile}: missing ${required}`)
    }
  }

  if (relativeFile === 'index.html' && !html.includes('"@type":"Person"')) {
    errors.push(`${relativeFile}: missing Person JSON-LD`)
  }
  if (
    relativeFile.startsWith('blogs/') &&
    relativeFile !== 'blogs/index.html' &&
    !html.includes('"@type":"Article"')
  ) {
    errors.push(`${relativeFile}: missing Article JSON-LD`)
  }
  if (
    relativeFile.startsWith('blogs/') &&
    relativeFile !== 'blogs/index.html' &&
    !/<article\b[^>]*\blang="zh-CN"/.test(html)
  ) {
    errors.push(`${relativeFile}: Chinese article is missing lang="zh-CN"`)
  }

  for (const href of hrefs) {
    if (!href || href === '#') {
      errors.push(`${relativeFile}: empty link`)
      continue
    }
    if (href.includes('undefined')) {
      errors.push(`${relativeFile}: link contains undefined (${href})`)
      continue
    }
    if (/^(mailto:|tel:|#)/i.test(href)) {
      continue
    }

    let url
    try {
      url = new URL(href, siteOrigin)
    } catch {
      errors.push(`${relativeFile}: invalid URL (${href})`)
      continue
    }

    if (url.origin === siteOrigin) {
      if (isDirectoryPage(url.pathname)) {
        errors.push(
          `${relativeFile}: internal page link is missing / (${href})`,
        )
      }
      if (!(await internalTargetExists(url.pathname))) {
        errors.push(`${relativeFile}: missing internal target (${href})`)
      }
    } else {
      externalLinks.add(url.href)
    }
  }
}

for (const requiredAsset of [
  'rss.xml',
  'robots.txt',
  'sitemap.xml',
  'social-card.png',
]) {
  try {
    await readFile(path.join(outputDir, requiredAsset))
  } catch {
    errors.push(`missing production asset: /${requiredAsset}`)
  }
}

if (checkExternal) {
  for (const href of [...externalLinks].sort()) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15_000)
    try {
      let response = await fetch(href, {
        method: 'HEAD',
        redirect: 'follow',
        headers: { 'user-agent': 'reese-site-link-check/1.0' },
        signal: controller.signal,
      })
      if ([403, 405].includes(response.status)) {
        response = await fetch(href, {
          method: 'GET',
          redirect: 'follow',
          headers: { 'user-agent': 'reese-site-link-check/1.0' },
          signal: controller.signal,
        })
      }
      if (response.status >= 400) {
        errors.push(`external ${href}: HTTP ${response.status}`)
      }
    } catch (error) {
      errors.push(
        `external ${href}: ${error instanceof Error ? error.message : String(error)}`,
      )
    } finally {
      clearTimeout(timeout)
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(
    `Checked ${htmlFiles.length} HTML files, ${externalLinks.size} external URLs${
      checkExternal ? ' (network verified)' : ''
    }.`,
  )
}
