"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

import { themedBrowserColor, themedFavicon } from "@/config/assets"

type BrowserTheme = keyof typeof themedFavicon

function resolveBrowserTheme(theme: string | undefined): BrowserTheme {
  if (theme === "dark" || theme === "light") {
    return theme
  }

  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark"
  }

  return "light"
}

function getManagedLink(selector: string, create: () => HTMLElement) {
  const existing = document.head.querySelector<HTMLElement>(selector)

  if (existing) {
    return existing
  }

  const next = create()
  document.head.appendChild(next)
  return next
}

export function ThemeFavicon() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const theme = resolveBrowserTheme(resolvedTheme)
    const favicon = getManagedLink('link[data-theme-favicon="true"]', () => {
      const link = document.createElement("link")
      link.setAttribute("data-theme-favicon", "true")
      link.setAttribute("rel", "icon")
      link.setAttribute("type", "image/svg+xml")
      link.setAttribute("sizes", "any")
      return link
    }) as HTMLLinkElement

    const color = getManagedLink('meta[data-theme-color="true"]', () => {
      const meta = document.createElement("meta")
      meta.setAttribute("data-theme-color", "true")
      meta.setAttribute("name", "theme-color")
      return meta
    }) as HTMLMetaElement

    favicon.setAttribute("href", themedFavicon[theme])
    color.setAttribute("content", themedBrowserColor[theme])
  }, [resolvedTheme])

  return null
}
