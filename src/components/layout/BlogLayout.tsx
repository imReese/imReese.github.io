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
    blog.series ? { key: `series:${blog.series}`, label: blog.series } : null,
    ...(blog.topics ?? []).slice(0, 4).map((topic) => ({
      key: `topic:${topic}`,
      label: topic,
    })),
  ].filter((chip): chip is { key: string; label: string } => Boolean(chip))

  return (
    <Container className="mt-16 lg:mt-32">
      <div className="mx-auto max-w-[1440px]">
        <article className="min-w-0">
          <header className="flex flex-col">
            <div className="flex items-center justify-between gap-4">
              {previousPathname && (
                <button
                  type="button"
                  onClick={() => router.back()}
                  aria-label={blogPage.article.backToBlogs}
                  className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff1f5] shadow-md shadow-[#4c4f69]/5 ring-1 ring-[#bcc0cc]/70 transition hover:ring-primary/30 dark:bg-[#313244] dark:ring-[#45475a]/80 dark:hover:ring-[#94e2d5]/30"
                >
                  <ArrowLeftIcon className="h-4 w-4 stroke-muted-foreground transition group-hover:stroke-primary" />
                </button>
              )}
              <time
                dateTime={blog.date}
                className="ml-auto flex shrink-0 items-center text-base text-muted-foreground"
              >
                <span className="h-4 w-0.5 rounded-full bg-border" />
                <span className="ml-3">{formatDate(blog.date, locale)}</span>
                <span className="mx-2">·</span>
                <span>{blog.author}</span>
              </time>
            </div>
            <h1 className="mt-6 break-words text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
              {blog.title}
            </h1>
            <p
              aria-label={blogPage.article.descriptionLabel}
              className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground"
            >
              {blog.description}
            </p>
            {chips.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip.key}
                    className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
            ) : null}
          </header>
          <Prose className="mt-10 max-w-none text-[1.0625rem] leading-8" data-mdx-content>
            {children}
          </Prose>
        </article>
      </div>
    </Container>
  )
}
