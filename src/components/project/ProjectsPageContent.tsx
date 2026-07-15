'use client'

import { ArrowUpRight } from 'lucide-react'

import GitHubSnake from '@/components/home/GitHubSnake'
import { Container } from '@/components/layout/Container'
import { CustomIcon } from '@/components/shared/CustomIcon'
import {
  FlowDiagram,
  SystemBoundaryDiagram,
} from '@/components/shared/TechDiagram'
import { useLocalizedContent } from '@/components/shared/useLocalizedContent'
import { utm_source } from '@/config/siteConfig'
import { isExternalHref, withUtmSource } from '@/lib/externalLinks'

type WorkItem = {
  name: string
  description: string
  href: string
  label: string
  tags: string[]
  status?: {
    label: string
    description: string
  }
  capabilities?: string[]
  evidenceLinks?: Array<{ label: string; href: string }>
  relation?: string
  upstream?: { href: string; label: string }
}

type WorkSection = {
  title: string
  intro: string
  items: WorkItem[]
}

function LinkArrow() {
  return (
    <ArrowUpRight
      className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-primary"
      aria-hidden="true"
    />
  )
}

function RelatedLinks({
  links,
}: {
  links: Array<{ label: string; href: string }> | undefined
}) {
  if (!links || links.length === 0) {
    return null
  }

  return (
    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
      {links.map((link) => {
        const isExternal = isExternalHref(link.href)

        return (
          <a
            key={`${link.label}-${link.href}`}
            href={withUtmSource(link.href, utm_source)}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-1.5 text-xs transition hover:text-primary"
          >
            {link.label}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )
      })}
    </div>
  )
}

function TagLine({ tags }: { tags: string[] }) {
  if (tags.length === 0) {
    return null
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs leading-5 text-muted-foreground">
      {tags.map((tag, index) => (
        <span key={tag} className="inline-flex items-center gap-x-2">
          {index > 0 ? (
            <span className="h-1 w-1 rounded-full bg-muted-foreground/35" />
          ) : null}
          <span>{tag}</span>
        </span>
      ))}
    </div>
  )
}

function SectionHeader({ title, intro }: { title: string; intro: string }) {
  return (
    <div className="border-b border-border/70 pb-4">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
        {intro}
      </p>
    </div>
  )
}

