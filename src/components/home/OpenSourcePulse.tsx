import GitHubSnake from "@/components/home/GitHubSnake"
import { currentFocus, impactStats } from "@/config/infoConfig"
import { Activity, Code2, GitBranch, Network } from "lucide-react"

const focusIcons = [Activity, GitBranch, Network, Code2]

export function OpenSourcePulse() {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/75 shadow-xl shadow-primary/5 backdrop-blur">
      <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {currentFocus.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {currentFocus.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {currentFocus.summary}
          </p>
          <div className="mt-5 grid gap-2">
            {currentFocus.bullets.map((bullet, index) => {
              const Icon = focusIcons[index % focusIcons.length]
              return (
                <div key={bullet} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
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

        <div className="rounded-xl border border-border/60 bg-background/65 p-3">
          <GitHubSnake />
        </div>
      </div>
      <div className="grid gap-4 border-t border-border/70 px-5 pb-5 pt-4 sm:px-7 sm:pb-7 lg:grid-cols-3">
        {impactStats.slice(0, 3).map((stat) => (
          <div key={stat.label} className="min-w-0">
            <div className="text-xl font-bold tracking-tight text-foreground">{stat.value}</div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {stat.label}
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{stat.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
