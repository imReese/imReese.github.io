import { Feed } from 'feed'
import { name, email } from '@/config/infoConfig'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { blogContentDir } from '@/lib/contentPaths'
import { getAllBlogs } from '@/lib/blogs'
import { absoluteUrl } from '@/lib/seo'

export async function GET() {
  const blogs = await getAllBlogs()
  let author = {
    name: name,
    email: email,
  }

  let feed = new Feed({
    title: author.name,
    description: name + "'s blog",
    author,
    id: absoluteUrl('/'),
    link: absoluteUrl('/'),
    language: 'zh-CN',
    image: absoluteUrl('/social-card.png'),
    favicon: absoluteUrl('/favicon.ico'),
    copyright: `All rights reserved ${name} ${new Date().getFullYear()}`,
    updated: blogs[0] ? new Date(`${blogs[0].date}T00:00:00.000Z`) : undefined,
    feedLinks: {
      rss2: absoluteUrl('/feed/'),
    },
  })

  for (const blog of blogs) {
    const filePath = path.join(blogContentDir, `${blog.slug}.mdx`)
    const source = await fs.readFile(filePath, 'utf-8')
    const { content } = matter(source)

    feed.addItem({
      title: blog.title,
      id: absoluteUrl(`/blogs/${blog.slug}/`),
      link: absoluteUrl(`/blogs/${blog.slug}/`),
      description: blog.description,
      content: content,
      author: [author],
      date: new Date(`${blog.date}T00:00:00.000Z`),
      category: [
        ...(blog.series ? [{ name: blog.series }] : []),
        ...(blog.topics ?? []).map((topic) => ({ name: topic })),
      ],
    })
  }

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'cache-control': 's-maxage=86400',
      'content-language': 'zh-CN',
    },
  })
}
