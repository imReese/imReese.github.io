# Profile Content Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the personal site and GitHub profile README into a content-driven professional profile centered on Reese's current SGLang Rust runtime work.

**Architecture:** Add a single typed content source in the Next.js site, then have the homepage, profile metadata, project list, career list, and education list read from that source. Keep the visual redesign intact and only update the content surface plus small layout pieces needed to present the richer profile. Rewrite the GitHub profile README as a concise public-facing summary that mirrors the same public facts without exposing phone or private resume details.

**Tech Stack:** Next.js App Router, TypeScript, React, Tailwind CSS, Framer Motion, lucide-react, GitHub Profile README Markdown.

---

## File Structure

- Create `imReese.github.io/src/config/profileContent.ts`: one editable template-like content file with Reese's profile summary, SGLang focus, experience highlights, project highlights, education summary, impact stats, and stack groups.
- Modify `imReese.github.io/src/config/infoConfig.ts`: re-export `profileContent`, use the shared profile summary for headline/introduction/about text/email/GitHub username, and keep global site consumers stable.
- Modify `imReese.github.io/src/config/career.ts`: replace placeholder company data with Huawei Cloud and Huawei Data Storage entries sourced from resume facts.
- Modify `imReese.github.io/src/config/education.ts`: replace placeholder school data with Nanjing University education facts.
- Modify `imReese.github.io/src/config/projects.ts`: add SGLang Rust Runtime, Lightweight C++ Web Server, and LeetCode Automation Manager as editable project entries.
- Modify `imReese.github.io/src/components/home/ElegantIntro.tsx`: import focus chips from `profileContent` instead of a hard-coded local list.
- Modify `imReese.github.io/src/components/home/SystemsPanel.tsx`: make the right-side systems panel reflect SGLang runtime, router, scheduler, KV transfer, and kernel backend boundaries.
- Modify `imReese.github.io/src/components/home/OpenSourcePulse.tsx`: make the activity card a current-focus block for SGLang while preserving the GitHub snake visual.
- Modify `imReese.github.io/src/components/home/AnimatedCareer.tsx`: display role-specific resume highlights from the typed career config.
- Modify `imReese.github.io/src/components/home/AnimatedEducation.tsx`: display coursework/foundation details from the typed education config.
- Modify `imReese.github.io/src/app/page.tsx`: keep the existing section order, update stack labels from shared content, and preserve the call-to-action.
- Modify `imReese/README.md`: rewrite the GitHub profile README with SGLang current focus, systems background, selected work, skill icons, contact badges, and contribution snake.

---

### Task 1: Add Shared Profile Content

**Files:**
- Create: `imReese.github.io/src/config/profileContent.ts`
- Modify: `imReese.github.io/src/config/infoConfig.ts`

- [ ] **Step 1: Create the content template**

Create `imReese.github.io/src/config/profileContent.ts` with these typed exports:

