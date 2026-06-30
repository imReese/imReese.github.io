"use client"

import { pageContentByLocale } from '@/config/localizedContent'
import { useLanguage } from '@/components/shared/LanguageProvider'

export function useLocalizedContent() {
  const { locale } = useLanguage()

  return pageContentByLocale[locale] ?? pageContentByLocale.en
}
