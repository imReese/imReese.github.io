import assert from 'node:assert/strict'
import test from 'node:test'

import robots from '../src/app/robots.ts'
import sitemap from '../src/app/sitemap.ts'
import { getAllBlogs } from '../src/lib/blogs.ts'
import { absoluteUrl, RSS_PATH } from '../src/lib/seo.ts'

test('sitemap contains only canonical public pages and published articles', async () => {
  const blogs = await getAllBlogs()
  const entries = await sitemap()
  const urls = entries.map((entry) => entry.url)
  const expected = [
    absoluteUrl('/'),
    absoluteUrl('/about/'),
    absoluteUrl('/projects/'),
    absoluteUrl('/blogs/'),
    ...blogs.map((blog) => absoluteUrl(`/blogs/${blog.slug}/`)),
  ]

  assert.deepEqual(new Set(urls), new Set(expected))
  assert.equal(urls.length, new Set(urls).size)
  assert.equal(
    urls.some((url) => url.includes('?')),
    false,
  )
  assert.equal(
    urls.some((url) => url.includes('#')),
    false,
  )
  assert.equal(urls.includes(absoluteUrl(RSS_PATH)), false)
  assert.equal(
    blogs.some((blog) => blog.draft === true),
    false,
  )
})

test('robots references the production sitemap and canonical host', () => {
  const result = robots()

  assert.equal(result.sitemap, absoluteUrl('/sitemap.xml'))
  assert.equal(result.host, 'https://imreese.github.io')
})
