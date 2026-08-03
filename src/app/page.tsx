import { type Metadata } from 'next'

import { Container } from '@/components/layout/Container'
import { ElegantIntro } from '@/components/home/ElegantIntro'
import { getAllBlogs } from '@/lib/blogs'
import { OpenSourcePulse } from '@/components/home/OpenSourcePulse'
import { HomepageNotes } from '@/components/home/HomepageNotes'
import { contentByLocale, siteContent } from '@/config/content'
import { createPageMetadata, serializeJsonLd, absoluteUrl } from '@/lib/seo'

const homeMetadata = contentByLocale.en.pages.metadata.home

export const metadata: Metadata = createPageMetadata({
  title: homeMetadata.title,
  description: homeMetadata.description,
  path: '/',
  absoluteTitle: true,
})

export default async function Home() {
  const blogList = (await getAllBlogs()).slice(0, 3)
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteContent.site.name,
    url: absoluteUrl('/'),
    image: absoluteUrl('/android-chrome-512x512.png'),
    jobTitle: 'Software Engineer, Inference Engine',
    sameAs: [`https://github.com/${siteContent.site.githubUsername}`],
    knowsAbout: [
      'LLM inference systems',
      'KV cache systems',
      'Distributed storage systems',
      'Performance engineering',
    ],
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
      />
      <section className="pb-16 pt-10 sm:py-20 lg:pb-8 lg:pt-16">
        <Container>
          <ElegantIntro />
        </Container>
      </section>

      <section className="border-t border-border/60 py-14 sm:py-16 lg:py-14">
        <Container>
          <OpenSourcePulse />
        </Container>
      </section>

      <section className="border-t border-border/60 py-14 sm:py-16 lg:py-20">
        <Container>
          <HomepageNotes blogs={blogList} />
        </Container>
      </section>
    </div>
  )
}
