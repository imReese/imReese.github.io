'use client'

import { Activity, ArrowUpRight, Cpu, Database, Network } from 'lucide-react'
import { useLocalizedContent } from '@/components/shared/useLocalizedContent'

const researchIcons = [Activity, Database, Network, Cpu]

export function OpenSourcePulse() {
  const { profile } = useLocalizedContent()
  const { currentFocus, impactStats, researchAreas } = profile

  return (
    <section>
      <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-16">
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
          <div className="mt-6 flex flex-wrap gap-2">
            {currentFocus.links.map((link) => {
              const isExternal = link.href.startsWith('http')
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border/80 px-3 py-2 text-xs font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
                >
                  {link.label}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )
            })}
          </div>
        </div>

        <ol className="border-t border-border/70">
          {currentFocus.bullets.map((bullet, index) => (
            <li
              key={bullet}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-b border-border/70 py-5 text-sm leading-7 text-muted-foreground sm:grid-cols-[3rem_minmax(0,1fr)]"
            >
              <span className="font-mono text-xs font-semibold text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-16 grid border-t border-border/70 sm:grid-cols-2">
        {researchAreas.map((area, index) => {
          const Icon = researchIcons[index % researchIcons.length]
          const isRightColumn = index % 2 === 1

          return (
            <article
              key={area.title}
              className={`min-w-0 border-b border-border/70 py-8 sm:min-h-[15rem] ${
                isRightColumn ? 'sm:border-l sm:pl-8' : 'sm:pr-8'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-primary">
                    {area.label}
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">
                    {area.title}
                  </h3>
                </div>
                <Icon
                  className="h-5 w-5 flex-none text-primary"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                {area.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-3 gap-y-2 text-xs text-muted-foreground">
                {area.tags.map((tag, tagIndex) => (
                  <span key={tag} className="inline-flex items-center gap-x-3">
                    {tagIndex > 0 ? (
                      <span className="h-1 w-1 rounded-full bg-primary/70" />
                    ) : null}
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </article>
          )
        })}
      </div>

      <div className="mt-12 grid border-y border-border/70 sm:grid-cols-3">
        {impactStats.slice(0, 3).map((stat, index) => (
          <div
            key={stat.label}
            className={`min-w-0 py-6 ${
              index > 0
                ? 'border-t border-border/70 sm:border-l sm:border-t-0 sm:pl-6'
                : 'sm:pr-6'
            } ${index === 1 ? 'sm:pr-6' : ''}`}
          >
            <div className="text-2xl font-semibold text-foreground">
              {stat.value}
            </div>
            <div className="mt-1 text-xs font-semibold text-primary">
              {stat.label}
            </div>
            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              {stat.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
