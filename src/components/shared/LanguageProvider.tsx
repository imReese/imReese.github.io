"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

type Locale = "en" | "zh"

const STORAGE_KEY = "reese-language"

const translations = {
  en: {
    "common.menu": "Menu",
    "common.closeMenu": "Close menu",
    "common.switchLanguage": "Switch language",
    "common.toggleTheme": "Toggle theme",
    "common.githubRepo": "Github Repo",
    "footer.rights": "All rights reserved.",
    "nav.Home": "Home",
    "nav.About": "About",
    "nav.Projects": "Projects",
    "nav.Blogs": "Blogs",
    "home.viewProjects": "View projects",
    "home.readNotes": "Read notes",
  },
  zh: {
    "common.menu": "菜单",
    "common.closeMenu": "关闭菜单",
    "common.switchLanguage": "切换语言",
    "common.toggleTheme": "切换主题",
    "common.githubRepo": "GitHub 仓库",
    "footer.rights": "保留所有权利。",
    "nav.Home": "首页",
    "nav.About": "关于",
    "nav.Projects": "项目",
    "nav.Blogs": "博客",
    "home.viewProjects": "查看项目",
    "home.readNotes": "阅读笔记",
  },
} as const

type TranslationKey = keyof typeof translations.en

type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return "en"
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === "zh" ? "zh" : "en"
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  useEffect(() => {
    setLocaleState(readInitialLocale())
  }, [])

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale)
    window.localStorage.setItem(STORAGE_KEY, nextLocale)
    document.documentElement.lang = nextLocale === "zh" ? "zh-CN" : "en"
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale(locale === "zh" ? "en" : "zh")
  }, [locale, setLocale])

  const t = useCallback(
    (key: TranslationKey) => translations[locale][key] ?? translations.en[key],
    [locale],
  )

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t],
  )

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en"
  }, [locale])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }

  return context
}
