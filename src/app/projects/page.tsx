import { type Metadata } from 'next'

import { ProjectsPageContent } from '@/components/project/ProjectsPageContent'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Projects',
  description:
    'Verifiable systems work across the SGLang Rust runtime, NexusKV, and Mooncake / HiCache source analysis, with status and evidence links.',
  path: '/projects/',
})

export default function Projects() {
  return <ProjectsPageContent />
}