```ts
export type ProfileSummary = {
  name: string
  headline: string
  introduction: string
  location: string
  email: string
  githubUsername: string
  focusAreas: string[]
  aboutParagraphs: string[]
}

export type CurrentFocus = {
  eyebrow: string
  title: string
  summary: string
  bullets: string[]
  links: Array<{ label: string; href: string }>
}

export type ImpactStat = {
  value: string
  label: string
  detail: string
}

export type ExperienceHighlight = {
  company: string
  team: string
  title: string
  start: string
  end: string
  logo: string
  highlights: string[]
}

export type EducationHighlight = {
  school: string
  major: string
  start: string
  end: string
  logo: string
  details: string[]
}

export type ProjectHighlight = {
  name: string
  description: string
  href: string
  label: string
  tags: string[]
}

export type StackGroup = {
  title: string
  items: string[]
}

export const profileSummary: ProfileSummary = {
  name: "Reese",
  headline: "Backend systems for LLM serving and cloud-native products.",
  introduction:
    "I'm Reese, a Shenzhen-based systems engineer building Rust runtime infrastructure for SGLang, with production experience across distributed storage, Linux tooling, and CPU performance analysis.",
  location: "Shenzhen, China",
  email: "reese_duan@outlook.com",
  githubUsername: "imReese",
  focusAreas: ["SGLang", "Rust Runtime", "PD Disaggregation", "Backend Systems", "Cloud Native", "Linux"],
  aboutParagraphs: [
    "I build backend systems where reliability, performance, and operational clarity matter.",
    "My recent work focuses on SGLang's Rust runtime direction: request lifecycle, scheduler/router boundaries, gRPC protocols, tokenization edges, and PD-style KV transfer planning.",
    "Before that I worked on distributed storage cluster management and CPU microarchitecture performance analysis at Huawei, which shaped how I debug systems from product behavior down to instruction-level traces.",
  ],
}

export const currentFocus: CurrentFocus = {
  eyebrow: "Current focus",
  title: "SGLang Rust runtime infrastructure",
  summary:
    "I am working on a Rust-first serving runtime for SGLang that moves request lifecycle, scheduling, routing, protocol, tokenizer, cache, and transfer boundaries into a testable systems layer.",
  bullets: [
    "Define router and gRPC service boundaries for tokenized generation, health, model info, and control-plane calls.",
    "Shape scheduler, prefix-cache, KV page allocation, and prefill/decode batching paths for clearer runtime ownership.",
    "Model PD disaggregation, KV transfer planning, descriptor checksums, and Mooncake-backed transfer boundaries.",
    "Keep kernel execution behind a portable backend seam for CUDA, CPU, Metal, ROCm, and MUSA directions.",
  ],
  links: [
    { label: "GitHub", href: "https://github.com/imReese" },
    { label: "Projects", href: "/projects" },
  ],
}

export const impactStats: ImpactStat[] = [
  { value: "128 -> 256", label: "cluster scale", detail: "Expanded distributed storage cluster initialization capacity." },
  { value: "+40%", label: "init efficiency", detail: "Improved cluster startup path through async queues and module decoupling." },
  { value: "90%+", label: "branch coverage", detail: "Built DTFuzz interface tests to block high-risk storage defects." },
  { value: "+30%", label: "TLB hit rate", detail: "Validated a dynamic TLB scheduling approach with ChampSim." },
  { value: "+6%", label: "IPC", detail: "Measured instruction-level architecture gains in CPU simulation." },
  { value: "+8%", label: "throughput", detail: "Helped tune SMT strategy on Kunpeng CPU workloads." },
]

export const experienceHighlights: ExperienceHighlight[] = [
  {
    company: "Huawei Cloud Computing",
    team: "Shuhai Lab",
    title: "Computer Architecture Research Engineer",
    logo: "cpu",
    start: "2023.07",
    end: "2024.07",
    highlights: [
      "Used perf and Intel Pin to build low-overhead instruction-flow analysis for MySQL and Redis style workloads.",
      "Validated a dynamic TLB scheduling algorithm in ChampSim, improving simulated TLB hit rate and IPC.",
      "Worked with HiSilicon and openEuler teams on Kunpeng CPU SMT tuning and microcode-level performance improvement.",
    ],
  },
  {
    company: "Huawei Data Storage",
    team: "Infrastructure Development",
    title: "Software Development Engineer",
    logo: "server",
    start: "2022.05",
    end: "2023.07",
    highlights: [
      "Built distributed high-availability and cluster-management paths around leader election and Paxos-based coordination.",
      "Decoupled initialization modules with async queues, raising supported node scale from 128 to 256.",
      "Added DTFuzz coverage for 200+ interfaces and hardened command execution paths with input filtering and sandboxing.",
    ],
  },
]

export const educationHighlights: EducationHighlight[] = [
  {
    school: "Nanjing University",
    major: "B.Eng. Environmental Engineering",
    logo: "college",
    start: "2017.09",
    end: "2021.06",
    details: [
      "GPA 4.2 / 5.0.",
      "Computer organization, data structures, operating systems, networks, computer architecture, linear algebra, probability and statistics, and algorithm design.",
    ],
  },
]

export const projectHighlights: ProjectHighlight[] = [
  {
    name: "SGLang Rust Runtime",
    description:
      "Rust runtime direction for SGLang covering request lifecycle, scheduler/router boundaries, gRPC contracts, tokenizer edges, cache management, and PD KV transfer planning.",
    href: "https://github.com/imReese",
    label: "github.com/imReese",
    tags: ["Rust", "SGLang", "LLM Serving", "gRPC", "Scheduling"],
  },
  {
    name: "Lightweight C++ Web Server",
    description:
      "C++ web server using thread pools, non-blocking sockets, epoll, HTTP state machines, database-backed login/register flow, and sync/async logging.",
    href: "https://github.com/imReese",
    label: "github.com/imReese",
    tags: ["C++", "Linux", "epoll", "HTTP", "MySQL"],
  },
  {
    name: "LeetCode Automation Manager",
    description:
      "Automation that parses problem statements, generates descriptions, code templates, tests, and GitHub Actions workflows for algorithm practice.",
    href: "https://github.com/imReese",
    label: "github.com/imReese",
    tags: ["Python", "C++", "Automation", "GitHub Actions"],
  },
]

export const stackGroups: StackGroup[] = [
  { title: "Languages", items: ["Rust", "C/C++", "Go", "Python", "Shell", "TypeScript"] },
  { title: "Systems", items: ["Linux", "gRPC", "Paxos", "epoll", "perf", "Intel Pin", "gdb"] },
  { title: "Infrastructure", items: ["Docker", "Kubernetes", "Redis", "MySQL", "Prometheus", "Grafana"] },
]
```

