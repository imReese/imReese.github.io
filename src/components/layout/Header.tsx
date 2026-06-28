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
import { name } from '@/config/infoConfig'
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
  return (
    <Popover {...props}>
      <Popover.Button className="group flex items-center rounded-full bg-card/80 px-4 py-2 text-sm font-medium shadow-lg ring-1 ring-border/70 backdrop-blur">
        Menu
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
            className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl p-8 ring-1 ring-muted bg-card"
          >
            <div className="flex flex-row-reverse items-center justify-between">
              <Popover.Button aria-label="Close menu" className="-m-1 p-1">
                <XIcon className="h-6 w-6 text-muted-foreground" />
              </Popover.Button>
              <h2 className="text-sm font-medium text-muted-foreground">
                {name}
              </h2>
            </div>
            <nav className="mt-6">
              <ul className="-my-2 divide-y divide-zinc-100 text-base dark:divide-zinc-100/5">
                {navItems.map((item) => (
                  <MobileNavItem key={item.name} href={item.href}>{item.name}</MobileNavItem>
                ))}
              </ul>
            </nav>
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
  let isActive = usePathname() === href

  return (
    <li>
      <Link
        href={href}
        className={clsx(
          'relative block px-3 py-2 transition',
          isActive
            ? 'text-primary'
            : 'opacity-80 hover:opacity-100 hover:text-primary',
        )}
      >
        {children}
        {isActive && (
          <span className="absolute inset-x-1 -bottom-px h-[1.5px] bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 dark:from-primary/0 dark:via-primary/40 dark:to-primary/0" />
        )}
      </Link>
    </li>
  )
}

function DesktopNavigation(props: React.ComponentPropsWithoutRef<'nav'>) {
  return (
    <nav {...props}>
      <ul className="flex rounded-full bg-card/80 px-3 text-sm font-medium shadow-md ring-1 ring-border/70 backdrop-blur">
        {navItems.map((item, index) => (
          <Fragment key={item.name}>
            {index > 0 && (
              <li className="flex items-center">
                <div className="h-4 w-px bg-muted-foreground/30" />
              </li>
            )}
            <NavItem href={item.href}>{item.name}</NavItem>
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
  return (
    <div className='flex flex-row items-center gap-2'>
      <div
        className={clsx(
          className,
          'h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:ring-white/10',
        )}
        {...props}
      />
      {showName && (
        <Link
          href="/"
          aria-label="Home"
          className='pointer-events-auto'
        >
          <div className="text-md font-semibold capitalize">{name}</div>
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
        placeholder="blur"
        className={clsx(
          'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800',
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
        className="pointer-events-none z-50 flex h-16 flex-none flex-col pt-6"
        style={{ position: 'sticky', top: 0 }}
      >
        <Container className="w-full">
            <div className="relative flex gap-4">
              <div className="flex flex-1">
                <AvatarContainer showName={true}>
                  <Avatar />
                </AvatarContainer>
              </div>
              <div className="flex flex-1 justify-start">
                <MobileNavigation className="pointer-events-auto md:hidden" />
                <DesktopNavigation className="pointer-events-auto hidden md:block" />
              </div>
              <div className="flex justify-end md:flex-1">
                <div className="pointer-events-auto flex flex-row items-center gap-2 md:mr-2">
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
