import { type Metadata } from 'next'

import { AboutContent } from '@/components/about/AboutContent'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'About',
  description:
    'Reese’s engineering path from distributed storage and CPU workload analysis to LLM inference runtimes, KV cache systems, and transfer infrastructure.',
  path: '/about/',
})

export default function About() {
  return <AboutContent />
}
