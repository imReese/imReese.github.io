export type Locale = 'en' | 'zh'

type HomepageStatsPayload = {
  homepage?: {
    scope?: unknown
    pageviews?: unknown
  }
}

function isHomepageStatsPayload(value: unknown): value is HomepageStatsPayload {
  return typeof value === 'object' && value !== null
}

export function getHomepageViewCount(payload: unknown) {
  if (!isHomepageStatsPayload(payload)) {
    return null
  }

  const scope = payload.homepage?.scope
  const pageviews = payload.homepage?.pageviews
  if (
    scope !== 'site' ||
    typeof pageviews !== 'number' ||
    !Number.isInteger(pageviews) ||
    pageviews < 0
  ) {
    return null
  }

  return pageviews
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
