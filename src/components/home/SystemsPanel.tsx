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
      <div className="flex flex-col items-start gap-3 border-b border-border/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 2xl:px-7 2xl:py-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary/10 text-primary 2xl:h-9 2xl:w-9">
            <SquareTerminal className="h-4 w-4 2xl:h-5 2xl:w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground 2xl:text-base">
              {copy.title}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground 2xl:text-sm">
              {copy.subtitle}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground 2xl:text-sm">
          <MapPin className="h-3.5 w-3.5 text-primary 2xl:h-4 2xl:w-4" aria-hidden="true" />
          {site.location}
        </span>
      </div>

      <div className="px-5 py-5 sm:px-6 2xl:px-8 2xl:py-7">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-foreground 2xl:text-lg">
              {currentExperience.company}
            </span>
            <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[0.68rem] font-semibold text-primary 2xl:text-xs">
              {copy.current}
            </span>
          </div>
          <span className="font-mono text-xs text-muted-foreground 2xl:text-sm">
            {currentExperience.start} - {currentExperience.end}
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-semibold leading-tight text-foreground 2xl:mt-4 2xl:text-3xl">
          {currentExperience.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground 2xl:text-base 2xl:leading-7">
          {currentExperience.team}
        </p>

        <ul className="mt-4 space-y-2 2xl:mt-5 2xl:space-y-3">
          {currentExperience.highlights.slice(0, 3).map((highlight) => (
            <li
              key={highlight}
              className="flex gap-2.5 text-xs leading-5 text-muted-foreground 2xl:text-sm 2xl:leading-6"
            >
              <span className="mt-2 h-1 w-1 flex-none rounded-full bg-primary 2xl:mt-2.5 2xl:h-1.5 2xl:w-1.5" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-border/70 pt-4 2xl:mt-7 2xl:pt-6">
          <p className="text-xs font-semibold text-primary 2xl:text-sm">{copy.previous}</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 sm:gap-0 2xl:mt-4">
            {previousExperience.map((experience, index) => (
              <div
                key={`${experience.company}-${experience.start}`}
                className={index > 0 ? 'sm:border-l sm:pl-4 2xl:pl-6' : 'sm:pr-4 2xl:pr-6'}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-sm font-semibold text-foreground 2xl:text-base">
                    {experience.company}
                  </span>
                  <span className="font-mono text-[0.68rem] text-muted-foreground 2xl:text-xs">
                    {experience.start}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground 2xl:text-sm 2xl:leading-6">
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
