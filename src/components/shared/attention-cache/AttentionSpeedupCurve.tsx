'use client'

import clsx from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'
import * as React from 'react'
import { InteractiveShell, itemVariants, revealEase } from './InteractiveShell'
import {
  checkpointAlignedResume,
  fullAttentionRemaining,
  kdaRemaining,
  remainingSpeedup,
  swaRemaining,
} from './math'
import { Slider } from './Slider'
import { type CurveSeries } from './types'

const MAX_HIT_RATIO = 0.9
const SWA_WINDOW_RATIO = 0.25
const TOTAL_TOKENS = 32_768

export function AttentionSpeedupCurve() {
  const [hitPercent, setHitPercent] = React.useState(50)
  const [checkpointInterval, setCheckpointInterval] = React.useState(4096)
  const prefersReducedMotion = useReducedMotion()
  const hitSliderId = React.useId()
  const checkpointSliderId = React.useId()
  const alpha = hitPercent / 100
  const prefixTokens = Math.floor(alpha * TOTAL_TOKENS)
  const effectiveResume = checkpointAlignedResume(
    prefixTokens,
    TOTAL_TOKENS,
    checkpointInterval,
  )
  const replayTokens = prefixTokens - effectiveResume
  const width = 440
  const height = 300
  const plot = { left: 44, right: 426, top: 20, bottom: 250 }
  const plotWidth = plot.right - plot.left
  const plotHeight = plot.bottom - plot.top
  const maxSpeedup = 10
  const x = (value: number) => plot.left + (value / MAX_HIT_RATIO) * plotWidth
  const y = (value: number) =>
    plot.bottom -
    ((Math.min(maxSpeedup, Math.max(1, value)) - 1) / (maxSpeedup - 1)) *
      plotHeight

  const curveSeries: CurveSeries[] = [
    {
      label: 'MHA / MLA',
      shortLabel: '完整因果 Attention',
      detail: '二次增长的因果三角形',
      className: 'stroke-[#1e66f5] dark:stroke-[#89b4fa]',
      dotClassName: 'fill-[#1e66f5] dark:fill-[#89b4fa]',
      dashArray: undefined,
      remaining: fullAttentionRemaining,
    },
    {
      label: 'SWA',
      shortLabel: 'W = 25% · N',
      detail: '先二次增长，随后受窗口约束',
      className: 'stroke-[#8839ef] dark:stroke-[#cba6f7]',
      dotClassName: 'fill-[#8839ef] dark:fill-[#cba6f7]',
      dashArray: '8 5',
      remaining: (sampleAlpha) => swaRemaining(sampleAlpha, SWA_WINDOW_RATIO),
    },
    {
      label: 'KDA 递推部分',
      shortLabel: '理想上界',
      detail: 'checkpoint 精确对齐；不含加载与传输',
      className: 'stroke-[#40a02b] dark:stroke-[#a6e3a1]',
      dotClassName: 'fill-[#40a02b] dark:fill-[#a6e3a1]',
      dashArray: '3 4',
      stepped: true,
      remaining: (sampleAlpha) =>
        kdaRemaining(sampleAlpha, TOTAL_TOKENS, checkpointInterval),
    },
  ]

  const smoothPathFor = (series: CurveSeries) =>
    Array.from({ length: 91 }, (_, index) => {
      const sampleAlpha = index / 100
      const sampleSpeedup = remainingSpeedup(series.remaining(sampleAlpha))
      return `${index === 0 ? 'M' : 'L'} ${x(sampleAlpha).toFixed(2)} ${y(sampleSpeedup).toFixed(2)}`
    }).join(' ')

  const checkpointPath = () => {
    const commands = [`M ${x(0).toFixed(2)} ${y(1).toFixed(2)}`]
    const maxResume = checkpointAlignedResume(
      MAX_HIT_RATIO * TOTAL_TOKENS,
      TOTAL_TOKENS,
      checkpointInterval,
    )

    for (
      let resume = checkpointInterval;
      resume <= maxResume;
      resume += checkpointInterval
    ) {
      const threshold = resume / TOTAL_TOKENS
      const previousRemaining =
        (TOTAL_TOKENS - (resume - checkpointInterval)) / TOTAL_TOKENS
      const nextRemaining = (TOTAL_TOKENS - resume) / TOTAL_TOKENS
      commands.push(
        `L ${x(threshold).toFixed(2)} ${y(remainingSpeedup(previousRemaining)).toFixed(2)}`,
        `L ${x(threshold).toFixed(2)} ${y(remainingSpeedup(nextRemaining)).toFixed(2)}`,
      )
    }

    commands.push(
      `L ${x(MAX_HIT_RATIO).toFixed(2)} ${y(
        remainingSpeedup(
          kdaRemaining(MAX_HIT_RATIO, TOTAL_TOKENS, checkpointInterval),
        ),
      ).toFixed(2)}`,
    )
    return commands.join(' ')
  }

  return (
    <InteractiveShell
      eyebrow="Attention 加速比探索器"
      title="相同前缀命中率，不同 Attention 的可跳过工作量并不相同"
      caption="曲线只比较理想化的 Attention 主体：MHA/MLA 使用完整因果依赖，SWA 取 W = 0.25N；KDA 只计算递推部分，并把续算边界向下对齐到 checkpoint。"
    >
      <motion.div
        variants={itemVariants}
        className="min-w-0 rounded-[8px] border border-border/70 bg-background/45 p-1.5 sm:p-4"
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="block h-auto w-full"
          role="img"
          aria-labelledby={`${hitSliderId}-curve-title ${hitSliderId}-curve-desc`}
        >
          <title id={`${hitSliderId}-curve-title`}>
            Prefix Cache 的理想 Attention 加速比曲线
          </title>
          <desc id={`${hitSliderId}-curve-desc`}>
            展示逻辑前缀命中率从 0% 到 90% 时，完整因果 MHA/MLA、滑动窗口
            Attention 和 KDA 递推部分的理想加速比。KDA 示例的输入长度为{' '}
            {TOTAL_TOKENS} 个 token，每 {checkpointInterval} 个 token 保存一次
            checkpoint；阶梯曲线是理想上界，不包含 checkpoint
            加载、传输和重放成本。
          </desc>

          {[1, 2, 4, 6, 8, 10].map((tick) => (
            <g
              key={tick}
              className={clsx(
                tick === 2 || tick === 6 || tick === 8
                  ? 'hidden sm:block'
                  : undefined,
              )}
            >
              <line
                x1={plot.left}
                x2={plot.right}
                y1={y(tick)}
                y2={y(tick)}
                className="stroke-border/55"
                strokeDasharray={tick === 1 ? undefined : '4 6'}
              />
              <text
                x={plot.left - 7}
                y={y(tick) + 4}
                textAnchor="end"
                className="fill-muted-foreground font-mono text-[12px]"
              >
                {tick}×
              </text>
            </g>
          ))}
          {[0, 0.25, 0.5, 0.75, 0.9].map((tick) => (
            <g
              key={tick}
              className={clsx(
                tick === 0.25 || tick === 0.75 ? 'hidden sm:block' : undefined,
              )}
            >
              <line
                x1={x(tick)}
                x2={x(tick)}
                y1={plot.top}
                y2={plot.bottom}
                className="stroke-border/25"
              />
              <text
                x={x(tick)}
                y={plot.bottom + 20}
                textAnchor="middle"
                className="fill-muted-foreground font-mono text-[12px]"
              >
                {Math.round(tick * 100)}%
              </text>
            </g>
          ))}
          <text
            x={(plot.left + plot.right) / 2}
            y={height - 7}
            textAnchor="middle"
            className="fill-muted-foreground text-[12px]"
          >
            前缀命中率 · α
          </text>
          <text
            x="11"
            y={(plot.top + plot.bottom) / 2}
            textAnchor="middle"
            transform={`rotate(-90 11 ${(plot.top + plot.bottom) / 2})`}
            className="hidden fill-muted-foreground text-[12px] sm:block"
          >
            理想 Attention 加速比
          </text>

          {curveSeries.map((series) => (
            <motion.path
              key={`${series.label}-${checkpointInterval}`}
              d={series.stepped ? checkpointPath() : smoothPathFor(series)}
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={series.dashArray}
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
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            y1={plot.top}
            y2={plot.bottom}
            className="stroke-foreground/45"
            strokeDasharray="3 4"
          />
          {curveSeries.map((series) => {
            const currentSpeedup = remainingSpeedup(series.remaining(alpha))
            return (
              <motion.circle
                key={`${series.label}-cursor`}
                initial={false}
                animate={{ cx: x(alpha), cy: y(currentSpeedup) }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                r={series.stepped ? 5.5 : 5}
                className={clsx(series.dotClassName, 'stroke-background')}
                strokeWidth="2"
              />
            )
          })}
        </svg>
      </motion.div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Slider
            id={hitSliderId}
            label="对比命中率 · α"
            value={hitPercent}
            max={90}
            valueLabel={`${hitPercent}%`}
            minLabel="0%"
            maxLabel="90%"
            description="这里显示逻辑匹配比例；KDA 可能只能从更早的 checkpoint 恢复。"
            onChange={setHitPercent}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Slider
            id={checkpointSliderId}
            label="KDA checkpoint 间隔 · C"
            value={checkpointInterval}
            min={1024}
            max={8192}
            step={1024}
            valueLabel={`${checkpointInterval.toLocaleString()} 个 token`}
            minLabel="1,024"
            maxLabel="8,192"
            description={`固定示例长度 N = ${TOTAL_TOKENS.toLocaleString()} 个 token。`}
            onChange={setCheckpointInterval}
          />
        </motion.div>
      </div>

      <div
        className="mt-4 grid gap-3 sm:grid-cols-3"
        aria-live="polite"
        aria-atomic="true"
      >
        {curveSeries.map((series) => (
          <motion.div
            variants={itemVariants}
            key={series.label}
            className="rounded-[8px] border border-border/70 bg-background/55 p-3"
          >
            <div className="flex items-center gap-2">
              <svg
                viewBox="0 0 28 8"
                className="h-2 w-7 shrink-0"
                aria-hidden="true"
              >
                <line
                  x1="1"
                  x2="27"
                  y1="4"
                  y2="4"
                  strokeWidth="3"
                  strokeDasharray={series.dashArray}
                  className={series.className}
                />
              </svg>
              <p className="text-sm font-semibold text-foreground">
                {series.label}
              </p>
            </div>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-foreground">
              {remainingSpeedup(series.remaining(alpha)).toFixed(2)}×
            </p>
            <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
              {series.shortLabel}
            </p>
            <p className="text-xs leading-5 text-muted-foreground">
              {series.detail}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.dl
        variants={itemVariants}
        className="mt-4 grid gap-2 rounded-[8px] border border-border/70 bg-secondary/20 p-3 text-xs sm:grid-cols-3"
      >
        <div>
          <dt className="text-muted-foreground">逻辑匹配前缀</dt>
          <dd className="mt-1 font-mono font-semibold text-foreground">
            {prefixTokens.toLocaleString()} 个 token
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">KDA 实际恢复位置</dt>
          <dd className="mt-1 font-mono font-semibold text-foreground">
            {effectiveResume.toLocaleString()} 个 token
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">未对齐前缀重放量</dt>
          <dd className="mt-1 font-mono font-semibold text-foreground">
            {replayTokens.toLocaleString()} 个 token
          </dd>
        </div>
      </motion.dl>

      <motion.p
        variants={itemVariants}
        className="mt-4 rounded-[8px] border border-[#df8e1d]/35 bg-[#df8e1d]/[0.07] px-4 py-3 text-sm leading-6 text-muted-foreground dark:border-[#f9e2af]/30 dark:bg-[#f9e2af]/[0.06]"
      >
        <strong className="font-semibold text-foreground">
          KDA 递推部分的理想上界：
        </strong>
        必须在对齐边界拥有完整递推状态和 ShortConv 等续算状态。曲线虽把未对齐
        token 算入剩余 token，但仍忽略 checkpoint 查询、回载、传输和恢复开销。
      </motion.p>
    </InteractiveShell>
  )
}
