'use client'

import { motion, useReducedMotion } from 'framer-motion'
import * as React from 'react'
import { InteractiveShell, itemVariants } from './InteractiveShell'
import { MetricCard } from './MetricCard'
import {
  blockRemaining,
  blockSpeedup,
  fullAttentionRemaining,
  remainingSpeedup,
  tokenWiseRemaining,
} from './math'
import { Slider } from './Slider'

const referenceBetas = [0.3, 0.5, 0.7]

export function PrefillSpeedupExplorer() {
  const [hitPercent, setHitPercent] = React.useState(50)
  const [attentionSharePercent, setAttentionSharePercent] = React.useState(50)
  const prefersReducedMotion = useReducedMotion()
  const hitSliderId = React.useId()
  const shareSliderId = React.useId()
  const alpha = hitPercent / 100
  const beta = attentionSharePercent / 100
  const attentionRemaining = fullAttentionRemaining(alpha)
  const linearRemaining = tokenWiseRemaining(alpha)
  const transformerRemaining = blockRemaining(alpha, beta)

  const workSegments = [
    {
      label: '剩余 Attention 工作量',
      value: beta * attentionRemaining,
      share: beta,
      className: 'bg-[#1e66f5] dark:bg-[#89b4fa]',
    },
    {
      label: '剩余逐 token 工作量',
      value: (1 - beta) * linearRemaining,
      share: 1 - beta,
      className: 'bg-[#8839ef] dark:bg-[#cba6f7]',
    },
  ]

  return (
    <InteractiveShell
      eyebrow="完整 Prefill FLOPs 模型"
      title="Attention 加速不是整个 Transformer 模块的加速"
      caption="α 控制前缀命中比例，β 控制 Attention 在原始模块 FLOPs 中的占比；结果是理想化计算量模型，不是实测 TTFT 或生产吞吐。"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Slider
            id={hitSliderId}
            label="前缀命中率 · α"
            value={hitPercent}
            max={90}
            valueLabel={`${hitPercent}%`}
            minLabel="0%"
            maxLabel="90%"
            description="逻辑前缀匹配长度占完整输入序列的比例。"
            onChange={setHitPercent}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Slider
            id={shareSliderId}
            label="Attention FLOPs 占比 · β"
            value={attentionSharePercent}
            max={100}
            valueLabel={`${attentionSharePercent}%`}
            minLabel="0%（全为逐 token 算子）"
            maxLabel="100%（全为 Attention）"
            description="Attention 在未使用缓存时的 Transformer 模块 FLOPs 中所占的比例。"
            onChange={setAttentionSharePercent}
          />
        </motion.div>
      </div>

      <div
        className="mt-4 grid gap-3 sm:grid-cols-3"
        aria-live="polite"
        aria-atomic="true"
      >
        <MetricCard
          label="Attention 局部加速比"
          value={`${remainingSpeedup(attentionRemaining).toFixed(2)}×`}
          formula={`剩余 ${(attentionRemaining * 100).toFixed(1)}% · 1 − α²`}
          note="只计算完整因果 Attention FLOPs"
          tone="blue"
        />
        <MetricCard
          label="逐 token 算子加速比"
          value={`${remainingSpeedup(linearRemaining).toFixed(2)}×`}
          formula={`剩余 ${(linearRemaining * 100).toFixed(1)}% · 1 − α`}
          note="投影、MLP 和其他逐 token 计算"
          tone="mauve"
        />
        <MetricCard
          label="完整模块理想加速比"
          value={`${blockSpeedup(alpha, beta).toFixed(2)}×`}
          formula={`剩余 ${(transformerRemaining * 100).toFixed(1)}%`}
          note="按 FLOPs 加权得到的理想上界"
          tone="green"
        />
      </div>

      <motion.div
        variants={itemVariants}
        className="mt-4 rounded-[8px] border border-border/70 bg-background/55 p-4"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-sm font-semibold text-foreground">
            模块剩余工作量
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            β(1 − α²) + (1 − β)(1 − α)
          </p>
        </div>
        <div
          className="mt-3 flex h-7 w-full overflow-hidden rounded-md border border-border/70 bg-secondary/35"
          role="img"
          aria-label={`模块还剩 ${(transformerRemaining * 100).toFixed(1)}% 的 FLOPs：其中 Attention 占 ${(workSegments[0].value * 100).toFixed(1)} 个百分点，逐 token 算子占 ${(workSegments[1].value * 100).toFixed(1)} 个百分点。`}
        >
          {workSegments.map((segment) => (
            <motion.span
              key={segment.label}
              initial={false}
              animate={{ width: `${segment.value * 100}%` }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className={segment.className}
              title={`${segment.label}：${(segment.value * 100).toFixed(1)} 个百分点`}
            />
          ))}
          <motion.span
            initial={false}
            animate={{ width: `${(1 - transformerRemaining) * 100}%` }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="bg-secondary/25"
            title={`已跳过的工作量：${((1 - transformerRemaining) * 100).toFixed(1)} 个百分点`}
          />
        </div>
        <div className="mt-3 grid gap-2 text-xs leading-5 text-muted-foreground sm:grid-cols-2">
          {workSegments.map((segment) => (
            <p key={`${segment.label}-legend`}>
              <strong className="font-semibold text-foreground">
                {segment.label}
              </strong>{' '}
              · {(segment.value * 100).toFixed(1)} 个百分点；原始占比为{' '}
              {(segment.share * 100).toFixed(0)}%
            </p>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-4 rounded-[8px] border border-border/70 bg-secondary/20 p-4"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground">
          50% 命中率参考
        </p>
        <dl className="mt-3 grid gap-2 sm:grid-cols-3">
          {referenceBetas.map((referenceBeta) => (
            <div
              key={referenceBeta}
              className="flex items-baseline justify-between rounded-md border border-border/60 bg-background/55 px-3 py-2 sm:block"
            >
              <dt className="font-mono text-xs text-muted-foreground">
                β = {referenceBeta * 100}%
              </dt>
              <dd className="font-mono text-base font-semibold tabular-nums text-foreground sm:mt-1">
                {blockSpeedup(0.5, referenceBeta).toFixed(2)}×
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="mt-4 rounded-[8px] border border-[#df8e1d]/35 bg-[#df8e1d]/[0.07] px-4 py-3 text-sm leading-6 text-muted-foreground dark:border-[#f9e2af]/30 dark:bg-[#f9e2af]/[0.06]"
      >
        <strong className="font-semibold text-foreground">模型边界：</strong>{' '}
        这里只把未命中 token 的计算量加权相加；没有计入 cache
        查询、回载、传输、同步、内核效率、调度或 checkpoint
        重放。因此完整模块的理想加速比仍不能直接当作 TTFT 或吞吐提升。
      </motion.p>
    </InteractiveShell>
  )
}
