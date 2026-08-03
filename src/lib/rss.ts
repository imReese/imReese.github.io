import { Feed } from 'feed'

import { type BlogType, getPublishedBlogs } from './blogs.ts'
import { absoluteUrl, RSS_PATH, RSS_TITLE } from './seo.ts'

const RSS_DESCRIPTION =
  '关于大模型推理、分布式系统、存储与性能优化的技术文章。'

function publicationDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`)
}

export type RssAuthor = {
  name: string
  email: string
}

export function createRssXml(blogs: BlogType[], rssAuthor: RssAuthor) {
  const publishedBlogs = getPublishedBlogs(blogs)
  const author = {
    ...rssAuthor,
    link: absoluteUrl('/about/'),
  }
  const feed = new Feed({
    title: RSS_TITLE,
    description: RSS_DESCRIPTION,
    author,
    id: absoluteUrl('/blogs/'),
    link: absoluteUrl('/blogs/'),
    feed: absoluteUrl(RSS_PATH),
    language: 'zh-CN',
    image: absoluteUrl('/social-card.png'),
    favicon: absoluteUrl('/favicon.ico'),
    copyright: `All rights reserved ${rssAuthor.name}`,
    updated: publishedBlogs[0]
      ? publicationDate(publishedBlogs[0].date)
      : undefined,
  })

  for (const blog of publishedBlogs) {
    const url = absoluteUrl(`/blogs/${blog.slug}/`)

    feed.addItem({
      title: blog.title,
      description: blog.description,
      id: url,
      guid: url,
      link: url,
      author: [author],
      date: publicationDate(blog.date),
      category: [
        ...(blog.series ? [{ name: blog.series }] : []),
        ...(blog.topics ?? []).map((topic) => ({ name: topic })),
      ],
    })
  }

  return feed.rss2()
}

export function createRssResponse(blogs: BlogType[], author: RssAuthor) {
  return new Response(createRssXml(blogs, author), {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400',
      'Content-Language': 'zh-CN',
    },
  })
}
