import { compileMDX } from 'next-mdx-remote/rsc'
import { promises as fs } from 'fs'
import path from 'path'
import { mdxComponents } from '@/components/shared/MdxComponents'
import { blogContentDir } from './contentPaths'

export async function getMDXContent(slug: string) {
  const filePath = path.join(blogContentDir, `${slug}.mdx`)
  const source = await fs.readFile(filePath, 'utf-8')
  
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: true }
  })
  
  return content
}
