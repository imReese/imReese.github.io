import { type Metadata } from 'next'

import { LocalizedBlogsPageContent } from '@/components/blog/LocalizedBlogsPageContent'
import { contentByLocale } from '@/config/content'
import { getAllBlogs } from '@/lib/blogs'
import { createPageMetadata } from '@/lib/seo'

export const runtime = process.env.NEXT_RUNTIME === 'edge' ? 'edge' : 'nodejs'

const blogMetadata = contentByLocale.en.pages.metadata.blog

export const metadata: Metadata = createPageMetadata({
  title: blogMetadata.title,
  description: blogMetadata.description,
  path: '/blogs/',
})

export default async function BlogsIndex() {
  let blogs = await getAllBlogs()

  return <LocalizedBlogsPageContent blogs={blogs} />
}
