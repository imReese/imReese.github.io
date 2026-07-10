'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { useLocalizedContent } from '@/components/shared/useLocalizedContent'

export function SystemsPanel() {
  const { site, profile } = useLocalizedContent()
  const currentExperience = profile.experience[0]
  const systemPath = profile.researchAreas.slice(0, 4)
  const primaryLink = profile.currentFocus.links[0]

  return (
    <motion.aside
      initial={{ opacity: 0, y: 20, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.16, ease: 'easeOut' }}
      className="min-w-0 overflow-hidden rounded-lg border border-border/80 bg-card/65"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-4">
        <span className="text-xs font-semibold text-primary">
          {profile.currentFocus.eyebrow}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {site.location}
        </span>
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="text-sm font-semibold text-foreground">
            {currentExperience.company}
          </span>
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

        <div className="mt-6 border-t border-border/70">
          {systemPath.map((area, index) => (
            <div
              key={area.title}
              className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-border/70 py-3.5"
            >
              <span className="font-mono text-[0.68rem] font-semibold text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 text-sm font-medium text-foreground">
                {area.title}
              </span>
              <span className="hidden text-xs text-muted-foreground sm:block">
                {area.label}
              </span>
            </div>
          ))}
        </div>

        {primaryLink ? (
          <a
            href={primaryLink.href}
            target={primaryLink.href.startsWith('http') ? '_blank' : undefined}
            rel={
              primaryLink.href.startsWith('http')
                ? 'noopener noreferrer'
                : undefined
            }
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition hover:text-primary"
          >
            {primaryLink.label}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </motion.aside>
  )
}
