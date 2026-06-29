import { Container } from "@/components/layout/Container"
import { ElegantIntro } from "@/components/home/ElegantIntro"
import { getAllBlogs } from "@/lib/blogs"
import { OpenSourcePulse } from "@/components/home/OpenSourcePulse"
import { HomepageNotes } from "@/components/home/HomepageNotes"
import { ExperienceStack } from "@/components/home/ExperienceStack"

export default async function Home() {
  const blogList = (await getAllBlogs()).slice(0, 3)

  return (
    <div className="min-h-screen overflow-x-hidden">
      <section className="pb-6 pt-8 sm:pt-10 lg:pb-6 lg:pt-14">
        <Container>
          <ElegantIntro />
        </Container>
      </section>

      <section className="py-8 lg:py-10">
        <Container>
          <OpenSourcePulse />
        </Container>
      </section>

      <section className="py-10 lg:py-14">
        <Container>
          <ExperienceStack />
        </Container>
      </section>

      <section className="py-10 lg:py-14">
        <Container>
          <HomepageNotes blogs={blogList} />
        </Container>
      </section>
    </div>
  )
}
