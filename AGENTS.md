# SpotGov Design System — agent rules

**Canonical references:** [`docs/design-system.md`](docs/design-system.md) (components, patterns, AI rules) · [`docs/design-tokens.md`](docs/design-tokens.md) (token values) — read before any UI work.

## Non-negotiables

- **Tokens:** Use semantic utilities (`text-text-strong-950`, `bg-bg-white-0`, `primary-base`, `rounded-12`). Never raw hex in product UI.
- **Primary:** `primary-base` = `#335CFF` (AlignUI blue-500). One brand blue in chrome.
- **Typography:** Six roles only — page title (`text-sg-page-title`), section heading (`text-sg-section`), body (`text-sg-body`), label (`text-sg-label`), caption (`text-sg-metadata`), micro label (`text-sg-small-label`). Legacy AlignUI names may appear inside primitives, but new product UI should use SG aliases.
- **Icons:** `@remixicon/react` Line only. Sizes: `size-icon-inline` (14px), `size-icon` (16px), `size-icon-emphasis` (20px).
- **Accessibility:** WCAG 2.1 AA for user-facing text. Prioritize 1.4.3 Contrast, 1.4.1 Use of Color, 2.4.7 Focus Visible, 2.1.1 Keyboard, 3.3.x Forms/Errors, and 4.1.2 Name/Role/Value. Do not use `text-text-soft-400` for 12–14px text on `bg-bg-white-0`; use `text-text-sub-600`. Status must not rely on color alone — include text plus an icon or shape.
- **Radius:** Prefer readable numeric utilities: micro `rounded-8`, interactives `rounded-12`, surfaces `rounded-16`, overlays `rounded-20`. Legacy `rounded-10`, `rounded-sg-lg`, and `rounded-lg` are compatibility aliases. Tables flat inside; round the wrapper.
- **Shadows:** `shadow-regular-xs` at rest, `shadow-regular-md` for float. Ring-first pattern. One shadow per element.
- **Spacing:** Dual-density on 4px grid — dense inside data (4–16px), breathable for layout (8–48px). Widget gap `gap-6`, section gap `gap-8`, card padding `p-6`.
- **States:** Interactive components need hover, pressed/active, focus-visible, disabled, and loading guidance where relevant. Buttons must expose disabled/loading accessibly.
- **Components:** Import from `@/components/ui/*`. Compose patterns in `components/blocks/`. See `docs/component-conventions.md`.

## Surfaces

| Job | Use |
|-----|-----|
| Primitives | `components/ui/` — 51 AlignUI components |
| Composed patterns | `components/blocks/` |
| Token preview | `/` (Next.js dev) |
| Full catalog | Storybook at `/storybook` |

## Do not use

Dropped tokens: `verified-*`, `highlighted-*`, `stable-*`. Marketing type scale (`text-title-h1`–`h5`, `text-doc-*`) in product UI. AlignUI Figma Custom Icons. `*Fill` Remix icons in product UI.
