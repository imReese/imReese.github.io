'use client'

import { Suspense, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { Container } from '@/components/layout/Container'
import { useLocalizedContent } from '@/components/shared/useLocalizedContent'
import { useLanguage } from '@/components/shared/LanguageProvider'
import { type BlogPageContent } from '@/config/content'
import { type BlogType } from '@/lib/blogs'
import { formatDate } from '@/lib/formatDate'
import { ChevronRight } from 'lucide-react'

function getCategoryLabel(
  category: string | undefined,
  labels: BlogPageContent['categories'],
) {
  return category ? (labels[category] ?? category) : labels.fallback
}

function getTopicLabel(topic: string, copy: BlogPageContent['readingMap']) {
  return copy.topics.find((item) => item.value === topic)?.label ?? topic
}

function getSeriesLabel(series: string, labels: BlogPageContent['series']) {
  return labels[series] ?? series
}

function BlogMeta({
  blog,
  categoryLabels,
  seriesLabels,
  readingMap,
}: {
  blog: BlogType
  categoryLabels: BlogPageContent['categories']
  seriesLabels: BlogPageContent['series']
  readingMap: BlogPageContent['readingMap']
}) {
  const chips = [
    {
      key: `category:${blog.category ?? 'fallback'}`,
      label: getCategoryLabel(blog.category, categoryLabels),
    },
    blog.series
      ? {
          key: `series:${blog.series}`,
          label: getSeriesLabel(blog.series, seriesLabels),
        }
      : null,
    ...(blog.topics ?? []).slice(0, 2).map((topic) => ({
      key: `topic:${topic}`,
      label: getTopicLabel(topic, readingMap),
    })),
  ].filter((chip): chip is { key: string; label: string } => Boolean(chip))

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs leading-5 text-muted-foreground">
      {chips.map((chip, index) => (
        <span key={chip.key} className="inline-flex items-center gap-x-2">
          {index > 0 ? (
            <span className="h-1 w-1 rounded-full bg-muted-foreground/35" />
          ) : null}
          <span>{chip.label}</span>
        </span>
      ))}
    </div>
  )
}

function Blog({
  blog,
  readBlog,
  categoryLabels,
  seriesLabels,
  readingMap,
  locale,
}: {
  blog: BlogType
  readBlog: string
  categoryLabels: BlogPageContent['categories']
  seriesLabels: BlogPageContent['series']
  readingMap: BlogPageContent['readingMap']
  locale: 'en' | 'zh'
}) {
  return (
    <article className="group relative border-t border-border/65 py-6 first:border-t-0 first:pt-0 sm:grid sm:grid-cols-[8.25rem_minmax(0,1fr)] sm:gap-7">
      <time
        dateTime={blog.date}
        className="block font-mono text-[0.78rem] leading-6 text-muted-foreground/80 sm:pt-1"
      >
        {formatDate(blog.date, locale)}
      </time>
      <div className="min-w-0">
        <h3 className="text-[1.05rem] font-semibold leading-7 text-foreground transition group-hover:text-primary">
          <Link href={`/blogs/${blog.slug}`}>
            <span className="absolute -inset-x-3 -inset-y-3 hidden rounded-lg transition group-hover:bg-muted/25 sm:block" />
            <span className="relative">{blog.title}</span>
          </Link>
        </h3>
        <p className="relative mt-2 text-sm leading-6 text-muted-foreground">
          {blog.description}
        </p>
        <div className="relative flex items-end justify-between gap-4">
          <BlogMeta
            blog={blog}
            categoryLabels={categoryLabels}
            seriesLabels={seriesLabels}
            readingMap={readingMap}
          />
          <span className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100 sm:inline-flex">
            {readBlog}
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  )
}

