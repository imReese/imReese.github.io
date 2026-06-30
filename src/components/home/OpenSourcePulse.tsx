import { currentFocus, impactStats, researchAreas } from "@/config/infoConfig"
import { Activity, Cpu, Database, Network } from "lucide-react"

const researchIcons = [Activity, Database, Network, Cpu]

export function OpenSourcePulse() {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/75 shadow-xl shadow-primary/5 backdrop-blur">
      <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <p className="text-sm font-semibold text-primary">
            {currentFocus.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">
            {currentFocus.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {currentFocus.summary}
          </p>
          <div className="mt-5 grid gap-3">
            {currentFocus.bullets.map((bullet, index) => {
              const Icon = researchIcons[index % researchIcons.length]
              return (
                <div key={bullet} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                  <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span>{bullet}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {currentFocus.links.map((link) => {
              const isExternal = link.href.startsWith("http")
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="rounded-full border border-primary/30 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
                >
                  {link.label}
                </a>
              )
            })}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {researchAreas.map((area, index) => {
            const Icon = researchIcons[index % researchIcons.length]
            return (
              <article
                key={area.title}
                className="group min-w-0 rounded-xl border border-border/70 bg-background/70 p-4 transition hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-primary">
                      {area.label}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-foreground">
                      {area.title}
                    </h3>
                  </div>
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {area.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {area.points.map((point) => (
                    <li key={point} className="flex gap-2 text-xs leading-5 text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {area.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-secondary px-2 py-1 text-[0.68rem] font-medium text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </div>
      <div className="grid gap-4 border-t border-border/70 px-5 pb-5 pt-4 sm:px-7 sm:pb-7 lg:grid-cols-3">
        {impactStats.slice(0, 3).map((stat) => (
          <div key={stat.label} className="min-w-0">
            <div className="text-xl font-bold text-foreground">{stat.value}</div>
            <div className="mt-1 text-xs font-semibold text-primary">
              {stat.label}
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{stat.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
