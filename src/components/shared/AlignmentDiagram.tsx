'use client'

import clsx from 'clsx'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

type AlignmentTone =
  | 'teal'
  | 'blue'
  | 'green'
  | 'mauve'
  | 'rose'
  | 'amber'
  | 'surface'

type AlignmentMarker = {
  value: number
  label?: string
  detail?: string
  emphasis?: boolean
}

type AlignmentTrack = {
  label: string
  detail?: string
  tone?: AlignmentTone
  interval?: number
  intervalLabel?: string
  markers: AlignmentMarker[]
}

type AlignmentHighlight = {
  value: number
  label: string
  detail?: string
}

type AlignmentDiagramProps = {
  eyebrow?: string
  title: string
  caption?: string
  start: number
  end: number
  unit?: string
  highlight?: AlignmentHighlight
  tracks: AlignmentTrack[]
  compact?: boolean
}

const revealEase = [0.22, 1, 0.36, 1] as const

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 34,
    scale: 0.985,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.82,
      ease: revealEase,
      when: 'beforeChildren',
      delayChildren: 0.08,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: revealEase },
  },
}

const trackVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.055,
    },
  },
}

const axisVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.82, ease: revealEase },
  },
}

const markerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.35, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 320, damping: 24, mass: 0.7 },
  },
}

const highlightVariants: Variants = {
  hidden: { opacity: 0, scaleY: 0 },
  visible: {
    opacity: 1,
    scaleY: 1,
    transition: { duration: 0.72, ease: revealEase },
  },
}

const toneClassNames: Record<
  AlignmentTone,
  {
    border: string
    bg: string
    text: string
    soft: string
    dot: string
    tick: string
  }
> = {
  teal: {
    border: 'border-primary/35',
    bg: 'bg-accent-soft/75',
    text: 'text-primary',
    soft: 'bg-accent-soft/40',
    dot: 'bg-primary ring-primary/20',
    tick: 'bg-primary/35',
  },
  blue: {
    border: 'border-[#1e66f5]/30 dark:border-[#89b4fa]/35',
    bg: 'bg-[#1e66f5]/10 dark:bg-[#89b4fa]/10',
    text: 'text-[#1e66f5] dark:text-[#89b4fa]',
    soft: 'bg-[#1e66f5]/[0.06] dark:bg-[#89b4fa]/[0.07]',
    dot: 'bg-[#1e66f5] ring-[#1e66f5]/20 dark:bg-[#89b4fa] dark:ring-[#89b4fa]/20',
    tick: 'bg-[#1e66f5]/30 dark:bg-[#89b4fa]/30',
  },
  green: {
    border: 'border-[#40a02b]/30 dark:border-[#a6e3a1]/35',
    bg: 'bg-[#40a02b]/10 dark:bg-[#a6e3a1]/10',
    text: 'text-[#2f7d20] dark:text-[#a6e3a1]',
    soft: 'bg-[#40a02b]/[0.06] dark:bg-[#a6e3a1]/[0.07]',
    dot: 'bg-[#40a02b] ring-[#40a02b]/20 dark:bg-[#a6e3a1] dark:ring-[#a6e3a1]/20',
    tick: 'bg-[#40a02b]/30 dark:bg-[#a6e3a1]/30',
  },
  mauve: {
    border: 'border-[#8839ef]/30 dark:border-[#cba6f7]/35',
    bg: 'bg-[#8839ef]/10 dark:bg-[#cba6f7]/10',
    text: 'text-[#8839ef] dark:text-[#cba6f7]',
    soft: 'bg-[#8839ef]/[0.06] dark:bg-[#cba6f7]/[0.07]',
    dot: 'bg-[#8839ef] ring-[#8839ef]/20 dark:bg-[#cba6f7] dark:ring-[#cba6f7]/20',
    tick: 'bg-[#8839ef]/30 dark:bg-[#cba6f7]/30',
  },
  rose: {
    border: 'border-[#d20f39]/30 dark:border-[#f38ba8]/35',
    bg: 'bg-[#d20f39]/10 dark:bg-[#f38ba8]/10',
    text: 'text-[#d20f39] dark:text-[#f38ba8]',
    soft: 'bg-[#d20f39]/[0.06] dark:bg-[#f38ba8]/[0.07]',
    dot: 'bg-[#d20f39] ring-[#d20f39]/20 dark:bg-[#f38ba8] dark:ring-[#f38ba8]/20',
    tick: 'bg-[#d20f39]/30 dark:bg-[#f38ba8]/30',
  },
  amber: {
    border: 'border-[#df8e1d]/35 dark:border-[#f9e2af]/35',
    bg: 'bg-[#df8e1d]/12 dark:bg-[#f9e2af]/10',
    text: 'text-[#9a5b00] dark:text-[#f9e2af]',
    soft: 'bg-[#df8e1d]/[0.07] dark:bg-[#f9e2af]/[0.07]',
    dot: 'bg-[#df8e1d] ring-[#df8e1d]/20 dark:bg-[#f9e2af] dark:ring-[#f9e2af]/20',
    tick: 'bg-[#df8e1d]/35 dark:bg-[#f9e2af]/30',
  },
  surface: {
    border: 'border-border/80',
    bg: 'bg-secondary/40',
    text: 'text-muted-foreground',
    soft: 'bg-secondary/20',
    dot: 'bg-muted-foreground ring-muted-foreground/20',
    tick: 'bg-border',
  },
}

