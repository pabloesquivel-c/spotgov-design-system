# SpotGov design tokens

SpotGov product UI is built **directly on AlignUI's design tokens, used as they ship**. This doc describes AlignUI's token system and how we apply it — it is a description of the foundation, **not** a parallel set of overrides.

**Guiding principle:** Do not re-theme AlignUI's scales. AlignUI's palette, radius, typography, shadow, and spacing tokens are a curated, self-consistent system; overriding them in `globals.css`/`tailwind.config.ts` breaks the look. SpotGov-specific theming (e.g. a brand primary hue, font choice) is layered **on top** through AlignUI's own CSS variables, without redefining the underlying ramps. Until that theme lands, treat AlignUI defaults as canonical.

**Accessibility companion:** [`docs/accessibility.md`](./accessibility.md) — WCAG baseline, contrast pairings, keyboard focus, status, and component state rules.

**Agent entry point:** [`AGENTS.md`](../AGENTS.md) — workflow, non-negotiables, and full doc read order.

**Figma file:** [AlignUI Design System 2.0](https://www.figma.com/design/zTiVrKUV6Isp2fdWjl2dg3/AlignUI---Design-System-2.0--Current-)

---

## Color palette

Use AlignUI's **semantic** token roles. Do not hardcode hex values or pick raw palette scales (`blue-*`, `slate-*`) directly in product UI — go through the semantic layer so theming stays centralized.

### Primary

| Token | Where to use |
|-------|--------------|
| `primary-base` | Primary buttons, text links, active nav, focus rings, selected states |
| `primary-darker` / `primary-dark` | Button hover, link hover, pressed interactive states |
| `primary-alpha-24` / `-16` / `-10` | Selected row backgrounds, subtle highlights, ghost/tinted button hover |

### Neutral semantic stack

| Role | Tokens | Where to use |
|------|--------|--------------|
| **Static** | `static-black`, `static-white` | Absolute black/white — text on filled buttons, inverse surfaces |
| **Background** | `bg-strong-950`, `bg-surface-800`, `bg-sub-300`, `bg-soft-200`, `bg-weak-50`, `bg-white-0` | Page canvas (`bg-white-0`), section fills (`bg-weak-50`), disabled fields, subtle panels |
| **Text** | `text-strong-950`, `text-sub-600`, `text-soft-400`, `text-disabled-300`, `text-white-0` | Headings and primary copy; secondary copy and metadata; low-emphasis decorative text; disabled labels; text on dark/filled surfaces |
| **Stroke** | `stroke-strong-950`, `stroke-sub-300`, `stroke-soft-200`, `stroke-white-0` | Input borders (`stroke-soft-200`), dividers, card rings, table borders |
| **Icon** | Mirror text roles | `text-sub-600` for neutral actions, semantic `*-base` for status |

### Status

| Token | Where to use |
|-------|--------------|
| `warning-*` | Deadlines approaching, incomplete profiles, non-blocking validation |
| `error-*` | Form errors, failed actions, destructive confirm, urgent deadlines |
| `success-*` | Completed steps, healthy sync, awarded/confirmed states |
| `feature-*` | AI capabilities, beta badges, premium highlights, agent panels |
| `away-*` | Draft, pending review, on hold, in progress — workflow neutrals |
| `faded-*` | Archived, inactive, disabled records |
| `information-*` | Tips, help callouts, neutral informational banners |

**Status accessibility:** Status components must include a text label and a redundant non-color cue. Use `StatusBadge.Icon` or `StatusBadge.Dot`; never signal Awarded / Pending / Rejected through color alone.

---

## Accessibility baseline

**Standard:** SpotGov product UI targets WCAG 2.1 AA.

### WCAG criteria map

| Criterion | Design-system rule |
|-----------|--------------------|
| **1.4.3 Contrast (Minimum)** | 12–14px readable text uses `text-text-sub-600` or stronger on `bg-bg-white-0`. |
| **1.4.1 Use of Color** | Status, validation, and alerts pair semantic color with text plus an icon or shape. |
| **2.4.7 Focus Visible** | Interactive primitives keep a visible `focus-visible` ring or shadow. |
| **2.1.1 Keyboard** | Menus, dialogs, dropdowns, form controls, and primary flows remain keyboard operable. |
| **3.3.x Forms and Errors** | Labels, helper text, error text, and recovery guidance are part of form patterns. |
| **4.1.2 Name, Role, Value** | Icon-only actions, custom controls, and status components expose names and states. |

### Contrast

| Use | Required pairing |
|-----|------------------|
| 12–14px body, captions, labels, metadata | `text-text-sub-600` or stronger on `bg-bg-white-0` |
| Primary copy and headings | `text-text-strong-950` |
| Disabled controls | `text-text-disabled-300` only when the control is actually disabled |
| Decorative / non-essential text | `text-text-soft-400` only when the information is not required to complete a task |

`text-text-soft-400` is below AA for normal 12–14px text on `bg-bg-white-0`; do not use it for timestamps, table metadata, helper text, or other user-facing task information.

### Focus

Every interactive element must have a visible `focus-visible` state. Use the existing focus shadows (`shadow-button-primary-focus`, `shadow-button-important-focus`, `shadow-button-error-focus`) and pair focus rings with `primary-base` or `stroke-strong-950` depending on variant. Never remove outlines without replacing them.

---

## Typography

Use **AlignUI's native type utilities**. Hierarchy comes from size, weight, and color — not custom scales.

| Product role | AlignUI utility | Spec | Where to use |
|--------------|-----------------|------|--------------|
| Page title | `text-title-h6` | 20px / 28px / 500 | Top of page — dashboard title, detail view title |
| Section heading | `text-label-md` | 16px / 24px / 500 | Card headers, modal titles, settings group labels |
| Body | `text-paragraph-sm` | 14px / 20px / 400 | Descriptions, table cell text, form helper copy, nav labels |
| Label | `text-label-sm` | 14px / 20px / 500 | Field labels, column headers, button text, emphasized inline text |
| Caption / metadata | `text-paragraph-xs` | 12px / 16px / 400 | Timestamps, footnotes, secondary metadata |
| Micro label | `text-label-xs` | 12px / 16px / 500 | Badges, tags, compact table headers, filter chips |

Larger `title-h1`–`h5`, `paragraph-xl/lg`, `label-xl/lg`, `subheading-*`, and `doc-*` utilities exist in AlignUI for marketing and document contexts; reach for them only when a screen genuinely needs that scale.

### Color pairing

| Copy type | Token |
|-----------|-------|
| Primary | `text-strong-950` |
| Secondary / metadata | `text-sub-600` |
| Decorative low emphasis | `text-soft-400` |

---

## Icons

**Library:** `@remixicon/react` — prefer `*Line` in product UI.

### Size scale (AlignUI conventions)

| Utility | Size | Where to use |
|---------|------|--------------|
| `size-4` | 16px | Table row actions, tags, hints, compact/inline contexts |
| `size-5` | 20px | Default — buttons, inputs, nav items, dropdowns, toasts |
| `size-6` | 24px | Empty states, onboarding illustrations, prominent headers |

Checkbox, radio, and switch control boxes keep their AlignUI sizes — do not shrink them.

### Color

Mirror text roles: `text-text-sub-600` (neutral), `text-text-strong-950` (emphasis), semantic `*-base` for status.

### Exceptions

`FileFormatIcon`, avatar empty-state SVGs, OAuth brand marks.

---

## Corner radius

Use AlignUI's radius scale as-is. AlignUI ships two custom radii (`rounded-10`, `rounded-20`) alongside Tailwind's defaults; together they form the scale below. **Do not redefine these tokens** in `tailwind.config.ts`.

| Utility | Value | Where to use |
|---------|-------|--------------|
| `rounded-lg` | 8px | Small controls (small/xsmall buttons, inputs), tags, badges |
| `rounded-10` | 10px | **AlignUI's signature control radius** — medium buttons, inputs, selects |
| `rounded-xl` | 12px | Occasional mid surfaces where AlignUI uses it |
| `rounded-2xl` | 16px | Content containers — cards, KPI widgets, alert bodies |
| `rounded-20` | 20px | Modals, popovers, command menu, drawer panels |
| `rounded-full` | 9999px | Circular affordances — avatars, switch thumbs, icon-only round buttons, dots, segmented pills |

**Trust primitive defaults.** Buttons, inputs, selects, and modals already apply the correct radius — do not override them per-instance. Match a component's radius only when composing custom surfaces around it.

**Do not use full radius on:** cards, modals, primary CTA buttons, table rows, list items. Full on rectangles reads consumer/chat-app and hurts scannability in dense data UI.

---

## Shadows

Minimal elevation — ring-first for resting surfaces, shadow for float. No custom stacks or colored shadows in product UI.

| Token | AlignUI name | Value | Where to use |
|-------|--------------|-------|--------------|
| `shadow-regular-xs` | X-Small | `0 1px 2px 0 #0a0d1408` | Resting elevation — inputs, selects, cards at rest, steppers, compact buttons |
| `shadow-regular-md` | Medium | `0 16px 32px -12px #0e121b1a` | Floating layers — dropdowns, modals, popovers, command menu |

### Usage rules

- **Default pattern:** `ring-1 ring-stroke-soft-200` + `shadow-regular-xs` on bordered controls (AlignUI select/input pattern).
- **One shadow per element** — do not stack `regular-xs` and `regular-md`.
- **Prefer ring over shadow** when a 1px border already defines the edge (dense tables, inline panels).

`shadow-button-*-focus`, `shadow-tooltip`, and `shadow-fancy-buttons-*` are component internals — do not pick them manually.

---

## Grid system

AlignUI dashboard grid, used as-is — desktop-first (no separate mobile grid for now).

**Figma:** [Grid System](https://www.figma.com/design/zTiVrKUV6Isp2fdWjl2dg3/AlignUI---Design-System-2.0--Current-?node-id=2762-1284)

### Shared constants

| Token | Value | Where to use |
|-------|-------|--------------|
| Content grid width | 1440px | Max width of dashboard column zone |
| Page safe area | 170px each side | Desktop page margins to grid |
| Columns | 12 | All dashboard/widget layout |
| Column gutter | 24px | Between columns in widget rows |
| Sidebar → content gap | 32px | Space between nav and main content |

### Shell variants

| Shell | Sidebar | Submenu | Col width | Where to use |
|-------|---------|---------|-----------|--------------|
| **Sidebar Expanded** | 272px | — | 70px | **Default** — main app, full nav |
| **Sidebar Collapsed** | 80px | — | 86px | Narrow desktop, icon rail |
| **Sidebar & Submenu** | 80px | 264px | 64px | Deep nav + secondary panel |
| **Topbar** | — | — | 80px | No sidebar layouts |

### Responsive contract

| Range | Layout rule |
|-------|-------------|
| `< md` | Single-column content. Navigation collapses to topbar or drawer. |
| `md`–`lg` | Two-column only when both panels remain readable; otherwise stack. |
| `lg+` | Use the documented 12-column shell/grid variants. |
| `2xl` | Keep content within the 1440px grid; do not stretch tables or cards indefinitely. |

---

## Spacing

Use **Tailwind's default spacing scale** on a 4px grid (`1` = 4px, `2` = 8px, …). AlignUI does not define custom spacing variables, and neither do we — do not add any.

- **Trust AlignUI component defaults** for buttons, inputs, modals — set spacing only at page/block layout level.
- **Common layout defaults:** widget-to-widget `gap-6` (24px, matches the column gutter); section-to-section `gap-8` (32px); card interior `p-6` (24px); form-field stack `gap-4` (16px).
- **Dense data surfaces** (tables, toolbars, chips) tighten to 8–16px (`gap-2`–`gap-4`, `py-2`–`py-3`); keep containers padded and rows flat inside.

---

## Component states

### Buttons

All button variants support these states out of the box in AlignUI:

| State | Behavior |
|-------|----------|
| Default | Semantic variant/mode tokens |
| Hover | Darker/tinted token step |
| Focus-visible | Visible focus shadow/ring; keyboard-operable |
| Disabled | Non-interactive, `disabled` attribute, disabled text token |

> Pressed-state styling and a `loading` prop are **not** in stock AlignUI. If SpotGov needs them, add them deliberately as part of the theming/extension layer — not as ad-hoc edits to the primitive.

### Badges and status

Use status badges for workflow state and regular badges for category labels. Status badges require label text plus an icon or dot. Category badges may use color as decoration, but category meaning must still be present in the text.
