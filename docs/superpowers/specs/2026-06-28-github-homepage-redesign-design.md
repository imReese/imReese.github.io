# GitHub Homepage Redesign Design

Date: 2026-06-28

## Goal

Refresh the `imReese.github.io` homepage so the first impression matches Reese's GitHub identity: a backend and cloud-native engineer building reliable systems.

The approved direction is an A+B hybrid:

- A: a professional systems-console hero for the first viewport.
- B: an open-source activity section that uses GitHub contribution activity as supporting evidence.

The visual theme is Catppuccin:

- Dark mode: Catppuccin Mocha.
- Light mode: Catppuccin Latte.

## Current Issues

- The current homepage headline says "Full-Stack web developer, and indie hacker", which is less aligned with the selected backend/cloud-native identity.
- The right side of the hero uses a small rocket element that reads as placeholder-like rather than specific to backend systems.
- Mobile first viewport has too much empty vertical space, and the animated title can truncate or crowd.
- The journey cards are too low-contrast in dark mode.
- The GitHub contribution snake, blog section, and tech cloud feel like separate stacked modules instead of a coherent homepage narrative.
- The blog area looks sparse when there is only one test post.
- The tech cloud loading or empty state can look like an unfinished block.

## Homepage Narrative

The page should read as a short proof chain:

1. Reese builds backend systems for cloud-native products.
2. Reese works with practical infrastructure technologies: Go, Python, C/C++, Linux, Kubernetes, Docker, Redis, MySQL, and observability tooling.
3. Reese is active on GitHub and writes engineering notes.
4. Reese has career and education context that supports the positioning.

## Information Architecture

### Header

Keep the existing navigation items and theme toggle:

- Home
- About
- Projects
- Blogs

The homepage header should remain compact and should not create a large blank mobile first viewport. On mobile, the hero content should appear in the first viewport below the navigation.

### Hero

Hero copy:

- H1: `Backend systems for cloud-native products.`
- Supporting copy: `I'm Reese, a Shenzhen-based software engineer focused on reliable backend services, Linux tooling, and cloud-native infrastructure.`

Primary actions:

- `View projects` linking to `/projects`
- `Read notes` linking to `/blogs`

Technology chips:

- Go
- Python
- C/C++
- Kubernetes
- Docker
- Redis
- MySQL
- Linux

Right-side visual:

- Replace the rocket with a code-native systems panel.
- The panel should suggest service topology, logs, queue/storage/observability nodes, and healthy system state.
- It should be built in React/Tailwind, not as a raster screenshot.
- It should work in both themes and scale down gracefully on mobile.

### Open-source Pulse

Create a GitHub activity band after the hero:

- Section title: `Open-source pulse`
- Supporting text should frame GitHub activity as ongoing engineering practice.
- Reuse the existing GitHub contribution snake asset.
- The asset should sit inside a stronger, theme-aware frame rather than an isolated generic card.
- The section should use stable static proof points instead of dynamic counts: `Active on GitHub`, `Backend focus`, and `Engineering notes`.

### Journey and Education

Keep work and education content, but make it more visible and concise:

- Avoid nearly-black-on-black cards in Mocha.
- Use cards or timeline rows with clear labels, dates, and a restrained accent.
- Keep the existing expandable behavior, but remove generic expansion filler.
- Expanded content should show dates, role/category labels, and concise real context only.

### Writing

Do not make a large empty blog grid when only one article exists.

Design behavior:

- If there are 1 to 3 posts, show a compact notes module.
- The module can contain the newest posts and a clear archive link to `/blogs`.
- Avoid making the test blog look like a major featured article.

### Tech Stack

Keep the icon cloud, but make it feel intentional:

- Introduce it as an engineering stack, not decorative icon soup.
- Improve its loading container so the placeholder looks deliberate.
- Use compact category labels around the icon cloud.
- Keep the current lazy loading behavior.

### Footer CTA

Replace the generic "Let's Build Something Amazing" tone with a more engineer-specific closing:

- Suggested title: `Have a backend or infrastructure problem worth solving?`
- Suggested copy: `I like turning practical systems work into reliable products and useful notes.`
- CTAs: email and projects/blogs.

## Visual System

### Catppuccin Mocha Tokens

Use these as the dark-mode basis:

- Crust: `#11111b`
- Mantle: `#181825`
- Base: `#1e1e2e`
- Surface 0: `#313244`
- Surface 1: `#45475a`
- Text: `#cdd6f4`
- Subtext: `#a6adc8`
- Teal: `#94e2d5`
- Green: `#a6e3a1`
- Blue: `#89b4fa`
- Lavender: `#b4befe`
- Red: `#f38ba8`

### Catppuccin Latte Tokens

Use these as the light-mode basis:

