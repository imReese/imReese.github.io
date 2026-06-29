"use client"

import { motion } from "framer-motion"
import { BriefcaseBusiness, MapPin, Sparkles } from "lucide-react"

const experiences = [
  {
    period: "2025.06 - Now",
    organization: "Baidu AI Computing",
    summary: "Inference engine performance for large-model serving.",
    current: true,
    details: [
      "Serving runtime: SGLang scheduler boundaries and prefill/decode paths",
      "Memory and transfer: cache/KV residency and Mooncake TE readiness",
      "Backend tuning across NVIDIA GPUs and Kunlunxin P-series",
    ],
  },
  {
    period: "2023",
    organization: "Huawei Cloud",
    summary: "CPU architecture performance analysis.",
  },
  {
    period: "2022",
    organization: "Huawei Data Storage",
    summary: "Distributed systems engineering.",
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
              <p className="mt-0.5 text-xs text-muted-foreground">Inference systems and backend performance</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>Beijing</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-background/70 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <BriefcaseBusiness className="h-4 w-4 text-primary" />
            <span>Experience</span>
          </div>
          <div className="mt-5 space-y-5">
            {experiences.map((experience) => (
              <div
                key={`${experience.period}-${experience.organization}`}
                className="grid gap-3 sm:grid-cols-[6.5rem_1fr]"
              >
                <div className="flex flex-wrap items-center gap-2 sm:block">
                  <span className="font-mono text-xs font-semibold text-primary">
                    {experience.period}
                  </span>
                  {experience.current ? (
                    <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-primary sm:mt-2 sm:inline-block">
                      Current
                    </span>
                  ) : null}
                </div>
                <div
                  className={
                    experience.current
                      ? "border-l-2 border-primary pl-4"
                      : "border-l border-border/70 pl-4"
                  }
                >
                  <p className="text-sm font-semibold text-foreground">
                    {experience.organization}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {experience.summary}
                  </p>
                  {experience.details ? (
                    <ul className="mt-3 space-y-1.5">
                      {experience.details.map((detail) => (
                        <li
                          key={detail}
                          className="flex gap-2 text-xs leading-4 text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
