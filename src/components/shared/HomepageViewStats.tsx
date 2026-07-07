'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

import {
  formatHomepageViewCount,
  formatHomepageViewLabel,
  getHomepageViewCount,
} from '@/lib/homepageStats'
import { cn } from '@/lib/utils'

type HomepageViewStatsProps = {
  className?: string
}

export function HomepageViewStats({ className }: HomepageViewStatsProps) {
  const [viewCount, setViewCount] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadStats() {
      try {
        const response = await fetch('/stats.json', {
          cache: 'no-store',
          signal: controller.signal,
        })

        if (!response.ok) {
          return
        }

        const payload: unknown = await response.json()
        setViewCount(getHomepageViewCount(payload))
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
  }, [])

  if (viewCount === null) {
    return null
  }

  return (
    <div
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 whitespace-nowrap text-sm font-normal text-muted-foreground',
        className,
      )}
    >
      <Eye className="h-4 w-4 text-muted-foreground/80" aria-hidden="true" />
      <span>
        <span className="font-medium text-muted-foreground">
          {formatHomepageViewCount(viewCount, 'en')}
        </span>{' '}
        {formatHomepageViewLabel(viewCount)}
      </span>
    </div>
  )
}
