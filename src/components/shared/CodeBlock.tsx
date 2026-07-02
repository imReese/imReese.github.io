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
    <div className="not-prose my-8 overflow-hidden rounded-lg border border-[#bcc0cc]/70 bg-[#eff1f5] shadow-[0_18px_50px_-32px_rgba(76,79,105,0.45)] dark:border-[#45475a]/70 dark:bg-[#1e1e2e] dark:shadow-[0_18px_55px_-35px_rgba(17,17,27,0.9)]">
      <div className="flex h-10 items-center justify-between border-b border-[#ccd0da]/80 bg-[#e6e9ef]/75 px-4 dark:border-[#45475a]/70 dark:bg-[#181825]/70">
        <span className="rounded-md border border-[#bcc0cc]/70 bg-[#ccd0da]/45 px-2 py-0.5 font-mono text-[0.72rem] font-medium leading-none text-[#6c6f85] dark:border-[#45475a]/70 dark:bg-[#313244]/60 dark:text-[#bac2de]">
          {language}
        </span>
        <button
          type="button"
          onClick={copyCode}
          title={copied ? 'Copied' : 'Copy code'}
          aria-label={copied ? 'Copied code' : 'Copy code'}
          className={clsx(
            'inline-flex h-7 w-7 items-center justify-center gap-1.5 rounded-md border transition sm:w-auto sm:px-2',
            copied
              ? 'border-[#179299]/35 bg-[#179299]/10 text-primary dark:border-[#94e2d5]/35 dark:bg-[#94e2d5]/10 dark:text-[#94e2d5]'
              : 'border-[#bcc0cc]/70 bg-[#eff1f5]/65 text-[#6c6f85] hover:border-[#179299]/50 hover:text-primary dark:border-[#45475a]/70 dark:bg-[#313244]/55 dark:text-[#a6adc8] dark:hover:border-[#94e2d5]/50 dark:hover:text-[#94e2d5]',
          )}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span className="hidden font-mono text-[0.72rem] font-medium leading-none sm:inline">
            {copied ? 'Copied' : 'Copy'}
          </span>
        </button>
      </div>
      <pre
        className={clsx(
          className,
          'm-0 max-h-[42rem] overflow-x-auto bg-transparent px-4 py-4 font-mono text-sm leading-7 text-[#4c4f69] sm:px-5 sm:py-5 dark:text-[#cdd6f4]',
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}
