'use client'

import { Suspense, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { Card } from '@/components/shared/Card'
import { Container } from '@/components/layout/Container'
import { useLocalizedContent } from '@/components/shared/useLocalizedContent'
import { type BlogPageContent } from '@/config/content'
import { type BlogType } from '@/lib/blogs'
import { formatDate } from '@/lib/formatDate'
import { BookOpenText, CalendarDays, Tags } from 'lucide-react'

const categoryLabels: Record<string, string> = {
  'engineering-deep-dive': 'Engineering Deep Dive',
  'debugging-validation': 'Debugging & Validation',
  'engineering-notes': 'Engineering Notes',
  runbooks: 'Runbooks',
  'reading-notes': 'Reading Notes',
}

function getCategoryLabel(category?: string) {
  return category ? (categoryLabels[category] ?? category) : 'Engineering Notes'
}

function isSecondaryNote(blog: BlogType) {
  return blog.category === 'runbooks' || blog.category === 'reading-notes'
}

function BlogMeta({ blog }: { blog: BlogType }) {
  const chips = [
    getCategoryLabel(blog.category),
    blog.series,
    ...(blog.topics ?? []).slice(0, 2),
  ].filter((chip): chip is string => Boolean(chip))

  return (
    <div className="relative z-10 mt-4 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={chip}
          className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground"
        >
          {chip}
        </span>
      ))}
    </div>
  )
}

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
        <BlogMeta blog={blog} />
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

function FeaturedBlog({ blog, readBlog }: { blog: BlogType; readBlog: string }) {
  return (
    <Card
      as="article"
      className="rounded-lg border border-border/70 bg-card/70 p-5 shadow-sm"
    >
      <Card.Eyebrow as="time" dateTime={blog.date}>
        {formatDate(blog.date)}
      </Card.Eyebrow>
      <Card.Title href={`/blogs/${blog.slug}`}>{blog.title}</Card.Title>
      <Card.Description>{blog.description}</Card.Description>
      <BlogMeta blog={blog} />
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

function getBlogYears(blogs: BlogType[]) {
  const counts = new Map<string, number>()

  for (const blog of blogs) {
    const year = blog.date.slice(0, 4)
    counts.set(year, (counts.get(year) ?? 0) + 1)
  }

  return Array.from(counts.entries()).sort(([a], [z]) => Number(z) - Number(a))
}

function getTopicCounts(blogs: BlogType[]) {
  const counts = new Map<string, number>()

  for (const blog of blogs) {
    for (const topic of blog.topics ?? []) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1)
    }
  }

  return counts
}

function getFilterHref({
  year,
  topic,
}: {
  year?: string | null
  topic?: string | null
}) {
  const params = new URLSearchParams()

  if (year) {
    params.set('year', year)
  }

  if (topic) {
    params.set('topic', topic)
  }

  const query = params.toString()
  return query ? `/blogs?${query}` : '/blogs'
}

function BlogReadingMap({
  blogs,
  copy,
  selectedYear,
  selectedTopic,
}: {
  blogs: BlogType[]
  copy: BlogPageContent['readingMap']
  selectedYear: string | null
  selectedTopic: string | null
}) {
  const latestBlog = blogs[0]
  const years = getBlogYears(blogs)
  const topicCounts = getTopicCounts(blogs)
  const hasActiveFilter = Boolean(selectedYear || selectedTopic)
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
                <Link
                  key={year}
                  href={getFilterHref({
                    year: selectedYear === year ? null : year,
                    topic: selectedTopic,
                  })}
                  scroll={false}
                  aria-current={selectedYear === year ? 'true' : undefined}
                  className={clsx(
                    'group flex items-center justify-between gap-3 rounded-md py-1 text-sm transition',
                    selectedYear === year
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary',
                  )}
                >
                  <span className="font-mono">{year}</span>
                  <span
                    className={clsx(
                      'rounded-full px-2 py-0.5 text-xs font-medium transition',
                      selectedYear === year
                        ? 'bg-primary/15 text-primary'
                        : 'bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary',
                    )}
                  >
                    {formatCount(count)}
                  </span>
                </Link>
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
                <Link
                  key={topic.value}
                  href={getFilterHref({
                    year: selectedYear,
                    topic: selectedTopic === topic.value ? null : topic.value,
                  })}
                  scroll={false}
                  aria-current={
                    selectedTopic === topic.value ? 'true' : undefined
                  }
                  aria-label={`${topic.label}, ${formatCount(topicCounts.get(topic.value) ?? 0)}`}
                  className={clsx(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition',
                    selectedTopic === topic.value
                      ? 'bg-primary/15 text-primary'
                      : 'bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary',
                  )}
                >
                  {topic.label}
                  <span className="ml-1 font-mono text-[0.65rem] opacity-70">
                    {topicCounts.get(topic.value) ?? 0}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {hasActiveFilter ? (
          <Link
            href="/blogs"
            scroll={false}
            className="mt-6 inline-flex text-xs font-semibold text-primary transition hover:text-primary/80"
          >
            {copy.clearFilter}
          </Link>
        ) : null}
      </div>
    </aside>
  )
}

