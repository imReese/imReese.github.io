export type Locale = 'en' | 'zh'

type GoatCounterPayload = {
  count?: unknown
}

function isGoatCounterPayload(value: unknown): value is GoatCounterPayload {
  return typeof value === 'object' && value !== null
}

export function getGoatCounterViewCount(payload: unknown) {
  if (!isGoatCounterPayload(payload)) {
    return null
  }

  const rawCount = payload.count
  let count: unknown = rawCount

  if (typeof rawCount === 'string') {
    const normalizedCount = rawCount.replace(/[,\s._'’]/gu, '')
    if (!/^\d+$/.test(normalizedCount)) {
      return null
    }
    count = Number(normalizedCount)
  }

  if (typeof count !== 'number' || !Number.isSafeInteger(count) || count < 0) {
    return null
  }

  return count
}

export function formatHomepageViewCount(count: number, locale: Locale) {
  return new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US').format(
    count,
  )
}

export function formatHomepageViewText(count: number, locale: Locale) {
  const formattedCount = formatHomepageViewCount(count, locale)

  return locale === 'zh'
    ? `本站浏览 ${formattedCount} 次`
    : `${formattedCount} site views`
}
