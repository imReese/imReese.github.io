import { email, name } from '@/config/infoConfig'
import { getAllBlogs } from '@/lib/blogs'
import { createRssResponse } from '@/lib/rss'

export async function GET() {
  return createRssResponse(await getAllBlogs(), { name, email })
}
