import GitHubSnake from "@/components/home/GitHubSnake"
import { Activity, Code2, NotebookTabs } from "lucide-react"

const proofPoints = [
  { label: "Active on GitHub", icon: Activity },
  { label: "Backend focus", icon: Code2 },
  { label: "Engineering notes", icon: NotebookTabs },
]

export function OpenSourcePulse() {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/75 shadow-xl shadow-primary/5 backdrop-blur">
      <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Open-source pulse</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            A compact view of recent coding activity, practical tooling, and notes from the systems I keep learning through.
          </p>
          <div className="mt-5 grid gap-2">
            {proofPoints.map((point) => {
              const Icon = point.icon
              return (
                <div key={point.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span>{point.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/65 p-3">
          <GitHubSnake />
        </div>
      </div>
    </section>
  )
}
