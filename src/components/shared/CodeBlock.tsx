'use client'

import {
  Children,
  isValidElement,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'
import clsx from 'clsx'
import { Check, Copy } from 'lucide-react'

function getTextContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join('')
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getTextContent(node.props.children)
  }

  return ''
}

function getLanguage(children: ReactNode) {
  const child = Children.toArray(children)[0]

  if (!isValidElement<{ className?: string }>(child)) {
    return 'text'
  }

  const match = child.props.className?.match(/language-([\w-]+)/)
  return match?.[1] ?? 'text'
}

function formatLanguage(language: string) {
  const labels: Record<string, string> = {
    bash: 'bash',
    shell: 'shell',
    sh: 'shell',
    text: 'text',
    ts: 'ts',
    tsx: 'tsx',
    js: 'js',
    jsx: 'jsx',
    json: 'json',
    python: 'python',
    py: 'python',
    yaml: 'yaml',
    yml: 'yaml',
  }

  return labels[language] ?? language
}

export function CodeBlock({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'pre'>) {
  const [copied, setCopied] = useState(false)
  const code = useMemo(() => getTextContent(children).replace(/\n$/, ''), [
    children,
  ])
  const language = formatLanguage(getLanguage(children))

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = code
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.top = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-border/70 bg-zinc-950 shadow-sm dark:bg-black/40">
      <div className="flex h-10 items-center justify-between border-b border-white/10 px-4">
        <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-zinc-400">
          {language}
        </span>
        <button
          type="button"
          onClick={copyCode}
          title={copied ? 'Copied' : 'Copy code'}
          aria-label={copied ? 'Copied code' : 'Copy code'}
          className={clsx(
            'inline-flex h-7 w-7 items-center justify-center rounded-md border transition',
            copied
              ? 'border-primary/30 bg-primary/15 text-primary'
              : 'border-white/10 bg-white/5 text-zinc-400 hover:border-primary/40 hover:text-primary',
          )}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
      <pre
        className={clsx(
          className,
          'm-0 max-h-[42rem] overflow-x-auto bg-transparent px-5 py-5 text-sm leading-7 text-zinc-100',
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}
