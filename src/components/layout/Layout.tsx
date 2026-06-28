import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.10),transparent_32rem),hsl(var(--background))] dark:bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_34rem),hsl(var(--background))]" />
        </div>
      </div>
      <div className="relative flex w-full flex-col">
        <Header />
        <main className="flex-auto px-4 sm:px-6 lg:px-8">{children}</main>
        <Footer />
      </div>
    </>
  )
}
