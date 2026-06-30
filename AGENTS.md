# SpotGov Design System — agent rules

**Canonical token reference:** [`docs/design-tokens.md`](docs/design-tokens.md) — read before any UI work.

## Non-negotiables

- **Tokens:** Use semantic utilities (`text-text-strong-950`, `bg-bg-white-0`, `primary-base`, `rounded-10`). Never raw hex in product UI.
- **Primary:** `primary-base` = `#335CFF` (AlignUI blue-500). One brand blue in chrome.
- **Typography:** Six roles only — page title (`text-title-h6`), section heading (`text-label-md`), body (`text-paragraph-sm`), label (`text-label-sm`), caption (`text-paragraph-xs`), micro label (`text-label-xs`).
- **Icons:** `@remixicon/react` Line only. Sizes: `size-icon-inline` (14px), `size-icon` (16px), `size-icon-emphasis` (20px).
- **Radius:** 12px floor on interactives (`rounded-10`). Surface containers `rounded-sg-lg` (16px). Overlays `rounded-20`. Tags/badges `rounded-lg` (8px micro). Tables flat inside; round the wrapper.
- **Shadows:** `shadow-regular-xs` at rest, `shadow-regular-md` for float. Ring-first pattern. One shadow per element.
- **Spacing:** Dual-density on 4px grid — dense inside data (4–16px), breathable for layout (8–48px). Widget gap `gap-6`, section gap `gap-8`, card padding `p-6`.
- **Components:** Import from `@/components/ui/*`. Compose patterns in `components/blocks/`. See `docs/component-conventions.md`.

## Surfaces

| Job | Use |
|-----|-----|
| Primitives | `components/ui/` — 51 AlignUI components |
| Composed patterns | `components/blocks/` |
| Token preview | `/` (Next.js dev) |
| Full catalog | Storybook at `/storybook` |

## Do not use

Dropped tokens: `verified-*`, `highlighted-*`, `stable-*`. Marketing type scale (`text-title-h1`–`h5`, `text-doc-*`). AlignUI Figma Custom Icons. `*Fill` Remix icons in product UI.
