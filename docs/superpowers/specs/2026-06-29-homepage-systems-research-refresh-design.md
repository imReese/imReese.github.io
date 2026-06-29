# Homepage Systems Research Refresh Design

## Goal

Refresh the homepage so it reads as a systems research and engineering profile for LLM serving, not a generic resume template.

## Content Hierarchy

1. Hero: lead with inference engines, cache/KV paths, Mooncake TransferEngine, and heterogeneous accelerator backends.
2. System visual: show the serving path as request, scheduler, prefix cache, KV cache, Mooncake TE, and accelerator backend.
3. Research focus: present four focused themes: Inference Engine, Cache and KV, Mooncake TransferEngine, and Heterogeneous Backends.
4. Experience: keep Baidu AI Computing Department first, then Huawei architecture/storage background.
5. Supporting sections: keep notes, stack, education, and contact, but make them secondary.

## Visual Direction

Keep the existing Catppuccin Latte/Mocha theme, rounded panels, restrained borders, and Tailwind component style. Reduce the homepage's generic card-stack feeling by using a stronger system-path panel in the hero and a denser research-grid section below it.

## Public Wording

Use public-safe wording:

- cache and KV cache behavior
- Mooncake TransferEngine or Mooncake TE
- NVIDIA GPUs and Kunlunxin P-series accelerators
- runtime, scheduling, operator, backend, memory, and transfer boundaries

Avoid internal-only details, confidential metrics, or implementation specifics that are not already public.

## Implementation Scope

- Update profile content data.
- Redesign the hero system panel.
- Redesign the current-focus section into a research-focus grid.
- Update README wording to include cache, KV, and Mooncake TE.
- Verify lint, TypeScript, production build, and live deployment.
