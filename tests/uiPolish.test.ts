import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const themeSource = readFileSync('src/styles/theme.css', 'utf8')
const homeSource = readFileSync(
  'src/components/home/OpenSourcePulse.tsx',
  'utf8',
)
const projectsSource = readFileSync(
  'src/components/project/ProjectsPageContent.tsx',
  'utf8',
)
const blogsSource = readFileSync(
  'src/components/blog/BlogsPageContent.tsx',
  'utf8',
)
const aboutSource = readFileSync(
  'src/components/about/AboutContent.tsx',
  'utf8',
)
const languageToggleSource = readFileSync(
  'src/components/shared/LanguageToggle.tsx',
  'utf8',
)

test('defines the required semantic Catppuccin tokens for both themes', () => {
  const tokens = [
    'background',
    'surface',
    'surface-elevated',
    'border',
    'foreground',
    'muted-foreground',
    'subtle-foreground',
    'accent',
    'accent-hover',
    'accent-soft',
    'success',
    'focus-ring',
    'code-background',
  ]

  for (const token of tokens) {
    const occurrences = themeSource.match(new RegExp(`--${token}:`, 'g')) ?? []
    assert.equal(
      occurrences.length,
      2,
      `${token} must exist in Latte and Mocha`,
    )
  }
})

test('keeps the homepage editorial two-column layout without a system map', () => {
  assert.match(homeSource, /lg:grid-cols-\[0\.82fr_1\.18fr\]/)
  assert.match(homeSource, /sm:grid-cols-\[2\.5rem_11rem_minmax\(0,1fr\)\]/)
  assert.equal(homeSource.includes('SystemBoundaryMap'), false)
  assert.equal(homeSource.includes('framer-motion'), false)
})

test('keeps project limits visible while evidence uses native disclosure', () => {
  assert.match(projectsSource, /<details/)
  assert.match(projectsSource, /<summary/)
  assert.match(projectsSource, /t\('projects\.scope'\)/)
  assert.match(projectsSource, /t\('projects\.capabilities'\)/)
  assert.match(projectsSource, /compact/)
})

test('limits blog card metadata without changing filter parameters', () => {
  const seriesNavigation = blogsSource.slice(
    blogsSource.indexOf('function SeriesNavigation'),
    blogsSource.indexOf('function BlogsPageContentView'),
  )

  assert.match(blogsSource, /\.slice\(0, 3\)/)
  assert.match(blogsSource, /params\.set\('series', series\)/)
  assert.match(blogsSource, /searchParams\.get\('series'\)/)
  assert.match(seriesNavigation, /lg:grid-cols-3/)
  assert.equal(seriesNavigation.includes('bg-surface'), false)
  assert.equal(seriesNavigation.includes('border-l'), false)
})

test('keeps About editorial flow without a duplicate technical path', () => {
  assert.equal(aboutSource.includes('TechnicalPath'), false)
  assert.equal(aboutSource.includes('about.technicalPath'), false)
  assert.match(aboutSource, /about\.timelineTitle/)
})

test('keeps language controls spacious without a filled active state', () => {
  assert.match(languageToggleSource, /h-10/)
  assert.match(languageToggleSource, /locale === 'en'/)
  assert.match(languageToggleSource, /locale === 'zh'/)
  assert.equal(languageToggleSource.includes('bg-accent-soft'), false)
})
