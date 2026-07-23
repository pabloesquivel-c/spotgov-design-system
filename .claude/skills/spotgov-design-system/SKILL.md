---
name: spotgov-design-system
description: >-
  Build SpotGov product UI using AlignUI primitives and canonical blocks.
  Use when implementing screens, components, forms, tables, modals, banners,
  empty states, or design-system work in spotgov-design-system.
---

# SpotGov Design System

## Read order (before coding)

1. [`AGENTS.md`](../../../AGENTS.md)
2. [`docs/component-manifest.md`](../../../docs/component-manifest.md) — fast inventory
3. [`docs/design-system.md`](../../../docs/design-system.md) §8 — which-one-when
4. [`docs/component-patterns.md`](../../../docs/component-patterns.md)
5. [`docs/screen-composition.md`](../../../docs/screen-composition.md) for new or materially redesigned full-screen UI
6. [`docs/design-tokens.md`](../../../docs/design-tokens.md) · [`docs/copy.md`](../../../docs/copy.md) · [`docs/accessibility.md`](../../../docs/accessibility.md)

## Non-negotiables (summary — full rules in AGENTS.md)

- Use AlignUI tokens as they ship — never redefine palette/radius/type scales in config
- Tokens: `bg-bg-*`, `text-text-*`, `primary-base`, `rounded-10` — no raw hex
- Import: `@/components/ui/*` and **canonical blocks** from the manifest
- Remix Line icons only; AlignUI type utilities (`text-title-h6`, `text-label-*`, `text-paragraph-*`)
- Light-only product; no dark/system theme controls in shipped UI
- Status: label text + icon or dot — not color alone
- Forms: `Label.Root htmlFor` matches control `id`; errors via `Hint` or `Alert`

## Workflow

1. **Inspect** — search manifest and canonical blocks before inventing markup
2. **Compose** — copy structure from canonical block files in `design-system.md` §16
3. **Screen-check** — for full screens, select the archetype and responsive contract in `screen-composition.md`
4. **Token-check** — semantic classes only; run anti-slop checklist (`design-system.md` §15)
5. **States** — hover, focus-visible, disabled, loading, empty, error where applicable
6. **Verify** — Storybook story or token preview if adding a primitive

## Canonical blocks (prefer over demo blocks)

See **Canonical blocks** section in `docs/component-manifest.md`. Examples: `EmptyState`, `DestructiveConfirmModal`, `ProductAnnouncementBanner`, `FilterPanelShell`, `ContractsTable`, `CheckboxCardShell`.

Reference-only AlignUI demos under `components/blocks/` need procurement-native copy before shipping.

## After adding components

Run `npm run generate:manifest` to refresh the inventory.
