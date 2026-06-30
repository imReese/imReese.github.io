import { parse } from 'yaml'

import friendsYaml from '../../content/friends.yml'
import pagesZhYaml from '../../content/pages.zh.yml'
import profileYaml from '../../content/profile.yml'
import projectsYaml from '../../content/projects.yml'
import siteYaml from '../../content/site.yml'

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
  about: {
    headline: string
  }
  blog: {
    headline: string
    intro: string
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
  items: Array<{
    name: string
    description: string
    href: string
    label: string
    tags: string[]
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

export type FriendsContent = {
  headline: string
  intro: string
  items: Array<{
    name: string
    description?: string
    link: { href: string; label?: string }
    logo?: string
  }>
}

function loadYamlContent<T>(source: string, label: string): T {
  const content = parse(source)

  if (!content || typeof content !== 'object') {
    throw new Error(`${label} must contain a YAML object`)
  }

  return content as T
}

export const siteContent = loadYamlContent<SiteContent>(siteYaml, 'content/site.yml')
export const profileContent = loadYamlContent<ProfileContent>(profileYaml, 'content/profile.yml')
export const projectsContent = loadYamlContent<ProjectsContent>(projectsYaml, 'content/projects.yml')
export const friendsContent = loadYamlContent<FriendsContent>(friendsYaml, 'content/friends.yml')
export const pagesZhContent = loadYamlContent<Record<string, unknown>>(pagesZhYaml, 'content/pages.zh.yml')
