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

test('keeps the homepage system map accessible and removes entrance fading', () => {
  assert.match(homeSource, /role="img"/)
  assert.match(homeSource, /aria-label=/)
  assert.match(homeSource, /md:grid-cols-4/)
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
  assert.match(blogsSource, /\.slice\(0, 3\)/)
  assert.match(blogsSource, /params\.set\('series', series\)/)
  assert.match(blogsSource, /searchParams\.get\('series'\)/)
})

test('renders the About technical path from localized content', () => {
  assert.match(aboutSource, /TechnicalPath/)
  assert.match(aboutSource, /about\.technicalPath/)
  assert.match(aboutSource, /md:grid-cols-4/)
})
