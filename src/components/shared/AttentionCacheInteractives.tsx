'use client'

import clsx from 'clsx'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import * as React from 'react'
import { type ReactNode } from 'react'

const revealEase = [0.22, 1, 0.36, 1] as const
const MAX_HIT_RATIO = 0.9
const SWA_WINDOW_RATIO = 0.25

const shellVariants: Variants = {
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
      delayChildren: 0.06,
      staggerChildren: 0.07,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: revealEase },
  },
}

function InteractiveShell({
  eyebrow,
  title,
  caption,
  children,
}: {
  eyebrow: string
  title: string
  caption: string
  children: ReactNode
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.figure
      variants={prefersReducedMotion ? undefined : shellVariants}
      initial={prefersReducedMotion ? false : 'hidden'}
      whileInView={prefersReducedMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -8% 0px' }}
      className="not-prose my-10 overflow-hidden rounded-lg border border-border/80 bg-surface/55 shadow-[0_22px_70px_-42px_rgba(76,79,105,0.35)] dark:shadow-[0_22px_70px_-44px_rgba(17,17,27,0.7)]"
    >
      <motion.figcaption
        variants={prefersReducedMotion ? undefined : itemVariants}
        className="border-b border-border/70 px-4 py-4 sm:px-5"
      >
        <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {eyebrow}
        </p>
        <p className="text-sm font-semibold leading-6 text-foreground">
          {title}
        </p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {caption}
        </p>
      </motion.figcaption>
      <div className="p-4 sm:p-5">{children}</div>
    </motion.figure>
  )
}

function MetricCard({
  label,
  value,
  formula,
  tone = 'teal',
}: {
  label: string
  value: string
  formula: string
  tone?: 'teal' | 'blue' | 'green' | 'mauve'
}) {
  const toneClasses = {
    teal: 'border-primary/30 bg-accent-soft/55 text-primary',
    blue: 'border-[#1e66f5]/30 bg-[#1e66f5]/[0.07] text-[#1e66f5] dark:border-[#89b4fa]/35 dark:bg-[#89b4fa]/[0.08] dark:text-[#89b4fa]',
    green:
      'border-[#40a02b]/30 bg-[#40a02b]/[0.07] text-[#2f7d20] dark:border-[#a6e3a1]/35 dark:bg-[#a6e3a1]/[0.08] dark:text-[#a6e3a1]',
    mauve:
      'border-[#8839ef]/30 bg-[#8839ef]/[0.07] text-[#8839ef] dark:border-[#cba6f7]/35 dark:bg-[#cba6f7]/[0.08] dark:text-[#cba6f7]',
  }

  return (
    <motion.div
      variants={itemVariants}
      className={clsx('rounded-[8px] border p-3 sm:p-4', toneClasses[tone])}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.08em] opacity-80">
        {label}
      </p>
      <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 font-mono text-xs opacity-80">{formula}</p>
    </motion.div>
  )
}

