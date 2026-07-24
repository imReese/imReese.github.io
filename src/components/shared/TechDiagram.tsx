'use client'

import clsx from 'clsx'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import * as React from 'react'
import { type CSSProperties, type ReactNode } from 'react'

type DiagramTone =
  | 'teal'
  | 'blue'
  | 'green'
  | 'mauve'
  | 'rose'
  | 'amber'
  | 'surface'

type DiagramItem = {
  label: string
  detail?: string
  tone?: DiagramTone
}

type LayerItem = DiagramItem & {
  items?: string[]
}

type SequenceStep = {
  from: string
  to: string
  label: string
  detail?: string
  tone?: DiagramTone
}

type StateItem = DiagramItem & {
  next?: string
}

type MappingGroup = DiagramItem & {
  items: string[]
}

type FlowStep = DiagramItem & {
  meta?: string
  items?: string[]
}

type BoundaryGroup = DiagramItem & {
  items: string[]
  signals?: string[]
}

type CompareColumn = {
  title: string
  tone?: DiagramTone
  items: string[]
}

type ExpandableNote = {
  title: string
  detail?: string
  items?: string[]
  tone?: DiagramTone
}

const revealEase = [0.22, 1, 0.36, 1] as const

const diagramContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.985,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.72,
      ease: revealEase,
      when: 'beforeChildren',
      delayChildren: 0.08,
      staggerChildren: 0.075,
    },
  },
}

const diagramItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.58,
      ease: revealEase,
    },
  },
}

const toneClassNames: Record<
  DiagramTone,
  {
    border: string
    bg: string
    text: string
    soft: string
    line: string
  }
> = {
  teal: {
    border: 'border-primary/35',
    bg: 'bg-accent-soft/75',
    text: 'text-primary',
    soft: 'bg-accent-soft/55',
    line: 'bg-primary',
  },
  blue: {
    border: 'border-[#1e66f5]/30 dark:border-[#89b4fa]/35',
    bg: 'bg-[#1e66f5]/10 dark:bg-[#89b4fa]/10',
    text: 'text-[#1e66f5] dark:text-[#89b4fa]',
    soft: 'bg-[#1e66f5]/8 dark:bg-[#89b4fa]/8',
    line: 'bg-[#1e66f5] dark:bg-[#89b4fa]',
  },
  green: {
    border: 'border-[#40a02b]/30 dark:border-[#a6e3a1]/35',
    bg: 'bg-[#40a02b]/10 dark:bg-[#a6e3a1]/10',
    text: 'text-[#2f7d20] dark:text-[#a6e3a1]',
    soft: 'bg-[#40a02b]/8 dark:bg-[#a6e3a1]/8',
    line: 'bg-[#40a02b] dark:bg-[#a6e3a1]',
  },
  mauve: {
    border: 'border-[#8839ef]/30 dark:border-[#cba6f7]/35',
    bg: 'bg-[#8839ef]/10 dark:bg-[#cba6f7]/10',
    text: 'text-[#8839ef] dark:text-[#cba6f7]',
    soft: 'bg-[#8839ef]/8 dark:bg-[#cba6f7]/8',
    line: 'bg-[#8839ef] dark:bg-[#cba6f7]',
  },
  rose: {
    border: 'border-[#d20f39]/30 dark:border-[#f38ba8]/35',
    bg: 'bg-[#d20f39]/10 dark:bg-[#f38ba8]/10',
    text: 'text-[#d20f39] dark:text-[#f38ba8]',
    soft: 'bg-[#d20f39]/8 dark:bg-[#f38ba8]/8',
    line: 'bg-[#d20f39] dark:bg-[#f38ba8]',
  },
  amber: {
    border: 'border-[#df8e1d]/35 dark:border-[#f9e2af]/35',
    bg: 'bg-[#df8e1d]/12 dark:bg-[#f9e2af]/10',
    text: 'text-[#9a5b00] dark:text-[#f9e2af]',
    soft: 'bg-[#df8e1d]/8 dark:bg-[#f9e2af]/8',
    line: 'bg-[#df8e1d] dark:bg-[#f9e2af]',
  },
  surface: {
    border: 'border-border/80',
    bg: 'bg-secondary/40',
    text: 'text-muted-foreground',
    soft: 'bg-secondary/25',
    line: 'bg-border',
  },
}

function tone(toneName: DiagramTone = 'teal') {
  return toneClassNames[toneName]
}

