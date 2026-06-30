# Reese's Personal Homepage

This repository powers [imReese.github.io](https://imreese.github.io/). It is a
content-first GitHub personal homepage built with Next.js, Tailwind CSS, MDX,
and GitHub Pages.

The important idea: most people should edit files under `content/`, not the
frontend implementation under `src/`.

## Content First

Author-facing content lives here:

```text
content/
  site.yml
  profile.yml
  projects.yml
  friends.yml
  pages.zh.yml
  blogs/
```

- `content/site.yml`: site identity, navigation labels, footer links, social
  links, blog copy, and GitHub activity settings.
- `content/profile.yml`: homepage copy, about page copy, focus areas, work
  history, education, and stack.
- `content/projects.yml`: project cards and pinned GitHub repositories.
- `content/friends.yml`: friend links.
- `content/pages.zh.yml`: Chinese overrides for page-level content. Blog post
  bodies stay in `content/blogs/` and do not need a separate Chinese copy.
- `content/blogs/*.mdx`: blog posts.

The `src/` directory is the reusable template implementation. Change it when
you want to alter layout, components, routing, styling, or data loading.

## Writing Blog Posts

Create one `.mdx` file in `content/blogs/`:

```text
content/blogs/my-reading-note.mdx
```

The filename becomes the URL:

```text
/blogs/my-reading-note
```

Each post needs frontmatter:

```mdx
---
title: 'Post title'
description: 'One sentence summary.'
author: 'Reese'
date: '2026-06-30'
---

Write the post in Markdown or MDX.
```

Do not repeat the title as the first `# Heading`. The blog layout renders the
frontmatter title as the page heading.

## Local Development

Use Node.js 26:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Production build:

```bash
npm run build
```

The site is statically exported and deployed by GitHub Actions to GitHub Pages.

## Generated Files

Do not edit generated build output directly:

- `.next/`
- `out/`
- route export folders such as `blogs/`, `projects/`, `friends/`, `about/`
- generated PWA files such as `public/sw.js`

These are ignored by Git and recreated during build/deploy.

## Important Config Files

These files are easy to mistake for unused leftovers, but they have different
roles:

- `typography.ts`: used by `tailwind.config.ts`. It customizes
  `@tailwindcss/typography`, including Markdown/MDX prose styles for blog
  detail pages. Keep it unless the site stops using Tailwind typography.
- `postcss.config.js`: used by Next.js/Tailwind during CSS processing. It wires
  `tailwindcss` and `autoprefixer`. Keep it.
- `prettier.config.js`: not used by `npm run build`, but used by Prettier and
  editor integrations. It sets single quotes, no semicolons, and Tailwind class
  sorting via `prettier-plugin-tailwindcss`. Keep it if you want consistent
  formatting; it can be removed only if Prettier is removed too.

## Project Structure

```text
content/              Author-facing site content
src/app/              Next.js app routes
src/components/       Layout and UI components
src/config/           Thin adapters from content files to app data
src/lib/              Blog loading, MDX compilation, utilities
src/styles/           Global CSS, theme tokens, syntax highlighting
public/               Static assets and generated GitHub activity images
.github/workflows/    GitHub Pages deploy and scheduled activity refresh
```

## Deployment

Pushing to `main` triggers the GitHub Pages workflow. The workflow installs
dependencies, builds the static site, uploads the Pages artifact, and deploys
the result.

GitHub activity assets are refreshed by GitHub Actions, so the Projects page can
show current contribution activity without manual editing.