function Slider({
  id,
  label,
  value,
  max,
  onChange,
}: {
  id: string
  label: string
  value: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <div className="rounded-[8px] border border-border/80 bg-background/55 p-4">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-semibold text-foreground">
          {label}
        </label>
        <output
          htmlFor={id}
          className="font-mono text-lg font-semibold tabular-nums text-primary"
        >
          {value}%
        </output>
      </div>
      <input
        id={id}
        type="range"
        min="0"
        max={max}
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        onInput={(event) => onChange(Number(event.currentTarget.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />
      <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
        <span>0%</span>
        <span>{max}%</span>
      </div>
    </div>
  )
}

export function PrefixCacheTriangle() {
  const [hitPercent, setHitPercent] = React.useState(50)
  const prefersReducedMotion = useReducedMotion()
  const sliderId = React.useId()
  const alpha = hitPercent / 100
  const remaining = 1 - alpha * alpha
  const speedup = 1 / remaining
  const gridSize = 18
  const hitRows = Math.round(alpha * gridSize)
  const plotStart = 44
  const cellSize = 16
  const plotSize = gridSize * cellSize

  return (
    <InteractiveShell
      eyebrow="causal geometry lab"
      title="拖动 Prefix 命中率，观察真正被跳过的 Attention 三角形"
      caption="绿色是已经缓存的 Query 行；蓝色仍需计算。这里归一化的是 Full Causal Attention FLOPs。"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(17rem,0.95fr)] lg:items-center">
        <motion.div
          variants={itemVariants}
          className="rounded-[8px] border border-border/70 bg-background/45 p-2 sm:p-3"
        >
          <svg
            viewBox="0 0 376 364"
            className="mx-auto block h-auto w-full max-w-[25rem]"
            role="img"
            aria-labelledby={`${sliderId}-matrix-title ${sliderId}-matrix-desc`}
          >
            <title id={`${sliderId}-matrix-title`}>
              Prefix cache causal attention matrix
            </title>
            <desc id={`${sliderId}-matrix-desc`}>
              {hitPercent}% of query rows are served by prefix cache. The
              skipped attention triangle occupies{' '}
              {(alpha * alpha * 100).toFixed(1)}% of the original causal
              attention matrix.
            </desc>

            <text
              x={plotStart + plotSize / 2}
              y="22"
              textAnchor="middle"
              className="fill-muted-foreground font-mono text-[11px]"
            >
              Key position →
            </text>
            <text
              x="14"
              y={plotStart + plotSize / 2}
              textAnchor="middle"
              transform={`rotate(-90 14 ${plotStart + plotSize / 2})`}
              className="fill-muted-foreground font-mono text-[11px]"
            >
              Query position →
            </text>

            {Array.from({ length: gridSize }, (_, query) =>
              Array.from({ length: gridSize }, (_, key) => {
                const causal = key <= query
                const cached = causal && query < hitRows

                return (
                  <g key={`${query}-${key}`}>
                    <rect
                      x={plotStart + key * cellSize + 1}
                      y={plotStart + query * cellSize + 1}
                      width={cellSize - 2}
                      height={cellSize - 2}
                      rx="2"
                      className="fill-secondary/35"
                    />
                    {causal && (
                      <motion.rect
                        x={plotStart + key * cellSize + 1}
                        y={plotStart + query * cellSize + 1}
                        width={cellSize - 2}
                        height={cellSize - 2}
                        rx="2"
                        initial={false}
                        animate={{
                          opacity: cached ? 0.78 : 0.72,
                          scale: prefersReducedMotion ? 1 : cached ? 0.93 : 1,
                        }}
                        transition={{ duration: 0.24, ease: 'easeOut' }}
                        style={{
                          transformOrigin: `${plotStart + (key + 0.5) * cellSize}px ${plotStart + (query + 0.5) * cellSize}px`,
                        }}
                        className={clsx(
                          'transition-colors duration-300',
                          cached
                            ? 'fill-[#40a02b] dark:fill-[#a6e3a1]'
                            : 'fill-[#1e66f5] dark:fill-[#89b4fa]',
                        )}
                      />
                    )}
                  </g>
                )
              }),
            )}

            {hitRows > 0 && hitRows < gridSize && (
              <motion.line
                initial={false}
                animate={{
                  y1: plotStart + hitRows * cellSize,
                  y2: plotStart + hitRows * cellSize,
                }}
                x1={plotStart - 4}
                x2={plotStart + plotSize + 4}
                strokeDasharray="5 5"
                className="stroke-primary"
                strokeWidth="1.5"
              />
            )}

            <text
              x={plotStart}
              y={plotStart + plotSize + 20}
              className="fill-muted-foreground font-mono text-[10px]"
            >
              0
            </text>
            <text
              x={plotStart + plotSize}
              y={plotStart + plotSize + 20}
              textAnchor="end"
              className="fill-muted-foreground font-mono text-[10px]"
            >
              N
            </text>
          </svg>
          <div className="mt-1 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#40a02b] dark:bg-[#a6e3a1]" />
              skipped prefix rows
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#1e66f5] dark:bg-[#89b4fa]" />
              remaining suffix rows
            </span>
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.div variants={itemVariants}>
            <Slider
              id={sliderId}
              label="Prefix hit ratio · α"
              value={hitPercent}
              max={90}
              onChange={setHitPercent}
            />
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Remaining FLOPs"
              value={`${(remaining * 100).toFixed(1)}%`}
              formula={`1 − ${alpha.toFixed(2)}²`}
              tone="blue"
            />
            <MetricCard
              label="Ideal speedup"
              value={`${speedup.toFixed(2)}×`}
              formula="1 / (1 − α²)"
              tone="green"
            />
          </div>
          <motion.p
            variants={itemVariants}
            className="rounded-[8px] border border-border/70 bg-secondary/25 px-4 py-3 text-sm leading-6 text-muted-foreground"
          >
            命中 {hitPercent}% 的 token，只跳过左上角面积为{' '}
            <strong className="font-semibold text-foreground">
              {(alpha * alpha * 100).toFixed(1)}%
            </strong>{' '}
            的旧 Query；新 Query 仍要读取命中前缀中的 Key/Value。
          </motion.p>
        </div>
      </div>
    </InteractiveShell>
  )
}

function fullAttentionRemaining(alpha: number) {
  return 1 - alpha * alpha
}

function swaArea(length: number) {
  if (length <= SWA_WINDOW_RATIO) return (length * length) / 2
  return SWA_WINDOW_RATIO * length - SWA_WINDOW_RATIO ** 2 / 2
}

function swaRemaining(alpha: number) {
  return (swaArea(1) - swaArea(alpha)) / swaArea(1)
}

function kdaRemaining(alpha: number) {
  return 1 - alpha
}

function idealSpeedup(remaining: number) {
  return 1 / Math.max(remaining, 0.0001)
}

type CurveSeries = {
  label: string
  shortLabel: string
  detail: string
  className: string
  dotClassName: string
  remaining: (alpha: number) => number
}

const curveSeries: CurveSeries[] = [
  {
    label: 'MHA / MLA',
    shortLabel: 'Full causal',
    detail: 'quadratic causal triangle',
    className: 'stroke-[#1e66f5] dark:stroke-[#89b4fa]',
    dotClassName: 'fill-[#1e66f5] dark:fill-[#89b4fa]',
    remaining: fullAttentionRemaining,
  },
  {
    label: 'SWA',
    shortLabel: 'W = 25% · N',
    detail: 'quadratic, then window-bounded',
    className: 'stroke-[#8839ef] dark:stroke-[#cba6f7]',
    dotClassName: 'fill-[#8839ef] dark:fill-[#cba6f7]',
    remaining: swaRemaining,
  },
  {
    label: 'KDA',
    shortLabel: 'exact checkpoint',
    detail: 'linear recurrent scan',
    className: 'stroke-[#40a02b] dark:stroke-[#a6e3a1]',
    dotClassName: 'fill-[#40a02b] dark:fill-[#a6e3a1]',
    remaining: kdaRemaining,
  },
]

export function AttentionSpeedupCurve() {
  const [hitPercent, setHitPercent] = React.useState(50)
  const prefersReducedMotion = useReducedMotion()
  const sliderId = React.useId()
  const alpha = hitPercent / 100
  const width = 640
  const height = 320
  const plot = { left: 54, right: 618, top: 24, bottom: 258 }
  const plotWidth = plot.right - plot.left
  const plotHeight = plot.bottom - plot.top
  const maxSpeedup = 10
  const x = (value: number) => plot.left + (value / MAX_HIT_RATIO) * plotWidth
  const y = (value: number) =>
    plot.bottom - ((value - 1) / (maxSpeedup - 1)) * plotHeight
  const pathFor = (series: CurveSeries) =>
    Array.from({ length: 91 }, (_, index) => {
      const sampleAlpha = index / 100
      const sampleSpeedup = idealSpeedup(series.remaining(sampleAlpha))
      return `${index === 0 ? 'M' : 'L'} ${x(sampleAlpha).toFixed(2)} ${y(sampleSpeedup).toFixed(2)}`
    }).join(' ')

  return (
    <InteractiveShell
      eyebrow="attention speedup explorer"
      title="相同 Prefix 命中率，不同 Attention 的可跳过工作量并不相同"
      caption="曲线只比较理想化 Attention 主体：MHA/MLA 为 Full Causal，SWA 取 W = 0.25N，KDA 假设命中边界有完整 checkpoint。"
    >
      <motion.div
        variants={itemVariants}
        className="overflow-x-auto rounded-[8px] border border-border/70 bg-background/45 p-2 sm:p-4"
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="block h-auto w-full min-w-[34rem]"
          role="img"
          aria-labelledby={`${sliderId}-curve-title ${sliderId}-curve-desc`}
        >
          <title id={`${sliderId}-curve-title`}>
            Ideal prefix cache attention speedup curves
          </title>
          <desc id={`${sliderId}-curve-desc`}>
            Speedup from zero to ninety percent prefix hit ratio for full causal
            MHA or MLA, sliding window attention, and KDA with an exact state
            checkpoint.
          </desc>

          {[1, 2, 4, 6, 8, 10].map((tick) => (
            <g key={tick}>
              <line
                x1={plot.left}
                x2={plot.right}
                y1={y(tick)}
                y2={y(tick)}
                className="stroke-border/55"
                strokeDasharray={tick === 1 ? undefined : '4 6'}
              />
              <text
                x={plot.left - 10}
                y={y(tick) + 4}
                textAnchor="end"
                className="fill-muted-foreground font-mono text-[11px]"
              >
                {tick}×
              </text>
            </g>
          ))}
          {[0, 0.25, 0.5, 0.75, 0.9].map((tick) => (
            <g key={tick}>
              <line
                x1={x(tick)}
                x2={x(tick)}
                y1={plot.top}
                y2={plot.bottom}
                className="stroke-border/25"
              />
              <text
                x={x(tick)}
                y={plot.bottom + 22}
                textAnchor="middle"
                className="fill-muted-foreground font-mono text-[11px]"
              >
                {Math.round(tick * 100)}%
              </text>
            </g>
          ))}
          <text
            x={(plot.left + plot.right) / 2}
            y={height - 8}
            textAnchor="middle"
            className="fill-muted-foreground text-[12px]"
          >
            Prefix hit ratio · α
          </text>
          <text
            x="14"
            y={(plot.top + plot.bottom) / 2}
            textAnchor="middle"
            transform={`rotate(-90 14 ${(plot.top + plot.bottom) / 2})`}
            className="fill-muted-foreground text-[12px]"
          >
            Ideal attention speedup
          </text>

          {curveSeries.map((series) => (
            <motion.path
              key={series.label}
              d={pathFor(series)}
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              className={series.className}
              initial={
                prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }
              }
              whileInView={
                prefersReducedMotion ? undefined : { pathLength: 1, opacity: 1 }
              }
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: revealEase }}
            />
          ))}

          <motion.line
            initial={false}
            animate={{ x1: x(alpha), x2: x(alpha) }}
            y1={plot.top}
            y2={plot.bottom}
            className="stroke-foreground/45"
            strokeDasharray="3 4"
          />
          {curveSeries.map((series) => {
            const currentSpeedup = idealSpeedup(series.remaining(alpha))
            return (
              <motion.circle
                key={`${series.label}-cursor`}
                initial={false}
                animate={{ cx: x(alpha), cy: y(currentSpeedup) }}
                r="5"
                className={clsx(series.dotClassName, 'stroke-background')}
                strokeWidth="2"
              />
            )
          })}
        </svg>
      </motion.div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <motion.div variants={itemVariants}>
          <Slider
            id={sliderId}
            label="Compare at hit ratio · α"
            value={hitPercent}
            max={90}
            onChange={setHitPercent}
          />
        </motion.div>
        <div className="grid gap-3 sm:grid-cols-3">
          {curveSeries.map((series) => (
            <motion.div
              variants={itemVariants}
              key={series.label}
              className="rounded-[8px] border border-border/70 bg-background/55 p-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className={clsx(
                    'h-2.5 w-2.5 rounded-full',
                    series.dotClassName.replaceAll('fill-', 'bg-'),
                  )}
                />
                <p className="text-sm font-semibold text-foreground">
                  {series.label}
                </p>
              </div>
              <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-foreground">
                {idealSpeedup(series.remaining(alpha)).toFixed(2)}×
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {series.shortLabel}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        variants={itemVariants}
        className="mt-4 grid gap-2 rounded-[8px] border border-border/70 bg-secondary/20 p-3 sm:grid-cols-3"
      >
        {curveSeries.map((series) => (
          <p
            key={`${series.label}-detail`}
            className="text-xs leading-5 text-muted-foreground"
          >
            <strong className="font-semibold text-foreground">
              {series.label}
            </strong>
            <span className="mx-1 text-border">·</span>
            {series.detail}
          </p>
        ))}
      </motion.div>
    </InteractiveShell>
  )
}