function DiagramShell({
  eyebrow,
  title,
  caption,
  children,
  compact = false,
}: {
  eyebrow?: string
  title?: string
  caption?: string
  children: ReactNode
  compact?: boolean
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.figure
      variants={prefersReducedMotion ? undefined : diagramContainerVariants}
      initial={prefersReducedMotion ? false : 'hidden'}
      whileInView={prefersReducedMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.16, margin: '0px 0px -8% 0px' }}
      className={clsx(
        'not-prose overflow-hidden rounded-lg border border-border/80 bg-surface/55',
        compact
          ? 'my-6'
          : 'my-10 shadow-[0_22px_70px_-42px_rgba(76,79,105,0.35)] dark:shadow-[0_22px_70px_-44px_rgba(17,17,27,0.7)]',
      )}
    >
      {(eyebrow || title || caption) && (
        <motion.figcaption
          variants={prefersReducedMotion ? undefined : diagramItemVariants}
          className={clsx(
            'border-b border-border/70 px-4',
            compact ? 'py-3' : 'py-4 sm:px-5',
          )}
        >
          {eyebrow && (
            <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {eyebrow}
            </p>
          )}
          {title && (
            <p className="text-sm font-semibold leading-6 text-foreground">
              {title}
            </p>
          )}
          {caption && (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {caption}
            </p>
          )}
        </motion.figcaption>
      )}
      <div className={compact ? 'p-3 sm:p-4' : 'p-4 sm:p-5'}>{children}</div>
    </motion.figure>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-border/70 bg-background/60 px-2 py-1 font-mono text-xs font-medium leading-none text-muted-foreground">
      {children}
    </span>
  )
}

