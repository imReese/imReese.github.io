import { type Metadata } from 'next'

import { ProjectsPageContent } from '@/components/project/ProjectsPageContent'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Projects',
  description:
    'Projects and code walkthroughs on SGLang, NexusKV, Mooncake, HiCache, KV cache management, and LLM serving systems.',
  path: '/projects/',
})

export default function Projects() {
  return <ProjectsPageContent />
}
