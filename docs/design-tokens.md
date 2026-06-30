# SpotGov design tokens (Phase 2 — locked)

Canonical decisions for color palette and typography, curated from AlignUI Design System 2.0 for SpotGov product UI. Values in `app/globals.css` will be synced to Figma in a later pass; this doc is the source of truth for naming and usage.

## Color palette

**Philosophy:** Keep AlignUI semantic structure, simplify. SpotGov is restrained and neutral; `primary-base` is the main accent. Not a bright or shiny product.

### Primary

| Token | Use |
|-------|-----|
| `primary-base` | Brand blue — buttons, links, focus rings. Target: AlignUI `blue-500` (`#335CFF`) |
| `primary-darker` / `primary-dark` | Hover and pressed interactive states |
| `primary-alpha-24` / `-16` / `-10` | Subtle fills and selection backgrounds |

**Rule:** One visible brand blue in UI chrome. System tints (darker steps, alphas, `information-light`) are the same hue — not separate accents. Avoid raw `blue-*`, `sky-*`, or viz blues as standalone UI chrome.

### Neutral semantic stack

Keep AlignUI Token System roles as-is (no SG re-theming of neutrals):

- **Static:** `static-black`, `static-white`
- **Background:** `bg-strong-950`, `bg-surface-800`, `bg-sub-300`, `bg-soft-200`, `bg-weak-50`, `bg-white-0`
- **Text:** `text-strong-950`, `text-sub-600`, `text-soft-400`, `text-disabled-300`, `text-white-0`
- **Stroke:** `stroke-strong-950`, `stroke-sub-300`, `stroke-soft-200`, `stroke-white-0`
- **Icon:** mirror text roles (`icon-strong-950`, `icon-sub-600`, etc.)

### Status (core)

| Token | Use |
|-------|-----|
| `warning-*` | Needs attention, not urgent |
| `error-*` | Issues, missing requirements, urgent deadlines, destructive actions |
| `success-*` | Healthy or complete states |

### Special accents (2 only)

| Token | Use |
|-------|-----|
| `feature-*` | New capabilities, AI features, beta, premium highlights |
| `away-*` | Pipeline/workflow neutrals — Draft, Pending review, On hold, In progress |

### Utility

| Token | Use |
|-------|-----|
| `faded-*` | Inactive, archived, disabled UI |
| `information-*` | Neutral tips and callouts (blue-500 family, lighter tints for backgrounds) |

### Dropped (do not use in product UI)

`verified-*`, `highlighted-*`, `stable-*`

---

## Typography

**Philosophy:** Minimal product scale. Two weights (400, 500). Hierarchy via size, weight, and color. Inter. Body at 14px / 400 with `-0.006em` tracking.

### Six product roles

| SG role | AlignUI utility | Spec |
|---------|-----------------|------|
| Page title | `text-title-h6` | 20px / 500 |
| Section heading | `text-label-md` | 16px / 500 |
| Body | `text-paragraph-sm` | 14px / 400 / `-0.006em` |
| Label | `text-label-sm` | 14px / 500 |
| Caption | `text-paragraph-xs` | 12px / 400 |
| Micro label | `text-label-xs` | 12px / 500 |

### Color pairing

- Primary copy: `text-strong-950`
- Secondary copy: `text-sub-600`
- Metadata: `text-soft-400`

### Product-only — do not use

`text-title-h1`–`h5`, `text-paragraph-xl/lg/md`, `text-label-xl/lg`, `text-subheading-*`, `text-doc-*`, marketing hero styles.
