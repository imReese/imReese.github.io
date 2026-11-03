'use client'

import clsx from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'
import * as React from 'react'
import { useLanguage } from '@/components/shared/LanguageProvider'
import { InteractiveShell, itemVariants } from './InteractiveShell'
import { MetricCard } from './MetricCard'
import { Slider } from './Slider'

export function SwaBoundedReplayExplorer() {
  const { locale } = useLanguage()
  const isZh = locale === 'zh'
  const prefersReducedMotion = useReducedMotion()
  const hitSliderId = React.useId()

  const [hitTokens, setHitTokens] = React.useState(3072)
  const [swaMiss, setSwaMiss] = React.useState(true)

  const totalTokens = 4096
  const windowSize = 128
  const backtrackingTokens = 6
  const physicalSlotSize = windowSize + backtrackingTokens

  const replayStart = Math.max(0, hitTokens - windowSize)
  const replayTokens = swaMiss && hitTokens > 0 ? Math.min(windowSize, hitTokens) : 0

  // SVG coordinate calculations
  const svgWidth = 560
  const svgHeight = 220
  const barY = 40
  const barHeight = 36
  const barLeft = 40
  const barWidth = svgWidth - 80

  const hitWidth = (hitTokens / totalTokens) * barWidth
  const suffixWidth = barWidth - hitWidth
  const replayWidth = (replayTokens / totalTokens) * barWidth
  const replayX = barLeft + ((replayStart) / totalTokens) * barWidth

  return (
    <InteractiveShell
      eyebrow={isZh ? 'SWA Bounded Replay 核心机制' : 'SWA Bounded Replay Mechanics'}
      title={
        isZh
          ? '前缀命中下的 SWA 局部截断重放与常数级开销示意图'
          : 'Interactive SWA Bounded Replay with Constant-Time Overhead'
      }
      caption={
        isZh
          ? '拖动 Block KV 命中长度并切换 SWA 局部缓存状态，观察前缀复用、128-token 截断重放窗口与未缓存后缀的动态划分。'
          : 'Adjust Block KV hit length and toggle SWA local cache status to observe prefix reuse, the 128-token replay window, and the non-cached suffix.'
      }
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
          <motion.div variants={itemVariants}>
            <Slider
              id={hitSliderId}
              label={isZh ? 'Block KV 命中长度 (L₁)' : 'Block KV Hit Length (L₁)'}
              value={hitTokens}
              min={0}
              max={totalTokens}
              step={128}
              valueLabel={`${hitTokens} / ${totalTokens} tokens`}
              minLabel="0"
              maxLabel={`${totalTokens}`}
              description={
                isZh
                  ? '3FS 分布式存储集群中的块级 KV 命中长度（128-token 整数倍对齐）'
                  : 'Block KV hit length from persistent store (aligned to 128-token multiples)'
              }
              onChange={setHitTokens}
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-center rounded-[8px] border border-border/80 bg-background/55 p-4"
          >
            <span className="text-sm font-semibold text-foreground">
              {isZh ? '本地 SWA 状态缓存' : 'Local SWA State Cache'}
            </span>
            <p className="mt-1 text-xs text-muted-foreground">
              {isZh
                ? 'SWA 缓存在跨机或被淘汰时可能缺失，触发局部重放'
                : 'SWA cache miss across nodes triggers bounded replay'}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setSwaMiss(false)}
                className={clsx(
                  'flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition',
                  !swaMiss
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border border-border/70 bg-secondary/60 text-muted-foreground hover:bg-secondary',
                )}
              >
                {isZh ? 'SWA 命中 (无需重放)' : 'SWA Hit (Zero Replay)'}
              </button>
              <button
                type="button"
                onClick={() => setSwaMiss(true)}
                className={clsx(
                  'flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition',
                  swaMiss
                    ? 'border border-[#df8e1d]/40 bg-[#df8e1d]/15 text-[#9a5b00] dark:text-[#f9e2af]'
                    : 'border border-border/70 bg-secondary/60 text-muted-foreground hover:bg-secondary',
                )}
              >
                {isZh ? 'SWA 缺失 (触发 Replay)' : 'SWA Miss (Replay)'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Interactive SVG Graphic */}
        <motion.div
          variants={itemVariants}
          className="overflow-hidden rounded-[8px] border border-border/80 bg-background/45 p-3 sm:p-4"
        >
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="mx-auto block h-auto w-full max-w-[42rem]"
            role="img"
            aria-label="SWA Bounded Replay Schematic"
          >
            <defs>
              <pattern
                id="swa-cached-stripes"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M-2 2L2-2M0 8L8 0M6 10L10 6"
                  className="stroke-[#40a02b]/40 dark:stroke-[#a6e3a1]/40"
                  strokeWidth="1.2"
                />
              </pattern>
              <pattern
                id="swa-replay-stripes"
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M-1 1L1-1M0 6L6 0M5 7L7 5"
                  className="stroke-[#df8e1d]/80 dark:stroke-[#f9e2af]/80"
                  strokeWidth="1.5"
                />
              </pattern>
              <pattern
                id="swa-suffix-dots"
                width="7"
                height="7"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="3.5"
                  cy="3.5"
                  r="1"
                  className="fill-[#1e66f5]/50 dark:fill-[#89b4fa]/50"
                />
              </pattern>
            </defs>

            {/* Scale Axis */}
            <line
              x1={barLeft}
              y1={barY - 8}
              x2={barLeft + barWidth}
              y2={barY - 8}
              className="stroke-border"
              strokeWidth="1"
            />
            <text
              x={barLeft}
              y={barY - 14}
              className="fill-muted-foreground font-mono text-[10px]"
            >
              0
            </text>
            <text
              x={barLeft + barWidth}
              y={barY - 14}
              textAnchor="end"
              className="fill-muted-foreground font-mono text-[10px]"
            >
              L = {totalTokens} tokens
            </text>

            {/* Block KV Hit Section */}
            {hitWidth > 0 && (
              <g>
                <rect
                  x={barLeft}
                  y={barY}
                  width={hitWidth}
                  height={barHeight}
                  rx="4"
                  className="fill-[#40a02b]/15 stroke-[#40a02b]/50 dark:fill-[#a6e3a1]/10 dark:stroke-[#a6e3a1]/40"
                  strokeWidth="1"
                />
                <rect
                  x={barLeft}
                  y={barY}
                  width={hitWidth}
                  height={barHeight}
                  rx="4"
                  fill="url(#swa-cached-stripes)"
                />
                <text
                  x={barLeft + hitWidth / 2}
                  y={barY + barHeight / 2 + 4}
                  textAnchor="middle"
                  className="fill-foreground font-mono text-[11px] font-semibold"
                >
                  {isZh ? 'Block KV 命中（直接复用）' : 'Block KV Hit (Reused)'}
                </text>
              </g>
            )}

            {/* Non-cached Suffix Section */}
            {suffixWidth > 0 && (
              <g>
                <rect
                  x={barLeft + hitWidth}
                  y={barY}
                  width={suffixWidth}
                  height={barHeight}
                  rx="4"
                  className="fill-[#1e66f5]/10 stroke-[#1e66f5]/40 dark:fill-[#89b4fa]/10 dark:stroke-[#89b4fa]/30"
                  strokeWidth="1"
                />
                <rect
                  x={barLeft + hitWidth}
                  y={barY}
                  width={suffixWidth}
                  height={barHeight}
                  rx="4"
                  fill="url(#swa-suffix-dots)"
                />
                <text
                  x={barLeft + hitWidth + suffixWidth / 2}
                  y={barY + barHeight / 2 + 4}
                  textAnchor="middle"
                  className="fill-foreground font-mono text-[11px] font-semibold"
                >
                  {isZh ? '未缓存后缀前向' : 'Non-cached Suffix'}
                </text>
              </g>
            )}

            {/* SWA Replay Window Highlight */}
            {swaMiss && replayTokens > 0 && (
              <g>
                <motion.rect
                  initial={prefersReducedMotion ? false : { opacity: 0, scaleY: 0.9 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.3 }}
                  x={replayX}
                  y={barY - 3}
                  width={Math.max(replayWidth, 4)}
                  height={barHeight + 6}
                  rx="5"
                  className="fill-[#df8e1d]/25 stroke-[#df8e1d] dark:fill-[#f9e2af]/25 dark:stroke-[#f9e2af]"
                  strokeWidth="2"
                />
                <rect
                  x={replayX}
                  y={barY - 3}
                  width={Math.max(replayWidth, 4)}
                  height={barHeight + 6}
                  rx="5"
                  fill="url(#swa-replay-stripes)"
                />

                {/* Arrow and Indicator pointing to Replay Window */}
                <path
                  d={`M ${replayX + replayWidth / 2} ${barY + barHeight + 10} L ${replayX + replayWidth / 2} ${barY + barHeight + 32}`}
                  className="stroke-[#df8e1d] dark:stroke-[#f9e2af]"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
                <rect
                  x={replayX + replayWidth / 2 - 90}
                  y={barY + barHeight + 34}
                  width="180"
                  height="26"
                  rx="6"
                  className="fill-surface stroke-[#df8e1d]/60 dark:stroke-[#f9e2af]/60"
                  strokeWidth="1"
                />
                <text
                  x={replayX + replayWidth / 2}
                  y={barY + barHeight + 51}
                  textAnchor="middle"
                  className="fill-[#9a5b00] dark:fill-[#f9e2af] font-mono text-[10px] font-semibold"
                >
                  {isZh
                    ? `SWA 重放窗口 [s, L₁] = 128 tok`
                    : `SWA Replay [s, L₁] = 128 tok`}
                </text>
              </g>
            )}

            {/* Boundary Tick Marker */}
            <line
              x1={barLeft + hitWidth}
              y1={barY - 10}
              x2={barLeft + hitWidth}
              y2={barY + barHeight + 10}
              className="stroke-foreground"
              strokeWidth="2"
            />
            <text
              x={barLeft + hitWidth}
              y={barY + barHeight + 22}
              textAnchor="middle"
              className="fill-foreground font-mono text-[11px] font-bold"
            >
              L₁ = {hitTokens}
            </text>

            {/* Explanatory notes below */}
            <g transform={`translate(${barLeft}, ${barY + 95})`}>
              <circle cx="6" cy="6" r="4" className="fill-[#40a02b]" />
              <text x="18" y="10" className="fill-muted-foreground font-mono text-[10px]">
                {isZh
                  ? 'Block KV: 跨层全精度/FP4 块，从 3FS/HBM 直接加载，不重算'
                  : 'Block KV: Reused directly from 3FS / HBM; not recomputed'}
              </text>

              <circle cx="6" cy="24" r="4" className="fill-[#df8e1d]" />
              <text x="18" y="28" className="fill-muted-foreground font-mono text-[10px]">
                {isZh
                  ? 'SWA Replay: 截断在 max(s, i-127) 区间，仅重算最后 128 个 Token，代价为常数 O(1)'
                  : 'SWA Replay: Attends strictly to max(s, i-127)...i; constant O(1) recompute'}
              </text>
            </g>
          </svg>
        </motion.div>

        {/* Dynamic Calculation Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label={isZh ? 'SWA 重算代价' : 'Replay Cost'}
            value={swaMiss && hitTokens > 0 ? '128 tok' : '0 tok'}
            formula={
              swaMiss && hitTokens > 0
                ? isZh
                  ? '常数开销 · O(1)'
                  : 'Constant · O(1)'
                : isZh
                  ? '完全命中'
                  : 'Full hit'
            }
            tone={swaMiss && hitTokens > 0 ? 'amber' : 'green'}
            note={
              isZh
                ? '与前缀总长度 L₁ 无关，无需重算整段长上下文'
                : 'Independent of prefix length L₁; no full recompute'
            }
          />
          <MetricCard
            label={isZh ? 'Decoder Prefill 节省' : 'Decoder Prefill Saved'}
            value={hitTokens > 0 ? '~50%' : '0%'}
            formula={
              isZh
                ? 'CED 架构隐状态投影'
                : 'CED Latent Projection'
            }
            tone="teal"
            note={
              isZh
                ? '解码层只需 128 tok SWA，免去上千 tokens 历史'
                : 'Decoder only computes 128 tok SWA instead of full history'
            }
          />
          <MetricCard
            label={isZh ? '物理槽位尺寸' : 'Physical Slot'}
            value={`${physicalSlotSize} tok`}
            formula={
              isZh
                ? '128 窗口 + 6 回退余量'
                : '128 window + 6 backtrack'
            }
            tone="blue"
            note={
              isZh
                ? '单序列 SWA 仅占用 1.41 MB (MXFP8 格式)'
                : 'SWA slot takes only 1.41 MB per sequence in MXFP8'
            }
          />
          <MetricCard
            label={isZh ? '存储粒度对齐' : 'Store Granularity'}
            value="128 tok"
            formula="KVSTORE_GRAIN = 128"
            tone="mauve"
            note={
              isZh
                ? '落盘与截断自然对齐，避免跨窗口递归依赖'
                : 'Persistent writes align to 128 tokens without recurrence'
            }
          />
        </div>
      </div>
    </InteractiveShell>
  )
}
