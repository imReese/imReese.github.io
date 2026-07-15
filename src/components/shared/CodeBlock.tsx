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
  const code = useMemo(
    () => getTextContent(children).replace(/\n$/, ''),
    [children],
  )
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
    <div className="not-prose my-8 overflow-hidden rounded-lg border border-border/80 bg-code-background">
      <div className="flex h-10 items-center justify-between border-b border-border/80 bg-surface-elevated/75 px-4">
        <span className="rounded-md border border-border/80 bg-surface px-2 py-1 font-mono text-xs font-medium leading-none text-muted-foreground">
          {language}
        </span>
        <button
          type="button"
          onClick={copyCode}
          title={copied ? 'Copied' : 'Copy code'}
          aria-label={copied ? 'Copied code' : 'Copy code'}
          className={clsx(
            'inline-flex h-8 w-8 items-center justify-center gap-1.5 rounded-md border transition-colors duration-150 sm:w-auto sm:px-2',
            copied
              ? 'border-primary/35 bg-accent-soft text-primary'
              : 'border-border/80 bg-surface text-muted-foreground hover:border-primary/50 hover:text-primary',
          )}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span className="hidden font-mono text-xs font-medium leading-none sm:inline">
            {copied ? 'Copied' : 'Copy'}
          </span>
        </button>
      </div>
      <pre
        className={clsx(
          className,
          'm-0 max-h-[42rem] overflow-x-auto bg-transparent px-4 py-4 font-mono text-sm leading-7 text-foreground sm:px-5 sm:py-5',
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}
