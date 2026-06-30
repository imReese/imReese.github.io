import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getAllBlogs, getBlogBySlug } from '@/lib/blogs'
import { getMDXContent } from '@/lib/mdx'
import { BlogLayout } from '@/components/layout/BlogLayout'

export const runtime = process.env.NEXT_RUNTIME === 'edge' ? 'edge' : 'nodejs'

// Generate static params for all blogs
export async function generateStaticParams() {
  const blogs = await getAllBlogs()
  
  return blogs.map((blog) => ({
    slug: blog.slug,
  }))
}

interface Props {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug)
  if (!blog) {
    return {
      title: 'Blog not found',
    }
  }

  return {
    title: blog.title,
    description: blog.description,
  }
}

export default async function BlogPage({ params }: Props) {
  const blog = await getBlogBySlug(params.slug)
  
  if (!blog) {
    notFound()
  }

  const content = await getMDXContent(params.slug, blog.title)

  return (
    <BlogLayout blog={blog}>
      {content}
    </BlogLayout>
  )
}