function BlogsPageContentView({
  blogs,
  selectedYear,
  selectedTopic,
}: {
  blogs: BlogType[]
  selectedYear: string | null
  selectedTopic: string | null
}) {
  const { blogPage } = useLocalizedContent()
  const filteredBlogs = useMemo(
    () =>
      blogs.filter((blog) => {
        const matchesYear = selectedYear
          ? blog.date.slice(0, 4) === selectedYear
          : true
        const matchesTopic = selectedTopic
          ? (blog.topics ?? []).includes(selectedTopic)
          : true

        return matchesYear && matchesTopic
      }),
    [blogs, selectedTopic, selectedYear],
  )
  const hasActiveFilter = Boolean(selectedYear || selectedTopic)
  const featuredBlogs = useMemo(
    () => blogs.filter((blog) => blog.featured).slice(0, 6),
    [blogs],
  )
  const recentEngineeringBlogs = useMemo(
    () =>
      blogs
        .filter((blog) => !blog.featured && !isSecondaryNote(blog))
        .slice(0, 8),
    [blogs],
  )
  const secondaryBlogs = useMemo(
    () => blogs.filter((blog) => isSecondaryNote(blog)).slice(0, 8),
    [blogs],
  )

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

          <div className="mt-16 min-w-0 sm:mt-20">
            {!hasActiveFilter ? (
              <>
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
                      />
                    ))}
                  </div>
                </BlogSection>

                <BlogSection
                  title={blogPage.sections.recentTitle}
                  intro={blogPage.sections.recentIntro}
                >
                  <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
                    <div className="flex max-w-4xl flex-col space-y-12">
                      {recentEngineeringBlogs.map((blog) => (
                        <Blog
                          key={blog.slug}
                          blog={blog}
                          readBlog={blogPage.readBlog}
                        />
                      ))}
                    </div>
                  </div>
                </BlogSection>

                <BlogSection
                  title={blogPage.sections.notesTitle}
                  intro={blogPage.sections.notesIntro}
                >
                  <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
                    <div className="flex max-w-4xl flex-col space-y-12">
                      {secondaryBlogs.map((blog) => (
                        <Blog
                          key={blog.slug}
                          blog={blog}
                          readBlog={blogPage.readBlog}
                        />
                      ))}
                    </div>
                  </div>
                </BlogSection>
              </>
            ) : null}

            <BlogSection
              title={blogPage.sections.archiveTitle}
              intro={blogPage.sections.archiveIntro}
            >
              <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
                <div className="flex max-w-4xl flex-col space-y-12">
                  {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                      <Blog
                        key={blog.slug}
                        blog={blog}
                        readBlog={blogPage.readBlog}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {blogPage.readingMap.emptyFilter}
                    </p>
                  )}
                </div>
              </div>
            </BlogSection>
          </div>
        </div>
        <BlogReadingMap
          blogs={blogs}
          copy={blogPage.readingMap}
          selectedYear={selectedYear}
          selectedTopic={selectedTopic}
        />
      </div>
    </Container>
  )
}

function BlogsPageContentWithFilters({ blogs }: { blogs: BlogType[] }) {
  const searchParams = useSearchParams()

  return (
    <BlogsPageContentView
      blogs={blogs}
      selectedYear={searchParams.get('year')}
      selectedTopic={searchParams.get('topic')}
    />
  )
}

export function BlogsPageContent({ blogs }: { blogs: BlogType[] }) {
  return (
    <Suspense
      fallback={
        <BlogsPageContentView
          blogs={blogs}
          selectedYear={null}
          selectedTopic={null}
        />
      }
    >
      <BlogsPageContentWithFilters blogs={blogs} />
    </Suspense>
  )
}
