import clsx from 'clsx'
import { type ReactNode } from 'react'

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
    border: 'border-[#179299]/35 dark:border-[#94e2d5]/35',
    bg: 'bg-[#179299]/10 dark:bg-[#94e2d5]/10',
    text: 'text-primary dark:text-[#94e2d5]',
    soft: 'bg-[#179299]/8 dark:bg-[#94e2d5]/8',
    line: 'bg-[#179299] dark:bg-[#94e2d5]',
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
}: {
  eyebrow?: string
  title?: string
  caption?: string
  children: ReactNode
}) {
  return (
    <figure className="not-prose my-10 overflow-hidden rounded-[8px] border border-border/80 bg-card/55 shadow-[0_22px_70px_-42px_rgba(76,79,105,0.55)] dark:bg-card/55 dark:shadow-[0_22px_70px_-44px_rgba(17,17,27,0.95)]">
      {(eyebrow || title || caption) && (
        <figcaption className="border-b border-border/70 px-4 py-4 sm:px-5">
          {eyebrow && (
            <p className="mb-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary">
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
        </figcaption>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </figure>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-border/70 bg-background/60 px-2 py-1 font-mono text-[0.72rem] font-medium leading-none text-muted-foreground">
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
            <div key={`${layer.label}-${index}`}>
              <div
                className={clsx(
                  'relative overflow-hidden rounded-[8px] border p-4',
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
            </div>
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
      <div className="mb-4 flex flex-wrap gap-2">
        {actors.map((actor) => (
          <Badge key={actor}>{actor}</Badge>
        ))}
      </div>
      <ol className="space-y-3">
        {steps.map((step, index) => {
          const currentTone = tone(step.tone ?? 'teal')

          return (
            <li
              key={`${step.from}-${step.to}-${step.label}-${index}`}
              className={clsx(
                'rounded-[8px] border bg-background/55 p-3',
                currentTone.border,
              )}
            >
              <div className="grid gap-3 sm:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,1fr)] sm:items-center">
                <div className="flex items-center gap-3">
                  <span
                    className={clsx(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[0.72rem] font-semibold',
                      currentTone.bg,
                      currentTone.text,
                    )}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-mono text-[0.76rem] font-semibold text-foreground">
                      {step.from}
                    </p>
                    <p className="font-mono text-[0.76rem] text-muted-foreground">
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
            </li>
          )
        })}
      </ol>
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
              <div
                key={`${state.label}-${index}`}
                className="flex items-center gap-3"
              >
                <div
                  className={clsx(
                    'w-48 rounded-[8px] border p-3',
                    currentTone.border,
                    currentTone.bg,
                  )}
                >
                  <p
                    className={clsx(
                      'font-mono text-[0.78rem] font-semibold',
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
                      <span className="text-center font-mono text-[0.68rem] font-medium leading-4 text-muted-foreground">
                        {state.next}
                      </span>
                    )}
                    <div className="flex w-full items-center">
                      <span className="h-px flex-1 bg-border" />
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  </div>
                )}
              </div>
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
        <div
          className={clsx(
            'rounded-[8px] border p-4',
            sourceTone.border,
            sourceTone.bg,
          )}
        >
          <p
            className={clsx(
              'font-mono text-[0.8rem] font-semibold',
              sourceTone.text,
            )}
          >
            {source.label}
          </p>
          {source.detail && (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {source.detail}
            </p>
          )}
        </div>
        <div className="space-y-3">
          {groups.map((group, index) => {
            const currentTone = tone(group.tone ?? 'blue')

            return (
              <div
                key={`${group.label}-${index}`}
                className={clsx(
                  'rounded-[8px] border p-4',
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
              </div>
            )
          })}
        </div>
      </div>
    </DiagramShell>
  )
}
