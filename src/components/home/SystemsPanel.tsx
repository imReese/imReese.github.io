"use client"

import { motion } from "framer-motion"
import { BookOpen, BriefcaseBusiness, Code2, MapPin, PencilLine, Sparkles } from "lucide-react"

const highlights = [
  {
    title: "Current role",
    detail: "Baidu AI Computing, inference performance.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Writing",
    detail: "SGLang, Mooncake, cache notes.",
    icon: PencilLine,
  },
  {
    title: "Lab",
    detail: "Runtime and infrastructure experiments.",
    icon: Code2,
  },
]

const nowItems = [
  "Large-model inference performance",
  "Cache and KV-cache behavior",
  "Mooncake TE and SGLang runtime notes",
]

const timeline = [
  {
    year: "2025",
    text: "Baidu AI Computing, inference engine work",
  },
  {
    year: "2023",
    text: "Huawei Cloud, CPU architecture research",
  },
  {
    year: "2022",
    text: "Huawei Data Storage, distributed systems",
  },
]

export function SystemsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      className="relative min-w-0 max-w-full overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-5 shadow-2xl shadow-primary/10 backdrop-blur md:p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,hsl(var(--primary)/0.14),transparent_18rem),radial-gradient(circle_at_90%_90%,hsl(var(--chart-3)/0.12),transparent_16rem)]" />
      <div className="relative space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{"Reese's workspace"}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Engineering, notes, and small experiments</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>Beijing</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-background/70 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>{"What I'm focused on now"}</span>
          </div>
          <div className="mt-4 grid gap-3">
            {nowItems.map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="min-w-0 rounded-xl border border-border/65 bg-card/70 p-3"
              >
                <div className="flex flex-col gap-2">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-background/80 text-primary ring-1 ring-border/70">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h2 className="text-sm font-semibold leading-5 text-foreground">{item.title}</h2>
                  <p className="text-xs leading-5 text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="rounded-xl border border-border/60 bg-secondary/55 p-4">
          <div className="space-y-3">
            {timeline.map((item) => (
              <div
                key={`${item.year}-${item.text}`}
                className="grid grid-cols-[3.25rem_1fr] gap-3 text-sm"
              >
                <span className="font-mono text-xs font-semibold text-primary">{item.year}</span>
                <span className="leading-5 text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
