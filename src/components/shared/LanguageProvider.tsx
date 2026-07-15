'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { localeToHtmlLang, type Locale } from '@/lib/language'

const STORAGE_KEY = 'reese-language'

const translations = {
  en: {
    'common.menu': 'Menu',
    'common.closeMenu': 'Close menu',
    'common.switchLanguage': 'Switch language',
    'common.toggleTheme': 'Toggle theme',
    'common.githubRepo': 'GitHub Profile',
    'nav.Home': 'Home',
    'nav.About': 'About',
    'nav.Projects': 'Projects',
    'nav.Blogs': 'Blogs',
    'home.viewProjects': 'View projects',
    'home.readNotes': 'Read notes',
    'projects.scope': 'Scope and limits',
    'projects.capabilities': 'Implemented capabilities',
    'projects.evidence': 'Evidence and implementation links',
    'projects.repository': 'Primary repository',
  },
  zh: {
    'common.menu': '菜单',
    'common.closeMenu': '关闭菜单',
    'common.switchLanguage': '切换语言',
    'common.toggleTheme': '切换主题',
    'common.githubRepo': 'GitHub 主页',
    'nav.Home': '首页',
    'nav.About': '关于',
    'nav.Projects': '项目',
    'nav.Blogs': '博客',
    'home.viewProjects': '查看项目',
    'home.readNotes': '阅读笔记',
    'projects.scope': '范围与限制',
    'projects.capabilities': '已实现能力',
    'projects.evidence': '证据与实现链接',
    'projects.repository': '主仓库',
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
  if (typeof window === 'undefined') {
    return 'en'
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'zh' ? 'zh' : 'en'
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    setLocaleState(readInitialLocale())
  }, [])

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale)
    window.localStorage.setItem(STORAGE_KEY, nextLocale)
    document.documentElement.lang = localeToHtmlLang(nextLocale)
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'zh' ? 'en' : 'zh')
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
    document.documentElement.lang = localeToHtmlLang(locale)
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
    throw new Error('useLanguage must be used within LanguageProvider')
  }

  return context
}
