'use client'

import { ArrowUpRight } from 'lucide-react'

import { useLocalizedContent } from '@/components/shared/useLocalizedContent'

export function OpenSourcePulse() {
  const { profile, home } = useLocalizedContent()
  const { currentFocus, selectedWork } = profile

  return (
    <section className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-16">
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

      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {home.selectedWork.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          {home.selectedWork.intro}
        </p>
        <div className="mt-6 border-t border-border/70">
          {selectedWork.slice(0, 3).map((work, index) => (
            <article
              key={work.title}
              className="grid gap-3 border-b border-border/70 py-6 sm:grid-cols-[2.5rem_11rem_minmax(0,1fr)] sm:gap-5"
            >
              <span className="font-mono text-xs font-semibold text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-foreground">
                  {work.title}
                </h3>
                <span className="mt-1 block text-xs text-primary">
                  {work.eyebrow}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm leading-7 text-muted-foreground">
                  {work.description}
                </p>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
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
                  className="mt-2 inline-flex min-h-10 items-center gap-1.5 text-xs text-muted-foreground transition-colors duration-150 hover:text-primary"
                >
                  {home.selectedWork.linkLabel} · {work.link.label}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
