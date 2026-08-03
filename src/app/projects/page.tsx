import { type Metadata } from 'next'

import { ProjectsPageContent } from '@/components/project/ProjectsPageContent'
import { contentByLocale } from '@/config/content'
import { createPageMetadata } from '@/lib/seo'

const projectsMetadata = contentByLocale.en.pages.metadata.projects

export const metadata: Metadata = createPageMetadata({
  title: projectsMetadata.title,
  description: projectsMetadata.description,
  path: '/projects/',
})

export default function Projects() {
  return <ProjectsPageContent />
}
