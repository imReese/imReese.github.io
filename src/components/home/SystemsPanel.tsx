"use client"

import { motion } from "framer-motion"
import { Boxes, Cpu, Database, Network, ServerCog, Workflow } from "lucide-react"

const pathSteps = [
  {
    name: "request",
    detail: "tokenized req",
    icon: Workflow,
  },
  {
    name: "scheduler",
    detail: "prefill / decode",
    icon: Boxes,
  },
  {
    name: "prefix cache",
    detail: "reuse / hit behavior",
    icon: Database,
  },
  {
    name: "KV cache",
    detail: "pages / residency",
    icon: Database,
  },
  {
    name: "Mooncake TE",
    detail: "KV transfer boundary",
    icon: Network,
  },
  {
    name: "backend",
    detail: "GPU / P-series",
    icon: Cpu,
  },
]

const signals = [
  { label: "cache hit", value: "prefix / KV" },
  { label: "transfer", value: "Mooncake TE" },
  { label: "backend", value: "GPU / P-series" },
]

const logLines = [
  "trace request -> cache lookup -> TE transfer",
  "measure prefill/decode cache residency",
  "validate NVIDIA and Kunlunxin P-series backends",
]

export function SystemsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-4 shadow-2xl shadow-primary/15 backdrop-blur md:p-5"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,hsl(var(--primary)/0.18),transparent_18rem),radial-gradient(circle_at_85%_88%,hsl(var(--chart-3)/0.16),transparent_16rem)]" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ServerCog className="h-4 w-4 text-primary" />
            <span className="font-medium">inference path</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]" />
            <span>cache-aware</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-background/70 p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {pathSteps.map((step, index) => {
              const Icon = step.icon
              const isTransfer = step.name === "Mooncake TE"
              const isCache = step.name.includes("cache")
              return (
                <motion.div
                  key={step.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.28 + index * 0.06 }}
                  className={`relative overflow-hidden rounded-lg border p-3 ${
                    isTransfer
                      ? "border-primary/35 bg-primary/10"
                      : isCache
                        ? "border-[hsl(var(--chart-2)/0.35)] bg-[hsl(var(--chart-2)/0.08)]"
                        : "border-border/70 bg-card/75"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-background/80 text-primary ring-1 ring-border/70">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold leading-5 text-foreground">{step.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{step.detail}</div>
                    </div>
                  </div>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-background/80">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.7, delay: 0.5 + index * 0.05 }}
                      className="h-full origin-left rounded-full bg-primary"
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {signals.map((signal, index) => (
            <motion.div
              key={signal.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.72 + index * 0.06 }}
              className="min-w-0 rounded-lg border border-border/60 bg-secondary/70 p-2"
            >
              <div className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-primary">
                {signal.label}
              </div>
              <div className="mt-1 text-xs leading-5 text-muted-foreground">{signal.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-border/60 bg-background/80 p-3 font-mono text-[0.72rem] leading-6 text-muted-foreground">
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
