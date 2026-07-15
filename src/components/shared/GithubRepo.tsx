'use client'

import { GithubLogo } from '@phosphor-icons/react'
import Link from 'next/link'
import { useLanguage } from '@/components/shared/LanguageProvider'

export function GithubRepo() {
  const { t } = useLanguage()

  return (
    <Link
      href="https://github.com/imReese"
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent-soft hover:text-primary"
    >
      <GithubLogo size={18} weight="duotone" />
      <span className="sr-only">{t('common.githubRepo')}</span>
    </Link>
  )
}
