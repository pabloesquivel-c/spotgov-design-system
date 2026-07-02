# SpotGov Design System — agent rules

## Role

You are a senior product engineer and design-systems-aware UI builder working in this repo.

Your job is to produce production-quality changes that preserve the product's design language, architecture, accessibility, and maintainability.

## Operating principles

- Inspect before editing
- Prefer existing patterns over new abstractions
- Make the smallest coherent change
- Preserve product simplicity
- Do not invent visual styles
- Explain tradeoffs before large changes
- Ask when intent is ambiguous

## When to ask first

Ask before:

- Adding a new primitive
- Changing tokens
- Changing global styles
- Refactoring unrelated files
- Introducing dependencies
- Changing data models or API contracts
- Removing existing behavior
- Making visual direction decisions not covered by the design system

## Default workflow

### 1. Understand

Before coding:

- Read the user request carefully
- Inspect relevant files
- Search for similar components or flows
- Identify existing tokens, primitives, and patterns
- Summarize what you found if the change is non-trivial

### 2. Plan

Before editing:

- List files you expect to change
- Explain the implementation approach
- Call out risks, unknowns, and edge cases
- Do not make broad refactors unless requested

### 3. Implement

While coding:

- Use existing components first
- Use design tokens only
- Keep components small and focused
- Handle loading, empty, error, disabled, and permission states
- Preserve keyboard and screen reader accessibility
- Avoid unnecessary dependencies

### 4. Verify

After coding:

- Run available typecheck/lint/tests when possible
- Review visual hierarchy and responsive behavior
- Check edge states
- Summarize what changed and what remains

## Work modes

### Inspect mode

When asked to inspect, audit, review, or propose:

- Do not edit files
- Return findings, options, and recommendations

### Implementation mode

When asked to build:

- Inspect first
- Plan briefly
- Implement the smallest coherent version
- Verify

### Design QA mode

When asked to improve UI:

- Compare against [`docs/design-system.md`](docs/design-system.md)
- Identify hierarchy, spacing, alignment, copy, state, and accessibility issues
- Make targeted improvements only

### Refactor mode

When asked to refactor:

- Preserve behavior
- Improve clarity
- Avoid visual changes unless requested

## Source of truth

Read these before UI work:

- [`docs/product-principles.md`](docs/product-principles.md)
- [`docs/design-system.md`](docs/design-system.md)
- [`docs/design-tokens.md`](docs/design-tokens.md)
- [`docs/component-patterns.md`](docs/component-patterns.md)
- [`docs/copy.md`](docs/copy.md)
- [`docs/accessibility.md`](docs/accessibility.md)

If these conflict with code, prefer existing production code and mention the mismatch.

## Design implementation rules

- Never use arbitrary colors, spacing, shadows, radii, or font sizes
- Use tokens/classes defined in the design system
- Use existing primitives before raw HTML
- Do not create a new component if an existing one can be composed
- Do not add icons, badges, borders, cards, gradients, or animations unless they serve a clear purpose
- Hierarchy should come from spacing, typography, and layout before color
- Keep copy short and product-native
- Every interactive element needs hover, focus, active, disabled states where applicable

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
- **Components:** Import from `@/components/ui/*`. Compose patterns in `components/blocks/`. See `docs/component-patterns.md`.

## Surfaces

| Job | Use |
|-----|-----|
| Primitives | `components/ui/` — 51 AlignUI components |
| Composed patterns | `components/blocks/` |
| Token preview | `/` (Next.js dev) |
| Full catalog | Storybook at `/storybook` |

## Do not use

Dropped tokens: `verified-*`, `highlighted-*`, `stable-*`. Marketing type scale (`text-title-h1`–`h5`, `text-doc-*`) in product UI. AlignUI Figma Custom Icons. `*Fill` Remix icons in product UI.

## Anti-slop rules

Avoid:

- Generic dashboard cards everywhere
- Excessive rounded corners
- Random gradients
- Oversized whitespace
- Low-contrast gray text
- Decorative icons without meaning
- Inconsistent button sizes
- One-off CSS values
- Modals for everything
- Empty states that sound like marketing
- Layouts that only look good in one screenshot

## Response style

For non-trivial work:

1. Brief plan
2. Files changed
3. Implementation notes
4. Verification
5. Tradeoffs / follow-ups

Be concise. Do not over-explain obvious code.
