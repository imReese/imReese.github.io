import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getAllBlogs, getBlogBySlug } from '@/lib/blogs'
import { getMDXContent } from '@/lib/mdx'
import { BlogLayout } from '@/components/layout/BlogLayout'
import {
  createArticleJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from '@/lib/seo'

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

  return createPageMetadata({
    title: blog.title,
    description: blog.description,
    path: `/blogs/${blog.slug}/`,
    type: 'article',
    language: blog.language,
    publishedTime: blog.date,
    authors: [blog.author],
  })
}

export default async function BlogPage({ params }: Props) {
  const blog = await getBlogBySlug(params.slug)

  if (!blog) {
    notFound()
  }

  const content = await getMDXContent(params.slug, blog.title)
  const articleJsonLd = createArticleJsonLd({
    title: blog.title,
    description: blog.description,
    slug: blog.slug,
    publishedTime: blog.date,
    author: blog.author,
    language: blog.language,
    topics: blog.topics,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
      />
      <BlogLayout blog={blog}>{content}</BlogLayout>
    </>
  )
}
