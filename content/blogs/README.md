# Blog Posts

Write blog posts here as `.mdx` files.

The filename becomes the public URL:

```text
content/blogs/my-post.mdx -> /blogs/my-post/
```

Required frontmatter:

```mdx
---
title: 'My post title'
description: 'A short summary for the blog index and metadata.'
author: 'Reese'
date: '2026-06-30'
language: 'zh-CN'
category: 'engineering-deep-dive'
series: 'Mooncake / HiCache Internals'
featured: false
topics:
  - cloud-tooling
---
```

`language` supports `zh-CN` and `en-US`. Existing posts without the field default to `zh-CN` for backward compatibility. For translated posts, keep separate slugs and link the two versions near the beginning of each article.

## Writing Standard

Use `category`, `series`, and `featured` to control how the blog index presents the post:

```text
engineering-deep-dive  Source-level engineering analysis; eligible for featured placement
debugging-validation   Debugging and validation paths; eligible for featured placement
engineering-notes      Medium-depth engineering notes
runbooks               Tool guides and operational notes
reading-notes          Paper or classic system reading notes
```

Only set `featured: true` for posts with a clear thesis, source context, engineering trade-offs, evidence, and a strong takeaway.

Every post should leave the reader with something concrete they can explain or use. Do not write soft summaries.

Use one of these shapes:

```text
Source-level technical note
  Use for Mooncake, HiCache, SGLang, runtime internals.
  Required: entry files/functions, key data structures, call path, state changes, failure boundaries, and at least one diagram.

Systems note
  Use for Paxos/Raft, LSM, WAL, benchmark, profiling.
  Required: problem setup, concrete example, design tradeoff, boundary, and what to check when reading an implementation.

Tool guide
  Use for Git, Docker, kubectl, pyenv, rg/sed/awk/jq/yq.
  Required: what the tool does, when to use it, command groups by scenario, common mistakes, and practical recovery/debugging commands.
```

Avoid generic section endings such as `Summary`, `Common questions`, or `Checklist` unless the title names the actual technical boundary. Prefer section titles that say what the reader is about to learn:

```text
Good:
  Store metadata and Transfer Engine status are different
  Read path: Mooncake fills Host, HiCache loads back to GPU
  Git rescue paths

Weak:
  Summary
  Common questions
  Things to remember
```

## Diagram Components

Use React + Tailwind MDX components for important flows instead of plain Mermaid blocks.

Available components:

```mdx
<LayerDiagram
  title="KV cache tiers"
  layers={[
    { label: 'GPU KV pool', detail: 'attention uses these slots', tone: 'teal' },
    { label: 'Host KV pool', detail: 'HiCache backup/load-back buffer', tone: 'blue' },
  ]}
/>

<SequenceDiagram
  title="Remote KV read path"
  actors={['SGLang', 'HiCache', 'Mooncake Store', 'Transfer Engine']}
  steps={[
    { from: 'SGLang', to: 'HiCache', label: 'prefix match' },
    { from: 'HiCache', to: 'Mooncake Store', label: 'batch_exists(page keys)' },
  ]}
/>

<StateDiagram
  title="Replica visibility"
  states={[
    { label: 'PROCESSING', detail: 'PutStart reserved metadata', next: 'PutEnd' },
    { label: 'COMPLETE', detail: 'readable replica' },
  ]}
/>

<MappingDiagram
  title="Page key expansion"
  source={{ label: 'logical page key', detail: 'rolling hash from token page' }}
  groups={[
    { label: 'MHA', items: ['page_rank_k', 'page_rank_v'] },
    { label: 'MLA', items: ['page_rank_k'] },
  ]}
/>
```

Use diagrams when the article contains:

```text
multiple layers
metadata state transitions
request/data flow across components
one logical object expanding into multiple physical objects
```

Mooncake / HiCache series reading order:

```text
mooncake-kv-cache-system-resource.mdx
sglang-hicache-reading-notes.mdx
sglang-hicache-write-path.mdx
sglang-hicache-read-path.mdx
mooncake-store-master-client-dataflow.mdx
mooncake-store-put-path.mdx
mooncake-store-get-path.mdx
mooncake-replica-lease-hot-cache.mdx
mooncake-transfer-engine-remote-memory.mdx
mooncake-transfer-engine-transport-layer.mdx
sglang-to-mooncake-store-kv-cache-path.mdx
mooncake-python-sglang-integration-boundary.mdx
mooncake-hicache-debugging-validation.mdx
```
