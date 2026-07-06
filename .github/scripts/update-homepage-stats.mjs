import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const outputPath = join(repositoryRoot, 'public', 'stats.json')

const apiKey = process.env.PLAUSIBLE_STATS_API_KEY
const siteId = process.env.PLAUSIBLE_SITE_ID
const apiUrl = process.env.PLAUSIBLE_API_URL || 'https://plausible.io'

if (!apiKey || !siteId) {
  console.log(
    'Skipping homepage stats refresh: PLAUSIBLE_STATS_API_KEY and PLAUSIBLE_SITE_ID are required.',
  )
  process.exit(0)
}

const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/v2/query`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    site_id: siteId,
    metrics: ['pageviews', 'visits', 'visitors'],
    date_range: 'all',
    filters: [['is', 'event:page', ['/']]],
  }),
})

if (!response.ok) {
  const errorBody = await response.text()
  throw new Error(
    `Plausible stats request failed with ${response.status}: ${errorBody}`,
  )
}

const payload = await response.json()
const metrics = payload?.results?.[0]?.metrics ?? []
const [pageviews = 0, visits = 0, visitors = 0] = metrics

const stats = {
  homepage: {
    path: '/',
    pageviews: Number.isFinite(pageviews) ? pageviews : 0,
    visits: Number.isFinite(visits) ? visits : 0,
    visitors: Number.isFinite(visitors) ? visitors : 0,
    source: 'plausible',
    updatedAt: new Date().toISOString(),
  },
}

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(stats, null, 2)}\n`)

console.log(`Wrote homepage stats to ${outputPath}`)
