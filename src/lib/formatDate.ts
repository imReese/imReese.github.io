export function formatDate(dateString: string, locale?: 'en' | 'zh') {
  if (!locale) {
    return dateString
  }

  if (locale === 'zh') {
    const [year, month, day] = dateString.split('-')
    return `${year}年${Number(month)}月${Number(day)}日`
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${dateString}T00:00:00`))
}
