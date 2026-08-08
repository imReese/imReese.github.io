'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

import { useLanguage } from '@/components/shared/LanguageProvider'
import {
  formatHomepageViewText,
  getGoatCounterViewCount,
} from '@/lib/homepageStats'
import { cn } from '@/lib/utils'

type HomepageViewStatsProps = {
  className?: string
}

export function HomepageViewStats({ className }: HomepageViewStatsProps) {
  const { locale } = useLanguage()
  const [viewCount, setViewCount] = useState<number | null>(null)
  const siteUrl = process.env.NEXT_PUBLIC_GOATCOUNTER_URL

  useEffect(() => {
    if (!siteUrl) {
      return
    }

    const controller = new AbortController()
    const counterUrl = `${siteUrl.replace(/\/$/, '')}/counter/TOTAL.json`

    async function loadStats() {
      try {
        const response = await fetch(counterUrl, {
          cache: 'no-store',
          signal: controller.signal,
        })

        if (!response.ok) {
          return
        }

        const payload: unknown = await response.json()
        setViewCount(getGoatCounterViewCount(payload))
      } catch (error) {
        if (!controller.signal.aborted) {
          setViewCount(null)
        }
      }
    }

    loadStats()

    return () => {
      controller.abort()
    }
  }, [siteUrl])

  return (
    <div
      className={cn(
        'flex min-h-5 max-w-full items-center text-sm font-normal text-muted-foreground',
        className,
      )}
      aria-live="polite"
    >
      {viewCount === null ? null : (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <Eye
            className="h-4 w-4 text-muted-foreground/80"
            aria-hidden="true"
          />
          <span>{formatHomepageViewText(viewCount, locale)}</span>
        </span>
      )}
    </div>
  )
}
