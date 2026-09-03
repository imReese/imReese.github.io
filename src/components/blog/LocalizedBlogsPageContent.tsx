'use client'

import { useMemo } from 'react'

import { BlogsPageContent } from '@/components/blog/BlogsPageContent'
import { useLanguage } from '@/components/shared/LanguageProvider'
import { getLocalizedBlogs, type BlogType } from '@/lib/blogs'

export function LocalizedBlogsPageContent({ blogs }: { blogs: BlogType[] }) {
  const { locale } = useLanguage()
  const localizedBlogs = useMemo(
    () => getLocalizedBlogs(blogs, locale),
    [blogs, locale],
  )

  return <BlogsPageContent blogs={localizedBlogs} />
}