function LeadFeaturedBlog({
  blog,
  readBlog,
  categoryLabels,
  seriesLabels,
  readingMap,
  locale,
}: {
  blog: BlogType
  readBlog: string
  categoryLabels: BlogPageContent['categories']
  seriesLabels: BlogPageContent['series']
  readingMap: BlogPageContent['readingMap']
  locale: 'en' | 'zh'
}) {
  return (
    <article className="group relative min-w-0 border-y border-border/70 py-7 sm:py-8">
      <time
        dateTime={blog.date}
        className="block font-mono text-[0.78rem] text-muted-foreground/80"
      >
        {formatDate(blog.date, locale)}
      </time>
      <h3 className="mt-5 max-w-xl text-[1.55rem] font-semibold leading-tight text-foreground transition group-hover:text-primary sm:text-[2.08rem]">
        <Link href={`/blogs/${blog.slug}`}>
          <span className="absolute inset-0" />
          {blog.title}
        </Link>
      </h3>
      <p className="relative mt-5 max-w-xl text-base leading-7 text-muted-foreground">
        {blog.description}
      </p>
      <BlogMeta
        blog={blog}
        categoryLabels={categoryLabels}
        seriesLabels={seriesLabels}
        readingMap={readingMap}
      />
      <div
        aria-hidden="true"
        className="relative mt-8 inline-flex items-center gap-1 text-sm font-semibold text-primary"
      >
        {readBlog}
        <ChevronRight className="h-4 w-4" />
      </div>
    </article>
  )
}

function SupportingFeaturedBlog({
  blog,
  categoryLabels,
  seriesLabels,
  readingMap,
  locale,
}: {
  blog: BlogType
  categoryLabels: BlogPageContent['categories']
  seriesLabels: BlogPageContent['series']
  readingMap: BlogPageContent['readingMap']
  locale: 'en' | 'zh'
}) {
  return (
    <article className="group relative border-t border-border/65 py-5 first:border-t-0 first:pt-0">
      <div className="grid gap-3 sm:grid-cols-[6.75rem_minmax(0,1fr)]">
        <time
          dateTime={blog.date}
          className="font-mono text-[0.78rem] leading-6 text-muted-foreground/80"
        >
          {formatDate(blog.date, locale)}
        </time>
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-6 text-foreground transition group-hover:text-primary">
            <Link href={`/blogs/${blog.slug}`}>
              <span className="absolute inset-0" />
              {blog.title}
            </Link>
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {blog.description}
          </p>
          <BlogMeta
            blog={blog}
            categoryLabels={categoryLabels}
            seriesLabels={seriesLabels}
            readingMap={readingMap}
          />
        </div>
      </div>
    </article>
  )
}

