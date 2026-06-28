"use client"

import { motion } from "framer-motion"
import { Activity, Boxes, Database, GitBranch, ServerCog } from "lucide-react"

const services = [
  {
    name: "gateway",
    detail: "routing / auth",
    icon: GitBranch,
    tone: "text-primary",
    width: "w-10/12",
  },
  {
    name: "workers",
    detail: "queues / jobs",
    icon: Boxes,
    tone: "text-[hsl(var(--chart-3))]",
    width: "w-8/12",
  },
  {
    name: "storage",
    detail: "mysql / redis",
    icon: Database,
    tone: "text-[hsl(var(--chart-2))]",
    width: "w-7/12",
  },
  {
    name: "observe",
    detail: "metrics / logs",
    icon: Activity,
    tone: "text-[hsl(var(--chart-4))]",
    width: "w-9/12",
  },
]

const logLines = [
  "deploy backend-api@sha256:7f42",
  "redis cache warmup completed",
  "p95 latency steady at 38ms",
]

export function SystemsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-4 shadow-2xl shadow-primary/10 backdrop-blur md:p-5"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,hsl(var(--primary)/0.18),transparent_16rem)]" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ServerCog className="h-4 w-4 text-primary" />
            <span className="font-medium">service topology</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]" />
            <span>healthy</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.32 + index * 0.08 }}
                className="rounded-xl border border-border/60 bg-secondary/55 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{service.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{service.detail}</div>
                  </div>
                  <Icon className={`h-4 w-4 ${service.tone}`} />
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background/70">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.55 + index * 0.08 }}
                    className={`h-full rounded-full bg-current ${service.tone} ${service.width}`}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-4 rounded-xl border border-border/50 bg-background/55 p-3 font-mono text-[0.72rem] leading-6 text-muted-foreground">
          {logLines.map((line, index) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.72 + index * 0.08 }}
              className="flex gap-2"
            >
              <span className="text-primary">$</span>
              <span>{line}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
