export type MetricTone = 'teal' | 'blue' | 'green' | 'mauve' | 'amber'

export type CurveSeries = {
  label: string
  shortLabel: string
  detail: string
  className: string
  dotClassName: string
  dashArray?: string
  remaining: (alpha: number) => number
  stepped?: boolean
}

export type EvolutionStage = {
  label: string
  eyebrow: string
  representation: string
  growth: string
  restore: string
  summary: string
  details: string[]
  tone: 'teal' | 'blue' | 'mauve' | 'amber' | 'green'
}
