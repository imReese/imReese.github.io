'use client'

import { useContext } from 'react'
import { useRouter } from 'next/navigation'

import { AppContext } from '@/app/providers'
import { Container } from '@/components/layout/Container'
import { Prose } from '@/components/shared/Prose'
import { useLanguage } from '@/components/shared/LanguageProvider'
import { useLocalizedContent } from '@/components/shared/useLocalizedContent'
import { type BlogPageContent } from '@/config/content'
import { type BlogType } from '@/lib/blogs'
import { formatDate } from '@/lib/formatDate'

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

function ArrowLeftIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BlogLayout({
  blog,
  children,
}: {
  blog: BlogType
  children: React.ReactNode
}) {
  let router = useRouter()
  let { previousPathname } = useContext(AppContext)
  const { locale } = useLanguage()
  const { blogPage } = useLocalizedContent()
  const chips = [
    {
      key: `category:${blog.category ?? 'fallback'}`,
      label: getCategoryLabel(blog.category, blogPage.categories),
    },
    blog.series
      ? {
          key: `series:${blog.series}`,
          label: getSeriesLabel(blog.series, blogPage.series),
        }
      : null,
    ...(blog.topics ?? []).slice(0, 4).map((topic) => ({
      key: `topic:${topic}`,
      label: getTopicLabel(topic, blogPage.readingMap),
    })),
  ].filter((chip): chip is { key: string; label: string } => Boolean(chip))

  return (
    <Container className="mt-14 sm:mt-24">
      <div className="mx-auto w-full max-w-[1440px]">
        <article className="min-w-0">
          <header className="flex flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-6">
              {previousPathname && (
                <button
                  type="button"
                  onClick={() => router.back()}
                  aria-label={blogPage.article.backToBlogs}
                  className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  <ArrowLeftIcon className="h-4 w-4 stroke-current" />
                </button>
              )}
              <time
                dateTime={blog.date}
                className="ml-auto flex shrink-0 items-center font-mono text-xs text-muted-foreground"
              >
                <span>{formatDate(blog.date, locale)}</span>
                <span className="mx-2">·</span>
                <span>{blog.author}</span>
              </time>
            </div>
            <h1 className="mt-10 break-words text-[2.2rem] font-semibold leading-tight tracking-tight text-foreground sm:text-[3.35rem]">
              {blog.title}
            </h1>
            <p
              aria-label={blogPage.article.descriptionLabel}
              className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg"
            >
              {blog.description}
            </p>
            {chips.length > 0 ? (
              <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs leading-5 text-muted-foreground">
                {chips.map((chip, index) => (
                  <span
                    key={chip.key}
                    className="inline-flex items-center gap-x-2"
                  >
                    {index > 0 ? (
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/35" />
                    ) : null}
                    <span>{chip.label}</span>
                  </span>
                ))}
              </div>
            ) : null}
          </header>
          <Prose
            className="blog-prose mt-12 max-w-none text-[1.0625rem] leading-8"
            data-mdx-content
          >
            {children}
          </Prose>
        </article>
      </div>
    </Container>
  )
}
