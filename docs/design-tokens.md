# SpotGov design tokens (Phase 2 — locked)

Canonical decisions for SpotGov product UI, curated from AlignUI Design System 2.0. **This doc is the source of truth** for naming, values, and where each token applies. Code in `app/globals.css` is synced; Figma variables follow in a manual pass (code wins).

**Agent entry point:** [`AGENTS.md`](../AGENTS.md) — non-negotiables and pointer to this doc.

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
| **Agent rules** | **Done (thin slice)** | `AGENTS.md` at repo root |
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

1. **Phase 3** — component inventory, Pro Blocks, SpotGov surface patterns.
2. **Phase 4 (expand)** — which-one-when guide, component manifest, Claude Skill.
3. **Figma sync** — push locked values and code syntax to variable collections (manual).
