export * from "./projects"
export * from "./friends"
export * from "./changelog"
export * from "./education"
export * from "./career"
export * from "./activity"


// personal info
export const name = "Reese"
export const headline = "Backend systems for cloud-native products."
export const introduction = "I'm Reese, a Shenzhen-based software engineer focused on reliable backend services, Linux tooling, and cloud-native infrastructure."
export const email = "reese_duan@outlook.com"
export const githubUsername = "imReese"

// about page
export const aboutMeHeadline = "I'm Reese, a backend/cloud-native engineer based in Shenzhen, China."
export const aboutParagraphs = [
  "I like building reliable backend services, learning how systems fail, and turning practical engineering work into useful notes.",
  "My day-to-day interests sit around Linux, distributed systems, cloud-native infrastructure, observability, and the tools that keep products running.",
  "Outside of coding, I enjoy travelling, photography, movies, and music."
]


// blog
export const blogHeadLine = "Engineering notes and field logs."
export const blogIntro = "Notes about backend systems, cloud-native tooling, AI, programming, and life."


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

// https://simpleicons.org/
export const techIcons = [
  "go",
  "python",
  "c",
  "cplusplus",
  "linux",
  "kubernetes",
  "docker",
  "redis",
  "mysql",
  "nginx",
  "prometheus",
  "grafana",
  "cmake",
  "gnubash",
  "git",
  "githubactions",
  "typescript",
  "react",
  "nextdotjs",
  "vercel",
  "visualstudiocode",
  "vim"
];

