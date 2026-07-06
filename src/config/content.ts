import { parse } from 'yaml'

import pagesEnYaml from '../../content/en/pages.yml'
import profileEnYaml from '../../content/en/profile.yml'
import projectsEnYaml from '../../content/en/projects.yml'
import siteEnYaml from '../../content/en/site.yml'
import pagesZhYaml from '../../content/zh/pages.yml'
import profileZhYaml from '../../content/zh/profile.yml'
import projectsZhYaml from '../../content/zh/projects.yml'
import siteZhYaml from '../../content/zh/site.yml'

export type NavItemContent = {
  name: string
  href: string
}

export type SiteContent = {
  site: {
    name: string
    headline: string
    introduction: string
    location: string
    email: string
    githubUsername: string
  }
  activity: {
    headline: string
    intro: string
    tweetIds: string[]
  }
  navigation: {
    header: NavItemContent[]
    footer: NavItemContent[]
  }
  socialLinks: Array<{
    name: string
    ariaLabel?: string
    icon: string
    href: string
  }>
}

export type SystemsPanelExperience = {
  period: string
  organization: string
  summary: string
  current?: boolean
  details?: string[]
}

export type HomePageContent = {
  hero: {
    viewProjects: string
    readNotes: string
  }
  systemsPanel: {
    workspaceTitle: string
    workspaceSubtitle: string
    location: string
    sectionTitle: string
    current: string
    experiences: SystemsPanelExperience[]
  }
  experienceStack: {
    eyebrow: string
    title: string
    aboutLink: string
    educationPrefix: string
    technicalEyebrow: string
    technicalTitle: string
    technicalIntro: string
    currentEmphasisLabel: string
    currentEmphasis: string
    engineeringHabitLabel: string
    engineeringHabit: string
  }
  notes: {
    title: string
    intro: string
    allNotes: string
    empty: string
  }
}

export type ProjectsPageContent = {
  githubActivityTitle: string
  githubActivityIntro: string
  githubProfileLink: string
}

export type BlogPageContent = {
  headline: string
  intro: string
  readBlog: string
  categories: Record<string, string>
  article: {
    backToBlogs: string
    descriptionLabel: string
  }
  sections: {
    featuredTitle: string
    featuredIntro: string
    recentTitle: string
    recentIntro: string
    notesTitle: string
    notesIntro: string
    archiveTitle: string
    archiveIntro: string
  }
  readingMap: {
    title: string
    intro: string
    latestLabel: string
    archiveLabel: string
    topicsLabel: string
    noteSingular: string
    notePlural: string
    clearFilter: string
    emptyFilter: string
    topics: Array<{
      label: string
      value: string
    }>
  }
}

export type ProfileContent = {
  focusAreas: string[]
  aboutParagraphs: string[]
  currentFocus: {
    eyebrow: string
    title: string
    summary: string
    bullets: string[]
    links: Array<{ label: string; href: string }>
  }
  researchAreas: Array<{
    title: string
    label: string
    description: string
    points: string[]
    tags: string[]
  }>
  impactStats: Array<{
    value: string
    label: string
    detail: string
  }>
  experience: Array<{
    company: string
    team: string
    title: string
    start: string
    end: string
    logo: string
    highlights: string[]
  }>
  education: Array<{
    school: string
    major: string
    start: string
    end: string
    logo: string
    details: string[]
  }>
  stackGroups: Array<{
    title: string
    items: string[]
  }>
}

export type ProjectsContent = {
  headline: string
  intro: string
  overview?: Array<{
    label: string
    value: string
    description: string
  }>
  focus?: {
    title: string
    intro: string
    items: Array<{
      title: string
      description: string
      tags: string[]
    }>
  }
  items: Array<{
    name: string
    description: string
    href: string
    label: string
    tags: string[]
  }>
  workSections?: Array<{
    title: string
    intro: string
    items: Array<{
      name: string
      description: string
      href: string
      label: string
      tags: string[]
    }>
  }>
  githubItems: Array<{
    name: string
    description: string
    link: { href: string; label: string }
    date?: string
    logo?: string
    category?: string[]
    tags?: string[]
    image?: string
    techStack?: string[]
    gitStars?: number
    gitForks?: number
  }>
}

export type PagesContent = {
  about: {
    headline: string
  }
  home: HomePageContent
  projectsPage: ProjectsPageContent
  blogPage: BlogPageContent
}

export type LocaleContent = {
  site: SiteContent
  profile: ProfileContent
  projects: ProjectsContent
  pages: PagesContent
}

function loadYamlContent<T>(source: string, label: string): T {
  const content = parse(source)

  if (!content || typeof content !== 'object') {
    throw new Error(`${label} must contain a YAML object`)
  }

  return content as T
}

export const contentByLocale = {
  en: {
    site: loadYamlContent<SiteContent>(siteEnYaml, 'content/en/site.yml'),
    profile: loadYamlContent<ProfileContent>(profileEnYaml, 'content/en/profile.yml'),
    projects: loadYamlContent<ProjectsContent>(projectsEnYaml, 'content/en/projects.yml'),
    pages: loadYamlContent<PagesContent>(pagesEnYaml, 'content/en/pages.yml'),
  },
  zh: {
    site: loadYamlContent<SiteContent>(siteZhYaml, 'content/zh/site.yml'),
    profile: loadYamlContent<ProfileContent>(profileZhYaml, 'content/zh/profile.yml'),
    projects: loadYamlContent<ProjectsContent>(projectsZhYaml, 'content/zh/projects.yml'),
    pages: loadYamlContent<PagesContent>(pagesZhYaml, 'content/zh/pages.yml'),
  },
} satisfies Record<string, LocaleContent>

export const siteContent = contentByLocale.en.site
export const profileContent = contentByLocale.en.profile
export const projectsContent = contentByLocale.en.projects
export const pagesContent = contentByLocale.en.pages