function OverviewIndex({
  items,
}: {
  items: Array<{ label: string; value: string; description: string }>
}) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="border-y border-border/70 py-6">
      <div className="grid gap-6 md:grid-cols-3 md:gap-10">
        {items.map((item) => (
          <div key={item.label} className="min-w-0">
            <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary">
              {item.label}
            </p>
            <p className="mt-3 text-lg font-semibold tracking-tight text-foreground">
              {item.value}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function FeaturedSystems({ items }: { items: WorkItem[] }) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="mt-12">
      <ul
        role="list"
        className="divide-y divide-border/70 border-y border-border/70"
      >
        {items.map((item) => {
          const isExternal = isExternalHref(item.href)

          return (
            <li key={item.name} className="py-8 sm:px-3">
              <article className="grid gap-6 sm:grid-cols-[minmax(0,0.82fr)_minmax(0,1.35fr)]">
                <div className="flex min-w-0 items-start justify-between gap-4">
                  <div className="min-w-0">
                    {item.status ? (
                      <span className="mb-3 inline-flex rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-primary">
                        {item.status.label}
                      </span>
                    ) : null}
                    <h2 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
                      <a
                        href={withUtmSource(item.href, utm_source)}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="group inline-flex items-start gap-2 transition hover:text-primary"
                      >
                        {item.name}
                        <LinkArrow />
                      </a>
                    </h2>
                    <p className="mt-3 truncate font-mono text-xs text-muted-foreground">
                      {item.label}
                    </p>
                    {item.status ? (
                      <p className="mt-4 text-sm leading-6 text-muted-foreground">
                        {item.status.description}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                  {item.capabilities && item.capabilities.length > 0 ? (
                    <ul className="mt-5 space-y-2">
                      {item.capabilities.map((capability) => (
                        <li
                          key={capability}
                          className="flex gap-2.5 text-sm leading-6 text-muted-foreground"
                        >
                          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                          <span>{capability}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <TagLine tags={item.tags} />
                  <RelatedLinks links={item.evidenceLinks} />
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function WorkSectionList({ section }: { section: WorkSection }) {
  return (
    <section className="mt-16">
      <SectionHeader title={section.title} intro={section.intro} />
      <ul role="list" className="divide-y divide-border/70">
        {section.items.map((item) => {
          const isExternal = isExternalHref(item.href)

          return (
            <li key={item.name} className="py-5 sm:px-3">
              <article className="grid gap-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
                <div className="min-w-0">
                  {item.relation ? (
                    <span className="mb-2 block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-primary">
                      {item.relation}
                    </span>
                  ) : null}
                  <h3 className="text-base font-semibold leading-6 text-foreground">
                    <a
                      href={withUtmSource(item.href, utm_source)}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="group inline-flex items-start gap-1.5 transition hover:text-primary"
                    >
                      {item.name}
                      <LinkArrow />
                    </a>
                  </h3>
                  <p className="mt-2 truncate font-mono text-xs text-muted-foreground">
                    {item.label}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                  <TagLine tags={item.tags} />
                  <RelatedLinks
                    links={[
                      ...(item.upstream ? [item.upstream] : []),
                      ...(item.evidenceLinks ?? []),
                    ]}
                  />
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function ArchitectureViews({
  diagrams,
}: {
  diagrams: ReturnType<typeof useLocalizedContent>['projects']['diagrams']
}) {
  if (!diagrams?.runtime && !diagrams?.platform) {
    return null
  }

  return (
    <section className="mt-16">
      {diagrams.runtime ? (
        <FlowDiagram
          eyebrow={diagrams.runtime.eyebrow}
          title={diagrams.runtime.title}
          caption={diagrams.runtime.caption}
          steps={diagrams.runtime.steps}
        />
      ) : null}
      {diagrams.platform ? (
        <SystemBoundaryDiagram
          eyebrow={diagrams.platform.eyebrow}
          title={diagrams.platform.title}
          caption={diagrams.platform.caption}
          groups={diagrams.platform.groups}
        />
      ) : null}
    </section>
  )
}

function FocusTracks({
  focus,
}: {
  focus:
    | {
        title: string
        intro: string
        items: Array<{ title: string; description: string; tags: string[] }>
      }
    | undefined
}) {
  if (!focus || focus.items.length === 0) {
    return null
  }

  return (
    <section className="mt-16">
      <SectionHeader title={focus.title} intro={focus.intro} />
      <div className="grid gap-x-10 sm:grid-cols-2">
        {focus.items.map((item) => (
          <article key={item.title} className="border-b border-border/70 py-5">
            <h3 className="text-base font-semibold leading-6 text-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
            <TagLine tags={item.tags} />
          </article>
        ))}
      </div>
    </section>
  )
}

function GitHubActivity({
  title,
  intro,
  href,
  linkLabel,
}: {
  title: string
  intro: string
  href: string
  linkLabel: string
}) {
  return (
    <section className="mt-16 border-t border-border/70 pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
            <CustomIcon name="github" size={22} />
            <h2>{title}</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            {intro}
          </p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary/80"
        >
          {linkLabel}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
      <div className="mt-6 border-y border-border/70 py-4">
        <GitHubSnake />
      </div>
    </section>
  )
}

export function ProjectsPageContent() {
  const { projects, projectsPage, site } = useLocalizedContent()
  const overviewItems = projects.overview ?? []
  const focus = projects.focus
  const workSections = projects.workSections ?? []
  const featuredSystems = projects.items.map((project) => ({
    name: project.name,
    description: project.description,
    href: project.href,
    label: project.label,
    tags: project.tags,
    status: project.status,
    capabilities: project.capabilities,
    evidenceLinks: project.evidenceLinks,
  }))

  return (
    <Container className="mt-16 sm:mt-24">
      <header className="max-w-4xl border-b border-border/70 pb-10">
        <h1 className="max-w-3xl break-words text-[2.35rem] font-semibold leading-tight tracking-tight text-foreground sm:text-[3.75rem]">
          {projects.headline}
        </h1>
        <p className="mt-6 max-w-2xl break-words text-base leading-8 text-muted-foreground">
          {projects.intro}
        </p>
      </header>

      <div className="mt-12">
        <OverviewIndex items={overviewItems} />
        <FeaturedSystems items={featuredSystems} />
        <ArchitectureViews diagrams={projects.diagrams} />

        {workSections.map((section) => (
          <WorkSectionList key={section.title} section={section} />
        ))}

        <FocusTracks focus={focus} />

        <GitHubActivity
          title={projectsPage.githubActivityTitle}
          intro={projectsPage.githubActivityIntro}
          href={withUtmSource(
            `https://github.com/${site.githubUsername}`,
            utm_source,
          )}
          linkLabel={projectsPage.githubProfileLink}
        />
      </div>
    </Container>
  )
}
