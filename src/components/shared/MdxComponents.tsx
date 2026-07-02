import { type MDXComponents } from 'mdx/types'
import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import { type AnchorHTMLAttributes } from 'react'
import clsx from 'clsx'
import { CodeBlock } from './CodeBlock'
import {
  LayerDiagram,
  MappingDiagram,
  SequenceDiagram,
  StateDiagram,
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

export const mdxComponents: MDXComponents = {
  LayerDiagram,
  MappingDiagram,
  SequenceDiagram,
  StateDiagram,
  Image: ({ alt = '', className, ...props }: ImageProps) => (
    <Image
      {...props}
      alt={alt}
      className={clsx('my-8 rounded-2xl', className)}
    />
  ),
  a: CustomLink,
  pre: CodeBlock,
}
