import { type MetadataRoute } from 'next'

import { getAllBlogs } from '@/lib/blogs'
import { absoluteUrl } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'monthly', priority: 1 },
    { url: absoluteUrl('/about/'), changeFrequency: 'yearly', priority: 0.7 },
    {
      url: absoluteUrl('/projects/'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    { url: absoluteUrl('/blogs/'), changeFrequency: 'weekly', priority: 0.9 },
  ]
  const blogs = await getAllBlogs()

  return [
    ...staticPages,
    ...blogs.map((blog) => ({
      url: absoluteUrl(`/blogs/${blog.slug}/`),
      lastModified: new Date(`${blog.date}T00:00:00.000Z`),
      changeFrequency: 'yearly' as const,
      priority: blog.featured ? 0.8 : 0.6,
    })),
  ]
}
