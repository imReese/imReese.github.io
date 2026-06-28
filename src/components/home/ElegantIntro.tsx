"use client"

import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Github } from "lucide-react"
import { headline, introduction } from "@/config/infoConfig"
import { SystemsPanel } from "@/components/home/SystemsPanel"

const focusAreas = ["Go", "Python", "C/C++", "Kubernetes", "Docker", "Redis", "MySQL", "Linux"]

export function ElegantIntro() {
  return (
    <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {headline}
        </h1>
        <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
          {introduction}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {focusAreas.map((area) => (
            <span
              key={area}
              className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
            >
              {area}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/20"
          >
            <Github className="h-4 w-4" />
            View projects
          </a>
          <a
            href="/blogs"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/35 px-6 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-primary/10"
          >
            <BookOpen className="h-4 w-4" />
            Read notes
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </motion.div>

      <SystemsPanel />
    </section>
  )
}
