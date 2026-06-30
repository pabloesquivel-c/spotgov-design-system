# SpotGov design tokens (Phase 2 — locked)

Canonical decisions for SpotGov product UI, curated from AlignUI Design System 2.0. **This doc is the source of truth** for naming, values, and where each token applies. Code in `app/globals.css` and Figma variables will be synced in a later pass.

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
| **Text** | `text-strong-950`, `text-sub-600`, `text-soft-400`, `text-disabled-300`, `text-white-0` | Headings and primary copy; secondary copy and descriptions; timestamps and metadata; disabled labels; text on dark/filled surfaces |
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

### Dropped (do not use in product UI)

`verified-*`, `highlighted-*`, `stable-*`

---

## Typography

**Philosophy:** Minimal product scale. Two weights (400, 500). Hierarchy via size, weight, and color. Inter. Body at 14px / 400 with `-0.006em` tracking.

### Six product roles

| SG role | Utility | Spec | Where to use |
|---------|---------|------|--------------|
| Page title | `text-title-h6` | 20px / 500 | Top of page — dashboard title, detail view title |
| Section heading | `text-label-md` | 16px / 500 | Card headers, modal titles, settings group labels |
| Body | `text-paragraph-sm` | 14px / 400 | Descriptions, table cell text, form helper copy, nav labels |
| Label | `text-label-sm` | 14px / 500 | Field labels, column headers, button text, emphasized inline text |
| Caption | `text-paragraph-xs` | 12px / 400 | Timestamps, footnotes, secondary metadata |
| Micro label | `text-label-xs` | 12px / 500 | Badges, tags, compact table headers, filter chips |

### Color pairing

| Copy type | Token |
|-----------|-------|
| Primary | `text-strong-950` |
| Secondary | `text-sub-600` |
| Metadata | `text-soft-400` |

### Do not use in product UI

`text-title-h1`–`h5`, `text-paragraph-xl/lg/md`, `text-label-xl/lg`, `text-subheading-*`, `text-doc-*`, marketing hero styles.

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

| Tier | Token / utility | Value | Where to use |
|------|-----------------|-------|--------------|
| **Micro** | `--radius-sm` / `rounded-lg`* | 8px | Tags, status badges, micro chips **only** — elements ≤28px tall |
| **Default** | `--radius` / `rounded-10` | **12px** | **Primary interactive** — buttons, inputs, selects, nav items, dropdown rows, accordion |
| **Surface** | `--radius-lg` / `rounded-sg-lg` | **16px** | **Content containers** — cards, KPI widgets, alert bodies, AI message blocks, empty states |
| **Overlay** | `rounded-20` | 20px | Modals, popovers, command menu, drawer panels |
| **Full** | `--radius-full` / `rounded-full` | 9999px | Circular affordances only — see below |

\*AlignUI maps `rounded-lg` → 8px in `tailwind.config.ts` — this is the micro tier, not Tailwind default.

### SG floor rule

**No user-facing surface below 12px** except micro chips (tags/badges). Migrate legacy `rounded-md` (6px) on interactive elements to `rounded-10`.

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

## Phase 2 inventory

What is locked in this doc vs still open.

| Category | Status | Notes |
|----------|--------|-------|
| Color palette | **Locked** | Semantic stack + dropped tokens; code sync to `#335CFF` pending |
| Typography | **Locked** | Six roles; preview updated |
| Icons | **Locked** | Remix Line, sizes, allowlist; components migrated |
| Grid system | **Locked** | Four shells, desktop only |
| Shadows | **Locked** | `regular-xs` + `regular-md` only |
| Corner radius | **Locked** | 12/16/20 tier + full allowlist |
| **Spacing** | Not started | AlignUI spacing scale — next curation pass |
| **Figma value sync** | Not started | Names match; values still differ in places |
| **Figma variable code syntax** | Not started | Needed for MCP token output |
| **Token preview site** | Partial | Typography, color, radius — add shadows section later |
| **globals.css sync** | Partial | Doc ahead of code for primary + radius migration on components |

### Notion Phase 2 checklist ([Full Build Plan](https://app.notion.com/p/38e382d615938192a2b4c9057e00c286))

| Notion item | Our progress |
|-------------|--------------|
| Export/list Figma tokens | **Done** for color, type, icons, grid, shadow, radius |
| Reconcile code ↔ Figma names | **Done** for naming; values partially reconciled |
| Brand tokens verified | **Done** in doc; differs from old Notion brand hex — doc is canonical |
| Typography tokens | **Done** — Inter, six roles |
| Token reference page | **Partial** — `/` token preview; expand with shadows |
| Figma variable code syntax | **Not done** |
| Migrate to Tailwind v4 `@theme` | **N/A** — repo stays Tailwind v3.4 |

---

## Next steps

1. **Spacing** — curate AlignUI spacing tokens (same pass as above).
2. **Usage descriptions in agent rules** — fold this doc into `AGENTS.md` / `.cursor/rules` (Phase 4).
3. **Code sync** — align `globals.css` values + component radius (12px floor) to locked doc.
4. **Figma sync** — push locked values and code syntax to variable collections.
5. **Token preview** — add shadows section; expand radius tier labels.
