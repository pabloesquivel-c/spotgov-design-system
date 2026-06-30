# Component directory conventions

- `components/ui/` — AlignUI primitives (buttons, inputs, badges, etc.). One component per file; compound APIs use named exports (`Root`, `Icon`, etc.).
- `components/blocks/` — Composed Pro Blocks and playground sections (e.g. token preview, screen-level patterns).
- `components/` (root) — App shell only (`header.tsx`, `theme-switch.tsx`). Do not add new primitives here.

Import primitives from `@/components/ui/<name>`. Use `cn` from `@/utils/cn` and `tv` from `@/utils/tv` for styling.