- [ ] **Step 2: Wire `infoConfig.ts` to the shared content**

Modify `imReese.github.io/src/config/infoConfig.ts` so it imports the shared content and exports the same public names used by existing components:

```ts
import { profileSummary } from "./profileContent"

export * from "./projects"
export * from "./friends"
export * from "./changelog"
export * from "./education"
export * from "./career"
export * from "./activity"
export * from "./profileContent"

export const name = profileSummary.name
export const headline = profileSummary.headline
export const introduction = profileSummary.introduction
export const email = profileSummary.email
export const githubUsername = profileSummary.githubUsername

export const aboutMeHeadline = "I'm Reese, a backend systems engineer based in Shenzhen, China."
export const aboutParagraphs = profileSummary.aboutParagraphs

export const blogHeadLine = "Engineering notes and field logs."
export const blogIntro = "Notes about backend systems, SGLang runtime work, cloud-native tooling, AI, programming, and life."
```

Keep the existing `SocialLinkType`, `socialLinks`, and `techIcons` exports, but add `"rust"` near the front of `techIcons`.

- [ ] **Step 3: Type-check the new content shape**

Run:

```bash
cd imReese.github.io
npx tsc --noEmit
```

Expected: TypeScript completes with no errors.

- [ ] **Step 4: Commit the shared content changes**

Run:

```bash
cd imReese.github.io
git add src/config/profileContent.ts src/config/infoConfig.ts
git commit -m "feat: add profile content template"
```

Expected: commit succeeds on `homepage-catppuccin-redesign`.

---

### Task 2: Apply Template Content Across the Homepage

**Files:**
- Modify: `imReese.github.io/src/config/career.ts`
- Modify: `imReese.github.io/src/config/education.ts`
- Modify: `imReese.github.io/src/config/projects.ts`
- Modify: `imReese.github.io/src/components/home/ElegantIntro.tsx`
- Modify: `imReese.github.io/src/components/home/SystemsPanel.tsx`
- Modify: `imReese.github.io/src/components/home/OpenSourcePulse.tsx`
- Modify: `imReese.github.io/src/components/home/AnimatedCareer.tsx`
- Modify: `imReese.github.io/src/components/home/AnimatedEducation.tsx`
- Modify: `imReese.github.io/src/app/page.tsx`

- [ ] **Step 1: Replace placeholder career data**

Update `CareerItemType` in `src/config/career.ts` to include `team` and `highlights`, then export `careerList` from `experienceHighlights`:

```ts
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
```

- [ ] **Step 2: Replace placeholder education data**

Update `EducationItemType` in `src/config/education.ts` to include `details`, then export `educationList` from `educationHighlights`:

```ts
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
```

- [ ] **Step 3: Populate projects from shared content**

In `src/config/projects.ts`, import `projectHighlights` and map it into `projects`:

```ts
import { projectHighlights } from "./profileContent"

export const projectHeadLine = "Systems Projects"
export const projectIntro = "SGLang runtime work, backend systems, and practical tooling."

export const projects: Array<ProjectItemType> = projectHighlights.map((project) => ({
  name: project.name,
  description: project.description,
  link: { href: project.href.replace(/^https?:\/\//, ""), label: project.label },
  tags: project.tags,
}))

export const githubProjects: Array<ProjectItemType> = []
```

- [ ] **Step 4: Replace local focus chips in `ElegantIntro.tsx`**

Import `profileSummary` and change the chip map to `profileSummary.focusAreas`:

```ts
import { headline, introduction, profileSummary } from "@/config/infoConfig"
```

```tsx
{profileSummary.focusAreas.map((area) => (
  <span
    key={area}
    className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
  >
    {area}
  </span>
))}
```

