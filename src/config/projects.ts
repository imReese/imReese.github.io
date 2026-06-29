import { projectHighlights } from "./profileContent"

export const projectHeadLine = "Systems Projects"
export const projectIntro = "SGLang runtime work, backend systems, and practical tooling."

export type ProjectItemType = {
  name: string
  description: string
  link: { href: string, label: string }
  date?: string
  logo?: string,
  category?: string[],
  tags?: string[],
  image?: string,
  techStack?: string[],
  gitStars?: number,
  gitForks?: number
}

export const projects: Array<ProjectItemType> = projectHighlights.map((project) => ({
  name: project.name,
  description: project.description,
  link: { href: project.href.replace(/^https?:\/\//, ""), label: project.label },
  tags: project.tags,
}))

export const githubProjects: Array<ProjectItemType> = []
