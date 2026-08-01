'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import * as React from 'react'
import { type ReactNode } from 'react'

export const revealEase = [0.22, 1, 0.36, 1] as const

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

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: revealEase },
  },
}

export function InteractiveShell({
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
