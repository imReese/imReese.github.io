'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/formatDate'
import { type BlogType } from '@/lib/blogs'
import { getLocalizedBlogs } from '@/lib/blogTranslations'
import { useLocalizedContent } from '@/components/shared/useLocalizedContent'
import { useLanguage } from '@/components/shared/LanguageProvider'

export function HomepageNotes({ blogs }: { blogs: BlogType[] }) {
  const { home } = useLocalizedContent()
  const { locale } = useLanguage()
  const copy = home.notes
  const recentBlogs = useMemo(
    () => getLocalizedBlogs(blogs, locale).slice(0, 3),
    [blogs, locale],
  )

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-foreground">
            {copy.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            {copy.intro}
          </p>
        </div>
        <Link
          href="/blogs/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
        >
          {copy.allNotes}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 border-t border-border/70">
        {recentBlogs.length > 0 ? (
          recentBlogs.map((blog) => (
            <Link
              key={blog.translationKey ?? blog.slug}
              href={`/blogs/${blog.slug}/`}
              className="group grid min-w-0 gap-3 border-b border-border/70 py-6 transition sm:grid-cols-[8.5rem_minmax(0,1fr)_1.5rem] sm:gap-6"
            >
              <time
                dateTime={blog.date}
                className="font-mono text-xs leading-6 text-muted-foreground sm:pt-0.5"
              >
                {formatDate(blog.date, locale)}
              </time>
              <div className="min-w-0">
                <h3 className="text-base font-semibold leading-7 text-foreground transition group-hover:text-primary">
                  {blog.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {blog.description}
                </p>
              </div>
              <ChevronRight className="hidden h-4 w-4 self-center text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary sm:block" />
            </Link>
          ))
        ) : (
          <div className="border-b border-border/70 py-6 text-sm text-muted-foreground">
            {copy.empty}
          </div>
        )}
      </div>
    </section>
  )
}
