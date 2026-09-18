'use client'

import { ArrowRight, BookOpen, Github } from 'lucide-react'
import { SystemsPanel } from '@/components/home/SystemsPanel'
import { useLocalizedContent } from '@/components/shared/useLocalizedContent'

function getHeadlineLines(headline: string) {
  const leadPatterns = ["Hi, I'm Reese.", 'Hi，我是 Reese']
  const lead = leadPatterns.find((pattern) => headline.startsWith(pattern))

  const zhLead = headline.match(/^(?:Hi|你好)[，,]\s*我是[^，,。.!?]+[，,。]?/)

  if (!lead && !zhLead) {
    return [headline]
  }

  const headlineLead = lead ?? zhLead?.[0] ?? ''
  const rest = headline
    .slice(headlineLead.length)
    .replace(/^[，,]\s*/, '')
    .trim()
  return rest ? [headlineLead, rest] : [headlineLead]
}

export function ElegantIntro() {
  const { site, profile, home } = useLocalizedContent()
  const headlineLines = getHeadlineLines(site.headline)

  return (
    <section className="grid min-w-0 gap-10 lg:grid-cols-2 lg:items-center lg:gap-14 xl:gap-16">
      <div className="min-w-0">
        <h1 className="max-w-4xl break-words font-semibold text-foreground">
          {headlineLines.map((line, index) => (
            <span
              key={`${index}-${line}`}
              className={
                index === 0
                  ? `block text-4xl leading-tight sm:text-5xl lg:text-6xl 2xl:text-7xl min-[1920px]:text-[4.5rem] ${
                      headlineLines.length > 1 ? 'whitespace-nowrap' : ''
                    }`
                  : 'mt-3 block text-3xl leading-tight sm:text-4xl lg:text-[2.8rem] 2xl:text-5xl min-[1920px]:text-[3.25rem]'
              }
            >
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-6 max-w-full text-base leading-8 text-muted-foreground sm:text-lg 2xl:text-xl 2xl:leading-9 min-[1920px]:leading-10">
          {site.introduction}
        </p>

        <div className="mt-6 flex max-w-full flex-wrap gap-x-3 gap-y-2 overflow-hidden text-sm text-muted-foreground 2xl:mt-8 2xl:text-base 2xl:gap-x-4">
          {profile.focusAreas.slice(0, 3).map((area, index) => (
            <span key={area} className="inline-flex items-center gap-x-3">
              {index > 0 ? (
                <span className="h-1 w-1 rounded-full bg-primary/70 2xl:h-1.5 2xl:w-1.5" />
              ) : null}
              <span>{area}</span>
            </span>
          ))}
        </div>

        <div className="mt-8 flex max-w-full flex-wrap items-center gap-x-6 gap-y-3 2xl:mt-10 2xl:gap-x-8">
          <a
            href="/projects/"
            className="inline-flex h-10 max-w-full items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-semibold text-background transition hover:bg-primary hover:text-primary-foreground 2xl:h-12 2xl:px-6 2xl:text-base"
          >
            <Github className="h-4 w-4 2xl:h-5 2xl:w-5" />
            {home.hero.viewProjects}
          </a>
          <a
            href="/blogs/"
            className="inline-flex h-10 max-w-full items-center justify-center gap-2 text-sm font-semibold text-foreground transition hover:text-primary 2xl:h-12 2xl:text-base"
          >
            <BookOpen className="h-4 w-4 2xl:h-5 2xl:w-5" />
            {home.hero.readNotes}
            <ArrowRight className="h-4 w-4 2xl:h-5 2xl:w-5" />
          </a>
        </div>
      </div>

      <SystemsPanel />
    </section>
  )
}
