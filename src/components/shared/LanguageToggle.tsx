"use client"

import { Languages } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/shared/LanguageProvider"

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, toggleLocale, t } = useLanguage()

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={toggleLocale}
      aria-label={t("common.switchLanguage")}
      className={cn("h-9 rounded-md px-2.5 text-xs font-semibold", className)}
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      <span className={cn(locale === "en" ? "text-primary" : "text-muted-foreground")}>
        EN
      </span>
      <span className="text-muted-foreground/50">/</span>
      <span className={cn(locale === "zh" ? "text-primary" : "text-muted-foreground")}>
        中
      </span>
    </Button>
  )
}
