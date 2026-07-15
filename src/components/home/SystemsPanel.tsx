'use client'

import { motion } from 'framer-motion'
import { MapPin, SquareTerminal } from 'lucide-react'
import { useLocalizedContent } from '@/components/shared/useLocalizedContent'

export function SystemsPanel() {
  const { site, profile, home } = useLocalizedContent()
  const currentExperience = profile.experience[0]
  const previousExperience = profile.experience.slice(1, 3)
  const copy = home.systemsPanel

  return (
    <motion.aside
      initial={{ opacity: 0, y: 20, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.16, ease: 'easeOut' }}
      className="min-w-0 overflow-hidden rounded-lg border border-border/80 bg-card/65"
    >
      <div className="flex flex-col items-start gap-3 border-b border-border/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
            <SquareTerminal className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {copy.title}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {copy.subtitle}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {site.location}
        </span>
      </div>

      <div className="px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-foreground">
              {currentExperience.company}
            </span>
            <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[0.68rem] font-semibold text-primary">
              {copy.current}
            </span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {currentExperience.start} - {currentExperience.end}
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-semibold leading-tight text-foreground">
          {currentExperience.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {currentExperience.team}
        </p>

        <ul className="mt-4 space-y-2">
          {currentExperience.highlights.slice(0, 3).map((highlight) => (
            <li
              key={highlight}
              className="flex gap-2.5 text-xs leading-5 text-muted-foreground"
            >
              <span className="mt-2 h-1 w-1 flex-none rounded-full bg-primary" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-border/70 pt-4">
          <p className="text-xs font-semibold text-primary">{copy.previous}</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 sm:gap-0">
            {previousExperience.map((experience, index) => (
              <div
                key={`${experience.company}-${experience.start}`}
                className={index > 0 ? 'sm:border-l sm:pl-4' : 'sm:pr-4'}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-sm font-semibold text-foreground">
                    {experience.company}
                  </span>
                  <span className="font-mono text-[0.68rem] text-muted-foreground">
                    {experience.start}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {experience.team}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
