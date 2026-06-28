import { Container } from "@/components/layout/Container"
import { ElegantIntro } from "@/components/home/ElegantIntro"
import AnimatedCareer from "@/components/home/AnimatedCareer"
import AnimatedEducation from "@/components/home/AnimatedEducation"
import { getAllBlogs } from "@/lib/blogs"
import { techIcons } from "@/config/infoConfig"
import IconCloud from "@/components/ui/icon-cloud"
import { OpenSourcePulse } from "@/components/home/OpenSourcePulse"
import { HomepageNotes } from "@/components/home/HomepageNotes"

export default async function Home() {
  let blogList = (await getAllBlogs()).slice(0, 3)

  return (
    <div className="min-h-screen">
      <section className="pb-14 pt-10 sm:pt-14 lg:pb-20 lg:pt-20">
        <Container>
          <ElegantIntro />
        </Container>
      </section>

      <section className="py-10 lg:py-14">
        <Container>
          <OpenSourcePulse />
        </Container>
      </section>

      <section className="py-12 lg:py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <AnimatedCareer />
            <AnimatedEducation />
          </div>
        </Container>
      </section>

      <section className="py-12 lg:py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
            <HomepageNotes blogs={blogList} />

            <section className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Engineering stack</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  The tools I reach for when building services, debugging systems, and keeping infrastructure observable.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                <span className="rounded-full bg-secondary px-3 py-1">Backend</span>
                <span className="rounded-full bg-secondary px-3 py-1">Cloud Native</span>
                <span className="rounded-full bg-secondary px-3 py-1">Observability</span>
              </div>
              <div className="mt-5 rounded-xl border border-border/50 bg-background/55">
                <IconCloud iconSlugs={techIcons} />
              </div>
            </section>
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-20">
        <Container>
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-8 text-center shadow-xl shadow-primary/5">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Have a backend or infrastructure problem worth solving?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              I like turning practical systems work into reliable products and useful notes.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="mailto:reese_duan@outlook.com"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5"
              >
                Get in touch
              </a>
              <a
                href="/projects"
                className="inline-flex items-center justify-center rounded-full border border-primary/35 px-6 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-primary/10"
              >
                View projects
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