type EvolutionStage = {
  label: string
  eyebrow: string
  representation: string
  growth: string
  restore: string
  summary: string
  details: string[]
  tone: 'teal' | 'blue' | 'mauve' | 'amber' | 'green'
}

const evolutionStages: EvolutionStage[] = [
  {
    label: 'KV Cache',
    eyebrow: 'dense history',
    representation: 'Kₜ + Vₜ per layer',
    growth: 'O(T · Hkv · d)',
    restore: 'all KV pages in [0, t)',
    summary:
      'MHA/GQA/MQA 将每个历史 token 的 Key 与 Value 直接保存下来；下一条 Query 读取这段完整历史。',
    details: [
      '物理对象通常按 layer、page、K/V 与 parallel rank 拆分',
      'Prefix 命中的是连续 token 边界，不是任意 page 集合',
    ],
    tone: 'blue',
  },
  {
    label: 'MLA latent',
    eyebrow: 'compressed history',
    representation: 'cₜᴷⱽ + RoPE key',
    growth: 'O(T · (dc + dr))',
    restore: 'latent and RoPE share boundary t',
    summary:
      'MLA 不再持久化展开后的所有 KV Heads，而是保存每 token 的压缩 latent 与解耦 RoPE 信息。',
    details: [
      '压缩改变 cache 宽度，但 Full Causal Attention 的依赖三角形仍然存在',
      'q_lora_rank 属于 Query 路径，通常不是持久化历史',
    ],
    tone: 'teal',
  },
  {
    label: 'DSA state',
    eyebrow: 'selected history',
    representation: 'MLA history + index keys',
    growth: 'usually O(T)',
    restore: 'main cache ∩ index state',
    summary:
      'DSA 在主 Attention 历史旁增加稀疏选择状态。Top-k 限制一次读取多少位置，不等于只存 top-k 个位置。',
    details: [
      'Indexer keys、主 MLA latent 与选择元数据可能属于不同 pool',
      '可恢复命中长度取所有必需 pool 的共同连续前缀',
    ],
    tone: 'mauve',
  },
  {
    label: 'KDA checkpoint',
    eyebrow: 'recurrent boundary',
    representation: 'S(t) + ShortConv Γ(t)',
    growth: 'live O(1); store O(checkpoints)',
    restore: 'complete checkpoint exactly at t',
    summary:
      'KDA 把长历史压进递归矩阵；Prefix reuse 需要在目标 token 边界保存完整 recurrent 与 convolution state。',
    details: [
      '只有矩阵 S(t) 不一定足够，ShortConv window 也可能是续算必需状态',
      '最近 checkpoint 早于命中边界时，中间 token 仍需 replay',
    ],
    tone: 'amber',
  },
  {
    label: 'Attention State Store',
    eyebrow: 'serving abstraction',
    representation: 'typed state bundle + identity',
    growth: 'sum of required state groups',
    restore: 'minimum complete aligned boundary',
    summary:
      '统一存储层不应假设对象永远是 K/V；它管理 pages、latent、index state、checkpoint 及其边界身份。',
    details: [
      '身份至少包含 model、layer/group、layout、dtype、parallel rank 与 prefix hash',
      'Store 返回“存在”不等于 runtime 已成功 load-back 并可安全续算',
    ],
    tone: 'green',
  },
]

