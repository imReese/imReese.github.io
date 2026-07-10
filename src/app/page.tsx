import { Container } from '@/components/layout/Container'
import { ElegantIntro } from '@/components/home/ElegantIntro'
import { getAllBlogs } from '@/lib/blogs'
import { OpenSourcePulse } from '@/components/home/OpenSourcePulse'
import { HomepageNotes } from '@/components/home/HomepageNotes'
import { ExperienceStack } from '@/components/home/ExperienceStack'

export default async function Home() {
  const blogList = (await getAllBlogs()).slice(0, 3)

  return (
    <div className="min-h-screen overflow-x-hidden">
      <section className="pb-12 pt-10 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
        <Container>
          <ElegantIntro />
        </Container>
      </section>

      <section className="border-t border-border/60 py-16 sm:py-20 lg:py-24">
        <Container>
          <OpenSourcePulse />
        </Container>
      </section>

      <section className="border-t border-border/60 py-16 sm:py-20 lg:py-24">
        <Container>
          <ExperienceStack />
        </Container>
      </section>

      <section className="border-t border-border/60 py-16 sm:py-20 lg:py-24">
        <Container>
          <HomepageNotes blogs={blogList} />
        </Container>
      </section>
    </div>
  )
}
