# GitHub Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the homepage into a Catppuccin Mocha/Latte backend-cloud-native portfolio with a systems hero, open-source activity band, and tighter supporting sections.

**Architecture:** Keep the existing Next.js App Router and Tailwind structure. Add three focused homepage components for the systems panel, GitHub activity band, and compact notes module, then reorganize `src/app/page.tsx` around those components. Update shared theme variables and the affected existing homepage components without redesigning secondary pages.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, next-themes, existing GitHub snake SVG assets.

---

## File Structure

- Modify `src/styles/tailwind.css`: replace existing light/dark CSS variables with Catppuccin Latte/Mocha tokens and add small global selection/focus polish.
- Modify `src/config/infoConfig.ts`: update homepage metadata copy and align tech icon slugs with backend/cloud-native positioning.
- Modify `src/components/layout/Layout.tsx`: use Catppuccin-friendly page backdrop.
- Modify `src/components/layout/Header.tsx`: keep existing nav behavior but reduce homepage mobile blank space and improve Catppuccin nav styling.
- Create `src/components/home/SystemsPanel.tsx`: code-native service topology/log panel for the hero.
- Modify `src/components/home/ElegantIntro.tsx`: replace old rocket hero with backend/cloud-native hero and `SystemsPanel`.
- Create `src/components/home/OpenSourcePulse.tsx`: themed wrapper around `GitHubSnake`.
- Create `src/components/home/HomepageNotes.tsx`: compact blog section for 0 to 3 posts.
- Modify `src/components/home/AnimatedCareer.tsx`: improve contrast and remove generic filler.
- Modify `src/components/home/AnimatedEducation.tsx`: improve contrast and remove fake achievement filler.
- Modify `src/components/ui/icon-cloud.tsx`: make the lazy/loading state look deliberate in Catppuccin themes.
- Modify `src/app/page.tsx`: reorganize homepage sections, add stack framing, and replace generic CTA.

---

### Task 1: Theme Tokens And Identity Copy

**Files:**
- Modify: `src/styles/tailwind.css`
- Modify: `src/config/infoConfig.ts`
- Modify: `src/components/layout/Layout.tsx`

- [ ] **Step 1: Update Catppuccin CSS variables**

In `src/styles/tailwind.css`, replace the current second `@layer base { :root ... .dark ... }` token block with:

```css
@layer base {
  :root {
    --background: 220 23% 95%; /* Catppuccin Latte base #eff1f5 */
    --foreground: 234 16% 35%; /* Latte text #4c4f69 */
    --card: 0 0% 100%;
    --card-foreground: 234 16% 35%;
    --popover: 0 0% 100%;
    --popover-foreground: 234 16% 35%;
    --primary: 183 73% 35%; /* Latte teal #179299 */
    --primary-foreground: 220 23% 95%;
    --secondary: 220 22% 92%; /* Latte mantle #e6e9ef */
    --secondary-foreground: 234 16% 35%;
    --muted: 223 16% 83%; /* Latte crust/surface mix */
    --muted-foreground: 233 10% 47%; /* Latte subtext #6c6f85 */
    --accent: 220 22% 92%;
    --accent-foreground: 234 16% 35%;
    --destructive: 347 87% 44%; /* Latte red #d20f39 */
    --destructive-foreground: 220 23% 95%;
    --border: 226 14% 80%; /* Latte surface0 #ccd0da */
    --input: 226 14% 80%;
    --ring: 183 73% 35%;
    --radius: 0.75rem;
    --chart-1: 183 73% 35%;
    --chart-2: 109 44% 40%;
    --chart-3: 220 91% 54%;
    --chart-4: 231 97% 72%;
    --chart-5: 347 87% 44%;
  }

  .dark {
    --background: 240 21% 12%; /* Catppuccin Mocha base #1e1e2e */
    --foreground: 226 64% 88%; /* Mocha text #cdd6f4 */
    --card: 240 21% 15%; /* Mocha surface base */
    --card-foreground: 226 64% 88%;
    --popover: 240 21% 15%;
    --popover-foreground: 226 64% 88%;
    --primary: 171 50% 73%; /* Mocha teal #94e2d5 */
    --primary-foreground: 240 23% 9%;
    --secondary: 237 16% 23%; /* Mocha surface0 #313244 */
    --secondary-foreground: 226 64% 88%;
    --muted: 237 16% 23%;
    --muted-foreground: 227 35% 80%; /* Mocha subtext #a6adc8 */
    --accent: 232 97% 85%; /* Mocha lavender #b4befe */
    --accent-foreground: 240 23% 9%;
    --destructive: 343 81% 75%; /* Mocha red #f38ba8 */
    --destructive-foreground: 240 23% 9%;
    --border: 234 13% 31%; /* Mocha surface1 #45475a */
    --input: 234 13% 31%;
    --ring: 171 50% 73%;
    --chart-1: 171 50% 73%;
    --chart-2: 115 54% 76%;
    --chart-3: 217 92% 76%;
    --chart-4: 232 97% 85%;
    --chart-5: 343 81% 75%;
  }
}
```

