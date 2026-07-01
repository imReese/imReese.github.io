'use client'

import { Card } from '@/components/shared/Card'
import { SimpleLayout } from '@/components/layout/SimpleLayout'
import { useLocalizedContent } from '@/components/shared/useLocalizedContent'
import { type BlogType } from '@/lib/blogs'
import { formatDate } from '@/lib/formatDate'

function Blog({ blog, readBlog }: { blog: BlogType; readBlog: string }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/blogs/${blog.slug}`}>{blog.title}</Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={blog.date}
          className="md:hidden"
          decorate
        >
          {formatDate(blog.date)}
        </Card.Eyebrow>
        <Card.Description>{blog.description}</Card.Description>
        <Card.Cta>{readBlog}</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={blog.date}
        className="mt-1 hidden md:block"
      >
        {formatDate(blog.date)}
      </Card.Eyebrow>
    </article>
  )
}

export function BlogsPageContent({ blogs }: { blogs: BlogType[] }) {
  const { blogPage } = useLocalizedContent()

  return (
    <SimpleLayout
      title={blogPage.headline}
      intro={blogPage.intro}
      headerClassName="max-w-5xl"
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          {blogs.map((blog) => (
            <Blog key={blog.slug} blog={blog} readBlog={blogPage.readBlog} />
          ))}
        </div>
      </div>
    </SimpleLayout>
  )
}
