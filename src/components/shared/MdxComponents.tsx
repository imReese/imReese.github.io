import { type MDXComponents } from 'mdx/types'
import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import {
  type AnchorHTMLAttributes,
  type StyleHTMLAttributes,
  type TableHTMLAttributes,
} from 'react'
import clsx from 'clsx'
import { AlignmentDiagram } from './AlignmentDiagram'
import {
  AttentionSpeedupCurve,
  AttentionStateEvolution,
  PrefixCacheTriangle,
} from './AttentionCacheInteractives'
import { CodeBlock } from './CodeBlock'
import {
  CompareCallout,
  ExpandableNotes,
  FlowDiagram,
  LayerDiagram,
  MappingDiagram,
  SequenceDiagram,
  StateDiagram,
  SystemBoundaryDiagram,
} from './TechDiagram'

const linkClassName =
  'font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition hover:decoration-primary'

const CustomLink = ({
  className,
  href = '',
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const classes = clsx(linkClassName, className)

  if (href?.startsWith('/')) {
    return <Link href={href} {...props} className={classes} />
  }

  if (href?.startsWith('#')) {
    return <a href={href} {...props} className={classes} />
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      {...props}
      className={classes}
    />
  )
}

const ResponsiveTable = ({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) => (
  <div className="not-prose my-8 w-full max-w-[72rem] overflow-x-auto rounded-xl border border-border bg-card/30 shadow-sm">
    <table
      {...props}
      className={clsx(
        'w-full min-w-[48rem] border-collapse text-left text-sm',
        '[&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-foreground',
        '[&_td]:border-b [&_td]:border-border/70 [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_td]:leading-6 [&_td]:text-muted-foreground',
        '[&_th]:border-b [&_th]:border-border [&_th]:bg-muted/45 [&_th]:px-4 [&_th]:py-3 [&_th]:align-bottom [&_th]:font-semibold [&_th]:text-foreground',
        '[&_tbody_tr:last-child_td]:border-b-0',
        className,
      )}
    />
  </div>
)

const TrustedStyle = ({
  children,
  ...props
}: StyleHTMLAttributes<HTMLStyleElement>) => (
  <style
    {...props}
    dangerouslySetInnerHTML={{ __html: String(children ?? '') }}
  />
)

type MathJaxMarkupProps = {
  display?: boolean
  markup?: string
}

const MathJaxMarkup = ({
  display = false,
  markup = '',
}: MathJaxMarkupProps) => {
  const html = { __html: markup }

  return display ? (
    <div className="mathjax-display-shell" dangerouslySetInnerHTML={html} />
  ) : (
    <span className="mathjax-inline-shell" dangerouslySetInnerHTML={html} />
  )
}

export const mdxComponents: MDXComponents = {
  AlignmentDiagram,
  AttentionSpeedupCurve,
  AttentionStateEvolution,
  CompareCallout,
  ExpandableNotes,
  FlowDiagram,
  LayerDiagram,
  MappingDiagram,
  PrefixCacheTriangle,
  SequenceDiagram,
  StateDiagram,
  SystemBoundaryDiagram,
  Image: ({ alt = '', className, ...props }: ImageProps) => (
    <Image
      {...props}
      alt={alt}
      className={clsx('my-8 rounded-2xl', className)}
    />
  ),
  a: CustomLink,
  'math-jax': MathJaxMarkup,
  pre: CodeBlock,
  style: TrustedStyle,
  table: ResponsiveTable,
}
