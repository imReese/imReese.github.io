'use client'

import { HashIcon } from 'lucide-react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { ProjectItemType } from '@/config/infoConfig'
import { utm_source } from '@/config/siteConfig'
import { normalizeExternalHref, withUtmSource } from '@/lib/externalLinks'
import Link from 'next/link'
import { CustomIcon } from '@/components/shared/CustomIcon'

export function ProjectCard({
  project,
  titleAs,
}: {
  project: ProjectItemType
  titleAs?: keyof JSX.IntrinsicElements
}) {
  const utmLink = withUtmSource(
    normalizeExternalHref(project.link.href),
    utm_source,
  )
  let Component = titleAs ?? 'h2'
  return (
    <li className="group relative flex h-full flex-col items-start">
      <div className="relative flex h-full w-full flex-col justify-between rounded-lg border border-muted-foreground/20 bg-background/60 p-5 shadow-sm transition-all group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:bg-muted/5 group-hover:shadow-md">
        <div className="">
          <div className="flex items-start gap-3 pr-7">
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-muted bg-muted/20">
              <CustomIcon
                name={
                  project.link.href.includes('github.com') ? 'github' : 'cpu'
                }
                size={24}
              />
            </div>
            <Component className="break-words text-base font-semibold leading-6">
              {project.name}
            </Component>
          </div>
          <p className="relative z-10 mt-4 break-words text-sm leading-6 text-muted-foreground">
            {project.description}
          </p>
        </div>

        <div className="relative z-10 mt-auto pt-5">
          {project.tags && project.tags.length > 0 && (
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              {project.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center space-x-0.5"
                >
                  <HashIcon className="icon-scale h-3 w-3 text-muted-foreground" />
                  <span className="break-words text-xs text-muted-foreground">
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <Link
          href={utmLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-20"
        >
          <ArrowUpRight
            size={32}
            weight="duotone"
            className="absolute right-5 top-5 h-4 w-4 text-muted-foreground group-hover:cursor-pointer group-hover:text-primary"
          />
        </Link>
      </div>
    </li>
  )
}
