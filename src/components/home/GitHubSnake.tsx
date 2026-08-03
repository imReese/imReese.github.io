'use client'

import Image from 'next/image'
import { useLanguage } from '@/components/shared/LanguageProvider'

export default function GitHubSnake() {
  const { t } = useLanguage()

  return (
    <div className="w-full overflow-hidden">
      <div className="dark:hidden">
        <Image
          src="/github-contribution-snake/github-contribution-grid-snake.svg"
          alt={t('common.githubActivity')}
          width={1000}
          height={200}
          priority={false}
          loading="lazy"
          className="h-auto w-full"
        />
      </div>
      <div className="hidden dark:block">
        <Image
          src="/github-contribution-snake/github-contribution-grid-snake-dark.svg"
          alt={t('common.githubActivity')}
          width={1000}
          height={200}
          priority={false}
          loading="lazy"
          className="h-auto w-full"
        />
      </div>
    </div>
  )
}
