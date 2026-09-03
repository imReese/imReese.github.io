import glob from 'fast-glob'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { blogContentDir } from './contentPaths.ts'

export type BlogLanguage = 'zh-CN' | 'en'
export type BlogLocale = 'zh' | 'en'

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
}

async function importBlog(blogFilename: string): Promise<BlogType> {
  const source = await fs.readFile(
    path.join(blogContentDir, blogFilename),
    'utf-8',
  )

  const { data } = matter(source)
  const language: BlogLanguage = data.language === 'en' ? 'en' : 'zh-CN'
  const slug = blogFilename.replace(/\.mdx$/, '')
  const translationKey =
    data.translationKey ??
    (language === 'en' && slug.endsWith('-en') ? slug.slice(0, -3) : undefined)

  return {
    ...data,
    language,
    translationKey,
    slug,
  } as BlogType
}

export async function getAllBlogs() {
  let blogFileNames = await glob('*.mdx', {
    cwd: blogContentDir,
  })

  let blogs = await Promise.all(blogFileNames.map(importBlog))

  return getPublishedBlogs(blogs)
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

export function getLocalizedBlogs(blogs: BlogType[], locale: BlogLocale) {
  const preferredLanguage: BlogLanguage = locale === 'zh' ? 'zh-CN' : 'en'
  const groups = new Map<string, BlogType[]>()

  for (const blog of blogs) {
    const key = blog.translationKey ?? blog.slug
    const variants = groups.get(key)
    if (variants) {
      variants.push(blog)
    } else {
      groups.set(key, [blog])
    }
  }

  return Array.from(groups.values())
    .map(
      (variants) =>
        variants.find((blog) => blog.language === preferredLanguage) ??
        variants.find((blog) => blog.language === 'zh-CN') ??
        variants[0],
    )
    .filter((blog): blog is BlogType => Boolean(blog))
    .sort((a, z) => {
      const aDate = a.date ? +new Date(a.date) : 0
      const zDate = z.date ? +new Date(z.date) : 0
      return zDate - aDate
    })
}

export async function getBlogBySlug(slug: string): Promise<BlogType | null> {
  try {
    // 移除可能存在的 .mdx 扩展名
    const cleanSlug = slug.replace(/\.mdx$/, '')
    const blog = await importBlog(`${cleanSlug}.mdx`)
    return blog.draft === true ? null : blog
  } catch (error) {
    console.error(`Failed to load blog with slug: ${slug}`, error)
    return null
  }
}
