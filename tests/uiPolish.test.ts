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
const headerSource = readFileSync('src/components/layout/Header.tsx', 'utf8')
const blogLayoutSource = readFileSync(
  'src/components/layout/BlogLayout.tsx',
  'utf8',
)
const systemsPanelSource = readFileSync(
  'src/components/home/SystemsPanel.tsx',
  'utf8',
)
const globalsSource = readFileSync('src/styles/globals.css', 'utf8')
const englishProfileSource = readFileSync('content/en/profile.yml', 'utf8')
const chineseProfileSource = readFileSync('content/zh/profile.yml', 'utf8')

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

test('keeps supporting work readable without a cramped metadata column', () => {
  assert.equal(
    projectsSource.includes('sm:grid-cols-[12rem_minmax(0,1fr)]'),
    false,
  )
  assert.equal(projectsSource.includes('mt-2 truncate font-mono'), false)
  assert.equal(projectsSource.includes('item.relation'), false)
})

test('uses sans typography for localized labels and mono for machine values', () => {
  assert.match(
    projectsSource,
    /text-xs font-semibold tracking-\[0\.04em\] text-primary/,
  )
  assert.equal(
    projectsSource.includes(
      'font-semibold uppercase tracking-[0.08em] text-primary',
    ),
    false,
  )
  assert.equal(
    projectsSource.includes(
      'shrink-0 font-mono text-xs font-semibold uppercase',
    ),
    false,
  )
  assert.match(aboutSource, /md:grid-cols-\[9rem_12rem_minmax\(0,1fr\)\]/)
})

test('keeps homepage project copy direct without problem-template fields', () => {
  assert.equal(homeSource.includes('work.problem'), false)
  assert.equal(homeSource.includes('problemLabel'), false)
  assert.equal(homeSource.includes('linkLabel'), false)
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

test('uses one shared content rail across every blog article', () => {
  assert.match(blogLayoutSource, /mx-auto w-full max-w-6xl/)
  assert.match(globalsSource, /--blog-content-width: 72rem/)
})

test('keeps blog list navigation available on direct article visits', () => {
  assert.match(blogLayoutSource, /href="\/blogs\/"/)
  assert.equal(blogLayoutSource.includes('previousPathname &&'), false)
})

test('keeps About editorial flow without a duplicate technical path', () => {
  assert.equal(aboutSource.includes('TechnicalPath'), false)
  assert.equal(aboutSource.includes('about.technicalPath'), false)
  assert.equal(aboutSource.includes('about.representativeTitle'), false)
  assert.equal(aboutSource.includes('about.links.map'), false)
  assert.match(aboutSource, /about\.timelineTitle/)
})

test('keeps language controls spacious without a filled active state', () => {
  assert.match(languageToggleSource, /h-10/)
  assert.match(languageToggleSource, /locale === 'en'/)
  assert.match(languageToggleSource, /locale === 'zh'/)
  assert.equal(languageToggleSource.includes('bg-accent-soft'), false)
})

test('keeps the requested HEAD~2 treatment on the header and workspace panel', () => {
  assert.match(globalsSource, /backdrop-filter: blur\(18px\)/)
  assert.match(globalsSource, /mask-image: linear-gradient/)
  assert.match(systemsPanelSource, /motion\.aside/)
  assert.match(systemsPanelSource, /bg-card\/65/)
  assert.equal(systemsPanelSource.includes('backdrop-blur-xl'), false)
  assert.match(headerSource, /bg-gradient-to-r/)
  assert.match(headerSource, /blur-md/)
  assert.match(headerSource, /shadow-\[#4c4f69\]\/5/)
})

test('keeps the workspace company labels concise and the current company prominent', () => {
  assert.match(englishProfileSource, /company: Huawei Data Storage\n/)
  assert.equal(
    englishProfileSource.includes('Data Storage Product Line'),
    false,
  )
  assert.match(chineseProfileSource, /company: 华为数据存储\n/)
  assert.equal(chineseProfileSource.includes('数据存储产品线'), false)
  assert.match(
    systemsPanelSource,
    /text-base font-semibold text-foreground[\s\S]*currentExperience\.company/,
  )
})
