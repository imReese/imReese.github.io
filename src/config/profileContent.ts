import { profileContent, projectsContent, siteContent } from './content'

export type ProfileSummary = {
  name: string
  headline: string
  introduction: string
  location: string
  email: string
  githubUsername: string
  focusAreas: string[]
  aboutParagraphs: string[]
}

export type CurrentFocus = {
  eyebrow: string
  title: string
  summary: string
  bullets: string[]
  links: Array<{ label: string; href: string }>
}

export type ResearchArea = {
  title: string
  label: string
  description: string
  points: string[]
  tags: string[]
}

export type ExperienceHighlight = {
  company: string
  team: string
  title: string
  start: string
  end: string
  logo: string
  highlights: string[]
}

export type EducationHighlight = {
  school: string
  major: string
  start: string
  end: string
  logo: string
  details: string[]
}

export type ProjectHighlight = {
  name: string
  description: string
  href: string
  label: string
  tags: string[]
}

export const profileSummary: ProfileSummary = {
  ...siteContent.site,
  focusAreas: profileContent.focusAreas,
  aboutParagraphs: profileContent.aboutParagraphs,
}

export const currentFocus: CurrentFocus = profileContent.currentFocus
export const researchAreas: ResearchArea[] = profileContent.researchAreas
export const experienceHighlights: ExperienceHighlight[] =
  profileContent.experience
export const educationHighlights: EducationHighlight[] =
  profileContent.education
export const projectHighlights: ProjectHighlight[] = projectsContent.items
