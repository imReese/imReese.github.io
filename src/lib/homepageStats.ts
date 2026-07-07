export type Locale = 'en' | 'zh'

type HomepageStatsPayload = {
  homepage?: {
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

  const pageviews = payload.homepage?.pageviews
  if (
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

export function formatHomepageViewLabel(count: number) {
  return count === 1 ? 'view' : 'views'
}
