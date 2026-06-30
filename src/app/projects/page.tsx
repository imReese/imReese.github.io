import { type Metadata } from 'next'
import { SimpleLayout } from '@/components/layout/SimpleLayout'

import { projectHeadLine, projectIntro, projects, githubProjects, githubUsername } from '@/config/infoConfig'

import { ProjectCard } from '@/components/project/ProjectCard'
import { GithubProjectCard } from '@/components/project/GithubProjectCard'
import { CustomIcon } from '@/components/shared/CustomIcon'
import GitHubSnake from '@/components/home/GitHubSnake'

export const metadata: Metadata = {
  title: 'Projects',
  description: projectHeadLine,
}

export default function Projects() {
  const hasGithubProjects = githubProjects.length > 0

  return (
    <SimpleLayout
      title={projectHeadLine}
      intro={projectIntro}
    >
      <ul
        role="list"
        className="grid max-w-full grid-cols-1 gap-x-8 gap-y-12 pb-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </ul>

      <section className="mx-auto my-4 flex w-full max-w-xl min-w-0 flex-col gap-5 border-t border-muted py-8 lg:max-w-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="flex flex-row items-center justify-start gap-2 text-xl font-semibold tracking-tight opacity-80 md:text-3xl">
              <CustomIcon name="github" size={28} />
              GitHub activity
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              A rolling snapshot of my contribution rhythm across backend systems,
              runtime experiments, and open-source notes.
            </p>
          </div>
          <a
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary transition hover:text-primary/80"
          >
            View GitHub profile
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
            {githubProjects.map((project) => (
              <GithubProjectCard key={project.name} project={project} titleAs='h3'/>
            ))}
          </ul>
        )}
      </section>
    </SimpleLayout>
  )
}
