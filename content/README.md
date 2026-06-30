# Content Guide

This directory is the author-facing part of the site. For normal profile updates,
edit files here instead of changing files under `src/`.

## Files

- `site.yml`: site identity, navigation, social links, blog labels, activity links
- `profile.yml`: homepage/about copy, focus areas, work history, education, stack
- `projects.yml`: project cards and GitHub activity settings
- `friends.yml`: friend links
- `pages.zh.yml`: Chinese overrides for page-level content
- `blogs/*.mdx`: blog posts

## Blog Posts

Each blog post is one `.mdx` file under `content/blogs/`.

```text
content/blogs/my-post.mdx
```

The filename becomes the URL:

```text
/blogs/my-post
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
