# Mooncake Blog Public Notes Design

## Goal

Publish a first Mooncake blog post on the personal site from the local Markdown knowledge base, while keeping the public version readable and safe to share.

## Source Material

- Mooncake local notes: `01-Architecture-Overview.md`
- Mooncake local notes: `10-Transfer-Engine/10-Transfer-Engine-Overview.md`
- Mooncake local notes: `20-Mooncake-Store/21-Put-Get-Dataflow.md`
- Mooncake local notes: `30-Integrations/31-vLLM-SGLang-LMCache-Connectors.md`
- Mooncake local notes: `10-Transfer-Engine/13-Sunrise-Link-and-TENT-Updates.md`

## Publishing Shape

Create a single MDX blog post under `src/content/blog/` with a public-note tone:

- explain the mental model before listing source files;
- remove local absolute paths, Obsidian links, personal work-in-progress notes, and raw source commit metadata;
- keep file names and API names when they help readers follow the open-source code;
- avoid performance claims that depend on a private environment;
- call out open questions instead of over-stating unfinished reading.

## Content Outline

1. Why Mooncake matters for KVCache-centric serving.
2. The control-plane/data-plane split across Store, master, client, and Transfer Engine.
3. A compact Put/Get data path.
4. Transfer Engine concepts: segments, registered memory, transports, batch submission, status polling.
5. Integration notes for SGLang, vLLM, and LMCache.
6. Reading traps and next files to inspect.

## Verification

Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`. If the generated static artifacts change during build, inspect them and keep only intentional source changes.