function tone(toneName: AlignmentTone = 'teal') {
  return toneClassNames[toneName]
}

function clamp(value: number, start: number, end: number) {
  return Math.min(end, Math.max(start, value))
}

function position(value: number, start: number, end: number) {
  return ((clamp(value, start, end) - start) / Math.max(1, end - start)) * 100
}

function markerAlignment(value: number) {
  if (value <= 3) return 'translate-x-0 text-left'
  if (value >= 97) return '-translate-x-full text-right'
  return '-translate-x-1/2 text-center'
}

function buildTicks(start: number, end: number, interval?: number) {
  if (!interval || interval <= 0 || end <= start) return []

  const first = Math.ceil(start / interval) * interval
  if (first > end) return []

  const rawCount = Math.floor((end - first) / interval) + 1
  const stride = Math.max(1, Math.ceil(rawCount / 72))
  const count = Math.floor((rawCount - 1) / stride) + 1

  return Array.from(
    { length: count },
    (_, index) => first + index * interval * stride,
  )
}

function formatBoundary(value: number, unit?: string) {
  return `${value.toLocaleString('en-US')}${unit ? ` ${unit}` : ''}`
}

export function AlignmentDiagram({
  eyebrow = 'boundary alignment',
  title,
  caption,
  start,
  end,
  unit,
  highlight,
  tracks,
  compact = false,
}: AlignmentDiagramProps) {
  const prefersReducedMotion = useReducedMotion()
  const highlightPosition = highlight
    ? position(highlight.value, start, end)
    : null

  const variantsEnabled = !prefersReducedMotion

  return (
    <motion.figure
      variants={variantsEnabled ? containerVariants : undefined}
      initial={variantsEnabled ? 'hidden' : false}
      whileInView={variantsEnabled ? 'visible' : undefined}
      viewport={{ once: true, amount: 0.14, margin: '0px 0px -8% 0px' }}
      className={clsx(
        'not-prose overflow-hidden rounded-lg border border-border/80 bg-surface/55',
        compact
          ? 'my-6'
          : 'my-10 shadow-[0_22px_70px_-42px_rgba(76,79,105,0.35)] dark:shadow-[0_22px_70px_-44px_rgba(17,17,27,0.7)]',
      )}
    >
      <motion.figcaption
        variants={variantsEnabled ? itemVariants : undefined}
        className={clsx(
          'border-b border-border/70 px-4',
          compact ? 'py-3' : 'py-4 sm:px-5',
        )}
      >
        <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {eyebrow}
        </p>
        <p className="text-sm font-semibold leading-6 text-foreground">{title}</p>
        {caption && (
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {caption}
          </p>
        )}
      </motion.figcaption>

      <div className={compact ? 'p-3 sm:p-4' : 'p-4 sm:p-5'}>
        <div className="hidden md:block">
          <motion.div
            variants={variantsEnabled ? itemVariants : undefined}
            className="mb-3 grid grid-cols-[minmax(12rem,0.32fr)_minmax(0,1fr)] gap-4"
          >
            <div className="flex items-end">
              <span className="font-mono text-xs font-medium text-muted-foreground">
                token boundary
              </span>
            </div>
            <div className="relative h-10">
              <motion.span
                variants={variantsEnabled ? axisVariants : undefined}
                className="absolute inset-x-0 bottom-2 h-px origin-left bg-border"
              />
              <span className="absolute bottom-3 left-0 font-mono text-xs text-muted-foreground">
                {formatBoundary(start, unit)}
              </span>
              <span className="absolute bottom-3 right-0 font-mono text-xs text-muted-foreground">
                {formatBoundary(end, unit)}
              </span>
              {highlight && highlightPosition !== null && (
                <motion.span
                  variants={variantsEnabled ? markerVariants : undefined}
                  className={clsx(
                    'absolute top-0 max-w-[11rem] font-mono text-xs font-semibold leading-4 text-primary',
                    markerAlignment(highlightPosition),
                  )}
                  style={{ left: `${highlightPosition}%` }}
                >
                  {highlight.label}
                  {highlight.detail && (
                    <span className="block font-sans text-[11px] font-normal text-muted-foreground">
                      {highlight.detail}
                    </span>
                  )}
                </motion.span>
              )}
            </div>
          </motion.div>

          <div className="space-y-3">
            {tracks.map((track, trackIndex) => {
              const currentTone = tone(track.tone)
              const ticks = buildTicks(start, end, track.interval)

              return (
                <motion.section
                  variants={variantsEnabled ? itemVariants : undefined}
                  key={`${track.label}-${trackIndex}`}
                  className="grid grid-cols-[minmax(12rem,0.32fr)_minmax(0,1fr)] gap-4"
                >
                  <div
                    className={clsx(
                      'rounded-[8px] border p-3 transition-shadow duration-300 hover:shadow-sm',
                      currentTone.border,
                      currentTone.bg,
                    )}
                  >
                    <p
                      className={clsx(
                        'text-sm font-semibold leading-6',
                        currentTone.text,
                      )}
                    >
                      {track.label}
                    </p>
                    {track.detail && (
                      <p className="mt-1 text-sm leading-5 text-muted-foreground">
                        {track.detail}
                      </p>
                    )}
                    {(track.intervalLabel || track.interval) && (
                      <p className="mt-2 font-mono text-xs text-muted-foreground">
                        {track.intervalLabel ?? `interval = ${track.interval}`}
                      </p>
                    )}
                  </div>

                  <motion.div
                    variants={variantsEnabled ? trackVariants : undefined}
                    className={clsx(
                      'relative min-h-24 rounded-[8px] border',
                      currentTone.border,
                      currentTone.soft,
                    )}
                    role="img"
                    aria-label={`${track.label}: ${track.markers
                      .map((marker) => formatBoundary(marker.value, unit))
                      .join(', ')}`}
                  >
                    <motion.span
                      variants={variantsEnabled ? axisVariants : undefined}
                      className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-border"
                    />

                    {ticks.map((tick) => (
                      <span
                        key={tick}
                        className={clsx(
                          'absolute top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2',
                          currentTone.tick,
                        )}
                        style={{ left: `${position(tick, start, end)}%` }}
                      />
                    ))}

                    {highlightPosition !== null && (
                      <motion.span
                        variants={variantsEnabled ? highlightVariants : undefined}
                        className="absolute inset-y-2 z-10 origin-center border-l border-dashed border-primary/60"
                        style={{ left: `${highlightPosition}%` }}
                      />
                    )}

                    {track.markers.map((marker, markerIndex) => {
                      const markerPosition = position(marker.value, start, end)
                      const labelOnTop = markerIndex % 2 === 0

                      return (
                        <motion.div
                          variants={variantsEnabled ? markerVariants : undefined}
                          key={`${marker.value}-${marker.label ?? markerIndex}`}
                          className="absolute inset-y-0 z-20"
                          style={{ left: `${markerPosition}%` }}
                        >
                          <span
                            className={clsx(
                              'absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4',
                              marker.emphasis
                                ? 'bg-primary ring-primary/20'
                                : currentTone.dot,
                            )}
                          />
                          {(marker.label || marker.detail) && (
                            <span
                              className={clsx(
                                'absolute max-w-[10rem] font-mono text-xs leading-4',
                                labelOnTop ? 'top-2' : 'bottom-2',
                                markerAlignment(markerPosition),
                                marker.emphasis
                                  ? 'font-semibold text-primary'
                                  : 'text-muted-foreground',
                              )}
                            >
                              {marker.label ?? formatBoundary(marker.value, unit)}
                              {marker.detail && (
                                <span className="mt-0.5 block font-sans text-[11px] leading-4 text-muted-foreground">
                                  {marker.detail}
                                </span>
                              )}
                            </span>
                          )}
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </motion.section>
              )
            })}
          </div>
        </div>

        <div className="space-y-3 md:hidden">
          <motion.div
            variants={variantsEnabled ? itemVariants : undefined}
            className="flex flex-wrap items-center gap-2 rounded-[8px] border border-border/70 bg-background/55 p-3"
          >
            <span className="font-mono text-xs text-muted-foreground">
              {formatBoundary(start, unit)} → {formatBoundary(end, unit)}
            </span>
            {highlight && (
              <span className="rounded-md border border-primary/30 bg-accent-soft/60 px-2 py-1 font-mono text-xs font-semibold text-primary">
                {highlight.label}: {formatBoundary(highlight.value, unit)}
                {highlight.detail ? ` · ${highlight.detail}` : ''}
              </span>
            )}
          </motion.div>

          {tracks.map((track, trackIndex) => {
            const currentTone = tone(track.tone)

            return (
              <motion.section
                variants={variantsEnabled ? itemVariants : undefined}
                key={`${track.label}-mobile-${trackIndex}`}
                className={clsx(
                  'rounded-[8px] border p-4 transition-shadow duration-300 hover:shadow-sm',
                  currentTone.border,
                  currentTone.bg,
                )}
              >
                <p
                  className={clsx(
                    'text-sm font-semibold leading-6',
                    currentTone.text,
                  )}
                >
                  {track.label}
                </p>
                {track.detail && (
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {track.detail}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {(track.intervalLabel || track.interval) && (
                    <span className="rounded-md border border-border/70 bg-background/60 px-2 py-1 font-mono text-xs text-muted-foreground">
                      {track.intervalLabel ?? `interval = ${track.interval}`}
                    </span>
                  )}
                  {track.markers.map((marker, markerIndex) => (
                    <span
                      key={`${marker.value}-mobile-${markerIndex}`}
                      className={clsx(
                        'rounded-md border px-2 py-1 font-mono text-xs',
                        marker.emphasis
                          ? 'border-primary/35 bg-accent-soft/70 font-semibold text-primary'
                          : 'border-border/70 bg-background/60 text-muted-foreground',
                      )}
                    >
                      {marker.label ?? formatBoundary(marker.value, unit)}
                      {marker.detail && (
                        <span className="block font-sans text-[11px] font-normal text-muted-foreground">
                          {marker.detail}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </motion.section>
            )
          })}
        </div>
      </div>
    </motion.figure>
  )
}
