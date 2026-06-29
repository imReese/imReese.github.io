import { profileSummary } from "./profileContent"

export * from "./projects"
export * from "./friends"
export * from "./changelog"
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
export const aboutMeHeadline = "I'm Reese, a backend systems engineer based in Beijing, China."
export const aboutParagraphs = profileSummary.aboutParagraphs


// blog
export const blogHeadLine = "Engineering notes and field logs."
export const blogIntro = "Notes about backend systems, SGLang runtime work, cloud-native tooling, AI, programming, and life."


// social links
export type SocialLinkType = {
  name: string,
  ariaLabel?: string,
  icon: string,
  href: string
}

export const socialLinks: Array<SocialLinkType> = [
  {
    name: 'Github',
    icon: 'github',
    href: 'https://github.com/imReese'
  },
  {
    name: 'Wechat',
    icon: 'wechat',
    href: 'https://github.com/imReese/reese-personal-website'
  }
]
