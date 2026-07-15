type BlogLike = {
  [key: string]: unknown
  category?: string
  series?: string
  topics?: string[]
}

type CategoryLabels = Record<string, string>
type SeriesLabels = Record<string, string>
type ReadingMap = {
  topics: Array<{ label: string; value: string }>
}

export type BlogMetaChip = {
  key: string
  label: string
}

function getCategoryLabel(
  category: string | undefined,
  labels: CategoryLabels,
) {
  return category ? (labels[category] ?? category) : labels.fallback
}

export function getTopicLabel(topic: string, copy: ReadingMap) {
  return copy.topics.find((item) => item.value === topic)?.label ?? topic
}

function getSeriesLabel(series: string, labels: SeriesLabels) {
  return labels[series] ?? series
}

export function getBlogMetaChips(
  blog: BlogLike,
  categoryLabels: CategoryLabels,
  seriesLabels: SeriesLabels,
  readingMap: ReadingMap,
  topicLimit = 2,
) {
  const candidates: BlogMetaChip[] = [
    {
      key: `category:${blog.category ?? 'fallback'}`,
      label: getCategoryLabel(blog.category, categoryLabels),
    },
    ...(blog.series
      ? [
          {
            key: `series:${blog.series}`,
            label: getSeriesLabel(blog.series, seriesLabels),
          },
        ]
      : []),
    ...(blog.topics ?? []).slice(0, topicLimit).map((topic) => ({
      key: `topic:${topic}`,
      label: getTopicLabel(topic, readingMap),
    })),
  ]

  const seen = new Set<string>()

  return candidates.filter((chip) => {
    const normalized = chip.label.trim().toLocaleLowerCase()
    if (!normalized || seen.has(normalized)) {
      return false
    }

    seen.add(normalized)
    return true
  })
}

export function matchesSeriesGroup(blog: BlogLike, series: string | null) {
  if (!series) {
    return true
  }

  switch (series) {
    case 'sglang-runtime':
      return blog.series === 'SGLang Runtime Notes'
    case 'mooncake-hicache':
      return blog.series === 'Mooncake / HiCache Internals'
    case 'kv-cache-systems':
      return (blog.topics ?? []).includes('kv-cache')
    case 'performance-engineering':
      return (blog.topics ?? []).includes('performance')
    case 'distributed-storage':
      return (blog.topics ?? []).some((topic) =>
        ['distributed-systems', 'storage-systems'].includes(topic),
      )
    case 'runbooks':
      return blog.category === 'runbooks'
    default:
      return false
  }
}