- Base: `#eff1f5`
- Mantle: `#e6e9ef`
- Crust: `#dce0e8`
- Surface 0: `#ccd0da`
- Surface 1: `#bcc0cc`
- Text: `#4c4f69`
- Subtext: `#6c6f85`
- Teal: `#179299`
- Green: `#40a02b`
- Blue: `#1e66f5`
- Lavender: `#7287fd`
- Red: `#d20f39`

### Palette Rules

- Teal is the primary action and system-accent color.
- Blue, green, and lavender are supporting state/detail colors.
- Avoid a one-note purple page.
- Avoid generic black/white defaults that break the Catppuccin feeling.
- In light mode, use Latte base/mantle surfaces rather than pure white as the dominant page background. Pure white may be used for focused cards only when contrast is needed.

### Typography

Keep the current system font stack.

Hero typography:

- Strong, compact heading.
- No viewport-width font scaling.
- No negative letter spacing beyond the existing Tailwind tracking utilities already in use.
- Mobile hero should wrap cleanly and keep the key message visible.

UI typography:

- Buttons, chips, cards, nav, and small labels need explicit sizes and weights.
- Avoid browser-default control sizing.

### Container Model

- Use open bands and purposeful panels.
- Do not nest cards inside cards.
- Keep card radius restrained, preferably 12 to 20 px depending on section scale.
- The systems panel can be a framed tool-like surface.
- The GitHub activity section can be a full-width band with one framed asset.

## Component Plan

Existing components to update or replace:

- `src/components/home/ElegantIntro.tsx`: replace the current hero layout with the backend/cloud-native hero and systems panel.
- `src/app/page.tsx`: reorganize section order and copy.
- `src/styles/tailwind.css`: update theme CSS variables to Catppuccin Mocha/Latte.
- `src/config/infoConfig.ts`: update headline/introduction and align the tech icon list with backend/cloud-native positioning.
- `src/components/home/AnimatedCareer.tsx`: improve contrast and remove generic filler copy.
- `src/components/home/AnimatedEducation.tsx`: improve contrast and remove overly specific fake achievements.
- `src/components/home/GitHubSnake.tsx`: keep asset rendering, but fit into the new activity band.
- `src/components/ui/icon-cloud.tsx`: improve placeholder/loading surface.
- `src/components/home/BlogCard.tsx` or homepage-local notes layout: avoid sparse large grids for one post.

New components to add:

- `SystemsPanel`: the right-side hero service topology/log panel.
- `OpenSourcePulse`: activity band wrapper around the GitHub snake.
- `HomepageNotes`: compact blog module for limited posts.

Keep these components scoped to the homepage and shared theme tokens.

## Data Flow

- Homepage remains a server component where possible.
- Blog data continues to come from `getAllBlogs()`.
- Visual systems panel uses static local data arrays inside the component.
- Tech icons continue to use `techIcons` from config.
- No new external API calls are required.

## Interaction

- Existing theme toggle remains.
- Hero CTA links navigate normally.
- Career/education expansion can remain if it feels polished after styling.
- Icon cloud keeps its existing lazy rendering behavior.
- Motion should be subtle and respect the current Framer Motion pattern.

## Responsive Requirements

Desktop:

- Hero uses a two-column composition.
- Systems panel is visible and balanced against hero copy.
- Next section should be hinted without excessive first-viewport blank space.

Mobile:

- Header does not push the hero content below the fold.
- H1 and supporting copy are visible in the first viewport.
- Systems panel stacks below hero copy and uses a reduced-detail mobile layout.
- Chips wrap without overflow.
- GitHub snake container scrolls or scales cleanly without clipping important content.

## Accessibility

- Preserve semantic headings.
- Links and buttons must have visible focus states.
- Icon-only controls should keep existing accessible labels.
- Color contrast must be checked in both Mocha and Latte.
- Decorative panel details should not create noisy screen-reader output.

## Error and Empty States

- If blog list is empty, show a compact "notes coming soon" style module and link to `/blogs`.
- If the icon cloud has not loaded, show a deliberate skeleton or compact placeholder matching the theme.
- If GitHub snake asset fails to load, the `alt` text should remain useful.

## Testing and Verification

Run:

- `npm run lint`
- `npm run build`

Browser verification:

- Desktop screenshot at the default browser viewport.
- Mobile screenshot around 390 x 844.
- Check light and dark themes.
- Verify links to `/projects`, `/blogs`, and email/contact CTA.
- Verify no horizontal overflow on mobile.
- Verify the first viewport no longer has the current large blank mobile gap.

Visual comparison:

- Compare implementation against the approved Catppuccin A+B companion mockup.
- Check at least hero copy, systems panel, section order, theme colors, GitHub activity framing, mobile first viewport, and card contrast.

## Out of Scope

- Do not add new backend services or analytics.
- Do not fetch live GitHub API data.
- Do not redesign About, Projects, Blogs, or Changelog pages beyond theme variables that naturally affect them.
- Do not create new blog content.
- Do not commit `.superpowers/` companion artifacts.
