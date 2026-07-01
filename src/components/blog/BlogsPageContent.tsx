'use client'

import Link from 'next/link'
import { Card } from '@/components/shared/Card'
import { Container } from '@/components/layout/Container'
import { useLocalizedContent } from '@/components/shared/useLocalizedContent'
import { type BlogPageContent } from '@/config/content'
import { type BlogType } from '@/lib/blogs'
import { formatDate } from '@/lib/formatDate'
import { BookOpenText, CalendarDays, Tags } from 'lucide-react'

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

function getBlogYears(blogs: BlogType[]) {
  const counts = new Map<string, number>()

  for (const blog of blogs) {
    const year = blog.date.slice(0, 4)
    counts.set(year, (counts.get(year) ?? 0) + 1)
  }

  return Array.from(counts.entries()).sort(([a], [z]) => Number(z) - Number(a))
}

function BlogReadingMap({
  blogs,
  copy,
}: {
  blogs: BlogType[]
  copy: BlogPageContent['readingMap']
}) {
  const latestBlog = blogs[0]
  const years = getBlogYears(blogs)
  const formatCount = (count: number) =>
    `${count} ${count === 1 ? copy.noteSingular : copy.notePlural}`

  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <div className="rounded-2xl border border-border/70 bg-card/75 p-5 shadow-sm backdrop-blur sm:p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <BookOpenText className="h-4 w-4" aria-hidden="true" />
          <span>{copy.title}</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {copy.intro}
        </p>

        {latestBlog ? (
          <div className="mt-6 border-t border-border/70 pt-5">
            <div className="text-xs font-semibold text-primary">
              {copy.latestLabel}
            </div>
            <Link
              href={`/blogs/${latestBlog.slug}`}
              className="mt-2 block text-sm font-semibold leading-6 text-foreground transition hover:text-primary"
            >
              {latestBlog.title}
            </Link>
            <time
              dateTime={latestBlog.date}
              className="mt-2 block font-mono text-xs text-muted-foreground"
            >
              {formatDate(latestBlog.date)}
            </time>
          </div>
        ) : null}

        <div className="mt-6 grid gap-5 border-t border-border/70 pt-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.archiveLabel}</span>
            </div>
            <div className="mt-3 grid gap-2">
              {years.map(([year, count]) => (
                <div
                  key={year}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="font-mono text-muted-foreground">
                    {year}
                  </span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {formatCount(count)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <Tags className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.topicsLabel}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {copy.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export function BlogsPageContent({ blogs }: { blogs: BlogType[] }) {
  const { blogPage } = useLocalizedContent()

  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0">
          <header className="w-[calc(100vw-4rem)] min-w-0 max-w-4xl sm:w-full">
            <h1 className="break-words text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
              {blogPage.headline}
            </h1>
            <p className="mt-6 max-w-3xl break-words text-base text-zinc-600 dark:text-zinc-400">
              {blogPage.intro}
            </p>
          </header>

          <div className="mt-16 min-w-0 sm:mt-20 md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
            <div className="flex max-w-4xl flex-col space-y-16">
              {blogs.map((blog) => (
                <Blog
                  key={blog.slug}
                  blog={blog}
                  readBlog={blogPage.readBlog}
                />
              ))}
            </div>
          </div>
        </div>
        <BlogReadingMap blogs={blogs} copy={blogPage.readingMap} />
      </div>
    </Container>
  )
}
