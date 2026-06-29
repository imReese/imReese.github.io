
import { educationHighlights } from "./profileContent"

export type EducationItemType = {
  school: string
  major: string
  image?: string
  logo: string
  start: string
  end: string
  details: string[]
}

export const educationList: Array<EducationItemType> = educationHighlights
