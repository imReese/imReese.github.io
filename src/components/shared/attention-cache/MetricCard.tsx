'use client'

import clsx from 'clsx'
import { motion } from 'framer-motion'
import * as React from 'react'
import { itemVariants } from './InteractiveShell'
import { type MetricTone } from './types'

const toneClasses: Record<MetricTone, string> = {
  teal: 'border-primary/30 bg-accent-soft/55 text-primary',
  blue: 'border-[#1e66f5]/30 bg-[#1e66f5]/[0.07] text-[#1e66f5] dark:border-[#89b4fa]/35 dark:bg-[#89b4fa]/[0.08] dark:text-[#89b4fa]',
  green:
    'border-[#40a02b]/30 bg-[#40a02b]/[0.07] text-[#2f7d20] dark:border-[#a6e3a1]/35 dark:bg-[#a6e3a1]/[0.08] dark:text-[#a6e3a1]',
  mauve:
    'border-[#8839ef]/30 bg-[#8839ef]/[0.07] text-[#8839ef] dark:border-[#cba6f7]/35 dark:bg-[#cba6f7]/[0.08] dark:text-[#cba6f7]',
  amber:
    'border-[#df8e1d]/35 bg-[#df8e1d]/[0.08] text-[#9a5b00] dark:border-[#f9e2af]/35 dark:bg-[#f9e2af]/[0.08] dark:text-[#f9e2af]',
}

export function MetricCard({
  label,
  value,
  formula,
  note,
  tone = 'teal',
}: {
  label: string
  value: string
  formula: string
  note?: string
  tone?: MetricTone
}) {
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
      {note && (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p>
      )}
    </motion.div>
  )
}
