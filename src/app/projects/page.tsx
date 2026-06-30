import { type Metadata } from 'next'

import { ProjectsPageContent } from '@/components/project/ProjectsPageContent'
import { projectHeadLine } from '@/config/infoConfig'

export const metadata: Metadata = {
  title: 'Projects',
  description: projectHeadLine,
}

export default function Projects() {
  return <ProjectsPageContent />
}
