# Profile Content Template Design

Date: 2026-06-28

## Goal

Enrich both public surfaces for Reese:

- `imReese/README.md`, the GitHub profile README.
- `imReese.github.io`, the personal homepage.

The content should make the current SGLang-related Rust runtime work the main
professional signal, while using the resume history as supporting proof:
distributed storage systems, Paxos-based cluster management, Linux/backend
engineering, CPU microarchitecture performance analysis, and low-level tooling.

The website should become content-template driven so future updates usually
require editing one structured config file instead of changing React component
copy.

## Public Content Rules

- Do not publish phone numbers or private resume-only contact details.
- Use the existing public email and GitHub profile links.
- Keep claims grounded in local sources:
  - `imReese/resume/main.tex`
  - `sglang-rs/README.md`
  - existing homepage config files
- Avoid framing the site as a generic job application. The tone should be a
  systems engineer profile: concise, current, and technically specific.

## Content Positioning

The shared narrative is:

> Backend and systems engineer building Rust runtime infrastructure for SGLang,
> with production experience in distributed storage, cluster management,
> Linux-based tooling, and CPU performance analysis.

Primary current focus:

- SGLang / LLM serving runtime work.
- Rust runtime boundaries around router, scheduler, engine, tokenizer,
  gRPC/control-plane, PD disaggregation, KV transfer, and kernel backend
  integration.
- Backend/cloud-native systems with Linux observability and performance
  tooling.

Supporting proof:

- Huawei storage infrastructure: Paxos-based cluster management, node-scale
  growth from 128 to 256, async communication model, white-box testing, fuzzing,
  security hardening, and production issue fixes.
- Huawei cloud architecture research: Perf/Intel Pin instruction tracing,
  MySQL/Redis workload analysis, TLB scheduling simulation, ChampSim validation,
  IPC and TLB-hit improvements, and cross-team CPU optimization validation.
- Personal projects: `sglang-rs`, C/C++ web server, LeetCode automation.

## Website Design

### Template File

Add a structured content file, recommended path:

`src/config/profileContent.ts`

It should export typed data such as:

- `profileSummary`
  - headline
  - short introduction
  - location
  - current focus tags
- `currentFocus`
  - title
  - summary
  - bullets
  - repository link
- `experienceHighlights`
  - organization
  - role
  - timeframe
  - theme
  - bullets
  - metrics
- `projectHighlights`
  - name
  - description
  - stack
  - link
  - bullets
- `skillGroups`
  - group name
  - items
- `impactStats`
  - label
  - value
  - context

The file should include comments that explain how Reese can fill or update each
section without reading component internals.

### Homepage Consumption

Refactor homepage-facing components to consume `profileContent.ts`:

- The hero and supporting copy should read from `profileSummary`.
- The first proof section should emphasize `currentFocus`, especially SGLang.
- Career/experience proof should read from `experienceHighlights`.
- Project cards should read from `projectHighlights`.
- Skills and impact badges should read from `skillGroups` and `impactStats`.

The existing Catppuccin Latte/Mocha visual direction stays in place. The work is
content architecture and copy enrichment, not another visual redesign.

### Suggested Sections

Keep the homepage compact:

1. Hero: "Backend systems for LLM serving and cloud-native products."
2. Current focus: SGLang Rust runtime, router/scheduler/runtime boundaries, PD
   disaggregation, KV transfer, and kernel integration direction.
3. Systems proof: resume-derived experience highlights and metrics.
4. Projects: SGLang-first, then lightweight C++ server and automation tooling.
5. Stack: Rust, Go, C/C++, Python, Linux, Docker/Kubernetes, Redis/MySQL,
   observability, performance tools.

## README Design

Rewrite `imReese/README.md` as a concise GitHub profile entry:

- Keep the contribution snake and contact badges.
- Keep skill icons, but add Rust/SGLang-oriented signals.
- Replace the generic greeting with a stronger systems summary.
- Add a "Current focus" block for SGLang runtime work.
- Add a "Systems background" block summarizing distributed storage, CPU
  performance analysis, and production backend work.
- Link to the personal website and SGLang-related repository if available.

README should stay readable in GitHub's profile view. Avoid long resume-style
paragraphs.

## Data Flow

Website:

`profileContent.ts` -> homepage/about components -> rendered pages.

README:

Manual Markdown update using the same narrative and selected highlights. Do not
introduce an auto-generation script in this iteration.

This keeps the implementation maintainable without adding build steps or
generation tooling.

## Error Handling And Fallbacks

- If a template array is empty, the rendering component should either hide that
  subsection or show a compact fallback that does not look broken.
- Links should be optional where reasonable, but existing project links should
  render as regular anchors or Next `Link` based on whether they are internal or
  external.
- Public copy should avoid unverifiable claims beyond the local resume and
  repository context.

## Testing And Verification

For `imReese.github.io`:

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- Browser QA on the local dev server:
  - desktop Latte
  - desktop Mocha
  - mobile Latte
  - no horizontal overflow
  - SGLang/current-focus section visible and readable

For `imReese`:

- Markdown review of `README.md`.
- Confirm no private phone number is present.
- Confirm links render as standard GitHub Markdown/HTML.

For git/publishing:

- Merge the existing homepage redesign branch into `main` before pushing the
  homepage updates.
- Commit each repository separately.
- Push both repositories' `main` branches after verification.

## Out Of Scope

- Auto-generating README from the website template.
- Adding a CMS, MDX content system, or admin editor.
- Publishing private resume contact information.
- Redesigning the visual theme again.
- Implementing new SGLang functionality.
