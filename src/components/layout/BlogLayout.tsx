'use client'

import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Prose } from '@/components/shared/Prose'
import { useLanguage } from '@/components/shared/LanguageProvider'
import { useLocalizedContent } from '@/components/shared/useLocalizedContent'
import { type BlogType } from '@/lib/blogs'
import { getBlogMetaChips } from '@/lib/blogPresentation'
import { formatDate } from '@/lib/formatDate'

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
  const { locale } = useLanguage()
  const { blogPage } = useLocalizedContent()
  const chips = getBlogMetaChips(
    blog,
    blogPage.categories,
    blogPage.series,
    blogPage.readingMap,
    4,
  )

  return (
    <Container className="mt-14 sm:mt-24">
      <div className="mx-auto w-full max-w-6xl">
        <article className="min-w-0" lang={blog.language}>
          <header className="flex flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-6">
              <Link
                href="/blogs/"
                aria-label={blogPage.article.backToBlogs}
                className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
              >
                <ArrowLeftIcon className="h-4 w-4 stroke-current" />
              </Link>
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
