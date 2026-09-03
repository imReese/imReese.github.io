import { compileMDX } from 'next-mdx-remote/rsc'
import { promises as fs } from 'fs'
import path from 'path'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { mdxComponents } from '@/components/shared/MdxComponents'
import { blogContentDir } from './contentPaths'
import rehypeMathjaxV4 from './rehypeMathjaxV4'
import type { BlogLanguage } from './blogs'

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

function rewriteLegacyTranslationLink(
  source: string,
  translationKey?: string,
  language?: BlogLanguage,
) {
  if (!translationKey || language !== 'en') {
    return source
  }

  return source.replaceAll(
    `/blogs/${translationKey}/`,
    `/blogs/${translationKey}-zh/`,
  )
}

export async function getMDXContent(
  sourceSlug: string,
  title?: string,
  translationKey?: string,
  language?: BlogLanguage,
) {
  const filePath = path.join(blogContentDir, `${sourceSlug}.mdx`)
  const rawSource = await fs.readFile(filePath, 'utf-8')
  const source = rewriteLegacyTranslationLink(
    removeDuplicateTitleHeading(rawSource, title),
    translationKey,
    language,
  )

  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeMathjaxV4],
      },
    },
  })

  return content
}
