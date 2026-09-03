import type { BlogLanguage, BlogType } from './blogs'

export type BlogLocale = 'zh' | 'en'

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
