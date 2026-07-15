# Content Guide

This directory is the author-facing part of the site. For normal profile updates,
edit files here instead of changing files under `src/`.

## Files

- `en/site.yml` and `zh/site.yml`: site identity, navigation, social links, and activity links
- `en/profile.yml` and `zh/profile.yml`: focus areas, about copy, work history, education, stack
- `en/projects.yml` and `zh/projects.yml`: project cards and GitHub activity settings
- `en/pages.yml` and `zh/pages.yml`: page-level copy for home, about, projects, and blogs
- `blogs/*.mdx`: blog posts

## Blog Posts

Each blog post is one `.mdx` file under `content/blogs/`.

```text
content/blogs/my-post.mdx
```

The filename becomes the URL:

```text
/blogs/my-post/
```

Each post needs frontmatter:

```mdx
---
title: 'Post title'
description: 'One sentence summary.'
author: 'Reese'
date: '2026-06-30'
---

# Post title

Write in Markdown or MDX.
```
