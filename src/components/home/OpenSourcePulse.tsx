'use client'

import { ArrowUpRight } from 'lucide-react'
import { useLocalizedContent } from '@/components/shared/useLocalizedContent'

export function OpenSourcePulse() {
  const { profile } = useLocalizedContent()
  const { currentFocus, researchAreas } = profile

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
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
          {currentFocus.links.map((link) => {
            const isExternal = link.href.startsWith('http')
            return (
              <a
                key={link.href}
                href={link.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition hover:text-primary"
              >
                {link.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )
          })}
        </div>
      </div>

      <div className="border-t border-border/70">
        {researchAreas.slice(0, 3).map((area, index) => (
          <article
            key={area.title}
            className="grid gap-3 border-b border-border/70 py-6 sm:grid-cols-[2.5rem_12rem_minmax(0,1fr)] sm:gap-5"
          >
            <span className="font-mono text-xs font-semibold text-primary">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {area.title}
              </h3>
              <span className="mt-1 block text-xs text-primary">
                {area.label}
              </span>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              {area.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
