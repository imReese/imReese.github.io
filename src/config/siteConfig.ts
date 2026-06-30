import { siteContent } from './content'

export const utm_source = process.env.NEXT_PUBLIC_UTM_SOURCE

type NavItemType = {
  name: string
  href: string
}

export const footerItems: Array<NavItemType> = siteContent.navigation.footer

export const navItems: Array<NavItemType> = siteContent.navigation.header
