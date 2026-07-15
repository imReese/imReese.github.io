'use client'

import Link from 'next/link'

import { ContainerInner, ContainerOuter } from '@/components/layout/Container'
import { footerItems } from '@/config/siteConfig'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import SocialLinks from '@/components/home/SocialLinks'
import { HomepageViewStats } from '@/components/shared/HomepageViewStats'
import { useLanguage } from '@/components/shared/LanguageProvider'
import { RSS_PATH } from '@/lib/seo'

function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className="transition hover:text-primary">
      {children}
    </Link>
  )
}

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-32 flex-none">
      <ContainerOuter>
        <div className="border-t border-muted pb-16 pt-10">
          <ContainerInner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium sm:justify-start">
                {footerItems.map((item) => (
                  <NavLink key={item.name} href={item.href}>
                    {t(`nav.${item.name}` as Parameters<typeof t>[0])}
                  </NavLink>
                ))}
                <a
                  href={RSS_PATH}
                  className="font-normal text-muted-foreground transition hover:text-primary"
                >
                  RSS
                </a>
              </div>

              <div className="flex flex-col items-center gap-2 sm:items-end">
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-end">
                  <p className="text-sm text-muted-foreground">
                    &copy; 2026 Reese. All rights reserved.
                  </p>
                  <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <SocialLinks className="mt-0" />
                  </div>
                </div>
                <HomepageViewStats className="justify-center sm:justify-end sm:self-end" />
              </div>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}
