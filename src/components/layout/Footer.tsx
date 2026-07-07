"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ContainerInner, ContainerOuter } from '@/components/layout/Container'
import { footerItems } from '@/config/siteConfig'
import { siteContent } from '@/config/content'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import SocialLinks from '@/components/home/SocialLinks'
import { HomepageViewStats } from '@/components/shared/HomepageViewStats'


function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="transition hover:text-primary"
    >
      {children}
    </Link>
  )
}

export function Footer() {
  const pathname = usePathname()
  const showHomepageStats = pathname === '/'

  return (
    <footer className="mt-32 flex-none">
      <ContainerOuter>
        <div className="border-t border-muted pb-16 pt-10">
          <ContainerInner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium sm:justify-start">
                {footerItems.map((item) => (
                  <NavLink key={item.name} href={item.href}>
                    {item.name}
                  </NavLink>
                ))}
              </div>

              <div className="flex flex-col items-center gap-2 sm:items-end">
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-end">
                  <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} {siteContent.site.name}. All rights reserved.
                  </p>
                  <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <SocialLinks className="mt-0" />
                  </div>
                </div>
                {showHomepageStats ? (
                  <HomepageViewStats
                    className="justify-center sm:self-end sm:justify-end"
                  />
                ) : null}
              </div>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}
