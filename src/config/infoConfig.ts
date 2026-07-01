import { pagesContent, siteContent } from "./content"
import { profileSummary } from "./profileContent"

export * from "./projects"
export * from "./education"
export * from "./career"
export * from "./activity"
export * from "./profileContent"


// personal info
export const name = profileSummary.name
export const headline = profileSummary.headline
export const introduction = profileSummary.introduction
export const email = profileSummary.email
export const githubUsername = profileSummary.githubUsername

// about page
export const aboutMeHeadline = pagesContent.about.headline
export const aboutParagraphs = profileSummary.aboutParagraphs


// blog
export const blogHeadLine = pagesContent.blogPage.headline
export const blogIntro = pagesContent.blogPage.intro


// social links
export type SocialLinkType = {
  name: string,
  ariaLabel?: string,
  icon: string,
  href: string
}

export const socialLinks: Array<SocialLinkType> = siteContent.socialLinks
