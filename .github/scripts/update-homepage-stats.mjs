import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const outputPath = join(repositoryRoot, 'public', 'stats.json')

const siteUrl = process.env.GOATCOUNTER_URL

if (!siteUrl) {
  throw new Error('GOATCOUNTER_URL is required to refresh site stats.')
}

const endAt = Date.now()
const response = await fetch(`${siteUrl.replace(/\/$/, '')}/counter/TOTAL.json`, {
  headers: {
    Accept: 'application/json',
  },
})

if (!response.ok) {
  const errorBody = await response.text()
  throw new Error(
    `GoatCounter total counter request failed with ${response.status}: ${errorBody}`,
  )
}

const payload = await response.json()
const rawCount = payload?.count
const normalizedCount =
  typeof rawCount === 'string' ? rawCount.replaceAll(',', '') : rawCount
const pageviews =
  typeof normalizedCount === 'string' && /^\d+$/.test(normalizedCount)
    ? Number(normalizedCount)
    : normalizedCount

if (!Number.isSafeInteger(pageviews) || pageviews < 0) {
  throw new Error('GoatCounter response did not include a valid total count.')
}

const stats = {
  homepage: {
    scope: 'site',
    pageviews,
    source: 'goatcounter',
    updatedAt: new Date(endAt).toISOString(),
  },
}

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(stats, null, 2)}\n`)

console.log(`Wrote site stats to ${outputPath}`)
