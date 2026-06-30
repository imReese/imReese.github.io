import { Container } from '@/components/layout/Container'

export function SimpleLayout({
  title,
  intro,
  children,
}: {
  title: string
  intro: string
  children?: React.ReactNode
}) {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="w-[calc(100vw-4rem)] max-w-2xl min-w-0 sm:w-full">
        <h1 className="break-words text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
          {title}
        </h1>
        <p className="mt-6 break-words text-base text-zinc-600 dark:text-zinc-400">
          {intro}
        </p>
      </header>
      {children && (
        <div className="mt-16 w-[calc(100vw-4rem)] max-w-full min-w-0 sm:mt-20 sm:w-full">
          {children}
        </div>
      )}
    </Container>
  )
}