const stageToneClasses = {
  teal: {
    active: 'border-primary/45 bg-accent-soft/70 text-primary ring-primary/15',
    dot: 'bg-primary',
  },
  blue: {
    active:
      'border-[#1e66f5]/40 bg-[#1e66f5]/10 text-[#1e66f5] ring-[#1e66f5]/15 dark:border-[#89b4fa]/40 dark:bg-[#89b4fa]/10 dark:text-[#89b4fa] dark:ring-[#89b4fa]/15',
    dot: 'bg-[#1e66f5] dark:bg-[#89b4fa]',
  },
  mauve: {
    active:
      'border-[#8839ef]/40 bg-[#8839ef]/10 text-[#8839ef] ring-[#8839ef]/15 dark:border-[#cba6f7]/40 dark:bg-[#cba6f7]/10 dark:text-[#cba6f7] dark:ring-[#cba6f7]/15',
    dot: 'bg-[#8839ef] dark:bg-[#cba6f7]',
  },
  amber: {
    active:
      'border-[#df8e1d]/45 bg-[#df8e1d]/10 text-[#9a5b00] ring-[#df8e1d]/15 dark:border-[#f9e2af]/40 dark:bg-[#f9e2af]/10 dark:text-[#f9e2af] dark:ring-[#f9e2af]/15',
    dot: 'bg-[#df8e1d] dark:bg-[#f9e2af]',
  },
  green: {
    active:
      'border-[#40a02b]/40 bg-[#40a02b]/10 text-[#2f7d20] ring-[#40a02b]/15 dark:border-[#a6e3a1]/40 dark:bg-[#a6e3a1]/10 dark:text-[#a6e3a1] dark:ring-[#a6e3a1]/15',
    dot: 'bg-[#40a02b] dark:bg-[#a6e3a1]',
  },
}

