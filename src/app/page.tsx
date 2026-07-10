import { Container } from '@/components/layout/Container'
import { ElegantIntro } from '@/components/home/ElegantIntro'
import { getAllBlogs } from '@/lib/blogs'
import { OpenSourcePulse } from '@/components/home/OpenSourcePulse'
import { HomepageNotes } from '@/components/home/HomepageNotes'

export default async function Home() {
  const blogList = (await getAllBlogs()).slice(0, 3)

  return (
    <div className="min-h-screen overflow-x-hidden">
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
