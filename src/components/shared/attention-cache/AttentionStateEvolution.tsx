'use client'

import clsx from 'clsx'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import * as React from 'react'
import { InteractiveShell, itemVariants, revealEase } from './InteractiveShell'
import { type EvolutionStage } from './types'

const evolutionStages: EvolutionStage[] = [
  {
    label: 'KV Cache',
    eyebrow: '逐 token 历史',
    representation: '每层 Kₜ + Vₜ',
    growth: 'O(T · Hkv · d)',
    restore: '恢复 [0, t) 的全部 KV 页',
    summary:
      'MHA/GQA/MQA 将每个历史 token 的 Key 与 Value 直接保存下来；下一条 Query 读取这段完整历史。',
    details: [
      '物理对象通常按层、页、K/V 与并行 rank 拆分',
      '前缀命中的是连续 token 边界，不是任意页集合',
    ],
    tone: 'blue',
  },
  {
    label: 'MLA latent',
    eyebrow: '压缩历史',
    representation: 'cₜᴷⱽ + RoPE Key',
    growth: 'O(T · (dc + dr))',
    restore: 'latent 与 RoPE 共享边界 t',
    summary:
      'MLA 不再持久化展开后的全部 KV Head，而是保存每 token 的压缩 latent 与解耦 RoPE 信息。',
    details: [
      '压缩改变缓存宽度，但完整因果 Attention 的依赖三角形仍然存在',
      'q_lora_rank 属于 Query 路径，通常不是持久化历史',
    ],
    tone: 'teal',
  },
  {
    label: 'DSA 状态',
    eyebrow: '筛选历史',
    representation: 'MLA 历史 + 索引 Key',
    growth: '通常为 O(T)',
    restore: '主缓存 ∩ 索引状态',
    summary:
      'DSA 在主 Attention 历史旁增加稀疏选择状态。Top-k 限制一次读取多少位置，不等于只存 top-k 个位置。',
    details: [
      '索引 Key、主 MLA latent 与选择元数据可能属于不同缓存池',
      '可恢复命中长度取所有必需缓存池的共同连续前缀',
    ],
    tone: 'mauve',
  },
  {
    label: 'KDA checkpoint',
    eyebrow: '递推边界',
    representation: 'S(t) + ShortConv Γ(t)',
    growth: '在线 O(1)；存储 O(checkpoint 数)',
    restore: '边界 t 处的完整 checkpoint',
    summary:
      'KDA 把长历史压进递推矩阵；前缀复用需要在目标 token 边界保存完整递推状态与卷积状态。',
    details: [
      '只有矩阵 S(t) 不一定足够，ShortConv 窗口也可能是续算必需状态',
      '最近 checkpoint 早于命中边界时，中间 token 仍需重放',
    ],
    tone: 'amber',
  },
  {
    label: 'Attention State Store',
    eyebrow: '服务抽象',
    representation: '带类型的状态包 + 身份',
    growth: '所有必需状态组之和',
    restore: '最短的完整对齐边界',
    summary:
      '统一存储层不应假设对象永远是 K/V；它管理页、latent、索引状态、checkpoint 及其边界身份。',
    details: [
      '身份至少包含模型、层/组、布局、数据类型、并行 rank 与前缀哈希',
      '存储层返回“存在”不等于运行时已成功回载并可安全续算',
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
  const selectorId = React.useId()
  const detailId = React.useId()
  const activeStage = evolutionStages[activeIndex]
  const activeTone = stageToneClasses[activeStage.tone]

  return (
    <InteractiveShell
      eyebrow="状态演进"
      title="Attention 缓存正在从 KV 张量演化为可恢复的状态集合"
      caption="选择任一阶段，比较它保存什么、如何增长，以及前缀复用真正需要恢复到哪个边界。"
    >
      <motion.div variants={itemVariants} className="md:hidden">
        <label
          htmlFor={selectorId}
          className="mb-2 block text-sm font-semibold text-foreground"
        >
          Attention 状态阶段
        </label>
        <select
          id={selectorId}
          value={activeIndex}
          onChange={(event) => setActiveIndex(Number(event.target.value))}
          aria-controls={detailId}
          className="w-full rounded-[8px] border border-border/80 bg-background px-3 py-3 text-sm font-semibold text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {evolutionStages.map((stage, index) => (
            <option key={stage.label} value={index}>
              {index + 1}. {stage.label} — {stage.eyebrow}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          使用系统原生选择器，在五种状态表示之间切换。
        </p>
      </motion.div>

      <ol className="hidden grid-cols-5 gap-2 md:grid lg:gap-3">
        {evolutionStages.map((stage, index) => {
          const isActive = index === activeIndex
          const tone = stageToneClasses[stage.tone]

          return (
            <motion.li
              variants={itemVariants}
              key={stage.label}
              className="relative min-w-0"
            >
              {index < evolutionStages.length - 1 && (
                <span className="absolute left-[calc(50%+1.75rem)] top-5 h-px w-[calc(100%-2.65rem)] bg-border" />
              )}
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={isActive}
                aria-controls={detailId}
                className={clsx(
                  'relative z-10 h-full w-full min-w-0 rounded-[8px] border px-2 py-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none lg:px-3',
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
                <span className="block break-words text-xs font-semibold leading-5 lg:text-sm">
                  {stage.label}
                </span>
                <span className="mt-1 hidden font-mono text-[10px] uppercase tracking-[0.08em] opacity-75 lg:block">
                  {stage.eyebrow}
                </span>
              </button>
            </motion.li>
          )
        })}
      </ol>

      <div
        id={detailId}
        className="mt-4 min-h-[19rem] overflow-hidden rounded-[8px] border border-border/75 bg-background/55"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={activeStage.label}
            initial={prefersReducedMotion ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, x: -12 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.28,
              ease: revealEase,
            }}
            className="p-4 sm:p-5"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="flex flex-col gap-2 border-b border-border/60 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  阶段 {activeIndex + 1} · {activeStage.eyebrow}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">
                  {activeStage.label}
                </h3>
              </div>
              <span
                className={clsx(
                  'inline-flex self-start rounded-md border px-2.5 py-1 font-mono text-xs font-semibold',
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
              <div className="min-w-0 rounded-[8px] border border-border/65 bg-secondary/25 p-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  状态表示
                </dt>
                <dd className="mt-2 break-words font-mono text-sm font-semibold text-foreground">
                  {activeStage.representation}
                </dd>
              </div>
              <div className="min-w-0 rounded-[8px] border border-border/65 bg-secondary/25 p-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  存储增长
                </dt>
                <dd className="mt-2 break-words font-mono text-sm font-semibold text-foreground">
                  {activeStage.growth}
                </dd>
              </div>
              <div className="min-w-0 rounded-[8px] border border-border/65 bg-secondary/25 p-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  恢复条件
                </dt>
                <dd className="mt-2 break-words font-mono text-sm font-semibold text-foreground">
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
