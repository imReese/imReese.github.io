import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 flex max-w-full justify-center overflow-x-hidden sm:px-8">
        <div className="flex w-full max-w-7xl 2xl:max-w-[1536px] min-[1920px]:max-w-[1680px] lg:px-8">
          <div className="w-full bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.10),transparent_36rem),hsl(var(--background))] dark:bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_40rem),hsl(var(--background))]" />
        </div>
      </div>
      <div className="relative flex min-w-0 max-w-full w-full flex-col overflow-x-hidden">
        <Header />
        <main className="min-w-0 max-w-full flex-auto">{children}</main>
        <Footer />
      </div>
    </>
  )
}