- [ ] **Step 2: Add global background and focus polish**

In the final `@layer base` body rule in `src/styles/tailwind.css`, make it:

```css
@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }

  ::selection {
    background: hsl(var(--primary) / 0.28);
  }

  :focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 3px;
  }
}
```

- [ ] **Step 3: Update identity copy and backend tech list**

In `src/config/infoConfig.ts`, replace the personal-info values and `techIcons` with:

```ts
export const headline = "Backend systems for cloud-native products."
export const introduction = "I'm Reese, a Shenzhen-based software engineer focused on reliable backend services, Linux tooling, and cloud-native infrastructure."
```

```ts
export const aboutMeHeadline = "I'm Reese, a backend and cloud-native engineer based in Shenzhen, China."
export const aboutParagraphs = [
  "I like building reliable backend services, learning how systems fail, and turning practical engineering work into useful notes.",
  "My day-to-day interests sit around Linux, distributed systems, cloud-native infrastructure, observability, and the tools that keep products running.",
  "Outside of coding, I enjoy travelling, photography, movies, and music."
]
```

```ts
export const blogHeadLine = "Engineering notes and field logs."
export const blogIntro = "Notes about backend systems, cloud-native tooling, AI, programming, and life."
```

```ts
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
```

- [ ] **Step 4: Update page backdrop**

In `src/components/layout/Layout.tsx`, replace the inner fixed backdrop div:

```tsx
<div className="w-full bg-background" />
```

with:

```tsx
<div className="w-full bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.10),transparent_32rem),hsl(var(--background))] dark:bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_34rem),hsl(var(--background))]" />
```

- [ ] **Step 5: Verify token compile**

Run:

```bash
npm run lint
```

Expected: lint completes with no new errors. Existing warnings are acceptable only if they were present before this task.

- [ ] **Step 6: Commit**

```bash
git add src/styles/tailwind.css src/config/infoConfig.ts src/components/layout/Layout.tsx
git commit -m "style: apply catppuccin homepage theme"
```

---

### Task 2: Systems Hero

**Files:**
- Create: `src/components/home/SystemsPanel.tsx`
- Modify: `src/components/home/ElegantIntro.tsx`
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Create the systems panel component**

Create `src/components/home/SystemsPanel.tsx`:

```tsx
"use client"

import { motion } from "framer-motion"
import { Activity, Boxes, Database, GitBranch, ServerCog } from "lucide-react"

const services = [
  {
    name: "gateway",
    detail: "routing / auth",
    icon: GitBranch,
    tone: "text-primary",
    width: "w-10/12",
  },
  {
    name: "workers",
    detail: "queues / jobs",
    icon: Boxes,
    tone: "text-[hsl(var(--chart-3))]",
    width: "w-8/12",
  },
  {
    name: "storage",
    detail: "mysql / redis",
    icon: Database,
    tone: "text-[hsl(var(--chart-2))]",
    width: "w-7/12",
  },
  {
    name: "observe",
    detail: "metrics / logs",
    icon: Activity,
    tone: "text-[hsl(var(--chart-4))]",
    width: "w-9/12",
  },
]

const logLines = [
  "deploy backend-api@sha256:7f42",
  "redis cache warmup completed",
  "p95 latency steady at 38ms",
]

export function SystemsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-4 shadow-2xl shadow-primary/10 backdrop-blur md:p-5"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,hsl(var(--primary)/0.18),transparent_16rem)]" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ServerCog className="h-4 w-4 text-primary" />
            <span className="font-medium">service topology</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]" />
            <span>healthy</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.32 + index * 0.08 }}
                className="rounded-xl border border-border/60 bg-secondary/55 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{service.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{service.detail}</div>
                  </div>
                  <Icon className={`h-4 w-4 ${service.tone}`} />
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background/70">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.55 + index * 0.08 }}
                    className={`h-full rounded-full bg-current ${service.tone} ${service.width}`}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-4 rounded-xl border border-border/50 bg-background/55 p-3 font-mono text-[0.72rem] leading-6 text-muted-foreground">
          {logLines.map((line, index) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.72 + index * 0.08 }}
              className="flex gap-2"
            >
              <span className="text-primary">$</span>
              <span>{line}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Replace the hero**

In `src/components/home/ElegantIntro.tsx`, replace the current component body with a two-column hero using this shape:

```tsx
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Github } from "lucide-react"
import { headline, introduction } from "@/config/infoConfig"
import { SystemsPanel } from "@/components/home/SystemsPanel"

