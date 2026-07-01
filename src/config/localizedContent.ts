import {
  contentByLocale,
  type BlogPageContent,
  type FriendsContent,
  type HomePageContent,
  type LocaleContent,
  type ProfileContent,
  type ProjectsContent,
  type ProjectsPageContent,
  type SiteContent,
} from './content'

export type Locale = 'en' | 'zh'

export type LocalizedPageContent = {
  site: SiteContent['site']
  about: LocaleContent['pages']['about']
  profile: ProfileContent
  projects: ProjectsContent
  projectsPage: ProjectsPageContent
  blogPage: BlogPageContent
  friends: FriendsContent
  home: HomePageContent
}

function toLocalizedPageContent(content: LocaleContent): LocalizedPageContent {
  return {
    site: content.site.site,
    about: content.pages.about,
    profile: content.profile,
    projects: content.projects,
    projectsPage: content.pages.projectsPage,
    blogPage: content.pages.blogPage,
    friends: content.pages.friends,
    home: content.pages.home,
  }
}

export const pageContentByLocale: Record<Locale, LocalizedPageContent> = {
  en: toLocalizedPageContent(contentByLocale.en),
  zh: toLocalizedPageContent(contentByLocale.zh),
}
