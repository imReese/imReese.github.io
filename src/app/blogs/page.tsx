import { type Metadata } from 'next'

import { BlogsPageContent } from '@/components/blog/BlogsPageContent'
import { getAllBlogs } from '@/lib/blogs'
import { createPageMetadata } from '@/lib/seo'

export const runtime = process.env.NEXT_RUNTIME === 'edge' ? 'edge' : 'nodejs'

export const metadata: Metadata = createPageMetadata({
  title: 'Blog',
  description:
    'Chinese engineering articles on SGLang runtime, Mooncake and HiCache internals, KV cache systems, storage, performance, and runbooks.',
  path: '/blogs/',
})

export default async function BlogsIndex() {
  let blogs = await getAllBlogs()

  return <BlogsPageContent blogs={blogs} />
}
