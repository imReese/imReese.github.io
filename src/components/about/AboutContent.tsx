'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import { useLocalizedContent } from '@/components/shared/useLocalizedContent'
import portraitImage from '@/images/portrait.jpg'

function SectionHeading({ title, intro }: { title: string; intro: string }) {
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

export function AboutContent() {
  const { about, profile } = useLocalizedContent()

  return (
    <Container className="mt-16 sm:mt-24">
      <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:gap-x-20">
        <div className="lg:order-first">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {about.headline}
          </h1>
          <div className="mt-7 max-w-3xl space-y-6 text-base leading-8 text-muted-foreground">
            {profile.aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="lg:justify-self-end">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt="Portrait photo"
              width={320}
              height={320}
              sizes="(min-width: 1024px) 20rem, 20rem"
              placeholder="blur"
              className="aspect-square rotate-3 rounded-2xl bg-surface-elevated object-cover"
            />
          </div>
        </div>
      </div>

      <section className="mt-20">
        <SectionHeading
          title={about.timelineTitle}
          intro={about.timelineIntro}
        />
        <ol className="mt-2 divide-y divide-border/70">
          {profile.experience.map((experience) => (
            <li
              key={`${experience.company}-${experience.start}`}
              className="grid gap-3 py-6 sm:grid-cols-[8.5rem_14rem_minmax(0,1fr)] sm:gap-6"
            >
              <span className="font-mono text-xs leading-6 text-muted-foreground">
                {experience.start} — {experience.end}
              </span>
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground">
                  {experience.company}
                </h3>
                <p className="text-xs leading-5 text-primary">
                  {experience.team}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold leading-6 text-foreground">
                  {experience.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {experience.highlights[0]}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20">
        <SectionHeading
          title={about.capabilitiesTitle}
          intro={about.capabilitiesIntro}
        />
        <div className="grid gap-x-10 sm:grid-cols-2">
          {profile.researchAreas.map((area) => (
            <article
              key={area.title}
              className="border-b border-border/70 py-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-base font-semibold text-foreground">
                  {area.title}
                </h3>
                <span className="font-mono text-xs text-primary">
                  {area.label}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {area.description}
              </p>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                {area.points.join(' · ')}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading
          title={about.representativeTitle}
          intro={about.representativeIntro}
        />
        <div className="grid gap-x-10 sm:grid-cols-2">
          {about.links.map((link) => {
            const isExternal = link.href.startsWith('http')
            const kindLabel =
              link.kind === 'project' ? about.projectLabel : about.articleLabel

            return (
              <a
                key={link.href}
                href={link.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="group border-b border-border/70 py-6"
              >
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                  {kindLabel}
                </span>
                <span className="mt-2 flex items-start justify-between gap-4">
                  <span>
                    <span className="block text-base font-semibold text-foreground transition group-hover:text-primary">
                      {link.title}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                      {link.description}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-primary"
                    aria-hidden="true"
                  />
                </span>
              </a>
            )
          })}
        </div>
      </section>
    </Container>
  )
}
