import { Container } from '@/components/layout/Container'
import clsx from 'clsx'

export function SimpleLayout({
  title,
  intro,
  children,
  headerClassName,
}: {
  title: string
  intro: string
  children?: React.ReactNode
  headerClassName?: string
}) {
  return (
    <Container className="mt-16 sm:mt-32">
      <header
        className={clsx(
          'w-[calc(100vw-4rem)] min-w-0 max-w-2xl sm:w-full',
          headerClassName,
        )}
      >
        <h1 className="break-words text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-6 break-words text-base text-zinc-600 dark:text-zinc-400">
          {intro}
        </p>
      </header>
      {children && (
        <div className="mt-16 w-[calc(100vw-4rem)] min-w-0 max-w-full sm:mt-20 sm:w-full">
          {children}
        </div>
      )}
    </Container>
  )
}
