# SpotGov design tokens (Phase 2 — locked)

Canonical decisions for SpotGov product UI, curated from AlignUI Design System 2.0. **This doc is the source of truth** for naming, values, and where each token applies. Code in `app/globals.css` is synced; Figma variables follow in a manual pass (code wins).

**Accessibility companion:** [`docs/accessibility.md`](./accessibility.md) — WCAG baseline, contrast pairings, keyboard focus, status, and component state rules.

**Agent entry point:** [`AGENTS.md`](../AGENTS.md) — workflow, non-negotiables, and full doc read order.

**Figma file:** [AlignUI Design System 2.0](https://www.figma.com/design/zTiVrKUV6Isp2fdWjl2dg3/AlignUI---Design-System-2.0--Current-)

---

## Color palette

**Philosophy:** Keep AlignUI semantic structure, simplify. SpotGov is restrained and neutral; `primary-base` is the main accent. Not a bright or shiny product.

### Primary

| Token | Value (target) | Where to use |
|-------|----------------|--------------|
| `primary-base` | AlignUI `blue-500` (`#335CFF`) | Primary buttons, text links, active nav, focus rings, selected states |
| `primary-darker` / `primary-dark` | Hover / pressed steps | Button hover, link hover, pressed interactive states |
| `primary-alpha-24` / `-16` / `-10` | Tinted fills | Selected row backgrounds, subtle highlights, ghost button hover |

**Rule:** One visible brand blue in UI chrome. System tints (darker steps, alphas, `information-light`) are the same hue — not separate accents. Avoid raw `blue-*`, `sky-*`, or viz blues as standalone UI chrome.

### Neutral semantic stack

Keep AlignUI Token System roles as-is (no SG re-theming of neutrals).

| Role | Tokens | Where to use |
|------|--------|--------------|
| **Static** | `static-black`, `static-white` | Absolute black/white — text on filled buttons, inverse surfaces |
| **Background** | `bg-strong-950`, `bg-surface-800`, `bg-sub-300`, `bg-soft-200`, `bg-weak-50`, `bg-white-0` | Page canvas (`bg-white-0`), section fills (`bg-weak-50`), disabled fields, subtle panels |
| **Text** | `text-strong-950`, `text-sub-600`, `text-soft-400`, `text-disabled-300`, `text-white-0` | Headings and primary copy; secondary copy, metadata, and descriptions; decorative low-emphasis text only; disabled labels; text on dark/filled surfaces |
| **Stroke** | `stroke-strong-950`, `stroke-sub-300`, `stroke-soft-200`, `stroke-white-0` | Input borders (`stroke-soft-200`), dividers, card rings, table borders |
| **Icon** | Mirror text roles | Same pairing as text — `icon-sub-600` for neutral actions, semantic `*-base` for status |

### Status (core)

| Token | Where to use |
|-------|--------------|
| `warning-*` | Deadlines approaching, incomplete profiles, non-blocking validation |
| `error-*` | Form errors, failed actions, destructive confirm, urgent deadlines |
| `success-*` | Completed steps, healthy sync, awarded/confirmed states |
| `feature-*` | AI capabilities, beta badges, premium highlights, agent panels |
| `away-*` | Draft, pending review, on hold, in progress — workflow neutrals |
| `faded-*` | Archived, inactive, disabled records |
| `information-*` | Tips, help callouts, neutral informational banners |

**Status accessibility:** Status components must include a text label and a redundant non-color cue. Use `StatusBadge.Icon` or `StatusBadge.Dot`; do not present Awarded / Pending / Rejected states through green/yellow/red color alone.

### Dropped (do not use in product UI)

`verified-*`, `highlighted-*`, `stable-*`

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
| **4.1.2 Name, Role, Value** | Icon-only actions, custom controls, loading buttons, and status components expose names and states. |

### Contrast

| Use | Required pairing |
|-----|------------------|
| 12–14px body, captions, labels, metadata | `text-text-sub-600` or stronger on `bg-bg-white-0` |
| Primary copy and headings | `text-text-strong-950` |
| Disabled controls | `text-text-disabled-300` only when the control is actually disabled |
| Decorative / non-essential text | `text-text-soft-400` allowed only when the information is not required to complete a task |

`text-text-soft-400` is below AA for normal 12–14px text on `bg-bg-white-0`; do not use it for timestamps, table metadata, helper text, or other user-facing task information.

### Focus

Every interactive element must have a visible `focus-visible` state. Use the existing focus shadows for buttons (`shadow-button-primary-focus`, `shadow-button-important-focus`, `shadow-button-error-focus`) and pair focus rings with `primary-base` or `stroke-strong-950` depending on variant. Never remove outlines without replacing them.

### Status

Do not rely on hue alone. Pair semantic color with clear text and either an icon or a shape:

| Status | Token | Redundant cue |
|--------|-------|---------------|
| Awarded / completed | `success-*` | check icon |
| Pending / in review | `away-*` or `warning-*` | clock icon or dot |
| Rejected / failed | `error-*` | close/error icon |
| Disabled / inactive | `faded-*` | muted icon or disabled affordance |

---

## Typography

**Philosophy:** Minimal product scale. Two weights (400, 500). Hierarchy via size, weight, and color. Inter. Body at 14px / 400 with `-0.006em` tracking.

### Six product roles

| SG role | Preferred utility | Legacy AlignUI utility | Spec | Where to use |
|---------|-------------------|------------------------|------|--------------|
| Page title | `text-sg-page-title` | `text-title-h6` | 20px / 28px / 500 | Top of page — dashboard title, detail view title |
| Section heading | `text-sg-section` | `text-label-md` | 16px / 24px / 500 | Card headers, modal titles, settings group labels |
| Body | `text-sg-body` | `text-paragraph-sm` | 14px / 20px / 400 | Descriptions, table cell text, form helper copy, nav labels |
| Label | `text-sg-label` | `text-label-sm` | 14px / 20px / 500 | Field labels, column headers, button text, emphasized inline text |
| Caption | `text-sg-metadata` | `text-paragraph-xs` | 12px / 16px / 400 | Timestamps, footnotes, secondary metadata |
| Micro label | `text-sg-small-label` | `text-label-xs` | 12px / 16px / 500 | Badges, tags, compact table headers, filter chips |

**Naming rule:** Use SG semantic aliases in new product UI and docs. Legacy AlignUI utility names remain available inside imported primitives and compatibility layers, but avoid heading-level names (`h1`–`h6`) for product roles.

### Color pairing

| Copy type | Token |
|-----------|-------|
| Primary | `text-strong-950` |
| Secondary | `text-sub-600` |
| Metadata | `text-sub-600` |
| Decorative low emphasis | `text-soft-400` |

### Do not use in product UI

`text-title-h1`–`h5`, `text-paragraph-xl/lg/md`, `text-label-xl/lg`, `text-subheading-*`, `text-doc-*`, marketing hero styles. `text-title-h6` is compatibility-only; prefer `text-sg-page-title`.

---

## Icons

**Philosophy:** Remix Icon Line only — sleek, lightweight. Do not use AlignUI Figma Custom Icons. Curated allowlist only.

**Library:** `@remixicon/react` — always `*Line`, never `*Fill` in product UI.

### Size scale

| Token | Utility | Size | Where to use |
|-------|---------|------|--------------|
| Inline | `size-icon-inline` | 14px | Table row actions, tags, hints, compact buttons |
| Default | `size-icon` | 16px | Buttons, inputs, nav items, dropdowns, toasts |
| Emphasis | `size-icon-emphasis` | 20px | Empty states, onboarding illustrations — rare |

**Do not shrink:** checkbox, radio, switch control boxes (~20px) — only decorative glyphs follow this scale.

### Color

Mirror text roles: `text-text-sub-600` (neutral), `text-text-strong-950` (emphasis), semantic `*-base` for status.

### Allowlist

Documented in repo — chrome, actions, objects, status, and domain icons (`RiBuildingLine`, `RiSparklingLine`, etc.). New icons require allowlist addition.

### Exceptions

`FileFormatIcon`, avatar empty-state SVGs, OAuth brand marks.

---

## Grid system

**Philosophy:** AlignUI dashboard grid as-is — desktop only (no mobile grid for now).

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

**AI layout pattern:** Specify shell + column spans — e.g. *“Sidebar Expanded. Row 1: three KPI widgets × 4 cols. Row 2: table × 12 cols.”*

### Responsive contract

The 12-column dashboard grid applies at desktop widths. Use Tailwind's default breakpoints for responsive behavior:

| Range | Layout rule |
|-------|-------------|
| `< md` | Single-column content. Avoid dense side-by-side data widgets. Navigation collapses to topbar or drawer. |
| `md`–`lg` | Two-column opportunities only when both panels remain readable; otherwise stack. |
| `lg+` | Use the documented 12-column shell/grid variants. |
| `2xl` | Keep content within the 1440px grid; do not stretch tables or cards indefinitely. |

For AI-generated screens, always specify both the desktop shell and the collapse behavior for smaller breakpoints.

---

## Shadows

**Philosophy:** Minimal elevation — two regular shadows only. Ring-first for resting surfaces; shadow for float. No custom stacks or colored shadows in product UI.

**Figma:** [Shadow](https://www.figma.com/design/zTiVrKUV6Isp2fdWjl2dg3/AlignUI---Design-System-2.0--Current-?node-id=2767-1801)

### Product shadows (lock these)

| Token | AlignUI name | Value | Where to use |
|-------|--------------|-------|--------------|
| `shadow-regular-xs` | X-Small | `0 1px 2px 0 #0a0d1408` | Resting elevation — inputs, selects, cards at rest, steppers, compact buttons |
| `shadow-regular-md` | Medium | `0 16px 32px -12px #0e121b1a` | Floating layers — dropdowns, modals, popovers, command menu |

### Usage rules

- **Default pattern:** `ring-1 ring-stroke-soft-200` + `shadow-regular-xs` on bordered controls (AlignUI select/input pattern).
- **One shadow per element** — do not stack `regular-xs` and `regular-md`.
- **Prefer ring over shadow** when a 1px border already defines the edge (dense tables, inline panels).

### Reference only (component internals — do not pick manually)

`shadow-button-*-focus`, `shadow-tooltip`, `shadow-fancy-buttons-*`

### Do not use in product UI

`shadow-custom-*` (xs/lg stacks), colored shadows (Primary/Purple/Orange), `shadow-fancy-buttons-*`, `shadow-regular-sm` (redundant between xs and md).

---

## Corner radius

**Philosophy:** Modern and friendly, not Excel-dense and not iOS-consumer. **12–16px is the product band.** Soft containers, precise data — round the workspace, not every cell.

**Visual goal:** Flowing B2B SaaS — agentic where it matters (AI panels), restrained elsewhere.

### Scale

| Tier | Preferred utility | Compatibility aliases | Value | Where to use |
|------|-------------------|-----------------------|-------|--------------|
| **Micro** | `rounded-8` | `rounded-lg`, `rounded-sg-micro` | 8px | Tags, badges, micro chips **only** — elements ≤28px tall |
| **Default** | `rounded-12` | `rounded-10`, `rounded-md`, `rounded-sg-default` | **12px** | **Primary interactive** — buttons, inputs, selects, nav items, dropdown rows, accordion |
| **Surface** | `rounded-16` | `rounded-sg-lg`, `rounded-sg-surface` | **16px** | **Content containers** — cards, KPI widgets, alert bodies, AI message blocks, empty states |
| **Overlay** | `rounded-20` | `rounded-sg-overlay` | 20px | Modals, popovers, command menu, drawer panels |
| **Full** | `--radius-full` / `rounded-full` | 9999px | Circular affordances only — see below |

**Naming rule:** Prefer the numeric utilities in new product UI. Compatibility aliases exist because AlignUI defaults and older code used misleading names (`rounded-lg` = 8px, `rounded-10` = 12px).

### SG floor rule

**No user-facing surface below 12px** except micro chips (tags/badges). Migrate legacy interactive radii to `rounded-12`.

**Ceiling:** Do not use 24–28px on product chrome — reads consumer/iOS. Overlays cap at 20px (`rounded-20`).

### Where each tier lives

| Surface | Radius | Rationale |
|---------|--------|-----------|
| Buttons, inputs, selects | 12px | Consistent interactive rhythm |
| Sidebar nav items, tabs, dropdown items | 12px | Same language as buttons |
| Cards, panels, KPI widgets | 16px | Soft workspace — content floats |
| Modals, popovers | 20px | Elevated layer, AlignUI default |
| Data tables | **0px on rows** | Scan lines stay flat; round the **card wrapper** at 16px |
| Tags, status badges | 8px micro or 12px if taller | Density vs readability |
| AI / agent panels | 16px | Conversational block — not a pill |

### Full radius — when and why

**Use `rounded-full` for:**

| Element | Why |
|---------|-----|
| Avatars | Universal person metaphor |
| Switch thumbs | Toggle affordance |
| Icon-only circular buttons | Clear hit target (compact button + `fullRadius`) |
| Pagination dots | Page indicator convention |
| Status dots in badges | Indicator light |
| Segmented control pills | Sliding capsule (theme switch) |

**Do not use full radius on:** cards, modals, primary CTA buttons, table rows, AI text blocks, list items. Full on rectangles reads chat-app / consumer, hurts scanability in dense data UI.

---

## Spacing

**Philosophy:** Dual-density on a **4px base grid**. Dense where data and controls compete for space; breathable where users orient and flow between tasks. Same grid as AlignUI/Tailwind — no custom spacing variables. Document **when to use which steps**, not a parallel token system.

**Visual goal:** Round and pad the container; keep the data flat and tight inside. Not Excel-dense, not marketing-site airy.

### Base grid

All spacing values are **multiples of 4px**. Use Tailwind's default spacing scale (`1` = 4px, `2` = 8px, etc.).

### Two density modes

| Mode | Step by | Allowed values | Tailwind utilities |
|------|---------|----------------|-------------------|
| **Dense** | 4px | 4, 8, 12, 16 | `1`, `2`, `3`, `4` |
| **Breathable** | 8px | 8, 16, 24, 32, 40, 48 | `2`, `4`, `6`, `8`, `10`, `12` |

Dense and breathable overlap at **8px and 16px** — that is intentional. The choice is which steps are allowed in each context, not two unrelated systems.

### Bridge to grid tokens

| Locked grid token | Spacing role |
|-------------------|--------------|
| 24px column gutter | Default **breathable** gap between widgets in a row |
| 32px sidebar → content gap | **Breathable** shell break — major layout, not component internals |

### Dense (4px rhythm)

Use **4px steps, cap at 16px** inside these surfaces:

| Surface | Spacing | Tailwind |
|---------|---------|----------|
| Table rows / cells | 8–12px vertical, 12–16px horizontal | `py-2`–`py-3`, `px-3`–`px-4` |
| Toolbars / filter bars | 8px between controls | `gap-2` |
| Tags, badges, status chips | 4–8px internal | `gap-1`–`gap-2`, `px-2` |
| Dropdown / menu items | 8px padding | `p-2` |
| Label → field | 8px gap | `gap-2` |
| Button icon gap | 12px | `gap-3` (AlignUI default — keep) |
| Inline metadata rows | 8px | `gap-2` |

### Breathable (8px rhythm)

Use **8px steps** for layout and containers:

| Surface | Spacing | Tailwind |
|---------|---------|----------|
| Card / panel padding | 20–24px | `p-5`–`p-6` |
| Between form fields | 16px | `gap-4` |
| Between dashboard widgets | 24px | `gap-6` (matches column gutter) |
| Page header → content | 24–32px | `gap-6`–`gap-8` |
| Modal header / body / footer | AlignUI defaults | `p-5`, internal `gap-3.5` — keep |
| AI / agent panels | 24px internal | `p-6` |
| Section breaks on a page | 32–40px | `gap-8`–`gap-10` |

### Nesting rule

**One density per nesting level:** page = breathable → card = breathable → table = dense. Do not skip levels (e.g. dense table directly on page canvas without a padded container).

```
┌─ Card (16px radius, 24px padding) ────────────────┐
│  Section heading                                 │
│  gap-4 (16px)                                    │
│  ┌─ Table (dense: 8–12px rows) ───────────────┐ │
│  │  flat rows, no row radius                     │ │
│  └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
         ↕ gap-6 (24px) to next widget
```

### Defaults (lock these)

| Context | Value | Tailwind |
|---------|-------|----------|
| Widget-to-widget | 24px | `gap-6` |
| Section-to-section | 32px | `gap-8` |
| Card interior padding | 24px | `p-6` |
| Form field stack | 16px | `gap-4` |

### Usage rules

- **Trust AlignUI component defaults** for buttons, inputs, modals — override only at page/block level with the rules above.
- **Avoid in new layout code:** odd steps `1.5` (6px), `2.5` (10px), `5` (20px) at page level. AlignUI components may still use them internally; do not spread them across page layout.
- **Spacing and radius must agree:** 16px surface radius wants **24px card padding** — 8px padding on a 16px-radius card feels tight and cheap.
- **Do not add custom CSS spacing variables** unless semantic aliases are needed later (e.g. `space-section` = 24px).

### Do not use in product UI

- Single global density — every screen must pick dense or breathable **per surface**, not per product.
- `gap-5` (20px) between dashboard widgets — falls between the two modes; use 24px (`gap-6`) instead.
- Generous padding inside table rows — wastes viewport on tender lists and procurement data.

---

## Component states

### Buttons

All button variants must document and support these states:

| State | Requirement |
|-------|-------------|
| Default | Uses semantic variant/mode tokens only |
| Hover | Uses existing darker/tinted token step |
| Pressed / active | Slightly stronger than hover; use the pressed token step (`primary-dark`, darker neutral, or error dark) |
| Focus-visible | Visible focus shadow/ring; keyboard-only when possible |
| Disabled | Non-interactive, `disabled` attribute, `text-text-disabled-300` |
| Loading | Keeps button width stable, sets `aria-busy`, disables repeated submission, and shows a non-color loading indicator |

### Badges and status

Use status badges for workflow state and regular badges for category labels. Status badges require label text plus an icon or dot. Category badges may use color as decoration, but category meaning must still be present in the text.

---

## Phase 2 inventory

Phase 2 complete (30 Jun 2026). Token definition + code sync done; Figma variable push is manual follow-up.

| Category | Status | Notes |
|----------|--------|-------|
| Color palette | **Locked + synced** | `globals.css` primary → `#335CFF` |
| Typography | **Locked** | Six roles; preview updated |
| Icons | **Locked + synced** | Remix Line, sizes; components migrated |
| Grid system | **Locked** | Four shells, desktop only |
| Shadows | **Locked + synced** | `regular-xs` + `regular-md`; preview added |
| Corner radius | **Locked + synced** | 12px floor in components + `rounded-md` → 12px |
| Spacing | **Locked** | Dual-density rules; preview added |
| **Agent docs** | **Done** | `AGENTS.md` + `product-principles`, `component-patterns`, `copy` |
| **Figma value sync** | Manual follow-up | Code + doc canonical; push to Figma when ready |
| **Figma variable code syntax** | Manual follow-up | Set in Figma Dev Mode for MCP |
| **Token preview site** | **Done** | Typography, color, radius, shadows, spacing, components |

### Notion Phase 2 checklist ([Full Build Plan](https://app.notion.com/p/38e382d615938192a2b4c9057e00c286))

| Notion item | Our progress |
|-------------|--------------|
| Export/list Figma tokens | **Done** — curated in `docs/design-tokens.md` |
| Reconcile code ↔ Figma ↔ brand | **Done** — doc + code canonical |
| Brand tokens verified | **Done** — AlignUI semantic + SG curation (supersedes old brand doc) |
| Typography tokens | **Done** — Inter, six roles |
| Token reference page | **Done** — `/` token preview |
| Code sync (`globals.css`) | **Done** — primary, radius, components |
| Figma variable code syntax | **Manual follow-up** |
| Migrate to Tailwind v4 `@theme` | **N/A** — repo stays Tailwind v3.4 |

---

## Next steps

1. **Phase 3** — component library complete (54 primitives + Pro Blocks). Figma parity spot-checked on top primitives (2 Jul 2026).
2. **Phase 4 (expand)** — which-one-when guide, component manifest, Claude Skill.
3. **Figma sync** — push locked values and code syntax to variable collections (manual).
