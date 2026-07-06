"use client"

import { ArrowUpRight } from "@phosphor-icons/react"
import { CustomIcon } from "@/components/shared/CustomIcon"
import GitHubSnake from "@/components/home/GitHubSnake"
import { GithubProjectCard } from "@/components/project/GithubProjectCard"
import { ProjectCard } from "@/components/project/ProjectCard"
import { SimpleLayout } from "@/components/layout/SimpleLayout"
import { cn } from "@/lib/utils"
import { useLocalizedContent } from "@/components/shared/useLocalizedContent"

type WorkSection = {
  title: string
  intro: string
  items: Array<{
    name: string
    description: string
    href: string
    label: string
    tags: string[]
  }>
}

function WorkLinkSection({ section }: { section: WorkSection }) {
  return (
    <section className="pb-10">
      <div className="mb-5 max-w-2xl">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          {section.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {section.intro}
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {section.items.map((item) => {
          const isExternal = /^https?:\/\//.test(item.href)

          return (
            <a
              key={item.name}
              href={item.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="group min-w-0 rounded-lg border border-muted-foreground/20 bg-background/60 p-4 transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold leading-6">
                  {item.name}
                </h3>
                <ArrowUpRight
                  size={16}
                  weight="duotone"
                  className="mt-1 shrink-0 text-muted-foreground group-hover:text-primary"
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
              <p className="mt-3 truncate text-xs text-muted-foreground/80">
                {item.label}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs leading-5 text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}

export function ProjectsPageContent() {
  const { projects, projectsPage, site } = useLocalizedContent()
  const overviewItems = projects.overview ?? []
  const focus = projects.focus
  const workSections = projects.workSections ?? []
  const projectItems = projects.items.map((project) => ({
    name: project.name,
    description: project.description,
    link: { href: project.href.replace(/^https?:\/\//, ""), label: project.label },
    tags: project.tags,
  }))
  const hasGithubProjects = projects.githubItems.length > 0

  return (
    <SimpleLayout title={projects.headline} intro={projects.intro}>
      {overviewItems.length > 0 && (
        <section className="mb-10 grid gap-3 border-y border-muted py-5 sm:grid-cols-3">
          {overviewItems.map((item) => (
            <div key={item.label} className="min-w-0 py-1">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                {item.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </section>
      )}

      <ul
        role="list"
        className={cn(
          "grid max-w-full grid-cols-1 gap-x-5 gap-y-5 pb-10",
          projectItems.length > 1 ? "sm:grid-cols-2" : "max-w-3xl",
        )}
      >
        {projectItems.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </ul>

      {workSections.map((section) => (
        <WorkLinkSection key={section.title} section={section} />
      ))}

      {focus && focus.items.length > 0 && (
        <section className="pb-10">
          <div className="mb-5 max-w-2xl">
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
              {focus.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {focus.intro}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {focus.items.map((item) => (
              <div
                key={item.title}
                className="min-w-0 rounded-lg border border-muted-foreground/20 bg-background/60 p-4"
              >
                <h3 className="text-base font-semibold leading-6">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs leading-5 text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto my-4 flex w-full max-w-xl min-w-0 flex-col gap-5 border-t border-muted py-8 lg:max-w-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="flex flex-row items-center justify-start gap-2 text-xl font-semibold tracking-tight opacity-80 md:text-3xl">
              <CustomIcon name="github" size={28} />
              {projectsPage.githubActivityTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {projectsPage.githubActivityIntro}
            </p>
          </div>
          <a
            href={`https://github.com/${site.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary transition hover:text-primary/80"
          >
            {projectsPage.githubProfileLink}
          </a>
        </div>

        <div className="overflow-hidden rounded-2xl border border-muted-foreground/20 bg-background/70 p-4 shadow-sm">
          <GitHubSnake />
        </div>

        {hasGithubProjects && (
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3"
          >
            {projects.githubItems.map((project) => (
              <GithubProjectCard key={project.name} project={project} titleAs="h3" />
            ))}
          </ul>
        )}
      </section>
    </SimpleLayout>
  )
}
