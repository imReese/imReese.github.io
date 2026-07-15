'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/shared/LanguageProvider'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const { t } = useLanguage()

  const toggleTheme = () => {
    // 直接在light和dark之间切换，跳过system
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    // console.log('切换主题:', newTheme)
    setTheme(newTheme)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={t('common.toggleTheme')}
      className="relative"
    >
      <Sun className="h-[1.125rem] w-[1.125rem] rotate-0 scale-100 transition-transform duration-150 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.125rem] w-[1.125rem] rotate-90 scale-0 transition-transform duration-150 dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
