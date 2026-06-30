"use client"

import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Layers3,
} from 'lucide-react'
import { useLocalizedContent } from '@/components/shared/useLocalizedContent'

const visibleHighlights = (highlights: string[], count: number) =>
  highlights.slice(0, count)

export function ExperienceStack() {
  const { profile, home } = useLocalizedContent()
  const [currentRole, ...pastRoles] = profile.experience
  const education = profile.education[0]
  const copy = home.experienceStack

  if (!currentRole) {
    return null
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.18fr_0.82fr] lg:items-start">
      <section className="rounded-2xl border border-border/70 bg-card/75 p-5 shadow-sm backdrop-blur sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <BriefcaseBusiness className="h-4 w-4" />
              <span>{copy.eyebrow}</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-foreground">
              {copy.title}
            </h2>
          </div>
          <Link
            href="/about"
            className="hidden items-center gap-1 rounded-full border border-primary/30 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10 sm:inline-flex"
          >
            {copy.aboutLink}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-6 space-y-5">
          <article className="border-l-2 border-primary pl-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-base font-semibold text-foreground">
                {currentRole.company}
              </h3>
              <span className="font-mono text-xs font-semibold text-primary">
                {currentRole.start} - {currentRole.end}
              </span>
            </div>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {currentRole.team} / {currentRole.title}
            </p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
              {visibleHighlights(currentRole.highlights, 3).map((highlight) => (
                <li key={highlight} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </article>

          <div className="grid gap-3 border-t border-border/70 pt-5 sm:grid-cols-2">
            {pastRoles.map((role) => (
              <article
                key={`${role.company}-${role.start}`}
                className="min-w-0"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {role.company}
                  </h3>
                  <span className="flex-none font-mono text-[0.7rem] font-semibold text-primary">
                    {role.start} - {role.end}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {role.team} / {role.title}
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {role.highlights[0]}
                </p>
              </article>
            ))}
          </div>

          {education ? (
            <div className="flex gap-3 border-t border-border/70 pt-5">
              <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
                <GraduationCap className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {education.school}
                  </h3>
                  <span className="font-mono text-[0.7rem] font-semibold text-primary">
                    {education.start} - {education.end}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {education.major}. {copy.educationPrefix}: {education.details.join(' ')}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card/75 p-5 shadow-sm backdrop-blur sm:p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Layers3 className="h-4 w-4" />
          <span>{copy.technicalEyebrow}</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold text-foreground">
          {copy.technicalTitle}
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {copy.technicalIntro}
        </p>

        <div className="mt-5 divide-y divide-border/70 border-y border-border/70">
          {profile.stackGroups.map((group) => (
            <div
              key={group.title}
              className="grid min-w-0 gap-2 py-3 xl:grid-cols-[8.25rem_minmax(0,1fr)]"
            >
              <div className="whitespace-nowrap text-sm font-semibold text-primary">
                {group.title}
              </div>
              <div className="flex min-w-0 flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="max-w-full rounded-md bg-secondary px-2 py-1 text-[0.72rem] font-medium text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-3 text-xs leading-5 text-muted-foreground">
          <div>
            <span className="font-semibold text-foreground">
              {copy.currentEmphasisLabel}:
            </span>{' '}
            {copy.currentEmphasis}
          </div>
          <div>
            <span className="font-semibold text-foreground">
              {copy.engineeringHabitLabel}:
            </span>{' '}
            {copy.engineeringHabit}
          </div>
        </div>
      </section>
    </div>
  )
}
