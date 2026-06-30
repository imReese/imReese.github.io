import {
  friendsContent,
  pagesZhContent,
  profileContent,
  projectsContent,
  siteContent,
  type FriendsContent,
  type ProfileContent,
  type ProjectsContent,
  type SiteContent,
} from './content'

export type Locale = 'en' | 'zh'

export type SystemsPanelExperience = {
  period: string
  organization: string
  summary: string
  current?: boolean
  details?: string[]
}

export type HomePageContent = {
  hero: {
    viewProjects: string
    readNotes: string
  }
  systemsPanel: {
    workspaceTitle: string
    workspaceSubtitle: string
    location: string
    sectionTitle: string
    current: string
    experiences: SystemsPanelExperience[]
  }
  experienceStack: {
    eyebrow: string
    title: string
    aboutLink: string
    educationPrefix: string
    technicalEyebrow: string
    technicalTitle: string
    technicalIntro: string
    currentEmphasisLabel: string
    currentEmphasis: string
    engineeringHabitLabel: string
    engineeringHabit: string
  }
  notes: {
    title: string
    intro: string
    allNotes: string
    empty: string
  }
}

export type ProjectsPageContent = {
  githubActivityTitle: string
  githubActivityIntro: string
  githubProfileLink: string
}

export type BlogPageContent = {
  headline: string
  intro: string
  readBlog: string
}

export type LocalizedPageContent = {
  site: SiteContent['site']
  about: SiteContent['about']
  profile: ProfileContent
  projects: ProjectsContent
  projectsPage: ProjectsPageContent
  blogPage: BlogPageContent
  friends: FriendsContent
  home: HomePageContent
}

const homeContentEn: HomePageContent = {
  hero: {
    viewProjects: 'View projects',
    readNotes: 'Read notes',
  },
  systemsPanel: {
    workspaceTitle: "Reese's workspace",
    workspaceSubtitle: 'Inference systems and backend performance',
    location: 'Beijing',
    sectionTitle: 'Experience',
    current: 'Current',
    experiences: [
      {
        period: '2025.06 - Now',
        organization: 'Baidu AI Computing',
        summary: 'Inference engine performance for large-model serving.',
        current: true,
        details: [
          'Serving runtime: SGLang scheduler boundaries and prefill/decode paths',
          'Memory and transfer: cache/KV residency and Mooncake TE readiness',
          'Backend tuning across heterogeneous accelerator paths',
        ],
      },
      {
        period: '2023',
        organization: 'Huawei Cloud',
        summary: 'CPU architecture performance analysis.',
      },
      {
        period: '2022',
        organization: 'Huawei Data Storage',
        summary: 'Distributed systems engineering.',
      },
    ],
  },
  experienceStack: {
    eyebrow: 'Experience & education',
    title: 'Systems work from storage to LLM serving',
    aboutLink: 'About',
    educationPrefix: 'Details',
    technicalEyebrow: 'Technical stack',
    technicalTitle: 'Tools around inference and systems debugging',
    technicalIntro:
      'A compact view of the runtime, memory, backend, and infrastructure tools I use when tracing serving systems.',
    currentEmphasisLabel: 'Current emphasis',
    currentEmphasis:
      'SGLang runtime paths, KV-cache behavior, Mooncake TE boundaries, and accelerator backend tuning.',
    engineeringHabitLabel: 'Engineering habit',
    engineeringHabit:
      'measure the path, reduce hidden state, and keep production behavior observable.',
  },
  notes: {
    title: 'Engineering notes',
    intro:
      'Short notes on backend systems, cloud-native tools, and the occasional life log.',
    allNotes: 'All notes',
    empty:
      'Notes are warming up. The archive is ready when the first field log lands.',
  },
}

const projectsPageContentEn: ProjectsPageContent = {
  githubActivityTitle: 'GitHub activity',
  githubActivityIntro:
    'A rolling snapshot of my contribution rhythm across backend systems, runtime experiments, and open-source notes.',
  githubProfileLink: 'View GitHub profile',
}

const blogPageContentEn: BlogPageContent = {
  headline: siteContent.blog.headline,
  intro: siteContent.blog.intro,
  readBlog: 'Read blog',
}

const pageContentEn: LocalizedPageContent = {
  site: siteContent.site,
  about: siteContent.about,
  profile: profileContent,
  projects: projectsContent,
  projectsPage: projectsPageContentEn,
  blogPage: blogPageContentEn,
  friends: friendsContent,
  home: homeContentEn,
}

const zh = pagesZhContent as Partial<LocalizedPageContent>

const pageContentZh: LocalizedPageContent = {
  site: { ...pageContentEn.site, ...zh.site },
  about: { ...pageContentEn.about, ...zh.about },
  profile: { ...pageContentEn.profile, ...zh.profile },
  projects: { ...pageContentEn.projects, ...zh.projects },
  projectsPage: { ...pageContentEn.projectsPage, ...zh.projectsPage },
  blogPage: { ...pageContentEn.blogPage, ...zh.blogPage },
  friends: { ...pageContentEn.friends, ...zh.friends },
  home: {
    hero: { ...pageContentEn.home.hero, ...zh.home?.hero },
    systemsPanel: {
      ...pageContentEn.home.systemsPanel,
      ...zh.home?.systemsPanel,
    },
    experienceStack: {
      ...pageContentEn.home.experienceStack,
      ...zh.home?.experienceStack,
    },
    notes: { ...pageContentEn.home.notes, ...zh.home?.notes },
  },
}

export const pageContentByLocale: Record<Locale, LocalizedPageContent> = {
  en: pageContentEn,
  zh: pageContentZh,
}
