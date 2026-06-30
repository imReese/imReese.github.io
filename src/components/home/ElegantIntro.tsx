"use client"

import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Github } from "lucide-react"
import { headline, introduction, profileSummary } from "@/config/infoConfig"
import { SystemsPanel } from "@/components/home/SystemsPanel"
import { useLanguage } from "@/components/shared/LanguageProvider"

export function ElegantIntro() {
  const { t } = useLanguage()

  return (
    <section className="grid min-w-0 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="min-w-0 max-w-2xl"
      >
        <h1 className="break-words text-3xl font-bold text-foreground sm:text-5xl lg:text-6xl">
          {headline}
        </h1>
        <p className="mt-6 max-w-full text-base leading-8 text-muted-foreground sm:text-lg">
          {introduction}
        </p>

        <div className="mt-6 flex max-w-full flex-wrap gap-2 overflow-hidden">
          {profileSummary.focusAreas.map((area) => (
            <span
              key={area}
              className="max-w-full rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
            >
              {area}
            </span>
          ))}
        </div>

        <div className="mt-8 flex max-w-full flex-col gap-3 sm:flex-row">
          <a
            href="/projects"
            className="inline-flex max-w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/20"
          >
            <Github className="h-4 w-4" />
            {t("home.viewProjects")}
          </a>
          <a
            href="/blogs"
            className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-primary/35 px-6 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-primary/10"
          >
            <BookOpen className="h-4 w-4" />
            {t("home.readNotes")}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </motion.div>

      <SystemsPanel />
    </section>
  )
}