- [ ] **Step 5: Retarget the systems panel**

In `SystemsPanel.tsx`, replace the services and log lines with SGLang runtime concepts:

```ts
const services = [
  { name: "router", detail: "gateway / gRPC", icon: GitBranch, tone: "text-primary", width: "w-10/12" },
  { name: "scheduler", detail: "prefill / decode", icon: Boxes, tone: "text-[hsl(var(--chart-3))]", width: "w-9/12" },
  { name: "kv transfer", detail: "PD / Mooncake", icon: Database, tone: "text-[hsl(var(--chart-2))]", width: "w-8/12" },
  { name: "kernels", detail: "cuda / cpu boundary", icon: Activity, tone: "text-[hsl(var(--chart-4))]", width: "w-7/12" },
]

const logLines = [
  "sglang serve --runtime rust",
  "prefill batch planned with kv pages",
  "decode worker waiting for kv-ready signal",
]
```

Also change the panel label from `service topology` to `sglang runtime`.

- [ ] **Step 6: Make `OpenSourcePulse` a current-focus section**

Import `currentFocus` and map its bullets into the left column. Keep `GitHubSnake` in the right column:

```ts
import { currentFocus } from "@/config/infoConfig"
import { Activity, Code2, GitBranch, Network } from "lucide-react"

const focusIcons = [Activity, GitBranch, Network, Code2]
```

Render `currentFocus.eyebrow`, `currentFocus.title`, `currentFocus.summary`, and `currentFocus.bullets`.

- [ ] **Step 7: Show real career and education details**

In `AnimatedCareer.tsx`, replace the generic expanded paragraph with a list over `careerItem.highlights`, and show `careerItem.team` below the title.

In `AnimatedEducation.tsx`, replace the generic paragraph with a list over `educationItem.details`.

- [ ] **Step 8: Update homepage stack copy**

In `src/app/page.tsx`, import `stackGroups` and render stack group pills instead of the hard-coded `Backend`, `Cloud Native`, and `Observability` labels:

```ts
import { stackGroups, techIcons } from "@/config/infoConfig"
```

```tsx
{stackGroups.map((group) => (
  <span key={group.title} className="rounded-full bg-secondary px-3 py-1">
    {group.title}: {group.items.slice(0, 3).join(" / ")}
  </span>
))}
```

- [ ] **Step 9: Verify homepage code**

Run:

```bash
cd imReese.github.io
npm run lint
npx tsc --noEmit
```

Expected: lint completes with the existing warnings only, and TypeScript completes with no errors.

- [ ] **Step 10: Commit homepage content changes**

Run:

```bash
cd imReese.github.io
git add src/config/career.ts src/config/education.ts src/config/projects.ts src/components/home/ElegantIntro.tsx src/components/home/SystemsPanel.tsx src/components/home/OpenSourcePulse.tsx src/components/home/AnimatedCareer.tsx src/components/home/AnimatedEducation.tsx src/app/page.tsx
git commit -m "feat: enrich homepage with systems profile content"
```

Expected: commit succeeds on `homepage-catppuccin-redesign`.

---

### Task 3: Rewrite the GitHub Profile README

**Files:**
- Modify: `imReese/README.md`

- [ ] **Step 1: Replace the README content**

Replace `imReese/README.md` with a concise public profile:

