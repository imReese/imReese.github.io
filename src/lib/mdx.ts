import { compileMDX } from 'next-mdx-remote/rsc'
import { promises as fs } from 'fs'
import path from 'path'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { mdxComponents } from '@/components/shared/MdxComponents'
import { blogContentDir } from './contentPaths'

function normalizeHeading(value: string) {
  return value
    .replace(/[`*_~[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function removeDuplicateTitleHeading(source: string, title?: string) {
  if (!title) {
    return source
  }

  const lines = source.split(/\r?\n/)
  let index = 0

  if (lines[index]?.trim() === '---') {
    index += 1
    while (index < lines.length && lines[index]?.trim() !== '---') {
      index += 1
    }
    if (index < lines.length) {
      index += 1
    }
  }

  while (index < lines.length && lines[index]?.trim() === '') {
    index += 1
  }

  const heading = lines[index]?.match(/^#\s+(.+?)\s*#?\s*$/)
  if (heading && normalizeHeading(heading[1]) === normalizeHeading(title)) {
    lines.splice(index, 1)
  }

  return lines.join('\n')
}

export async function getMDXContent(slug: string, title?: string) {
  const filePath = path.join(blogContentDir, `${slug}.mdx`)
  const source = removeDuplicateTitleHeading(
    await fs.readFile(filePath, 'utf-8'),
    title,
  )

  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [
          [rehypeKatex, { output: 'htmlAndMathml', strict: 'warn' }],
        ],
      },
    },
  })

  return content
}
