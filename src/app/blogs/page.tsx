import { type Metadata } from 'next'

import { BlogsPageContent } from '@/components/blog/BlogsPageContent'
import { getAllBlogs } from '@/lib/blogs'
import { blogIntro } from '@/config/infoConfig'

export const runtime = process.env.NEXT_RUNTIME === 'edge' ? 'edge' : 'nodejs'

export const metadata: Metadata = {
  title: 'Blogs',
  description: blogIntro,
}

export default async function BlogsIndex() {
  let blogs = await getAllBlogs()

  return <BlogsPageContent blogs={blogs} />
}
