export function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href)
}

export function withUtmSource(href: string, source?: string) {
  const normalizedSource = source?.trim()

  if (!isExternalHref(href) || !normalizedSource) {
    return href
  }

  const url = new URL(href)
  url.searchParams.set('utm_source', normalizedSource)
  return url.toString()
}

export function normalizeExternalHref(href: string) {
  return isExternalHref(href) ? href : `https://${href}`
}