const focusAreas = ["Go", "Python", "C/C++", "Kubernetes", "Docker", "Redis", "MySQL", "Linux"]

export function ElegantIntro() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!isVisible) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-5">
          <div className="h-12 w-4/5 animate-pulse rounded-xl bg-muted" />
          <div className="h-5 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-3/4 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-72 animate-pulse rounded-2xl bg-muted" />
      </div>
    )
  }

  return (
    <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {headline}
        </h1>
        <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
          {introduction}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {focusAreas.map((area) => (
            <span
              key={area}
              className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
            >
              {area}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/20"
          >
            <Github className="h-4 w-4" />
            View projects
          </a>
          <a
            href="/blogs"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/35 px-6 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-primary/10"
          >
            <BookOpen className="h-4 w-4" />
            Read notes
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </motion.div>

      <SystemsPanel />
    </section>
  )
}
```

- [ ] **Step 3: Reduce homepage mobile header blank space**

In `src/components/layout/Header.tsx`, make these targeted class changes:

- Change the homepage avatar spacer class from:

```tsx
className="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]"
```

to:

```tsx
className="order-last mt-8 md:mt-[calc(theme(spacing.16)-theme(spacing.3))]"
```

- Change the homepage greeting wrapper class from:

```tsx
className="text-3xl md:text-6xl font-bold tracking-tight flex flex-row"
```

to:

```tsx
className="hidden text-3xl font-bold tracking-tight sm:flex md:text-5xl lg:text-6xl"
```

- Change the `TypingAnimation` class from:

```tsx
className="text-3xl md:text-6xl font-bold tracking-tight"
```

to:

```tsx
className="text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl"
```

- Change `DesktopNavigation` list class from:

```tsx
className="flex rounded-full px-3 text-sm font-medium bg-card ring-1 ring-muted shadow-md backdrop-blur"
```

to:

```tsx
className="flex rounded-full bg-card/80 px-3 text-sm font-medium shadow-md ring-1 ring-border/70 backdrop-blur"
```

- Change `MobileNavigation` button class from:

```tsx
className="group flex items-center rounded-full px-4 py-2 text-sm font-medium shadow-lg ring-1 ring-muted backdrop-blur "
```

to:

```tsx
className="group flex items-center rounded-full bg-card/80 px-4 py-2 text-sm font-medium shadow-lg ring-1 ring-border/70 backdrop-blur"
```

- [ ] **Step 4: Verify hero compiles**

Run:

```bash
npm run lint
```

Expected: no TypeScript/ESLint errors from the new imports or component.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/SystemsPanel.tsx src/components/home/ElegantIntro.tsx src/components/layout/Header.tsx
git commit -m "feat: add systems-focused homepage hero"
```

---

### Task 3: Homepage Sections

**Files:**
- Create: `src/components/home/OpenSourcePulse.tsx`
- Create: `src/components/home/HomepageNotes.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create OpenSourcePulse**

Create `src/components/home/OpenSourcePulse.tsx`:

```tsx
import GitHubSnake from "@/components/home/GitHubSnake"
import { Activity, Code2, NotebookTabs } from "lucide-react"

const proofPoints = [
  { label: "Active on GitHub", icon: Activity },
  { label: "Backend focus", icon: Code2 },
  { label: "Engineering notes", icon: NotebookTabs },
]

export function OpenSourcePulse() {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/75 shadow-xl shadow-primary/5 backdrop-blur">
      <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Open-source pulse</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            A compact view of recent coding activity, practical tooling, and notes from the systems I keep learning through.
          </p>
          <div className="mt-5 grid gap-2">
            {proofPoints.map((point) => {
              const Icon = point.icon
              return (
                <div key={point.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span>{point.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/65 p-3">
          <GitHubSnake />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create HomepageNotes**

Create `src/components/home/HomepageNotes.tsx`:

```tsx
import Link from "next/link"
import { ArrowRight, FileText } from "lucide-react"
import { formatDate } from "@/lib/formatDate"
import { type BlogType } from "@/lib/blogs"

export function HomepageNotes({ blogs }: { blogs: BlogType[] }) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Engineering notes</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Short notes on backend systems, cloud-native tools, and the occasional life log.
          </p>
        </div>
        <Link href="/blogs" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          All notes
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-3">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <Link
              key={blog.slug}
              href={`/blogs/${blog.slug}`}
              className="group rounded-xl border border-border/60 bg-background/55 p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs text-muted-foreground">{formatDate(blog.date)}</div>
                  <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground group-hover:text-primary">
                    {blog.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{blog.description}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-background/55 p-4 text-sm text-muted-foreground">
            Notes are warming up. The archive is ready when the first field log lands.
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Reorganize `src/app/page.tsx` imports**

Replace imports in `src/app/page.tsx` with:

```tsx
import { Container } from "@/components/layout/Container"
import { ElegantIntro } from "@/components/home/ElegantIntro"
import AnimatedCareer from "@/components/home/AnimatedCareer"
import AnimatedEducation from "@/components/home/AnimatedEducation"
import { getAllBlogs } from "@/lib/blogs"
import { techIcons } from "@/config/infoConfig"
import IconCloud from "@/components/ui/icon-cloud"
import { OpenSourcePulse } from "@/components/home/OpenSourcePulse"
import { HomepageNotes } from "@/components/home/HomepageNotes"
```

- [ ] **Step 4: Replace homepage layout**

Replace the `return` block in `src/app/page.tsx` with:

```tsx
return (
  <div className="min-h-screen">
    <section className="pb-14 pt-10 sm:pt-14 lg:pb-20 lg:pt-20">
      <Container>
        <ElegantIntro />
      </Container>
    </section>

    <section className="py-10 lg:py-14">
      <Container>
        <OpenSourcePulse />
      </Container>
    </section>

    <section className="py-12 lg:py-16">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          <AnimatedCareer />
          <AnimatedEducation />
        </div>
      </Container>
    </section>

    <section className="py-12 lg:py-16">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <HomepageNotes blogs={blogList} />

          <section className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Engineering stack</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                The tools I reach for when building services, debugging systems, and keeping infrastructure observable.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
              <span className="rounded-full bg-secondary px-3 py-1">Backend</span>
              <span className="rounded-full bg-secondary px-3 py-1">Cloud Native</span>
              <span className="rounded-full bg-secondary px-3 py-1">Observability</span>
            </div>
            <div className="mt-5 rounded-xl border border-border/50 bg-background/55">
              <IconCloud iconSlugs={techIcons} />
            </div>
          </section>
        </div>
      </Container>
    </section>

    <section className="py-14 lg:py-20">
      <Container>
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-8 text-center shadow-xl shadow-primary/5">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Have a backend or infrastructure problem worth solving?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            I like turning practical systems work into reliable products and useful notes.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="mailto:reese_duan@outlook.com"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5"
            >
              Get in touch
            </a>
            <a
              href="/projects"
              className="inline-flex items-center justify-center rounded-full border border-primary/35 px-6 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-primary/10"
            >
              View projects
            </a>
          </div>
        </div>
      </Container>
    </section>
  </div>
)
```

- [ ] **Step 5: Verify sections compile**

Run:

```bash
npm run lint
```

Expected: no unused imports, no missing component errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/components/home/OpenSourcePulse.tsx src/components/home/HomepageNotes.tsx
git commit -m "feat: reorganize homepage proof sections"
```

---

### Task 4: Supporting Components Polish

**Files:**
- Modify: `src/components/home/AnimatedCareer.tsx`
- Modify: `src/components/home/AnimatedEducation.tsx`
- Modify: `src/components/ui/icon-cloud.tsx`

- [ ] **Step 1: Update career card contrast and expansion copy**

In `src/components/home/AnimatedCareer.tsx`:

- Change the outer `motion.div` class to:

```tsx
className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur"
```

- Change `CareerItem` row class expression to:

```tsx
className={`flex gap-4 rounded-xl p-4 transition-all duration-300 ${
  isExpanded ? 'bg-primary/10 shadow-sm' : 'hover:bg-secondary/70'
}`}
```

- Replace the expanded filler paragraph:

```tsx
<p>Developing innovative solutions and building scalable applications.</p>
```

with:

```tsx
<p>Backend product engineering with a focus on reliable services, internal tooling, and production operations.</p>
```

- Change the `Full-time` label class to:

```tsx
className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
```

- [ ] **Step 2: Update education card contrast and remove fake achievements**

In `src/components/home/AnimatedEducation.tsx`:

- Change the outer `motion.div` class to:

```tsx
className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur"
```

- Change `EducationItem` row class expression to:

```tsx
className={`flex gap-4 rounded-xl p-4 transition-all duration-300 ${
  isExpanded ? 'bg-primary/10 shadow-sm' : 'hover:bg-secondary/70'
}`}
```

- Replace the expanded details block content with:

```tsx
<div className="mt-2 text-sm leading-6 text-muted-foreground">
  <p>Computer science fundamentals, algorithms, software engineering, and systems programming foundations.</p>
</div>
```

- Change the degree label class to:

```tsx
className="rounded-full bg-[hsl(var(--chart-3))]/10 px-2 py-1 text-xs font-medium text-[hsl(var(--chart-3))]"
```

- [ ] **Step 3: Improve icon-cloud placeholder**

In `src/components/ui/icon-cloud.tsx`, replace the placeholder returned when `!shouldRender` with:

```tsx
return (
  <div
    id="icon-cloud-container"
    className="flex h-56 w-full items-center justify-center"
  >
    <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-border bg-secondary/60">
      <div className="absolute h-24 w-24 animate-pulse rounded-full border border-primary/25" />
      <div className="h-14 w-14 rounded-full bg-primary/15" />
    </div>
  </div>
);
```

Also update `cloudProps.containerProps.style.paddingTop` from `40` to `12` so the cloud sits better in the new card.

- [ ] **Step 4: Verify component polish**

Run:

```bash
npm run lint
```

Expected: no syntax or lint errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/AnimatedCareer.tsx src/components/home/AnimatedEducation.tsx src/components/ui/icon-cloud.tsx
git commit -m "style: polish homepage support modules"
```

---

### Task 5: Build And Browser QA

**Files:**
- No planned source edits unless verification reveals issues.
- Possible fixes in files from Tasks 1-4.

- [ ] **Step 1: Run production build**

Run:

```bash
npm run build
```

Expected: Next.js build succeeds and static export remains compatible with the existing configuration.

- [ ] **Step 2: Start or reuse local dev server**

Run:

```bash
npm run dev
```

Expected: local Next.js server is available, normally at `http://localhost:3000`.

- [ ] **Step 3: Desktop dark-mode QA**

Use the in-app browser at the default viewport:

1. Open `http://localhost:3000`.
2. Ensure dark mode is active.
3. Capture a viewport screenshot.
4. Check these points:
   - H1 says `Backend systems for cloud-native products.`
   - Systems panel appears on the right and is not empty.
   - `Open-source pulse` appears below the hero.
   - Catppuccin Mocha background is not plain black.
   - No visible text overlaps or clips.

- [ ] **Step 4: Desktop light-mode QA**

Use the theme toggle and check:

1. Latte background is soft, not pure white as the whole page.
2. Primary teal buttons remain readable.
3. Systems panel and journey cards have clear borders and contrast.
4. GitHub snake frame remains visible.

- [ ] **Step 5: Mobile QA**

Set browser viewport to 390 x 844 and reload.

Check:

1. Header no longer creates a blank first viewport.
2. H1 and intro appear in the first viewport.
3. Chips wrap without horizontal overflow.
4. Systems panel stacks below text.
5. No horizontal scroll.

- [ ] **Step 6: Fix QA issues**

If any QA issue appears, make the smallest targeted edit in the responsible file and rerun:

```bash
npm run lint
npm run build
```

Expected: both pass after the fix.

- [ ] **Step 7: Commit verification fixes or final state**

If fixes were needed:

```bash
git add <changed-files>
git commit -m "fix: refine homepage responsive polish"
```

If no fixes were needed, do not create an empty commit.

- [ ] **Step 8: Final status**

Run:

```bash
git status -sb
```

Expected: only intentional untracked `.superpowers/` companion artifacts remain, unless the user has separately requested cleanup.
