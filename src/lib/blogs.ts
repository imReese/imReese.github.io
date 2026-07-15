import glob from 'fast-glob'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { blogContentDir } from './contentPaths'

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
  language: 'zh-CN'
}

async function importBlog(blogFilename: string): Promise<BlogType> {
  const source = await fs.readFile(
    path.join(blogContentDir, blogFilename),
    'utf-8',
  )

  const { data } = matter(source)

  return {
    language: 'zh-CN',
    slug: blogFilename.replace(/\.mdx$/, ''),
    ...data,
  } as BlogType
}

export async function getAllBlogs() {
  let blogFileNames = await glob('*.mdx', {
    cwd: blogContentDir,
  })

  let blogs = await Promise.all(blogFileNames.map(importBlog))

  return blogs.sort((a, z) => {
    const aDate = a.date ? +new Date(a.date) : 0
    const zDate = z.date ? +new Date(z.date) : 0
    return zDate - aDate
  })
}

export async function getBlogBySlug(slug: string): Promise<BlogType | null> {
  try {
    // 移除可能存在的 .mdx 扩展名
    const cleanSlug = slug.replace(/\.mdx$/, '')
    return await importBlog(`${cleanSlug}.mdx`)
  } catch (error) {
    console.error(`Failed to load blog with slug: ${slug}`, error)
    return null
  }
}
