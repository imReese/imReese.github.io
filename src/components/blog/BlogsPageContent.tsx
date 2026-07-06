'use client'

import { useMemo } from 'react'
import { Card } from '@/components/shared/Card'
import { Container } from '@/components/layout/Container'
import { useLocalizedContent } from '@/components/shared/useLocalizedContent'
import { useLanguage } from '@/components/shared/LanguageProvider'
import { type BlogPageContent } from '@/config/content'
import { type BlogType } from '@/lib/blogs'
import { formatDate } from '@/lib/formatDate'

function getCategoryLabel(
  category: string | undefined,
  labels: BlogPageContent['categories'],
) {
  return category ? (labels[category] ?? category) : labels.fallback
}

function BlogMeta({
  blog,
  categoryLabels,
}: {
  blog: BlogType
  categoryLabels: BlogPageContent['categories']
}) {
  const chips = [
    {
      key: `category:${blog.category ?? 'fallback'}`,
      label: getCategoryLabel(blog.category, categoryLabels),
    },
    blog.series ? { key: `series:${blog.series}`, label: blog.series } : null,
    ...(blog.topics ?? []).slice(0, 2).map((topic) => ({
      key: `topic:${topic}`,
      label: topic,
    })),
  ].filter((chip): chip is { key: string; label: string } => Boolean(chip))

  return (
    <div className="relative z-10 mt-4 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground"
        >
          {chip.label}
        </span>
      ))}
    </div>
  )
}

function Blog({
  blog,
  readBlog,
  categoryLabels,
  locale,
}: {
  blog: BlogType
  readBlog: string
  categoryLabels: BlogPageContent['categories']
  locale: 'en' | 'zh'
}) {
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
          {formatDate(blog.date, locale)}
        </Card.Eyebrow>
        <Card.Description>{blog.description}</Card.Description>
        <BlogMeta blog={blog} categoryLabels={categoryLabels} />
        <Card.Cta>{readBlog}</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={blog.date}
        className="mt-1 hidden md:block"
      >
        {formatDate(blog.date, locale)}
      </Card.Eyebrow>
    </article>
  )
}

function FeaturedBlog({
  blog,
  readBlog,
  categoryLabels,
  locale,
}: {
  blog: BlogType
  readBlog: string
  categoryLabels: BlogPageContent['categories']
  locale: 'en' | 'zh'
}) {
  return (
    <Card
      as="article"
      className="rounded-lg border border-border/70 bg-card/70 p-5 shadow-sm"
    >
      <Card.Eyebrow as="time" dateTime={blog.date}>
        {formatDate(blog.date, locale)}
      </Card.Eyebrow>
      <Card.Title href={`/blogs/${blog.slug}`}>{blog.title}</Card.Title>
      <Card.Description>{blog.description}</Card.Description>
      <BlogMeta blog={blog} categoryLabels={categoryLabels} />
      <Card.Cta>{readBlog}</Card.Cta>
    </Card>
  )
}

function BlogSection({
  title,
  intro,
  children,
}: {
  title: string
  intro?: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-16 min-w-0 first:mt-0">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {intro ? (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {intro}
          </p>
        ) : null}
      </div>
      <div className="mt-8">{children}</div>
    </section>
  )
}

export function BlogsPageContent({ blogs }: { blogs: BlogType[] }) {
  const { blogPage } = useLocalizedContent()
  const { locale } = useLanguage()
  const featuredBlogs = useMemo(
    () => blogs.filter((blog) => blog.featured).slice(0, 4),
    [blogs],
  )

  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-4xl">
        <h1 className="break-words text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          {blogPage.headline}
        </h1>
        <p className="mt-6 max-w-3xl break-words text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {blogPage.intro}
        </p>
      </header>

      <div className="mt-14 min-w-0">
        <BlogSection
          title={blogPage.sections.featuredTitle}
          intro={blogPage.sections.featuredIntro}
        >
          <div className="grid gap-6 md:grid-cols-2">
            {featuredBlogs.map((blog) => (
              <FeaturedBlog
                key={blog.slug}
                blog={blog}
                readBlog={blogPage.readBlog}
                categoryLabels={blogPage.categories}
                locale={locale}
              />
            ))}
          </div>
        </BlogSection>

        <BlogSection
          title={blogPage.sections.archiveTitle}
          intro={blogPage.sections.archiveIntro}
        >
          <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
            <div className="flex max-w-4xl flex-col space-y-12">
              {blogs.map((blog) => (
                <Blog
                  key={blog.slug}
                  blog={blog}
                  readBlog={blogPage.readBlog}
                  categoryLabels={blogPage.categories}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </BlogSection>
      </div>
    </Container>
  )
}
