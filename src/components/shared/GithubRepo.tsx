"use client"

import { GithubLogo } from "@phosphor-icons/react"
import Link from "next/link"
import { useLanguage } from "@/components/shared/LanguageProvider"

export function GithubRepo() {
  const { t } = useLanguage()

  return (
    <Link
      href="https://github.com/imReese"
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
    >
      <GithubLogo size={18} weight="duotone" />
      <span className="sr-only">{t("common.githubRepo")}</span>
    </Link>
  )
}
