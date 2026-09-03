import glob from 'fast-glob'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { blogContentDir } from './contentPaths.ts'

export type BlogLanguage = 'zh-CN' | 'en'

export type BlogType = {
  title: string
  description: string
  author: string
  date: string
  slug: string
  topics?: string[]
  category?: string
  series?: string
  featured?: boolean
  draft?: boolean
  language: BlogLanguage
  translationKey?: string
  sourceSlug?: string
}

async function importBlog(blogFilename: string): Promise<BlogType> {
  const source = await fs.readFile(
    path.join(blogContentDir, blogFilename),
    'utf-8',
  )

  const { data } = matter(source)
  const language: BlogLanguage = data.language === 'en' ? 'en' : 'zh-CN'
  const sourceSlug = blogFilename.replace(/\.mdx$/, '')
  const translationKey =
    data.translationKey ??
    (language === 'en' && sourceSlug.endsWith('-en')
      ? sourceSlug.slice(0, -3)
      : undefined)

  return {
    ...data,
    language,
    translationKey,
    sourceSlug,
    slug: sourceSlug,
  } as BlogType
}

function applyTranslatedPublicSlugs(blogs: BlogType[]) {
  const translatedKeys = new Set(
    blogs
      .filter((blog) => blog.language === 'en' && blog.translationKey)
      .map((blog) => blog.translationKey as string),
  )

  return blogs.map((blog) => {
    const sourceSlug = blog.sourceSlug ?? blog.slug

    if (blog.language === 'zh-CN' && translatedKeys.has(sourceSlug)) {
      return {
        ...blog,
        translationKey: blog.translationKey ?? sourceSlug,
        slug: `${sourceSlug}-zh`,
      }
    }

    return blog
  })
}

export async function getAllBlogs() {
  const blogFileNames = await glob('*.mdx', {
    cwd: blogContentDir,
  })

  const blogs = await Promise.all(blogFileNames.map(importBlog))

  return getPublishedBlogs(applyTranslatedPublicSlugs(blogs))
}

export function getPublishedBlogs(blogs: BlogType[]) {
  const seenSlugs = new Set<string>()

  return blogs
    .filter((blog) => blog.draft !== true)
    .sort((a, z) => {
      const aDate = a.date ? +new Date(a.date) : 0
      const zDate = z.date ? +new Date(z.date) : 0
      return zDate - aDate
    })
    .filter((blog) => {
      if (seenSlugs.has(blog.slug)) {
        return false
      }

      seenSlugs.add(blog.slug)
      return true
    })
}

export async function getBlogBySlug(slug: string): Promise<BlogType | null> {
  const cleanSlug = slug.replace(/\.mdx$/, '')
  const blogs = await getAllBlogs()
  return blogs.find((blog) => blog.slug === cleanSlug) ?? null
}