```md
<div align="center">

  <a href="https://github.com/imReese">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=89B4FA&center=true&vCenter=true&width=620&lines=Hi,+I'm+Reese;SGLang+Rust+Runtime;Backend+%2F+Distributed+Systems;Rust+%7C+C%2B%2B+%7C+Go+%7C+Python+%7C+Linux" alt="Typing SVG" />
  </a>

  <p>
    Backend systems engineer in Shenzhen, currently working on SGLang Rust runtime infrastructure for LLM serving.
  </p>

  <p>
    <a href="https://github.com/imReese">
      <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
    </a>
    <a href="mailto:reese_duan@outlook.com">
      <img src="https://img.shields.io/badge/Outlook-0078D4?style=for-the-badge&logo=microsoftoutlook&logoColor=white" alt="Outlook">
    </a>
    <a href="https://github.com/imReese/imReese/blob/main/img/wechat_me.jpg">
      <img src="https://img.shields.io/badge/WeChat-07C160?style=for-the-badge&logo=wechat&logoColor=white" alt="WeChat">
    </a>
  </p>

</div>

### Current Focus

- Building Rust-side runtime boundaries for SGLang: request lifecycle, router/gRPC protocol, scheduler, tokenizer edges, prefix cache, and model-executor batch interfaces.
- Exploring PD disaggregation paths around KV transfer planning, descriptor checksums, KV-ready predicates, and Mooncake-backed transfer boundaries.
- Keeping kernel execution behind portable backend boundaries for CUDA, CPU, Metal, ROCm, and MUSA directions.

### Systems Background

- Distributed storage: high-availability cluster management, leader election, Paxos-based coordination, async initialization queues, and production fault handling.
- Performance engineering: Linux perf, Intel Pin instruction-flow tracing, ChampSim validation, TLB scheduling, IPC analysis, and CPU workload tuning.
- Product hardening: DTFuzz coverage for storage interfaces, command-injection mitigation, sandboxed execution paths, and operational reliability fixes.

### Selected Work

- **SGLang Rust Runtime**: Rust-first LLM serving runtime experiments for router, scheduler, protocol, tokenizer, cache, worker, and PD KV-transfer boundaries.
- **Lightweight C++ Web Server**: thread pool, non-blocking sockets, epoll, HTTP state machine, MySQL login/register flow, and sync/async logging.
- **LeetCode Automation Manager**: parses problems, generates descriptions, code templates, tests, and GitHub Actions workflows for algorithm practice.

### Languages and Tools

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=rust,c,cpp,go,python,linux,docker,kubernetes,redis,mysql,prometheus,grafana,cmake,bash,git,githubactions,vscode,vim&perline=9" alt="Languages and tools" />
  </a>
</p>

### GitHub Contributions

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/imReese/imReese/output/github-contribution-grid-snake-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/imReese/imReese/output/github-contribution-grid-snake.svg">
  <img alt="GitHub contribution grid snake animation" src="https://raw.githubusercontent.com/imReese/imReese/output/github-contribution-grid-snake.svg">
</picture>
```

- [ ] **Step 2: Check README rendering-sensitive syntax**

Run:

```bash
cd imReese
git diff --check
```

Expected: no whitespace errors.

- [ ] **Step 3: Commit the README**

Run:

```bash
cd imReese
git add README.md
git commit -m "docs: enrich profile readme"
```

Expected: commit succeeds on `main`.

---

### Task 4: Verify, Merge to Main, and Push

**Files:**
- Verify: `imReese.github.io`
- Verify: `imReese`

- [ ] **Step 1: Verify the website build**

Run:

```bash
cd imReese.github.io
git diff --check
npm run build
git checkout -- public/sw.js
```

Expected: whitespace check passes, production build succeeds, and generated service-worker drift is restored.

- [ ] **Step 2: Run local visual smoke test**

Start the site on a clean port:

```bash
cd imReese.github.io
npm run dev -- --port 3011
```

Open `http://localhost:3011/` and verify:

- The first viewport shows the Catppuccin homepage and SGLang-centered headline.
- The current-focus card mentions SGLang Rust runtime.
- The stack card includes Rust and systems-oriented groups.
- Mobile width has no horizontal overflow or overlapping text.

- [ ] **Step 3: Commit the plan document**

Run:

```bash
cd imReese.github.io
git add docs/superpowers/plans/2026-06-29-profile-content-template.md
git commit -m "docs: add profile content implementation plan"
```

Expected: commit succeeds on `homepage-catppuccin-redesign`.

- [ ] **Step 4: Merge website branch into `main`**

Run:

```bash
cd imReese.github.io
git fetch origin main
git switch main
git merge --no-ff homepage-catppuccin-redesign -m "merge homepage catppuccin redesign"
npm run build
git checkout -- public/sw.js
```

Expected: merge succeeds, production build succeeds on `main`, and generated service-worker drift is restored.

- [ ] **Step 5: Push both main branches**

Run:

```bash
cd imReese.github.io
git push origin main
cd ../imReese
git push origin main
```

Expected: both pushes complete successfully.

---

## Self-Review

- Spec coverage: the plan implements a template-like website content source, enriches the homepage with SGLang/current-work content, updates the GitHub profile README, verifies the site, merges the website branch to `main`, and pushes both repos.
- Placeholder scan: the plan contains concrete file paths, object shapes, commands, and expected results with no deferred content.
- Type consistency: `profileSummary`, `currentFocus`, `experienceHighlights`, `educationHighlights`, `projectHighlights`, and `stackGroups` are defined in Task 1 before being consumed in later tasks.
