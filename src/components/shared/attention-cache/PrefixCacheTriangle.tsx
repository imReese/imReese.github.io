'use client'

import clsx from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'
import * as React from 'react'
import { InteractiveShell, itemVariants } from './InteractiveShell'
import { MetricCard } from './MetricCard'
import { fullAttentionRemaining, remainingSpeedup } from './math'
import { Slider } from './Slider'

export function PrefixCacheTriangle() {
  const [hitPercent, setHitPercent] = React.useState(50)
  const prefersReducedMotion = useReducedMotion()
  const sliderId = React.useId()
  const alpha = hitPercent / 100
  const remaining = fullAttentionRemaining(alpha)
  const speedup = remainingSpeedup(remaining)
  const gridSize = 18
  const hitRows = Math.round(alpha * gridSize)
  const plotStart = 44
  const cellSize = 16
  const plotSize = gridSize * cellSize

  return (
    <InteractiveShell
      eyebrow="因果几何实验"
      title="拖动前缀命中率，观察真正被跳过的 Attention 三角形"
      caption="带斜纹的绿色网格是已缓存 Query 行，带点纹的蓝色网格是仍需计算的后缀。这里归一化的是完整因果 Attention FLOPs。"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(17rem,0.95fr)] lg:items-center">
        <motion.div
          variants={itemVariants}
          className="min-w-0 rounded-[8px] border border-border/70 bg-background/45 p-2 sm:p-3"
        >
          <svg
            viewBox="0 0 376 364"
            className="mx-auto block h-auto w-full max-w-[25rem]"
            role="img"
            aria-labelledby={`${sliderId}-matrix-title ${sliderId}-matrix-desc`}
          >
            <title id={`${sliderId}-matrix-title`}>
              Prefix Cache 的因果 Attention 矩阵
            </title>
            <desc id={`${sliderId}-matrix-desc`}>
              前缀缓存复用了 {hitPercent}% 的 Query 行。被跳过的 Attention
              三角形占原始因果 Attention 矩阵的{' '}
              {(alpha * alpha * 100).toFixed(1)}
              %。带斜纹的绿色单元格表示已跳过，带点纹的蓝色单元格表示仍需计算。
            </desc>

            <defs>
              <pattern
                id={`${sliderId}-cached-pattern`}
                width="5"
                height="5"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M-1 1L1-1M0 5L5 0M4 6L6 4"
                  className="stroke-background/75"
                  strokeWidth="1"
                />
              </pattern>
              <pattern
                id={`${sliderId}-remaining-pattern`}
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="3" cy="3" r="0.8" className="fill-background/85" />
              </pattern>
            </defs>

            <text
              x={plotStart + plotSize / 2}
              y="22"
              textAnchor="middle"
              className="fill-muted-foreground font-mono text-[11px]"
            >
              Key 位置 →
            </text>
            <text
              x="14"
              y={plotStart + plotSize / 2}
              textAnchor="middle"
              transform={`rotate(-90 14 ${plotStart + plotSize / 2})`}
              className="fill-muted-foreground font-mono text-[11px]"
            >
              Query 位置 →
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
                      <>
                        <motion.rect
                          x={plotStart + key * cellSize + 1}
                          y={plotStart + query * cellSize + 1}
                          width={cellSize - 2}
                          height={cellSize - 2}
                          rx="2"
                          initial={false}
                          animate={{
                            opacity: cached ? 0.82 : 0.76,
                            scale: prefersReducedMotion || !cached ? 1 : 0.93,
                          }}
                          transition={{
                            duration: prefersReducedMotion ? 0 : 0.24,
                            ease: 'easeOut',
                          }}
                          style={{
                            transformOrigin: `${plotStart + (key + 0.5) * cellSize}px ${plotStart + (query + 0.5) * cellSize}px`,
                          }}
                          className={clsx(
                            'transition-colors duration-300 motion-reduce:transition-none',
                            cached
                              ? 'fill-[#40a02b] dark:fill-[#a6e3a1]'
                              : 'fill-[#1e66f5] dark:fill-[#89b4fa]',
                          )}
                        />
                        <rect
                          x={plotStart + key * cellSize + 1}
                          y={plotStart + query * cellSize + 1}
                          width={cellSize - 2}
                          height={cellSize - 2}
                          rx="2"
                          fill={`url(#${sliderId}-${
                            cached ? 'cached' : 'remaining'
                          }-pattern)`}
                          opacity="0.72"
                        />
                      </>
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
                transition={{ duration: prefersReducedMotion ? 0 : 0.24 }}
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
          <div className="mt-1 flex flex-col justify-center gap-2 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-5">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm border border-[#40a02b] bg-[#40a02b]/70 bg-[repeating-linear-gradient(135deg,transparent,transparent_2px,currentColor_2px,currentColor_3px)] text-background dark:border-[#a6e3a1] dark:bg-[#a6e3a1]/70" />
              斜纹 · 已跳过的前缀行
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm border border-[#1e66f5] bg-[#1e66f5]/70 dark:border-[#89b4fa] dark:bg-[#89b4fa]/70" />
              点纹 · 仍需计算的后缀行
            </span>
          </div>
        </motion.div>

        <div className="min-w-0 space-y-4">
          <motion.div variants={itemVariants}>
            <Slider
              id={sliderId}
              label="前缀命中率 · α"
              value={hitPercent}
              max={90}
              valueLabel={`${hitPercent}%`}
              minLabel="0%"
              maxLabel="90%"
              description="逻辑前缀长度占完整输入长度的比例。"
              onChange={setHitPercent}
            />
          </motion.div>
          <div
            className="grid gap-3 sm:grid-cols-2"
            aria-live="polite"
            aria-atomic="true"
          >
            <MetricCard
              label="剩余 FLOPs"
              value={`${(remaining * 100).toFixed(1)}%`}
              formula={`1 − ${alpha.toFixed(2)}²`}
              tone="blue"
            />
            <MetricCard
              label="理想加速比"
              value={`${speedup.toFixed(2)}×`}
              formula="1 / (1 − α²)"
              note="仅限 Attention 主体的理想上界"
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