function FeaturedBlogSet({
  blogs,
  readBlog,
  categoryLabels,
  seriesLabels,
  readingMap,
  locale,
}: {
  blogs: BlogType[]
  readBlog: string
  categoryLabels: BlogPageContent['categories']
  seriesLabels: BlogPageContent['series']
  readingMap: BlogPageContent['readingMap']
  locale: 'en' | 'zh'
}) {
  const [leadBlog, ...supportingBlogs] = blogs

  if (!leadBlog) {
    return null
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-10">
      <LeadFeaturedBlog
        blog={leadBlog}
        readBlog={readBlog}
        categoryLabels={categoryLabels}
        seriesLabels={seriesLabels}
        readingMap={readingMap}
        locale={locale}
      />
      <div className="border-y border-border/70 py-5 sm:py-6">
        {supportingBlogs.map((blog) => (
          <SupportingFeaturedBlog
            key={blog.slug}
            blog={blog}
            categoryLabels={categoryLabels}
            seriesLabels={seriesLabels}
            readingMap={readingMap}
            locale={locale}
          />
        ))}
      </div>
    </div>
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
    <section className="mt-20 min-w-0 first:mt-0">
      <div className="border-b border-border/70 pb-4">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {intro ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            {intro}
          </p>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
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
  locale,
}: {
  blogs: BlogType[]
  copy: BlogPageContent['readingMap']
  selectedYear: string | null
  selectedTopic: string | null
  locale: 'en' | 'zh'
}) {
  const latestBlog = blogs[0]
  const years = getBlogYears(blogs)
  const topicCounts = getTopicCounts(blogs)
  const hasActiveFilter = Boolean(selectedYear || selectedTopic)

  return (
    <aside className="hidden lg:block lg:sticky lg:top-28 lg:self-start">
      <div className="border-l border-border/70 pl-8">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          {copy.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {copy.intro}
        </p>

        {latestBlog ? (
          <div className="mt-7 border-t border-border/70 pt-5">
            <div className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary">
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
              {formatDate(latestBlog.date, locale)}
            </time>
          </div>
        ) : null}

        <div className="mt-7 grid gap-7 border-t border-border/70 pt-5">
          <div>
            <div className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary">
              {copy.archiveLabel}
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
                    'group flex items-baseline justify-between gap-3 py-0.5 text-sm transition',
                    selectedYear === year
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary',
                  )}
                >
                  <span className="font-mono">{year}</span>
                  <span
                    className={clsx(
                      'font-mono text-xs transition',
                      selectedYear === year
                        ? 'text-primary'
                        : 'text-muted-foreground/70 group-hover:text-primary',
                    )}
                  >
                    {count}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary">
              {copy.topicsLabel}
            </div>
            <div className="mt-3 grid gap-2">
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
                  aria-label={`${topic.label}, ${
                    topicCounts.get(topic.value) ?? 0
                  } ${
                    (topicCounts.get(topic.value) ?? 0) === 1
                      ? copy.noteSingular
                      : copy.notePlural
                  }`}
                  className={clsx(
                    'group flex items-baseline justify-between gap-3 py-0.5 text-sm transition',
                    selectedTopic === topic.value
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary',
                  )}
                >
                  {topic.label}
                  <span className="font-mono text-xs text-muted-foreground/70 transition group-hover:text-primary">
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
            className="mt-7 inline-flex border-b border-primary/40 pb-0.5 text-xs font-semibold text-primary transition hover:border-primary"
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
  const { locale } = useLanguage()
  const featuredBlogs = useMemo(
    () => blogs.filter((blog) => blog.featured).slice(0, 4),
    [blogs],
  )
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

  return (
    <Container className="mt-16 sm:mt-24">
      <header className="max-w-4xl border-b border-border/70 pb-10">
        <h1 className="max-w-3xl break-words text-[2.35rem] font-semibold leading-tight tracking-tight text-foreground sm:text-[3.75rem]">
          {blogPage.headline}
        </h1>
        <p className="mt-6 max-w-2xl break-words text-base leading-8 text-muted-foreground">
          {blogPage.intro}
        </p>
      </header>

      <div className="mt-12 grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_18.5rem]">
        <div className="min-w-0">
          <BlogSection
            title={blogPage.sections.featuredTitle}
            intro={blogPage.sections.featuredIntro}
          >
            <FeaturedBlogSet
              blogs={featuredBlogs}
              readBlog={blogPage.readBlog}
              categoryLabels={blogPage.categories}
              seriesLabels={blogPage.series}
              readingMap={blogPage.readingMap}
              locale={locale}
            />
          </BlogSection>

          <BlogSection
            title={blogPage.sections.archiveTitle}
            intro={blogPage.sections.archiveIntro}
          >
            <div className="max-w-4xl">
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <Blog
                    key={blog.slug}
                    blog={blog}
                    readBlog={blogPage.readBlog}
                    categoryLabels={blogPage.categories}
                    seriesLabels={blogPage.series}
                    readingMap={blogPage.readingMap}
                    locale={locale}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  {blogPage.readingMap.emptyFilter}
                </p>
              )}
            </div>
          </BlogSection>
        </div>

        <BlogReadingMap
          blogs={blogs}
          copy={blogPage.readingMap}
          selectedYear={selectedYear}
          selectedTopic={selectedTopic}
          locale={locale}
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
