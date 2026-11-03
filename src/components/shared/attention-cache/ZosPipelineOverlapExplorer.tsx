'use client'

import clsx from 'clsx'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import * as React from 'react'
import { useLanguage } from '@/components/shared/LanguageProvider'
import { InteractiveShell, itemVariants } from './InteractiveShell'
import { MetricCard } from './MetricCard'

type TimelineBlock = {
  id: string
  track: 'cpu' | 'gpu'
  start: number
  duration: number
  labelZh: string
  labelEn: string
  subZh?: string
  subEn?: string
  type: 'schedule' | 'forward' | 'sample' | 'postprocess' | 'bubble' | 'sync'
}

export function ZosPipelineOverlapExplorer() {
  const { locale } = useLanguage()
  const isZh = locale === 'zh'
  const prefersReducedMotion = useReducedMotion()

  const [mode, setMode] = React.useState<'zos' | 'baseline'>('zos')
  const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null)

  // Timeline scale constants
  // Total virtual milliseconds represented on SVG width
  const svgWidth = 660
  const svgHeight = 240
  const trackHeight = 38
  const cpuY = 48
  const gpuY = 112
  const timeAxisY = 175
  const leftPadding = 80
  const trackWidth = svgWidth - leftPadding - 24

  // In Baseline:
  // Step N: Schedule (2.0) -> Forward N (6.0) -> Sample N (1.5) -> Post N (3.0) = 12.5ms
  // Step N+1: Schedule (2.0) -> Forward N+1 (6.0) -> Sample N+1 (1.5) -> Post N+1 (3.0) = 12.5ms
  // Total = 25.0ms
  // In ZOS:
  // Step N: Forward N (6.0) with Post N-1 (3.0) in parallel, Sample N (1.5) -> 7.5ms
  // Step N+1: Forward N+1 (6.0) with Post N (3.0) + Sched N+2 (2.0) in parallel, Sample N+1 (1.5) -> 7.5ms
  // Total = 15.0ms

  const maxTime = mode === 'baseline' ? 25.0 : 16.0
  const scale = (ms: number) => leftPadding + (ms / maxTime) * trackWidth
  const widthScale = (duration: number) => (duration / maxTime) * trackWidth

  // Timeline data for Baseline
  const baselineBlocks: TimelineBlock[] = [
    // Step N
    { id: 'b_sched_n', track: 'cpu', start: 0, duration: 2.0, labelZh: '调度 Step N', labelEn: 'Schedule N', type: 'schedule' },
    { id: 'b_bub_gpu_1', track: 'gpu', start: 0, duration: 2.0, labelZh: 'GPU 饥饿空转', labelEn: 'GPU Bubble', subZh: '等待 CPU 决策', subEn: 'Wait CPU', type: 'bubble' },
    { id: 'b_fwd_n', track: 'gpu', start: 2.0, duration: 6.0, labelZh: '前向 Forward N', labelEn: 'Forward N', subZh: 'CUDA 核函数', subEn: 'CUDA Kernels', type: 'forward' },
    { id: 'b_wait_cpu_1', track: 'cpu', start: 2.0, duration: 6.0, labelZh: 'CPU 挂起等待', labelEn: 'CPU Blocked', subZh: '等待设备算完', subEn: 'Wait Device', type: 'sync' },
    { id: 'b_smp_n', track: 'gpu', start: 8.0, duration: 1.5, labelZh: '采样 Sample N', labelEn: 'Sample N', type: 'sample' },
    { id: 'b_wait_cpu_2', track: 'cpu', start: 8.0, duration: 1.5, labelZh: 'CPU 挂起等待', labelEn: 'CPU Blocked', subZh: '等待采样产物', subEn: 'Wait Sample', type: 'sync' },
    { id: 'b_post_n', track: 'cpu', start: 9.5, duration: 3.0, labelZh: '后处理 Step N', labelEn: 'Post-process N', subZh: 'D2H 同步更新', subEn: 'D2H Sync', type: 'postprocess' },
    { id: 'b_bub_gpu_2', track: 'gpu', start: 9.5, duration: 3.0, labelZh: 'GPU 饥饿空转', labelEn: 'GPU Bubble', subZh: '等待后处理', subEn: 'Wait Post-proc', type: 'bubble' },
    // Step N+1
    { id: 'b_sched_n1', track: 'cpu', start: 12.5, duration: 2.0, labelZh: '调度 Step N+1', labelEn: 'Schedule N+1', type: 'schedule' },
    { id: 'b_bub_gpu_3', track: 'gpu', start: 12.5, duration: 2.0, labelZh: 'GPU 饥饿空转', labelEn: 'GPU Bubble', subZh: '等待 CPU 决策', subEn: 'Wait CPU', type: 'bubble' },
    { id: 'b_fwd_n1', track: 'gpu', start: 14.5, duration: 6.0, labelZh: '前向 Forward N+1', labelEn: 'Forward N+1', subZh: 'CUDA 核函数', subEn: 'CUDA Kernels', type: 'forward' },
    { id: 'b_wait_cpu_3', track: 'cpu', start: 14.5, duration: 6.0, labelZh: 'CPU 挂起等待', labelEn: 'CPU Blocked', subZh: '等待设备算完', subEn: 'Wait Device', type: 'sync' },
    { id: 'b_smp_n1', track: 'gpu', start: 20.5, duration: 1.5, labelZh: '采样 Sample N+1', labelEn: 'Sample N+1', type: 'sample' },
    { id: 'b_wait_cpu_4', track: 'cpu', start: 20.5, duration: 1.5, labelZh: 'CPU 挂起等待', labelEn: 'CPU Blocked', subZh: '等待采样产物', subEn: 'Wait Sample', type: 'sync' },
    { id: 'b_post_n1', track: 'cpu', start: 22.0, duration: 3.0, labelZh: '后处理 Step N+1', labelEn: 'Post-process N+1', subZh: 'D2H 同步更新', subEn: 'D2H Sync', type: 'postprocess' },
  ]

  // Timeline data for ZOS Overlap
  const zosBlocks: TimelineBlock[] = [
    // Step N
    { id: 'z_fwd_n', track: 'gpu', start: 0.0, duration: 6.0, labelZh: '前向 Forward N', labelEn: 'Forward N', subZh: 'CUDA Graph Replay (<2μs)', subEn: 'CUDA Graph Replay', type: 'forward' },
    { id: 'z_post_prev', track: 'cpu', start: 0.0, duration: 3.0, labelZh: '后处理 Step N-1', labelEn: 'Post-process N-1', subZh: '藏于前向阴影', subEn: 'Hidden in shadow', type: 'postprocess' },
    { id: 'z_sched_n1', track: 'cpu', start: 3.0, duration: 2.0, labelZh: '调度 Step N+1', labelEn: 'Schedule N+1', subZh: '藏于前向阴影', subEn: 'Hidden in shadow', type: 'schedule' },
    { id: 'z_idle_cpu_1', track: 'cpu', start: 5.0, duration: 1.0, labelZh: '就绪等待', labelEn: 'Ready wait', subZh: '前向尾声', subEn: 'Forward finish', type: 'sync' },
    { id: 'z_smp_n', track: 'gpu', start: 6.0, duration: 1.5, labelZh: '采样 Sample N', labelEn: 'Sample N', subZh: '生成产物保留', subEn: 'State preserved', type: 'sample' },
    { id: 'z_launch_smp_n', track: 'cpu', start: 6.0, duration: 1.5, labelZh: '采样发射与保留', labelEn: 'Sample Launch', subZh: '延迟至下一步', subEn: 'Deferred to next', type: 'sync' },

    // Step N+1
    { id: 'z_fwd_n1', track: 'gpu', start: 7.5, duration: 6.0, labelZh: '前向 Forward N+1', labelEn: 'Forward N+1', subZh: 'CUDA Graph 零气泡衔接', subEn: 'Zero-bubble Graph Replay', type: 'forward' },
    { id: 'z_post_n', track: 'cpu', start: 7.5, duration: 3.0, labelZh: '后处理 Step N (prev_step_state)', labelEn: 'Post-process N', subZh: '跨步延迟并发处理', subEn: 'Overlap via prev_step_state', type: 'postprocess' },
    { id: 'z_sched_n2', track: 'cpu', start: 10.5, duration: 2.0, labelZh: '调度 Step N+2', labelEn: 'Schedule N+2', subZh: '_correct_seqlens_qk 修正', subEn: 'Metadata correction', type: 'schedule' },
    { id: 'z_idle_cpu_2', track: 'cpu', start: 12.5, duration: 1.0, labelZh: '就绪等待', labelEn: 'Ready wait', subZh: '前向尾声', subEn: 'Forward finish', type: 'sync' },
    { id: 'z_smp_n1', track: 'gpu', start: 13.5, duration: 1.5, labelZh: '采样 Sample N+1', labelEn: 'Sample N+1', subZh: '生成产物保留', subEn: 'State preserved', type: 'sample' },
    { id: 'z_launch_smp_n1', track: 'cpu', start: 13.5, duration: 1.5, labelZh: '采样发射与保留', labelEn: 'Sample Launch', subZh: '延迟至下一步', subEn: 'Deferred to next', type: 'sync' },
  ]

  const activeBlocks = mode === 'zos' ? zosBlocks : baselineBlocks

  // Visual styling for different block types
  const getBlockStyle = (type: TimelineBlock['type'], isSelected: boolean) => {
    switch (type) {
      case 'forward':
        return {
          fill: '#1e66f5',
          fillOpacity: isSelected ? 0.95 : 0.82,
          stroke: '#7287fd',
          textColor: '#ffffff',
          badge: 'GPU Kernel',
        }
      case 'sample':
        return {
          fill: '#e64553',
          fillOpacity: isSelected ? 0.95 : 0.82,
          stroke: '#ea76cb',
          textColor: '#ffffff',
          badge: 'GPU Kernel',
        }
      case 'schedule':
        return {
          fill: '#df8e1d',
          fillOpacity: isSelected ? 0.95 : 0.8,
          stroke: '#fe640b',
          textColor: '#ffffff',
          badge: 'CPU Scheduler',
        }
      case 'postprocess':
        return {
          fill: '#179299',
          fillOpacity: isSelected ? 0.95 : 0.8,
          stroke: '#40a02b',
          textColor: '#ffffff',
          badge: 'CPU Worker',
        }
      case 'bubble':
        return {
          fill: '#d20f39',
          fillOpacity: 0.18,
          stroke: '#d20f39',
          textColor: '#d20f39',
          badge: 'Idle Bubble',
        }
      case 'sync':
      default:
        return {
          fill: '#9ca0b0',
          fillOpacity: 0.25,
          stroke: '#8c8fa1',
          textColor: '#4c4f69',
          badge: 'Wait / Sync',
        }
    }
  }

  // Selected block inspection info
  const selectedBlock = activeBlocks.find((b) => b.id === selectedBlockId) ?? activeBlocks[0]

  return (
    <InteractiveShell
      eyebrow={isZh ? '执行时序与并发对比' : 'Execution Timeline & Overlap'}
      title={
        isZh
          ? 'ZOS 跨步异步重叠流水线 vs 传统串行解码时序图'
          : 'Zero-Overhead Scheduling Dual-Track Pipeline vs Serial Baseline'
      }
      caption={
        isZh
          ? '切换执行模式并悬浮观察 CPU 与 GPU 双轨时序。ZOS 通过延迟跨步后处理与 CUDA Graph 重放，将 CPU 调度与后处理完全隐藏在 GPU 前向计算阴影中，彻底消除设备饥饿气泡。'
          : 'Switch execution modes and inspect CPU vs GPU dual tracks. ZOS eliminates hardware bubbles by concealing CPU scheduling and deferred post-processing inside GPU forward execution shadows.'
      }
    >
      <div className="space-y-6">
        {/* Mode Selector Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-border/80 bg-background/55 p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isZh ? '调度执行模式' : 'Scheduling Mode'}:
            </span>
            <div className="inline-flex rounded-lg border border-border/80 bg-surface/80 p-0.5">
              <button
                type="button"
                onClick={() => {
                  setMode('zos')
                  setSelectedBlockId(null)
                }}
                className={clsx(
                  'rounded-md px-3 py-1.5 text-xs font-semibold transition',
                  mode === 'zos'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {isZh ? 'ZOS 双轨异步重叠 (DeepInfer)' : 'ZOS Dual-Track Overlap (DeepInfer)'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('baseline')
                  setSelectedBlockId(null)
                }}
                className={clsx(
                  'rounded-md px-3 py-1.5 text-xs font-semibold transition',
                  mode === 'baseline'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {isZh ? '传统串行自回归解码 (Baseline)' : 'Traditional Serial Baseline'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#df8e1d]" />
              {isZh ? 'CPU 调度' : 'CPU Sched'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#179299]" />
              {isZh ? 'CPU 后处理' : 'CPU Post-proc'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#1e66f5]" />
              {isZh ? 'GPU 前向 (Graph)' : 'GPU Forward'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#e64553]" />
              {isZh ? 'GPU 采样' : 'GPU Sample'}
            </span>
            {mode === 'baseline' && (
              <span className="flex items-center gap-1.5 font-medium text-destructive">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#d20f39]/30 border border-[#d20f39]" />
                {isZh ? 'GPU 气泡' : 'GPU Bubble'}
              </span>
            )}
          </div>
        </div>

        {/* Dual-Track Timeline SVG */}
        <motion.div
          variants={itemVariants}
          className="overflow-x-auto rounded-[8px] border border-border/80 bg-background/55 p-3"
        >
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full min-w-[580px] select-none font-sans"
            style={{ height: 'auto' }}
          >
            <defs>
              {/* Pattern for Idle Bubble */}
              <pattern
                id="diagonalHatch"
                width="8"
                height="8"
                patternTransform="rotate(45 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <line x1="0" y1="0" x2="0" y2="8" stroke="#d20f39" strokeWidth="2" strokeOpacity="0.35" />
              </pattern>
            </defs>

            {/* Track Labels */}
            <g>
              <rect x="8" y={cpuY} width={leftPadding - 16} height={trackHeight} rx="4" fill="currentColor" fillOpacity="0.06" />
              <text x={leftPadding / 2} y={cpuY + trackHeight / 2 + 4} textAnchor="middle" className="text-[11px] font-semibold fill-foreground">
                CPU Host
              </text>
              <text x={leftPadding / 2} y={cpuY + trackHeight / 2 + 15} textAnchor="middle" className="text-[9px] fill-muted-foreground font-mono">
                Worker/Sched
              </text>

              <rect x="8" y={gpuY} width={leftPadding - 16} height={trackHeight} rx="4" fill="currentColor" fillOpacity="0.06" />
              <text x={leftPadding / 2} y={gpuY + trackHeight / 2 + 4} textAnchor="middle" className="text-[11px] font-semibold fill-foreground">
                GPU Device
              </text>
              <text x={leftPadding / 2} y={gpuY + trackHeight / 2 + 15} textAnchor="middle" className="text-[9px] fill-muted-foreground font-mono">
                Stream/Graph
              </text>
            </g>

            {/* Track Background Rails */}
            <rect
              x={leftPadding}
              y={cpuY}
              width={trackWidth}
              height={trackHeight}
              rx="4"
              fill="currentColor"
              fillOpacity="0.03"
              stroke="currentColor"
              strokeOpacity="0.1"
            />
            <rect
              x={leftPadding}
              y={gpuY}
              width={trackWidth}
              height={trackHeight}
              rx="4"
              fill="currentColor"
              fillOpacity="0.03"
              stroke="currentColor"
              strokeOpacity="0.1"
            />

            {/* Overlap Shadow Highlight Box in ZOS mode */}
            {mode === 'zos' && (
              <g>
                {/* Step N Overlap Zone */}
                <rect
                  x={scale(0)}
                  y={cpuY - 6}
                  width={widthScale(6.0)}
                  height={gpuY + trackHeight - cpuY + 12}
                  rx="6"
                  fill="#179299"
                  fillOpacity="0.05"
                  stroke="#179299"
                  strokeOpacity="0.35"
                  strokeDasharray="4 3"
                />
                {/* Step N+1 Overlap Zone */}
                <rect
                  x={scale(7.5)}
                  y={cpuY - 6}
                  width={widthScale(6.0)}
                  height={gpuY + trackHeight - cpuY + 12}
                  rx="6"
                  fill="#179299"
                  fillOpacity="0.07"
                  stroke="#179299"
                  strokeOpacity="0.45"
                  strokeDasharray="4 3"
                />
                <text
                  x={scale(7.5) + widthScale(3.0)}
                  y={cpuY - 11}
                  textAnchor="middle"
                  className="text-[10px] font-semibold fill-primary tracking-wide"
                >
                  ⚡ {isZh ? '前向计算阴影重叠区 (Overlap Shadow: 100% 隐藏 CPU 开销)' : 'Forward Overlap Shadow (Zero Exposed CPU Overhead)'}
                </text>
              </g>
            )}

            {/* Timeline Blocks */}
            {activeBlocks.map((block) => {
              const x = scale(block.start)
              const w = widthScale(block.duration)
              const y = block.track === 'cpu' ? cpuY : gpuY
              const isSelected = selectedBlockId === block.id
              const style = getBlockStyle(block.type, isSelected)
              const isBubble = block.type === 'bubble'

              return (
                <g
                  key={block.id}
                  className="cursor-pointer transition-transform duration-150 hover:opacity-90"
                  onClick={() => setSelectedBlockId(block.id)}
                  onMouseEnter={() => setSelectedBlockId(block.id)}
                >
                  {/* Block fill rect */}
                  <rect
                    x={x + 1}
                    y={y + 1}
                    width={Math.max(2, w - 2)}
                    height={trackHeight - 2}
                    rx="4"
                    fill={isBubble ? 'url(#diagonalHatch)' : style.fill}
                    fillOpacity={isBubble ? 1 : style.fillOpacity}
                    stroke={style.stroke}
                    strokeWidth={isSelected ? 2 : 1}
                    strokeDasharray={isBubble ? '3 2' : undefined}
                  />

                  {/* Text inside block if wide enough */}
                  {w > 36 && (
                    <text
                      x={x + w / 2}
                      y={y + (block.subZh ? 16 : trackHeight / 2 + 4)}
                      textAnchor="middle"
                      fill={style.textColor}
                      className={clsx(
                        'pointer-events-none font-medium',
                        w > 65 ? 'text-[10px]' : 'text-[9px]',
                      )}
                    >
                      {isZh ? block.labelZh : block.labelEn}
                    </text>
                  )}

                  {w > 65 && block.subZh && (
                    <text
                      x={x + w / 2}
                      y={y + 28}
                      textAnchor="middle"
                      fill={style.textColor}
                      opacity={0.8}
                      className="pointer-events-none text-[8.5px] font-mono"
                    >
                      {isZh ? block.subZh : block.subEn}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Time Axis (Bottom) */}
            <g transform={`translate(0, ${timeAxisY})`}>
              <line x1={leftPadding} y1="0" x2={leftPadding + trackWidth} y2="0" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
              {Array.from({ length: mode === 'baseline' ? 6 : 5 }).map((_, i) => {
                const ms = i * (mode === 'baseline' ? 5 : 4)
                const x = scale(ms)
                return (
                  <g key={ms} transform={`translate(${x}, 0)`}>
                    <line x1="0" y1="0" x2="0" y2="5" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
                    <text y="16" textAnchor="middle" className="text-[9.5px] font-mono fill-muted-foreground">
                      {ms} ms
                    </text>
                  </g>
                )
              })}
              <text
                x={leftPadding + trackWidth + 12}
                y="10"
                className="text-[9.5px] font-mono fill-muted-foreground"
              >
                Time →
              </text>
            </g>

            {/* Step Annotation Bracket */}
            <g transform={`translate(0, ${timeAxisY + 28})`}>
              {mode === 'baseline' ? (
                <>
                  <line x1={scale(0)} y1="0" x2={scale(12.5)} y2="0" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
                  <text x={scale(6.25)} y="12" textAnchor="middle" className="text-[10px] font-semibold fill-muted-foreground">
                    Step N: 12.5 ms (GPU 闲置 40%)
                  </text>
                  <line x1={scale(12.5)} y1="0" x2={scale(25.0)} y2="0" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
                  <text x={scale(18.75)} y="12" textAnchor="middle" className="text-[10px] font-semibold fill-muted-foreground">
                    Step N+1: 12.5 ms (GPU 闲置 40%)
                  </text>
                </>
              ) : (
                <>
                  <line x1={scale(0)} y1="0" x2={scale(7.5)} y2="0" stroke="#179299" strokeOpacity="0.6" strokeWidth="1.5" />
                  <text x={scale(3.75)} y="12" textAnchor="middle" className="text-[10px] font-semibold fill-primary">
                    Step N: 7.5 ms (0 气泡)
                  </text>
                  <line x1={scale(7.5)} y1="0" x2={scale(15.0)} y2="0" stroke="#179299" strokeOpacity="0.6" strokeWidth="1.5" />
                  <text x={scale(11.25)} y="12" textAnchor="middle" className="text-[10px] font-semibold fill-primary">
                    Step N+1: 7.5 ms (0 气泡，吞吐 +66%)
                  </text>
                </>
              )}
            </g>
          </svg>
        </motion.div>

        {/* Selected Phase Inspector Box */}
        {selectedBlock && (
          <motion.div
            variants={itemVariants}
            className="rounded-[8px] border border-border/80 bg-background/55 p-4 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-foreground">
                  {isZh ? selectedBlock.labelZh : selectedBlock.labelEn}
                </span>
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  {selectedBlock.track === 'cpu' ? 'Host Core (CPU)' : 'Device Tensor (GPU)'}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  ⏱ {selectedBlock.duration.toFixed(1)} ms
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {isZh ? '时间区间' : 'Window'}: [{selectedBlock.start.toFixed(1)}ms - {(selectedBlock.start + selectedBlock.duration).toFixed(1)}ms]
              </span>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-foreground/90">
              {selectedBlock.type === 'forward' &&
                (isZh
                  ? '执行主模型前向计算。在解码阶段通过 CUDA Graph Replay 发射，消除 Python Launch Overhead（下发仅需 <2μs）；此时 CPU 无需挂起，立即并发执行上一轮后处理。'
                  : 'Executes main model forward pass via CUDA Graph Replay, driving launch latency down to <2μs. The CPU proceeds immediately without device wait.')}
              {selectedBlock.type === 'postprocess' &&
                (isZh
                  ? '处理 Token 采样输出与状态转移（prev_step_state）。在 ZOS 模式下，本步后处理被挪动到下一步前向发射之后，完全利用 GPU 计算窗口并发执行，不占用任何端到端时延。'
                  : 'Processes sampled tokens and state transitions. In ZOS mode, post-processing is deferred until after the next forward launch, running entirely in parallel.')}
              {selectedBlock.type === 'schedule' &&
                (isZh
                  ? 'C++ 调度器执行批次重构与显存分配决策。在发射前调用 _correct_seqlens_qk() 修正由于跨步异步造成的序列长度滞后。'
                  : 'C++ scheduler constructs batch outputs and assigns memory blocks. The worker invokes _correct_seqlens_qk() to reconcile lag in sequence lengths.')}
              {selectedBlock.type === 'bubble' &&
                (isZh
                  ? '【串行瓶颈】由于后处理依赖设备采样产物，GPU 必须在 CPU 执行调度决策与后处理期间彻底空转，造成高达 40% 的算力饥饿浪费。'
                  : '[Serial Bottleneck] GPU sits idle waiting for CPU post-processing and scheduling, wasting ~40% of hardware compute capacity.')}
              {selectedBlock.type === 'sample' &&
                (isZh
                  ? '执行 Sampler 核函数生成新 Token。产物直接打包进 curr_step_state 并在 ZOS 模式下延迟到下一步消费。'
                  : 'Executes sampling kernel to emit tokens. The result is captured in curr_step_state and deferred to the next iteration.')}
              {selectedBlock.type === 'sync' &&
                (isZh
                  ? '【同步等待】CPU 阻塞等待 GPU 硬件流完成计算，线程处于阻塞或忙等状态。'
                  : '[Synchronous Wait] CPU thread blocks on CUDA stream completion.')}
            </p>
          </motion.div>
        )}

        {/* Real-time Metric Cards Comparison */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label={isZh ? '单步解码耗时' : 'Step Latency'}
            value={mode === 'zos' ? '7.5 ms' : '12.5 ms'}
            formula={
              mode === 'zos'
                ? 'max(T_fwd, T_post + T_sched) + T_smp'
                : 'T_sched + T_fwd + T_smp + T_post'
            }
            note={
              mode === 'zos'
                ? (isZh ? '端到端时延下降 40.0%' : '40.0% latency reduction')
                : (isZh ? '存在完整串行累加开销' : 'Full serial overhead accumulation')
            }
            tone={mode === 'zos' ? 'teal' : 'amber'}
          />

          <MetricCard
            label={isZh ? 'GPU 闲置气泡' : 'GPU Idle Bubble'}
            value={mode === 'zos' ? '0.0 ms' : '5.0 ms'}
            formula={mode === 'zos' ? 'Bubble = 0 μs' : '5.0 ms / 12.5 ms (40%)'}
            note={
              mode === 'zos'
                ? (isZh ? 'CUDA Graph 零气泡硬件打满' : 'Zero bubble, 100% saturation')
                : (isZh ? 'CPU 调度期间 GPU 完全饥饿' : 'GPU starved during CPU tasks')
            }
            tone={mode === 'zos' ? 'green' : 'mauve'}
          />

          <MetricCard
            label={isZh ? 'CPU 调度暴露时间' : 'Exposed CPU Overhead'}
            value={mode === 'zos' ? '0.0 ms' : '5.0 ms'}
            formula={
              mode === 'zos'
                ? 'max(0, T_cpu - T_gpu) = 0'
                : 'T_sched + T_post = 5.0ms'
            }
            note={
              mode === 'zos'
                ? (isZh ? '100% 藏于 GPU 前向阴影' : '100% hidden in GPU shadow')
                : (isZh ? '100% 暴露并推高首字后时延' : '100% exposed to ITL')
            }
            tone={mode === 'zos' ? 'blue' : 'amber'}
          />

          <MetricCard
            label={isZh ? '硬件计算吞吐提升' : 'Throughput Gain'}
            value={mode === 'zos' ? '+66.7%' : '基准 Baseline'}
            formula={mode === 'zos' ? '12.5ms / 7.5ms = 1.667x' : '1.00x'}
            note={
              mode === 'zos'
                ? (isZh ? '生产环境解码算力完全释放' : 'Peak hardware utilization')
                : (isZh ? '传统自回归实现的理论上限' : 'Bound by serial dependencies')
            }
            tone={mode === 'zos' ? 'teal' : 'blue'}
          />
        </div>
      </div>
    </InteractiveShell>
  )
}
