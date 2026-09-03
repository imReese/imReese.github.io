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
}

async function importBlog(blogFilename: string): Promise<BlogType> {
  const source = await fs.readFile(
    path.join(blogContentDir, blogFilename),
    'utf-8',
  )

  const { data } = matter(source)
  const language: BlogLanguage = data.language === 'en' ? 'en' : 'zh-CN'

  return {
    ...data,
    language,
    slug: blogFilename.replace(/\.mdx$/, ''),
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
