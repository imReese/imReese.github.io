import { siteContent } from "./content"
import { profileSummary } from "./profileContent"

export * from "./projects"
export * from "./friends"
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
export const aboutMeHeadline = siteContent.about.headline
export const aboutParagraphs = profileSummary.aboutParagraphs


// blog
export const blogHeadLine = siteContent.blog.headline
export const blogIntro = siteContent.blog.intro


// social links
export type SocialLinkType = {
  name: string,
  ariaLabel?: string,
  icon: string,
  href: string
}

export const socialLinks: Array<SocialLinkType> = siteContent.socialLinks
