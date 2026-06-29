
import { experienceHighlights } from "./profileContent"

export type CareerItemType = {
  company: string
  team: string
  title: string
  image?: string
  logo: string
  start: string
  end: string
  highlights: string[]
}

export const careerList: Array<CareerItemType> = experienceHighlights
