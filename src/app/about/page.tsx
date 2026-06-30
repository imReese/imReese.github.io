import { type Metadata } from "next"

import { AboutContent } from "@/components/about/AboutContent"
import { aboutMeHeadline } from "@/config/infoConfig"

export const metadata: Metadata = {
  title: 'About',
  description: aboutMeHeadline,
}

export default function About() {
  return <AboutContent />
}