export function LayerDiagram({
  eyebrow = 'layer view',
  title,
  caption,
  layers,
}: {
  eyebrow?: string
  title?: string
  caption?: string
  layers: LayerItem[]
}) {
  return (
    <DiagramShell eyebrow={eyebrow} title={title} caption={caption}>
      <div className="space-y-3">
        {layers.map((layer, index) => {
          const currentTone = tone(layer.tone)

          return (
            <motion.div key={`${layer.label}-${index}`} variants={diagramItemVariants}>
              <div
                className={clsx(
                  'relative overflow-hidden rounded-[8px] border p-4 transition-shadow duration-300 hover:shadow-sm',
                  currentTone.border,
                  currentTone.bg,
                )}
              >
                <div
                  className={clsx(
                    'absolute inset-y-4 left-0 w-1 rounded-r-full',
                    currentTone.line,
                  )}
                />
                <div className="pl-3">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <p
                      className={clsx(
                        'text-sm font-semibold leading-6',
                        currentTone.text,
                      )}
                    >
                      {layer.label}
                    </p>
                    {layer.detail && (
                      <p className="text-sm leading-6 text-muted-foreground">
                        {layer.detail}
                      </p>
                    )}
                  </div>
                  {layer.items && layer.items.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {layer.items.map((item) => (
                        <Badge key={item}>{item}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {index < layers.length - 1 && (
                <div className="flex h-5 items-center justify-center">
                  <span className="h-4 w-px bg-border" />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </DiagramShell>
  )
}

export function SequenceDiagram({
  eyebrow = 'call path',
  title,
  caption,
  actors,
  steps,
}: {
  eyebrow?: string
  title?: string
  caption?: string
  actors: string[]
  steps: SequenceStep[]
}) {
  return (
    <DiagramShell eyebrow={eyebrow} title={title} caption={caption}>
      <motion.div variants={diagramItemVariants} className="mb-4 flex flex-wrap gap-2">
        {actors.map((actor) => (
          <Badge key={actor}>{actor}</Badge>
        ))}
      </motion.div>
      <ol className="space-y-3">
        {steps.map((step, index) => {
          const currentTone = tone(step.tone ?? 'teal')

          return (
            <motion.li
              variants={diagramItemVariants}
              key={`${step.from}-${step.to}-${step.label}-${index}`}
              className={clsx(
                'rounded-[8px] border bg-background/55 p-3 transition-shadow duration-300 hover:shadow-sm',
                currentTone.border,
              )}
            >
              <div className="grid gap-3 sm:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,1fr)] sm:items-center">
                <div className="flex items-center gap-3">
                  <span
                    className={clsx(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold',
                      currentTone.bg,
                      currentTone.text,
                    )}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-mono text-xs font-semibold text-foreground">
                      {step.from}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {step.to}
                    </p>
                  </div>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="h-px w-8 bg-border" />
                  <span className={clsx('h-2 w-2 rounded-full', currentTone.line)} />
                  <span className="h-px w-8 bg-border" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-6 text-foreground">
                    {step.label}
                  </p>
                  {step.detail && (
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {step.detail}
                    </p>
                  )}
                </div>
              </div>
            </motion.li>
          )
        })}
      </ol>
    </DiagramShell>
  )
}

export function FlowDiagram({
  eyebrow = 'flow',
  title,
  caption,
  steps,
  compact = false,
}: {
  eyebrow?: string
  title?: string
  caption?: string
  steps: FlowStep[]
  compact?: boolean
}) {
  return (
    <DiagramShell
      eyebrow={eyebrow}
      title={title}
      caption={caption}
      compact={compact}
    >
      <ol
        className="grid gap-3 lg:grid-cols-[repeat(var(--flow-count),minmax(0,1fr))]"
        style={{ '--flow-count': steps.length } as CSSProperties}
      >
        {steps.map((step, index) => {
          const currentTone = tone(step.tone ?? 'teal')

          return (
            <motion.li
              variants={diagramItemVariants}
              key={`${step.label}-${index}`}
              className="relative min-w-0"
            >
              <div
                className={clsx(
                  'h-full rounded-[8px] border p-4 transition-shadow duration-300 hover:shadow-sm',
                  currentTone.border,
                  currentTone.bg,
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={clsx(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold',
                      'bg-background/70',
                      currentTone.text,
                    )}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={clsx(
                        'text-sm font-semibold leading-6',
                        currentTone.text,
                      )}
                    >
                      {step.label}
                    </p>
                    {step.meta && (
                      <p className="mt-1 font-mono text-xs leading-5 text-muted-foreground">
                        {step.meta}
                      </p>
                    )}
                    {step.detail && (
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {step.detail}
                      </p>
                    )}
                  </div>
                </div>
                {step.items && step.items.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {step.items.map((item) => (
                      <Badge key={item}>{item}</Badge>
                    ))}
                  </div>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block">
                  <span className="absolute left-full top-1/2 h-px w-3 -translate-y-1/2 bg-border" />
                  <span
                    className={clsx(
                      'absolute left-[calc(100%+0.75rem)] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full',
                      currentTone.line,
                    )}
                  />
                </div>
              )}
            </motion.li>
          )
        })}
      </ol>
    </DiagramShell>
  )
}

export function SystemBoundaryDiagram({
  eyebrow = 'system boundary',
  title,
  caption,
  groups,
  compact = false,
}: {
  eyebrow?: string
  title?: string
  caption?: string
  groups: BoundaryGroup[]
  compact?: boolean
}) {
  return (
    <DiagramShell
      eyebrow={eyebrow}
      title={title}
      caption={caption}
      compact={compact}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {groups.map((group, index) => {
          const currentTone = tone(group.tone ?? 'teal')

          return (
            <motion.section
              variants={diagramItemVariants}
              key={`${group.label}-${index}`}
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
                {group.label}
              </p>
              {group.detail && (
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {group.detail}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
              {group.signals && group.signals.length > 0 && (
                <div className="mt-4 border-t border-border/60 pt-3">
                  <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    observable
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.signals.map((signal) => (
                      <Badge key={signal}>{signal}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>
          )
        })}
      </div>
    </DiagramShell>
  )
}

export function CompareCallout({
  eyebrow = 'evidence boundary',
  title,
  caption,
  columns,
}: {
  eyebrow?: string
  title?: string
  caption?: string
  columns: CompareColumn[]
}) {
  return (
    <DiagramShell eyebrow={eyebrow} title={title} caption={caption}>
      <div className="grid gap-4 md:grid-cols-2">
        {columns.map((column, index) => {
          const currentTone = tone(
            column.tone ?? (index === 0 ? 'green' : 'amber'),
          )

          return (
            <motion.section
              variants={diagramItemVariants}
              key={`${column.title}-${index}`}
              className={clsx(
                'rounded-[8px] border p-4 transition-shadow duration-300 hover:shadow-sm',
                currentTone.border,
                currentTone.soft,
              )}
            >
              <p
                className={clsx(
                  'text-sm font-semibold leading-6',
                  currentTone.text,
                )}
              >
                {column.title}
              </p>
              <ul className="mt-3 space-y-2">
                {column.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-6 text-muted-foreground"
                  >
                    <span
                      className={clsx(
                        'mt-2 h-1.5 w-1.5 shrink-0 rounded-full',
                        currentTone.line,
                      )}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          )
        })}
      </div>
    </DiagramShell>
  )
}

export function ExpandableNotes({
  eyebrow = 'source notes',
  title,
  caption,
  notes,
}: {
  eyebrow?: string
  title?: string
  caption?: string
  notes: ExpandableNote[]
}) {
  return (
    <DiagramShell eyebrow={eyebrow} title={title} caption={caption}>
      <div className="space-y-3">
        {notes.map((note, index) => {
          const currentTone = tone(note.tone ?? 'surface')

          return (
            <motion.details
              variants={diagramItemVariants}
              key={`${note.title}-${index}`}
              className={clsx(
                'group rounded-[8px] border bg-background/55 p-4 transition-shadow duration-300 open:shadow-sm',
                currentTone.border,
              )}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <span
                  className={clsx(
                    'text-sm font-semibold leading-6',
                    currentTone.text,
                  )}
                >
                  {note.title}
                </span>
                <span className="font-mono text-xs text-muted-foreground transition group-open:rotate-45">
                  +
                </span>
              </summary>
              {note.detail && (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {note.detail}
                </p>
              )}
              {note.items && note.items.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {note.items.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              )}
            </motion.details>
          )
        })}
      </div>
    </DiagramShell>
  )
}

export function StateDiagram({
  eyebrow = 'state flow',
  title,
  caption,
  states,
}: {
  eyebrow?: string
  title?: string
  caption?: string
  states: StateItem[]
}) {
  return (
    <DiagramShell eyebrow={eyebrow} title={title} caption={caption}>
      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max items-stretch gap-3">
          {states.map((state, index) => {
            const currentTone = tone(state.tone)

            return (
              <motion.div
                variants={diagramItemVariants}
                key={`${state.label}-${index}`}
                className="flex items-center gap-3"
              >
                <div
                  className={clsx(
                    'w-48 rounded-[8px] border p-3 transition-shadow duration-300 hover:shadow-sm',
                    currentTone.border,
                    currentTone.bg,
                  )}
                >
                  <p
                    className={clsx(
                      'font-mono text-xs font-semibold',
                      currentTone.text,
                    )}
                  >
                    {state.label}
                  </p>
                  {state.detail && (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {state.detail}
                    </p>
                  )}
                </div>
                {index < states.length - 1 && (
                  <div className="flex w-20 flex-col items-center gap-1">
                    {state.next && (
                      <span className="text-center font-mono text-xs font-medium leading-4 text-muted-foreground">
                        {state.next}
                      </span>
                    )}
                    <div className="flex w-full items-center">
                      <span className="h-px flex-1 bg-border" />
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </DiagramShell>
  )
}

export function MappingDiagram({
  eyebrow = 'object mapping',
  title,
  caption,
  source,
  groups,
}: {
  eyebrow?: string
  title?: string
  caption?: string
  source: DiagramItem
  groups: MappingGroup[]
}) {
  const sourceTone = tone(source.tone ?? 'teal')

  return (
    <DiagramShell eyebrow={eyebrow} title={title} caption={caption}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1fr)] lg:items-start">
        <motion.div
          variants={diagramItemVariants}
          className={clsx(
            'rounded-[8px] border p-4 transition-shadow duration-300 hover:shadow-sm',
            sourceTone.border,
            sourceTone.bg,
          )}
        >
          <p className={clsx('font-mono text-xs font-semibold', sourceTone.text)}>
            {source.label}
          </p>
          {source.detail && (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {source.detail}
            </p>
          )}
        </motion.div>
        <div className="space-y-3">
          {groups.map((group, index) => {
            const currentTone = tone(group.tone ?? 'blue')

            return (
              <motion.div
                variants={diagramItemVariants}
                key={`${group.label}-${index}`}
                className={clsx(
                  'rounded-[8px] border p-4 transition-shadow duration-300 hover:shadow-sm',
                  currentTone.border,
                  currentTone.soft,
                )}
              >
                <p
                  className={clsx(
                    'text-sm font-semibold leading-6',
                    currentTone.text,
                  )}
                >
                  {group.label}
                </p>
                {group.detail && (
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {group.detail}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </DiagramShell>
  )
}
