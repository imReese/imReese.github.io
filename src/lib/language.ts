export type Locale = 'en' | 'zh'

export function localeToHtmlLang(locale: Locale) {
  return locale === 'zh' ? 'zh-CN' : 'en'
}
