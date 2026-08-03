import { type Metadata } from 'next'

import { AboutContent } from '@/components/about/AboutContent'
import { contentByLocale } from '@/config/content'
import { createPageMetadata } from '@/lib/seo'

const aboutMetadata = contentByLocale.en.pages.metadata.about

export const metadata: Metadata = createPageMetadata({
  title: aboutMetadata.title,
  description: aboutMetadata.description,
  path: '/about/',
})

export default function About() {
  return <AboutContent />
}
