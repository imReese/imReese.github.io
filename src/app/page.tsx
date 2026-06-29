import Link from "next/link"
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

      <section className="py-12 lg:py-16">
        <Container>
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-8 text-center shadow-xl shadow-primary/5">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Have a backend or infrastructure problem worth solving?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              I like turning messy performance paths into measurable, maintainable systems.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="mailto:reese_duan@outlook.com"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5"
              >
                Get in touch
              </a>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-full border border-primary/35 px-6 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-primary/10"
              >
                View projects
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
