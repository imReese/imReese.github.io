'use client'

import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'

import { Container } from '@/components/layout/Container'
import avatarImage from '@/images/avatar.jpg'
import { navItems } from '@/config/siteConfig'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { GithubRepo } from '@/components/shared/GithubRepo'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { useLanguage } from '@/components/shared/LanguageProvider'
import { useLocalizedContent } from '@/components/shared/useLocalizedContent'
import { isNavItemActive } from '@/lib/navigation'
import { ChevronDownIcon, XIcon } from 'lucide-react'

function MobileNavItem({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <li>
      <Popover.Button as={Link} href={href} className="block py-2">
        {children}
      </Popover.Button>
    </li>
  )
}

function MobileNavigation(
  props: React.ComponentPropsWithoutRef<typeof Popover>,
) {
  const { t } = useLanguage()
  const { site } = useLocalizedContent()

  return (
    <Popover {...props}>
      <Popover.Button className="group flex items-center rounded-full bg-card/80 px-4 py-2 text-sm font-medium shadow-lg ring-1 ring-border/70 backdrop-blur">
        {t('common.menu')}
        <ChevronDownIcon className="ml-3 h-auto w-2" />
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 z-50 backdrop-blur-sm dark:bg-background/80" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-card p-8 ring-1 ring-muted"
          >
            <div className="flex flex-row-reverse items-center justify-between">
              <Popover.Button
                aria-label={t('common.closeMenu')}
                className="-m-1 p-1"
              >
                <XIcon className="h-6 w-6 text-muted-foreground" />
              </Popover.Button>
              <h2 className="text-sm font-medium text-muted-foreground">
                {site.name}
              </h2>
            </div>
            <nav className="mt-6">
              <ul className="-my-2 divide-y divide-border/70 text-base">
                {navItems.map((item) => (
                  <MobileNavItem key={item.name} href={item.href}>
                    {t(`nav.${item.name}` as Parameters<typeof t>[0])}
                  </MobileNavItem>
                ))}
              </ul>
            </nav>
            <div className="mt-6 flex items-center gap-1 border-t border-border/70 pt-5">
              <LanguageToggle />
              <ThemeToggle />
              <GithubRepo />
            </div>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  )
}

function NavItem({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  let isActive = isNavItemActive(usePathname(), href)

  return (
    <li>
      <Link
        href={href}
        aria-current={isActive ? 'page' : undefined}
        className={clsx(
          'group relative block px-3 py-2 transition-colors duration-200',
          isActive
            ? 'font-semibold text-primary'
            : 'text-muted-foreground hover:text-primary',
        )}
      >
        {children}
        {isActive && (
          <>
            <span className="absolute inset-x-0 -bottom-0.5 z-10 h-0.5 bg-gradient-to-r from-primary/0 via-current to-primary/0" />
            <span className="absolute inset-x-0 -bottom-1 h-2 rounded-full bg-current opacity-20 blur-md" />
          </>
        )}
      </Link>
    </li>
  )
}

function DesktopNavigation(props: React.ComponentPropsWithoutRef<'nav'>) {
  const { t } = useLanguage()

  return (
    <nav {...props}>
      <ul className="relative flex px-2 text-sm font-medium before:absolute before:-inset-x-4 before:-bottom-0.5 before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-muted-foreground/30 before:to-transparent before:content-['']">
        {navItems.map((item, index) => (
          <Fragment key={item.name}>
            {index > 0 && (
              <li className="flex items-center">
                <div className="h-4 w-px bg-muted-foreground/30" />
              </li>
            )}
            <NavItem href={item.href}>
              {t(`nav.${item.name}` as Parameters<typeof t>[0])}
            </NavItem>
          </Fragment>
        ))}
      </ul>
    </nav>
  )
}

function AvatarContainer({
  showName = false,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  showName?: boolean
}) {
  const { site } = useLocalizedContent()

  return (
    <div className="pointer-events-auto flex flex-row items-center gap-2">
      <div
        className={clsx(
          className,
          'h-10 w-10 rounded-full bg-[#eff1f5]/90 p-0.5 shadow-lg shadow-[#4c4f69]/5 ring-1 ring-[#bcc0cc]/70 backdrop-blur dark:bg-[#313244]/85 dark:ring-[#45475a]/80',
        )}
        {...props}
      />
      {showName && (
        <Link href="/" aria-label="Home">
          <div className="text-base font-semibold capitalize">{site.name}</div>
        </Link>
      )}
    </div>
  )
}

function Avatar({
  large = false,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href'> & {
  large?: boolean
}) {
  return (
    <Link
      href="/"
      aria-label="Home"
      className={clsx(className, 'pointer-events-auto')}
      {...props}
    >
      <Image
        src={avatarImage}
        alt="Profile avatar"
        width={large ? 64 : 36}
        height={large ? 64 : 36}
        sizes={large ? '4rem' : '2.25rem'}
        className={clsx(
          'rounded-full bg-[#e6e9ef] object-cover dark:bg-[#313244]',
          large ? 'h-16 w-16' : 'h-9 w-9',
        )}
        priority
      />
    </Link>
  )
}

export function Header() {
  return (
    <>
      <header
        className="pointer-events-none relative z-50 flex h-16 flex-none flex-col pt-6"
        style={{ position: 'sticky', top: 0 }}
      >
        <div className="header-glass" aria-hidden="true" />
        <Container className="w-full">
          <div className="relative flex min-w-0 items-center gap-4">
            <div className="flex min-w-0 flex-1">
              <AvatarContainer showName={true}>
                <Avatar />
              </AvatarContainer>
            </div>
            <div className="flex flex-none justify-end md:flex-1 md:justify-start">
              <MobileNavigation className="pointer-events-auto md:hidden" />
              <DesktopNavigation className="pointer-events-auto hidden md:block" />
            </div>
            <div className="hidden justify-end md:flex md:flex-1">
              <div className="pointer-events-auto flex flex-row items-center gap-2 md:mr-2">
                <LanguageToggle />
                <ThemeToggle />
                <GithubRepo />
              </div>
            </div>
          </div>
        </Container>
      </header>
    </>
  )
}