export function AttentionStateEvolution() {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const prefersReducedMotion = useReducedMotion()
  const activeStage = evolutionStages[activeIndex]
  const activeTone = stageToneClasses[activeStage.tone]

  return (
    <InteractiveShell
      eyebrow="state evolution"
      title="Attention Cache 正在从 KV tensor 演化为可恢复的状态集合"
      caption="选择任一阶段，比较它保存什么、如何增长，以及 Prefix reuse 真正需要恢复到哪个边界。"
    >
      <div className="overflow-x-auto pb-2">
        <ol className="grid min-w-[760px] grid-cols-5 gap-3">
          {evolutionStages.map((stage, index) => {
            const isActive = index === activeIndex
            const tone = stageToneClasses[stage.tone]

            return (
              <motion.li
                variants={itemVariants}
                key={stage.label}
                className="relative"
              >
                {index < evolutionStages.length - 1 && (
                  <span className="absolute left-[calc(50%+2.1rem)] top-5 h-px w-[calc(100%-3.45rem)] bg-border" />
                )}
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  className={clsx(
                    'relative z-10 w-full rounded-[8px] border px-3 py-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isActive
                      ? clsx(tone.active, 'shadow-sm ring-4')
                      : 'border-border/70 bg-background/70 text-muted-foreground hover:border-border hover:bg-secondary/45 hover:text-foreground',
                  )}
                >
                  <span
                    className={clsx(
                      'mb-3 flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] font-semibold text-background',
                      tone.dot,
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="block text-sm font-semibold leading-5">
                    {stage.label}
                  </span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.08em] opacity-75">
                    {stage.eyebrow}
                  </span>
                </button>
              </motion.li>
            )
          })}
        </ol>
      </div>

      <div className="mt-4 min-h-[19rem] overflow-hidden rounded-[8px] border border-border/75 bg-background/55">
        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={activeStage.label}
            initial={prefersReducedMotion ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, x: -12 }}
            transition={{ duration: 0.28, ease: revealEase }}
            className="p-4 sm:p-5"
            aria-live="polite"
          >
            <div className="flex flex-col gap-2 border-b border-border/60 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Stage {activeIndex + 1} · {activeStage.eyebrow}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">
                  {activeStage.label}
                </h3>
              </div>
              <span
                className={clsx(
                  'inline-flex self-start rounded-md px-2.5 py-1 font-mono text-xs font-semibold',
                  activeTone.active,
                )}
              >
                {activeStage.growth}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {activeStage.summary}
            </p>

            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[8px] border border-border/65 bg-secondary/25 p-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Representation
                </dt>
                <dd className="mt-2 font-mono text-sm font-semibold text-foreground">
                  {activeStage.representation}
                </dd>
              </div>
              <div className="rounded-[8px] border border-border/65 bg-secondary/25 p-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Storage growth
                </dt>
                <dd className="mt-2 font-mono text-sm font-semibold text-foreground">
                  {activeStage.growth}
                </dd>
              </div>
              <div className="rounded-[8px] border border-border/65 bg-secondary/25 p-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Resume invariant
                </dt>
                <dd className="mt-2 font-mono text-sm font-semibold text-foreground">
                  {activeStage.restore}
                </dd>
              </div>
            </dl>

            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {activeStage.details.map((detail) => (
                <li
                  key={detail}
                  className="flex gap-2 rounded-[8px] border border-border/60 bg-surface/45 px-3 py-2 text-sm leading-6 text-muted-foreground"
                >
                  <span
                    className={clsx(
                      'mt-2 h-1.5 w-1.5 shrink-0 rounded-full',
                      activeTone.dot,
                    )}
                  />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        </AnimatePresence>
      </div>
    </InteractiveShell>
  )
}
