# Component directory conventions

File layout and imports for `components/`. For UX patterns and when to compose blocks, see [`component-patterns.md`](./component-patterns.md).

- `components/ui/` — AlignUI primitives (buttons, inputs, badges, etc.). One component per file; compound APIs use named exports (`Root`, `Icon`, etc.).
- `components/blocks/` — Composed Pro Blocks and playground sections (e.g. token preview, screen-level patterns).
- `components/` (root) — App shell only (`header.tsx`, `theme-switch.tsx`). Do not add new primitives here.

Import primitives from `@/components/ui/<name>`. Use `cn` from `@/utils/cn` and `tv` from `@/utils/tv` for styling.

## Reference-only blocks (do not ship as-is)

Most Pro Blocks under `components/blocks/` are **AlignUI catalog demos** — useful for Storybook and AI reference, not drop-in production screens. Before using a block in SpotGov product UI:

- Replace demo copy (`hello@alignui.com`, HR/finance placeholders) with procurement-native strings.
- Replace placeholder `<img>` avatars with `Avatar` primitives or real assets.
- Prefer canonical SpotGov patterns: `EmptyState`, `DestructiveConfirmModal`, `ProductAnnouncementBanner`, `contracts-table.tsx`, `filter-panel-shell.tsx`.
- Treat `general-settings-drawer.tsx` as a drawer shell demo only (includes dark/system theme controls — omit in product).

Agents should reach for **primitives + canonical blocks** above, not arbitrary demo blocks.

## State and accessibility coverage

- Interactive primitives must define default, hover, pressed/active, focus-visible, disabled, and loading states when those states apply.
- Storybook stories should show variants and state examples, not only the default rendering.
- Use semantic tokens from [`design-tokens.md`](./design-tokens.md); do not introduce raw hex or one-off Tailwind colors in product UI.
- Use SG type aliases (`text-sg-page-title`, `text-sg-body`, etc.) in new product UI. Legacy AlignUI type utilities can remain inside imported primitives.
- Use readable radius aliases (`rounded-8`, `rounded-12`, `rounded-16`, `rounded-20`) in new product UI.
- Follow [`accessibility.md`](./accessibility.md): status must include text plus an icon or shape, focus must be visible, and `text-text-soft-400` is decorative only on white surfaces.

### WCAG checkpoints by component job

| Component job | Required checks |
|---------------|-----------------|
| Buttons, links, tabs, menus | 2.4.7 Focus Visible, 2.1.1 Keyboard, 4.1.2 Name/Role/Value |
| Inputs and forms | 1.4.3 Contrast, 3.3.x Forms/Errors, 4.1.2 Name/Role/Value |
| Status badges and alerts | 1.4.1 Use of Color, 1.4.3 Contrast, 4.1.2 Name/Role/Value |
| Data tables and metadata | 1.4.3 Contrast, 2.1.1 Keyboard for row actions |
| Loading and async states | 4.1.2 Name/Role/Value, disabled/retry semantics where applicable |
