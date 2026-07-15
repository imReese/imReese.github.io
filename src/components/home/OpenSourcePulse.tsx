'use client'

import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { useLocalizedContent } from '@/components/shared/useLocalizedContent'

type BoundaryArea = {
  title: string
  label: string
}

function SystemBoundaryMap({ areas }: { areas: BoundaryArea[] }) {
  const nodes = areas.slice(0, 4)

  return (
    <figure
      role="img"
      aria-label={nodes.map((node) => node.title).join(' → ')}
      className="border-y border-border/70 py-4"
    >
      <ol className="grid gap-5 md:grid-cols-4 md:gap-4">
        {nodes.map((node, index) => (
          <li
            key={node.title}
            className="relative min-w-0 border-l-2 border-primary bg-surface/55 px-3.5 py-3"
          >
            <span className="block font-mono text-xs text-primary">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="mt-2 block text-sm font-semibold leading-5 text-foreground">
              {node.title}
            </span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              {node.label}
            </span>
            {index < nodes.length - 1 ? (
              <>
                <span
                  className="absolute left-3.5 top-full h-5 w-px bg-border md:hidden"
                  aria-hidden="true"
                />
                <ArrowRight
                  className="absolute left-full top-1/2 hidden h-4 w-4 -translate-x-0.5 -translate-y-1/2 text-primary md:block"
                  aria-hidden="true"
                />
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </figure>
  )
}

export function OpenSourcePulse() {
  const { profile, home } = useLocalizedContent()
  const { currentFocus, selectedWork } = profile

  return (
    <section>
      <div className="grid gap-9 lg:grid-cols-[minmax(16rem,0.7fr)_minmax(0,1.3fr)] lg:items-end lg:gap-14">
        <div>
          <p className="text-sm font-semibold text-primary">
            {currentFocus.eyebrow}
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {currentFocus.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
            {currentFocus.summary}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {currentFocus.links.map((link) => {
              const isExternal = link.href.startsWith('http')
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-foreground transition-colors duration-150 hover:text-primary"
                >
                  {link.label}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )
            })}
          </div>
        </div>

        <SystemBoundaryMap areas={profile.researchAreas} />
      </div>

      <div className="mt-14 border-t border-border/70 pt-10 sm:mt-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {home.selectedWork.title}
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-right">
            {home.selectedWork.intro}
          </p>
        </div>

        <div className="mt-7 border-y border-border/70 md:grid md:grid-cols-3 md:divide-x md:divide-border/70">
          {selectedWork.slice(0, 3).map((work, index) => (
            <article
              key={work.title}
              className="border-b border-border/70 py-6 last:border-b-0 md:border-b-0 md:px-6 md:first:pl-0 md:last:pr-0"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-xs font-semibold text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-xs font-medium text-primary">
                  {work.eyebrow}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold leading-6 text-foreground">
                {work.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {work.description}
              </p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {home.selectedWork.problemLabel}:
                </span>{' '}
                {work.problem}
              </p>
              <a
                href={work.link.href}
                target={
                  work.link.href.startsWith('http') ? '_blank' : undefined
                }
                rel={
                  work.link.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                className="mt-5 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-primary transition-colors duration-150 hover:text-accent-hover"
              >
                {home.selectedWork.linkLabel} · {work.link.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
