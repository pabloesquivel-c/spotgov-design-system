# SpotGov design system

Agent-facing guide for building product UI from this repo. **Existing system only** — curated AlignUI 2.0.

| Read order | Doc |
|------------|-----|
| 1 | [`AGENTS.md`](../AGENTS.md) |
| 2 | [`product-principles.md`](./product-principles.md) |
| 3 | **This doc** |
| 4 | [`component-manifest.md`](./component-manifest.md) (live inventory) |
| 5 | [`design-tokens.md`](./design-tokens.md) (token values) |
| 6 | [`component-patterns.md`](./component-patterns.md) |
| 7 | [`copy.md`](./copy.md) |
| 8 | [`accessibility.md`](./accessibility.md) |
| — | [`component-conventions.md`](./component-conventions.md) (imports and file layout) |

**Live:** `/` token preview · `/storybook` catalog  
**Stack:** Next.js 14 · React 18 · Tailwind 3.4 · Radix · `tailwind-variants` · `@remixicon/react` Line  
**Out of scope:** Framer marketing site · dark mode product UI (`app/layout.tsx`: `defaultTheme='light'`, `enableSystem={false}`)

---

## 1. Principles

| Principle | Exact rule |
|-----------|------------|
| Restrained B2B | One accent: `bg-primary-base` / `text-primary-base`. No extra blues in chrome. |
| Soft container, flat data | Surfaces `rounded-2xl` + `p-6`; table **wrapper** `rounded-20` (see `table-shared.tsx`); rows flat inside. |
| Semantic classes only | Never raw hex in product UI. |
| Native type roles | Use AlignUI type utilities: `text-title-h6`, `text-label-md`, `text-paragraph-sm`, `text-label-sm`, `text-paragraph-xs`, `text-label-xs`. |
| Ring + one shadow | `ring-1 ring-inset ring-stroke-soft-200` + `shadow-regular-xs` OR `shadow-regular-md` — not both tiers on one element. |
| Trust component defaults | Use AlignUI's built-in radius/spacing on primitives; set spacing only at page/block layout level. |
| Desktop-first | Productivity surfaces, not mobile-first marketing. |
| Compose | `@/components/ui/*` + `@/components/blocks/*`. |

**Default page surface** (`app/layout.tsx`): `bg-bg-white-0 text-text-strong-950`.

---

## 2. Architecture

```
components/ui/     → 51 primitives   import @/components/ui/<name>
components/blocks/ → Pro Blocks      compose patterns
components/        → header.tsx, theme-switch.tsx only (no new primitives)
app/globals.css    → CSS variables
tailwind.config.ts → semantic theme map
utils/cn.ts        → class merge
utils/tv.ts        → tailwind-variants (createTV)
```

**Compound API:** named exports (`Root`, `Icon`, `Wrapper`…), styled with `tv()`, merged with `cn()`.

```tsx
import * as Button from '@/components/ui/button';
import { TableBlock, BlockDataTable } from '@/components/blocks/table/table-shared';
```

---

## 3. Tokens

Values: [`design-tokens.md`](./design-tokens.md). Chain: **doc → `app/globals.css` → `tailwind.config.ts` → components**.

### 3.1 Token class naming (required)

Semantic tokens use **doubled role prefixes** in Tailwind utilities:

| Role | Pattern | Examples |
|------|---------|----------|
| Background | `bg-bg-*` | `bg-bg-white-0`, `bg-bg-weak-50`, `bg-bg-strong-950` |
| Text | `text-text-*` | `text-text-strong-950`, `text-text-sub-600`, `text-text-soft-400` |
| Stroke / ring | `ring-stroke-*`, `border-stroke-*` | `ring-stroke-soft-200` |
| Primary | `bg-primary-base`, `text-primary-base`, `ring-primary-base` | |
| Status | `bg-success-lighter`, `text-error-base`, `bg-feature-lighter` | |
| Static | `text-static-white`, `text-static-black` | On filled buttons |

**Do not write** `bg-white-0` or `text-strong-950` — those utilities do not exist.

### 3.2 Spacing vs grid

| Layer | Source | Agent use |
|-------|--------|-----------|
| **Spacing rhythm** | Tailwind default scale (4px base); rules in `design-tokens.md` § Spacing | `gap-*`, `p-*`, `py-*` inside components and layout |
| **Dashboard grid** | `design-tokens.md` § Grid | 1440px max content, 12 cols, `gap-6` gutter, 170px safe area, sidebar 272px / 80px / +264px submenu |

Spacing has **no custom CSS variables**. Grid constants are **not** spacing vars — apply both (e.g. 12-col row with `gap-6` between widgets).

**Locked defaults:**

| Context | Utility |
|---------|---------|
| Widget gap | `gap-6` |
| Section gap | `gap-8` |
| Card padding | `p-6` |
| Form field stack | `gap-4` |
| Label → field | `gap-1` or `gap-2` |
| Table toolbar | `gap-3`, `px-4 py-3.5` (`table-shared.tsx`) |

**Dense mode** (inside tables, toolbars, chips): Tailwind `1`–`4` only (`4px`–`16px`).  
**Breathable mode** (page, card, modal): Tailwind `2`, `4`, `6`, `8`, `10`, `12` (`8px`–`48px`).

**Avoid at page level:** `gap-5`, `gap-1.5`, `gap-2.5`, `p-5` between widgets (AlignUI internals may use them; do not spread to page layout).

### 3.3 Color

| Family | Classes | Use |
|--------|---------|-----|
| Primary | `primary-base`, `primary-darker`, `primary-dark`, `primary-alpha-10/16/24` | Actions, links, focus, selection |
| Background | `bg-bg-white-0`, `bg-bg-weak-50`, `bg-bg-soft-200`, `bg-bg-sub-300`, `bg-bg-surface-800`, `bg-bg-strong-950` | Surfaces |
| Text | `text-text-strong-950`, `text-text-sub-600`, `text-text-soft-400`, `text-text-disabled-300`, `text-text-white-0` | Copy |
| Stroke | `stroke-soft-200`, `stroke-sub-300`, `stroke-strong-950` (+ `ring-*`, `border-*`) | Borders |
| Status | `success-*`, `warning-*`, `error-*`, `feature-*`, `away-*`, `faded-*`, `information-*` | Workflow, AI, tips |
| Overlay | `bg-overlay` | Modal/drawer scrim (`--overlay` in `globals.css`) |
| Static | `text-static-white`, `text-static-black` | On filled surfaces |

**Dropped — never in product UI:** `verified-*`, `highlighted-*`, `stable-*`  
**Not UI chrome:** raw `blue-*`, `sky-*` scales — go through semantic tokens.

### 3.4 Typography

Use AlignUI's native type utilities:

| Role | Class | Spec |
|------|-------|------|
| Page title | `text-title-h6` | 20px / 28px / 500 |
| Section | `text-label-md` | 16px / 24px / 500 |
| Body | `text-paragraph-sm` | 14px / 20px / 400 |
| Label | `text-label-sm` | 14px / 20px / 500 |
| Caption | `text-paragraph-xs` | 12px / 16px / 400 |
| Micro | `text-label-xs` | 12px / 16px / 500 |

Larger `title-h1`–`h5`, `doc-*`, and `subheading-*` utilities are for marketing/document contexts — reach for them only when a screen genuinely needs that scale.

**Readable copy on white:** `text-text-sub-600` or stronger. `text-text-soft-400` = decorative only.

### 3.5 Icons, radius, shadows

| Icons | `size-4` (16px, inline/dense) · `size-5` (20px, default) · `size-6` (24px, emphasis) |
|-------|-------------------------------------------------------------------------------|
| Library | `@remixicon/react` `*Line` only — never `*Fill` |
| Exceptions | `@/components/ui/file-format-icon`, `avatar-empty-icons`, OAuth SVGs in auth blocks |

| Radius | Class | Use |
|--------|-------|-----|
| Small | `rounded-lg` | Tags, small badges, small/xsmall controls |
| Control | `rounded-10` | Buttons, inputs, selects, nav items (AlignUI default) |
| Surface | `rounded-2xl` | Cards, alerts, KPI widgets |
| Overlay | `rounded-20` | Modals, drawers, **table block wrapper**, command menu |
| Full | `rounded-full` | Avatars, switch thumb, pagination dots, `CompactButton` with `fullRadius` |

| Shadow | Use |
|--------|-----|
| `shadow-regular-xs` | Resting inputs, cards, compact buttons |
| `shadow-regular-md` | Float: dropdown, modal, drawer, popover, filter panel |

**Motion:** `transition duration-200 ease-out` (AlignUI default on interactives).

---

## 4. Layout & responsive

### 4.1 AlignUI grid (from `design-tokens.md`)

1440px max · 12 columns · `gap-6` gutter · 170px page safe area · sidebar→content `gap-8`.

Shells: **Sidebar Expanded** 272px (default) · **Collapsed** 80px · **+ Submenu** 264px · **Topbar**.

### 4.2 SpotGov desktop contract (extends grid)

Test at **1024, 1280, 1440, 1728**, and wide. Tailwind refs: `lg` 1024px · `xl` 1280px · `2xl` 1536px.

| Width / state | Behavior |
|---------------|----------|
| 1024px (`lg`) | Compact spacing; secondary panels collapse or toggle (see `filter-sidebar.tsx`: `md:flex-col` → sidebar stacks) |
| 1280px (`xl`) | Default layout |
| 1440px+ | Breathing room; **content capped** at 1440px grid — not full-bleed stretch |
| Wide | Secondary context or `max-w-*`; never full-width forms |
| Sidebar open/closed | Content reflows; no horizontal scroll on primary task flow |
| `< md` (768px) | Single column; side-by-side data widgets forbidden |
| `md`–`lg` | Two columns only if both panels readable |

### 4.3 Layout rules (actionable)

| Rule | Implementation |
|------|----------------|
| No fixed viewport layout | `max-w-*` / `w-full` + inner cap — not `w-screen` forms |
| Readable caps | Auth `max-w-[400px]`–`max-w-[440px]`; filter panel `w-[min(696px,calc(100vw-32px))]` (`filter-sidebar.tsx`) |
| Data width | Tables: `overflow-x-auto` on wrapper (`Table.Root`, `BlockDataTable` container) |
| Long text | `truncate` or `line-clamp-*` + `min-w-0` on flex children |
| No marketing layout | No centered hero column in app surfaces |
| Primary CTA | Keep visible at 1024px — shrink secondary first |

### 4.4 Density nesting (required)

```
Page          → gap-8, bg-bg-white-0
  Card        → rounded-2xl, p-6
    TableBlock → rounded-20, ring-1 ring-stroke-soft-200, shadow-regular-xs
      rows     → dense; Table.Cell default h-16 px-3 (components/ui/table.tsx)
```

### 4.5 Product page scaffold (no app shell yet)

There is **no** `DashboardShell` or settings layout component. Build pages in `app/<route>/page.tsx` by composing blocks + primitives.

**Default page wrapper** (grid cap + breathable spacing):

```tsx
<div className='mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-8'>
  {/* page header */}
  {/* page body */}
</div>
```

**Page header** (one per screen):

```tsx
<div className='flex flex-col gap-1'>
  <h1 className='text-title-h6 text-text-strong-950'>Settings</h1>
  <p className='text-paragraph-sm text-text-sub-600'>
    Manage your account and notification preferences.
  </p>
</div>
```

**Two-column body** (settings, filters, detail + nav) — widths from `filter-sidebar.tsx`:

```tsx
<div className='flex flex-col gap-6 lg:flex-row lg:gap-8'>
  <nav className='w-full shrink-0 lg:w-[224px]'>{/* section nav */}</nav>
  <main className='flex min-w-0 flex-1 flex-col gap-6'>{/* section content */}</main>
</div>
```

| Piece | Class / rule | Ref |
|-------|--------------|-----|
| Max page width | `max-w-[1440px]` | `design-tokens.md` § Grid |
| Page padding | `px-6 py-8` | Breathable |
| Section nav width | `lg:w-[224px]` | `filter-sidebar.tsx` |
| Content column | `flex-1 min-w-0` | Prevents flex overflow |
| Settings card width | `max-w-[440px] w-full` | `checkbox-card-shell.tsx` |

**Do not:** center a single auth card as the whole page; use `ArticleLayout` / stone vars (token preview only); invent a layout component in `components/`.

**Interactive pages:** add `'use client'` when using `useState`, `Switch`, `Select`, `Radio`, or other client-controlled inputs.

---

## 5. Primitive index (`components/ui/`)

Storybook: `UI/<Name>`. Import: `@/components/ui/<file>`.

| Primitive | Use | Avoid | Story / block ref |
|-----------|-----|-------|-------------------|
| `accordion` | Collapsible sections | Primary nav | `accordion.stories.tsx` |
| `alert` | Inline page/message banners | Field-level errors (`hint`) | `alert.stories.tsx` |
| `avatar` | User/org identity | Decorative-only without name | `avatar.stories.tsx` |
| `avatar-group` | Stacked people | Single user | `avatar-group.stories.tsx` |
| `avatar-group-compact` | Dense avatar stack | — | stories |
| `avatar-empty-icons` | Empty avatar placeholders | Custom SVG people | stories |
| `badge` | Category, count, tag label | Workflow state | `finance-command-menu.tsx` |
| `banner` | Full-width persistent announcement bar | Inline alerts (`alert`) | `banner.stories.tsx`, `blocks/banner/*` |
| `breadcrumb` | Hierarchy | Deep primary nav | `blocks/breadcrumbs/*` |
| `button` | Actions | Links, icon-only rows | `button.tsx`, `button.stories.tsx` |
| `button-group` | Segmented actions | Single CTA | stories |
| `checkbox` | Multi-select, table select | Mutually exclusive | `checkbox.stories.tsx` |
| `color-picker` | Color input | Simple hex field | `blocks/color-picker/*` |
| `command-menu` | Cmd+K palette | Simple search input | `blocks/command-menu/*` |
| `compact-button` | Icon-only row/toolbar actions | Primary CTA | `table-shared.tsx` |
| `datepicker` | Date/range pick | Free-text dates | `blocks/datepicker/*` |
| `digit-input` | OTP codes | Long numbers | `verification-code-card.tsx` |
| `divider` | In-card separators | Page sections | auth cards |
| `dot-stepper` | Step indicator dots | Labeled steps | stories |
| `drawer` | Side panel shell | Quick confirm | `drawer.stories.tsx`, `drawer-panel.tsx` |
| `dropdown` | Action menus | Main nav | `blocks/dropdown/*` |
| `fancy-button` | Auth primary submit | Toolbar | `create-account-card.tsx` |
| `file-format-icon` | File type glyph | Generic file icon | `documents-table.tsx` |
| `file-upload` | Upload control | Custom dropzone div | `blocks/file-upload/*` |
| `hint` | Helper/error under field | Page-level alert | `create-account-card.tsx` |
| `horizontal-stepper` | Wizard steps | Vertical flows | stories |
| `input` | Text fields | Multi-line | `input.tsx`, auth blocks |
| `kbd` | Shortcut display | Body copy | `filter-panel-shell.tsx` |
| `label` | Field labels | Headings | all form blocks |
| `link-button` | Inline tertiary action | Submit | `feature-announcement-modal.tsx` |
| `modal` | Dialog, confirm, form modal | Full-height panel | `blocks/modal/*` |
| `notification` | Radix toast (stacked) | Compact sonner toast | `notification.tsx` |
| `notification-provider` | App toast host | Per-toast | `app/layout.tsx` |
| `toast` | Sonner host + `toast.custom()` API | Radix notification stack | `toast.tsx`, `toast.stories.tsx` |
| `toast-alert` | Styled sonner toast body | Raw sonner markup | `toast-alert.tsx` |
| `pagination` | Table pages | Infinite scroll only | `TableBlockFooter` |
| `popover` | Anchored content | Modal task | stories |
| `progress-bar` | Linear progress | Indeterminate without label | stories |
| `progress-circle` | Circular progress | — | stories |
| `radio` | Single-select | Multi-select | `blocks/radio/*` |
| `rating` | Star display + interactive input | Custom star markup | `rating.tsx`, `svg-rating-icons.tsx` |
| `segmented-control` | Mode toggle | Main nav tabs | `theme-switch.tsx` |
| `select` | Native-style select | 2-option toggle | stories |
| `slider` | Range input | — | `blocks/slider/*` |
| `social-button` | OAuth | Regular actions | `login-card.tsx` |
| `status-badge` | Workflow state | Categories | `status-badge.tsx`, `component-showcase.tsx` |
| `svg-rating-icons` | Star ratings | Custom stars | stories |
| `switch` | On/off setting | Immediate action button | `blocks/switch/*` |
| `tab-menu-horizontal` | Section tabs | Vertical lists | `table-shared.tsx` |
| `tab-menu-vertical` | Side tab list | — | stories |
| `table` | Data grid | Card list for 20+ cols | `table.tsx`, `table-shared.tsx` |
| `tag` | Removable label | Status | stories |
| `textarea` | Multi-line text | Single-line | stories |
| `tooltip` | Hover/focus supplement | Required instructions | `blocks/tooltip/*` |
| `vertical-stepper` | Vertical wizard | — | stories |

---

## 6. Key primitive specs

### `button` — `components/ui/button.tsx`

| | |
|---|---|
| **API** | `Button.Root` · `Button.Icon` |
| **Props** | `variant`: `primary` \| `neutral` \| `error` · `mode`: `filled` \| `stroke` \| `lighter` \| `ghost` · `size`: `medium` \| `small` \| `xsmall` \| `xxsmall` · `loading` · `disabled` |
| **States** | Hover: `hover:bg-primary-darker` (filled) · Active: `active:bg-primary-dark` · Focus: `focus-visible:shadow-button-primary-focus` (neutral: `shadow-button-important-focus`, error: `shadow-button-error-focus`) · Disabled: `disabled:bg-bg-weak-50 disabled:text-text-disabled-300` · Loading: `aria-busy`, `RiLoader4Line`, width stable |
| **A11y** | Native `<button>`; loading = `aria-busy` |

### `compact-button` — `components/ui/compact-button.tsx`

| | |
|---|---|
| **Props** | `variant`: `stroke` \| `ghost` \| `white` \| `modifiable` · `size`: `large` \| `medium` · `fullRadius` |
| **Focus** | `focus-visible:bg-bg-strong-950 focus-visible:text-text-white-0` |
| **A11y** | **Required** `aria-label` when icon-only (see `table-shared.tsx`: `aria-label='Previous page'`) |

### `input` — `components/ui/input.tsx`

| | |
|---|---|
| **API** | `Input.Root` → `Input.Wrapper` → `Input.Input` + `Input.Icon` / `Input.Affix` / `Input.InlineAffix` |
| **States** | Rest: `shadow-regular-xs ring-stroke-soft-200` · Hover wrapper: `hover:bg-bg-weak-50` · Focus: `has-[input:focus]:shadow-button-important-focus` · Disabled: `text-text-disabled-300` |
| **Error** | Add `Hint.Root hasError` below — do not use red border alone |
| **A11y** | Pair `Label.Root htmlFor` + `Input.Input id` |

### `hint` — `components/ui/hint.tsx`

| | |
|---|---|
| **API** | `Hint.Root` · `Hint.Icon` |
| **Props** | `hasError` → `text-error-base` · `disabled` → `text-text-disabled-300` |
| **Default** | `text-paragraph-xs text-text-sub-600` |

### `status-badge` — `components/ui/status-badge.tsx`

| | |
|---|---|
| **API** | `StatusBadge.Root` + `StatusBadge.Icon` or `StatusBadge.Dot` |
| **Props** | `variant`: `stroke` \| `light` · `status`: `completed` \| `pending` \| `failed` \| `disabled` |
| **A11y** | Visible text label + color + icon/dot — mandatory |

### `alert` — `components/ui/alert.tsx`

| | |
|---|---|
| **Props** | `variant`: `filled` \| `light` \| `lighter` \| `stroke` · `status`: `error` \| `warning` \| `success` \| `information` \| `feature` · `size`: `xsmall` \| `small` \| `large` |
| **A11y** | Status icon + text; same color rules as status badges |

### `table` — `components/ui/table.tsx`

| | |
|---|---|
| **API** | `Table.Root`, `Header`, `Body`, `Head`, `Row`, `Cell`, `RowDivider`, `Caption` |
| **Defaults** | `Head`: `bg-bg-weak-50 px-3 py-2 text-paragraph-sm text-text-sub-600` · `Cell`: `h-16 px-3 group-hover/row:bg-bg-weak-50` |
| **Use with** | `TableBlock` wrapper from `table-shared.tsx` for product tables |

### `switch` — `components/ui/switch.tsx`

| | |
|---|---|
| **When** | Single on/off preference (one boolean) |
| **When not** | Mutually exclusive options (`radio`); multi-select (`checkbox`) |
| **API** | `Switch.Root` + `Label.Root htmlFor` wrapping title + description |
| **Pattern** | `notification-preferences-switch.tsx` — switch left, label block right |
| **A11y** | `id` on switch + `htmlFor` on label; description in label text, not tooltip-only |

### `select` — `components/ui/select.tsx`

| | |
|---|---|
| **When** | Enum choice (language, timezone, format) |
| **API** | `Select.Root` → `Select.Trigger` → `Select.Value` · `Select.Content` → `Select.Item` |
| **Pattern** | `SettingsSelect` in `general-settings-drawer.tsx` — `gap-1` label above full-width trigger |

### `radio` — `components/ui/radio.tsx`

| | |
|---|---|
| **When** | Exactly-one choice among few options with descriptions |
| **API** | `Radio.Group` → `Radio.Item` + `Label.Root htmlFor` per option |
| **Pattern** | `general-settings-drawer.tsx` theme list (demo includes dark/system — **omit those in product UI**, see §7.7) |

### `checkbox` — `components/ui/checkbox.tsx`

| | |
|---|---|
| **When** | Independent toggles (any subset allowed) |
| **Pattern** | `authentication-settings-checkbox.tsx` — `flex items-center gap-2`, checkbox + label row |

---

## 7. Block patterns (`components/blocks/`)

Storybook: `Blocks/<Category>`.

### 7.1 Table block

**When:** Sortable/filterable/paginated data.  
**When not:** &lt;5 static rows — use `Table.Root` only.

**Compose (exact exports from `table-shared.tsx`):**

```tsx
<TableBlock>                          // rounded-20 bg-bg-white-0 shadow-regular-xs ring-1 ring-stroke-soft-200
  <TableBlockTabs … />                // optional
  <TableBlockToolbar … />             // search + Filter + Sort by
  <BlockDataTable table={…} />        // overflow-x-auto px-4 pb-2
  <TableBlockFooter />                // Pagination.Root
</TableBlock>
```

**Also use:** `createSelectColumn`, `createActionsColumn`, `SortableHeader`, `getSortingIcon`.

**Canonical:** `documents-table.tsx` · `contracts-table.tsx` · Storybook `Blocks/Table`.

### 7.2 Filter panel

**Compose:** `FilterPanelShell` → `FilterPanelHeader` → body → `FilterPanelFooter` (Clear + Apply).

**Classes:** `filterPanelClassName`, `filterSidebarClassName` in `filter-sidebar.tsx`.

**Canonical:** `filter-panel-shell.tsx` · `date-range-filter.tsx` · Storybook `Blocks/Filter`.

### 7.3 Command menu

**Canonical templates:** `finance-command-menu.tsx` · `hr-sidebar-command-menu.tsx` · `hr-hub-command-menu.tsx`.

**Shared:** `command-menu-search-header.tsx`, `command-menu-keyboard-footer.tsx`.

### 7.4 Auth cards

| Block | File | Surface classes |
|-------|------|-----------------|
| Register | `create-account-card.tsx` | `max-w-[440px] rounded-20 bg-bg-white-0 p-5 md:p-8 gap-6` |
| Login | `login-card.tsx` | `max-w-[400px] rounded-20 … p-6 shadow-regular-xs` |

**Shared:** `auth-card-icon-header.tsx`, `password-field.tsx` · Storybook `Blocks/Auth`.

### 7.5 Drawer · Modal · Forms · Other

| Pattern | Ref |
|---------|-----|
| Drawer panel | `drawer-panel.tsx` — `drawerPanelClassName` |
| Drawer content | `support-drawer.tsx` |
| Modal | `feature-announcement-modal.tsx`, `payment-received-modal.tsx`, `destructive-confirm-modal.tsx` |
| Multi-section form | `account-setup-modal.tsx` |
| File upload states | `file-upload-status-cards.tsx` (loading/success/error) |
| Profile card | `profile-card/profile-card.tsx` |

### 7.6 Feature / AI (AlignUI template — future SpotGov agent UI)

| Element | Classes / API | Ref |
|---------|---------------|-----|
| Feature toast | `Notification` `status="feature"`, `RiSparklingLine` | `notification.tsx` |
| Feature tile | `bg-feature-lighter text-feature-base` | `finance-command-menu.tsx` |
| Feature alert | `alert` `status="feature"` | `alert.tsx` |
| Sparkle CTA | `FancyButton` + `RiSparklingLine` | `fancy-button.stories.tsx` |
| Panel spacing | `rounded-2xl p-6` | `design-tokens.md` § Spacing |

### 7.7 Settings page (compose — no dedicated block)

**When:** Account, security, notifications, regional preferences — multi-section config.  
**When not:** Use `Modal` for one quick edit; use `Drawer` for contextual panel (`general-settings-drawer.tsx` is a **drawer demo**, not a full page); use `TableBlock` or `FilterPanelShell` (filter Clear/Apply footer is wrong semantics).

**Canonical block refs:**

| Section type | Copy from |
|--------------|-----------|
| Page + nav scaffold | §4.5 + `filter-sidebar.tsx` (`FilterNavItem`) or `tab-menu-vertical.tsx` |
| Toggle list (email alerts) | `notification-preferences-switch.tsx` |
| Multi checkbox (2FA methods) | `authentication-settings-checkbox.tsx` |
| Privacy + badges | `privacy-settings-checkbox.tsx` |
| Password form | `change-password-form.tsx` |
| Select fields (locale/time) | `general-settings-drawer.tsx` body — **skip THEME OPTIONS** (dark/system conflict with light-only product) |
| Settings search palette | `settings-search-command-menu.tsx` (command menu, not page layout) |

**Settings card shell** — reuse exactly from `checkbox-card-shell.tsx`:

```
flex w-full max-w-[440px] flex-col gap-5 rounded-20 bg-bg-white-0 p-5
shadow-regular-md ring-1 ring-inset ring-stroke-soft-200
```

**Section header** — `CheckboxCardHeader` / `TextInputPanelHeader`:

```
Icon circle: size-10 rounded-full ring-1 ring-inset ring-stroke-soft-200
Title: text-label-sm text-text-strong-950
Description: text-paragraph-xs text-text-sub-600
```

**Controls by setting type:**

| Data shape | Component | Example |
|------------|-----------|---------|
| One boolean | `Switch.Root` + label block | Notification opt-in |
| Many booleans | `Checkbox.Root` rows | SMS + Authenticator app |
| Pick one of few | `Radio.Group` | *(omit theme until dark mode ships)* |
| Pick from list | `Select.Root` | Language, timezone |
| Text / password | `Input` + `Label` + optional `Hint` | Change password |

**Dividers inside card:**

| Variant | Use |
|---------|-----|
| `Divider.Root variant='line-spacing'` | Between groups in one card — `authentication-settings-checkbox.tsx` |
| `Divider.Root variant='solid-text'` | Named section label in long form — `general-settings-drawer.tsx` (`REGIONAL PREFERENCES`) |

**Save footer** — one pair per card (not per field):

```tsx
<div className='grid grid-cols-2 gap-3'>
  <Button.Root variant='neutral' mode='stroke' size='small'>Discard</Button.Root>
  <Button.Root variant='primary' size='small'>Apply Changes</Button.Root>
</div>
```

Ref: `notification-preferences-switch.tsx`, `change-password-form.tsx`. Use **Discard** or **Cancel** + **Apply Changes** — not FilterPanel **Clear** / **Apply**.

**Optional info callout:** `Alert.Root variant='lighter' status='information' size='xsmall'` + `Alert.Icon` — `notification-preferences-switch.tsx`.

**Nav: pick one**

| Pattern | Use when | Ref |
|---------|----------|-----|
| `FilterNavItem` list | Manual `active` state; same look as filter sidebar | `filter-sidebar.tsx` |
| `TabMenuVertical.Root` | Radix tab panels; content swaps per trigger | `tab-menu-vertical.tsx` |

Do not use `TabMenuHorizontal` for settings section nav (that is for table tabs — `table-shared.tsx`).

**Minimal page skeleton:**

```tsx
'use client';

import * as React from 'react';
import * as Button from '@/components/ui/button';
import * as Switch from '@/components/ui/switch';
import * as Label from '@/components/ui/label';
import * as Divider from '@/components/ui/divider';
import { CheckboxCardShell, CheckboxCardHeader } from '@/components/blocks/checkbox/checkbox-card-shell';
import { FilterNavItem } from '@/components/blocks/filter/filter-sidebar';
import { RiNotificationBadgeLine } from '@remixicon/react';

export default function SettingsPage() {
  const [section, setSection] = React.useState('Notifications');

  return (
    <div className='mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-8'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-title-h6 text-text-strong-950'>Settings</h1>
        <p className='text-paragraph-sm text-text-sub-600'>
          Manage your account and notification preferences.
        </p>
      </div>

      <div className='flex flex-col gap-6 lg:flex-row lg:gap-8'>
        <nav className='flex w-full flex-col gap-2 lg:w-[224px]'>
          {['Notifications', 'Security', 'Account'].map((label) => (
            <FilterNavItem
              key={label}
              label={label}
              active={section === label}
              onClick={() => setSection(label)}
              icon={<RiNotificationBadgeLine className='size-5' />}
            />
          ))}
        </nav>

        <main className='flex min-w-0 flex-1 flex-col gap-6'>
          <CheckboxCardShell>
            <CheckboxCardHeader
              icon={RiNotificationBadgeLine}
              title='Notification Preferences'
              description='Choose what notifications you want to receive.'
            />
            <Divider.Root variant='line-spacing' />
            {/* Switch rows — copy from notification-preferences-switch.tsx */}
            <div className='grid grid-cols-2 gap-3'>
              <Button.Root variant='neutral' mode='stroke' size='small'>
                Discard
              </Button.Root>
              <Button.Root variant='primary' size='small'>
                Apply Changes
              </Button.Root>
            </div>
          </CheckboxCardShell>
        </main>
      </div>
    </div>
  );
}
```

Import paths and child patterns: copy remaining markup from the canonical block files above — do not invent new card styles.

---

## 8. Which one when

| Need | Use | Not |
|------|-----|-----|
| Primary submit | `Button.Root variant="primary" mode="filled"` or `FancyButton` on auth | `LinkButton` |
| Secondary | `Button.Root variant="neutral" mode="stroke"` | Second primary filled |
| Destructive | `Button.Root variant="error" mode="filled"` | Neutral |
| Inline link | `LinkButton` | `Button mode="ghost"` |
| Table row action | `CompactButton variant="ghost"` + `RiMore2Line` | Full `Button` |
| Workflow state | `StatusBadge` + icon + label | `Badge` alone |
| Category label | `Badge` / `Tag` | `StatusBadge` |
| Field helper / error | `Hint.Root` (+ `hasError`) | `Tooltip` alone |
| Page banner | `Alert.Root` | `Hint` |
| Toast | `Notification` via provider | Custom div |
| Simple dialog | `Modal` `max-w-[440px]` | `Drawer` |
| Side panel | `Drawer` + `drawerPanelClassName` | `Modal` |
| Global search | Command menu block | Raw `<input>` |
| Data table | Table block recipe | Div grid |
| Static few rows | `Table.Root` only | Empty toolbar block |
| Settings full page | §4.5 scaffold + §7.7 card shells | `TableBlock`, centered auth card, `FilterPanelShell` |
| Settings nav | `FilterNavItem` or `TabMenuVertical` | `TabMenuHorizontal`, app dropdown |
| One boolean pref | `Switch` | `Checkbox` |
| Several independent prefs | `Checkbox` list | `Switch` per row when only one exists |
| Enum (language, tz) | `Select` | `Input` free text |
| Settings save | Discard/Cancel + Apply Changes per card | Filter Clear/Apply; one global FAB |
| Quick settings panel | `Drawer` + `drawerPanelClassName` | Full page for 2 fields |
| Theme / dark mode | **Do not ship** (light-only product) | `general-settings-drawer` theme block |

*Refine as SpotGov product screens ship.*

---

## 9. States (all interactives)

| State | Requirement |
|-------|-------------|
| Default | Semantic tokens from §3 |
| Hover | Token step (e.g. `hover:bg-primary-darker`, `hover:bg-bg-weak-50`) |
| Active/pressed | Stronger step (`active:bg-primary-dark`) |
| Focus-visible | Button shadows or `focus-visible:bg-bg-strong-950` on compact buttons — never omit |
| Disabled | Native `disabled`; `text-text-disabled-300`; `pointer-events-none` |
| Loading | `aria-busy`; spinner; stable width; block double submit |
| Error | `Hint hasError` or `Alert status="error"` + readable text |
| Empty | `EmptyState` in `components/blocks/empty-state/empty-state.tsx` |

**Upload file states:** `file-upload-status-cards.tsx` — `RiLoader2Line animate-spin`, `RiCheckboxCircleLine`, `RiErrorWarningLine`.

---

## 10. Accessibility

Target **WCAG 2.1 AA**. Details: [`accessibility.md`](./accessibility.md).

### By component job

| Job | WCAG |
|-----|------|
| Buttons, links, tabs, menus | 2.4.7, 2.1.1, 4.1.2 |
| Inputs, forms | 1.4.3, 3.3.x, 4.1.2 |
| Status badges, alerts | 1.4.1, 1.4.3, 4.1.2 |
| Tables | 1.4.3, 2.1.1 for row actions |
| Loading/async | 4.1.2, disable retry while loading |

### Agent checks

- 12–14px on `bg-bg-white-0`: `text-text-sub-600` minimum for readable content.
- Status: text + hue + `StatusBadge.Icon` or `StatusBadge.Dot`.
- Tables: `aria-label` on select-all/row checkboxes (`createSelectColumn` in `table-shared.tsx`).
- Icon-only: `aria-label` on `CompactButton`, `Pagination.NavButton`.
- Notifications: dismiss `aria-label='Close'` (`notification.tsx`).
- Forms: `Label.Root htmlFor` matches input `id`; error text visible.

### Status → token → icon

| Meaning | Badge `status` | Icon |
|---------|----------------|------|
| Completed | `completed` | `RiCheckboxCircleLine` |
| Pending | `pending` | `RiTimeLine` or dot |
| Failed | `failed` | `RiCloseCircleLine` |
| Inactive | `disabled` | dot or muted label |

---

## 11. Copy

**Canonical:** [`copy.md`](./copy.md) — voice, principles, buttons, empty/error/loading/confirmation structure, banned words.

**Locale:** US English, conversational B2B. Use tender/gov terms (tender, contract, agency, bid, award, solicitation) when they match user vocabulary.

**Typography classes for copy roles:**

| Element | Classes | Repo example |
|---------|---------|--------------|
| Section title | `text-label-md` or `text-label-sm text-text-strong-950` | `Authentication Settings` |
| Description | `text-paragraph-sm text-text-sub-600` | *"Enter your details to register."* — `create-account-card.tsx` |
| Helper | `text-paragraph-xs text-text-sub-600`; icon may be `text-text-soft-400` | `change-password-form.tsx` |
| Label | Sentence case + `Label.Asterisk` if required | `Email Address` — `create-account-card.tsx` |
| Placeholder | Short example values | `Search...` — `table-shared.tsx` |
| Status label | Always visible text | `Completed`, `Pending`, `Failed` — `status-badge.stories.tsx` |

Replace AlignUI demo strings (`hello@alignui.com`, `James Brown`) with SpotGov-realistic values in product work.

---

## 12. Icons

**Rule:** `@remixicon/react` `*Line` only. Pick icons already used in repo; grep before adding:

```bash
rg -o 'Ri[A-Za-z0-9]+Line' --glob '*.{tsx,ts}' | sort -u
```

**Common sets (from repo):**

- **Chrome:** `RiSearch2Line`, `RiFilter3Line`, `RiEqualizer2Line`, `RiMore2Line`, `RiCloseLine`, `RiArrowDownSLine`
- **Status:** `RiCheckboxCircleLine`, `RiTimeLine`, `RiCloseCircleLine`, `RiErrorWarningLine`, `RiInformationLine`, `RiSparklingLine`
- **Auth:** `RiUserLine`, `RiMailLine`, `RiLock2Line`, `RiEyeLine`, `RiEyeOffLine`
- **Nav:** `RiArrowLeftSLine`, `RiArrowRightSLine`, `RiHome5Line`, `RiSettings2Line`

New icons: add via PR and extend grep list. No `*Fill`. No AlignUI Figma custom icons.

---

## 13. AI implementation rules

### Do

- Read `AGENTS.md` → `product-principles.md` → this doc → `design-tokens.md` → `component-patterns.md` → `copy.md` → `accessibility.md`.
- Use full token classes: `bg-bg-white-0`, `text-text-sub-600`, `ring-stroke-soft-200`.
- Copy structure from canonical files (§7), not from scratch.
- Specify grid shell + column spans for dashboards.
- Nest density: page (`gap-8`) → card (`p-6`) → table block.
- Cap forms: `max-w-[400px]`–`max-w-[440px]`; tables may scroll horizontally.
- Include hover, focus-visible, disabled, loading, error states.
- Run anti-slop checklist (§15) before finishing.
- Settings pages: follow §7.7 — copy card shell + controls from canonical blocks; no invented layout.

### Don't

- Invent tokens, colors, radii, shadows, or spacing variables.
- Use `bg-white-0`, `text-strong-950` (wrong — missing prefix).
- Use dropped tokens, `blue-*`/`sky-*` chrome, `shadow-custom-*`, `shadow-regular-sm`, stacked shadows.
- Use marketing type (`text-title-h1`–`h5`) or non-AlignUI style systems (Framer, arbitrary CSS vars) in product UI.
- Use `text-text-soft-400` for readable 12–14px task text on white.
- Use `rounded-full` on cards, CTAs, table rows, AI text blocks.
- Reimplement primitives; add primitives to `components/` root.
- Build mobile-first marketing layouts for app surfaces.
- Assume dark mode.
- Use color-only status or validation.
- Build settings as `TableBlock`, `FilterPanelShell`, or full-page `Drawer`.
- Ship dark/system theme controls (light-only product; drawer theme block is demo-only).

---

## 14. Anti-patterns (never)

| Category | Never |
|----------|-------|
| Tokens | Raw hex; arbitrary Tailwind colors; `verified-*` / `highlighted-*` / `stable-*`; raw `blue-*`/`sky-*` scales as UI chrome |
| Typography | `text-title-h1`–`h5`, `text-doc-*` in product UI |
| Color | `text-text-soft-400` for metadata, timestamps, helpers, table cells on white |
| Icons | `*Fill`; icon libraries other than Remix Line (+ documented exceptions) |
| Radius | `rounded-full` on rectangular cards/CTAs/rows; changing a primitive's built-in radius per-instance |
| Shadow | `shadow-regular-xs` + `shadow-regular-md` on same element; `shadow-fancy-buttons-*` in product UI |
| Spacing | `gap-5` between widgets; dense table directly on page canvas without card/block wrapper |
| Layout | Fixed `w-screen` forms; center marketing column; infinite stretch on wide monitors |
| Components | One-off `<button>`/`<input>` styled ad hoc when primitive exists |
| A11y | Icon-only without `aria-label`; status without text; focus removed without replacement |
| Data | Rounded table rows — round **wrapper** only (`TableBlock`) |
| Settings | `TableBlock` or filter panel for settings; `FilterPanelFooter` Clear/Apply; dark/system theme controls; drawer as entire settings app; shadcn `<Form>` / invented `SettingsLayout` |
| Pages | Marketing/article layouts or `max-w-2xl` marketing columns for app UI |

---

## 15. Anti-slop checklist

- [ ] Classes use correct prefixes (`bg-bg-*`, `text-text-*`, `ring-stroke-*`)
- [ ] Type uses AlignUI type utilities (`text-title-h6`, `text-label-*`, `text-paragraph-*`)
- [ ] One `primary-base` accent in chrome
- [ ] Readable 12–14px text ≥ `text-text-sub-600` on `bg-bg-white-0`
- [ ] Status = text + color + icon/dot
- [ ] Hover + focus-visible + disabled on interactives; `aria-busy` if loading
- [ ] Icon-only controls have `aria-label`
- [ ] Labels wired with `htmlFor` / `id`; errors use `Hint hasError` or `Alert`
- [ ] Radius: controls `rounded-10`, surfaces `rounded-2xl`, overlays/table block `rounded-20`
- [ ] One shadow tier per element
- [ ] Density nested: page → card → table block
- [ ] Layout OK at 1024 / 1280 / 1440 / wide
- [ ] Forms capped; tables use `overflow-x-auto`
- [ ] Primitives imported from `@/components/ui/*`
- [ ] Remix Line icons only
- [ ] Copy: follow [`copy.md`](./copy.md); gov terms where natural
- [ ] No dropped tokens, dark mode, or Framer styles
- [ ] Settings: card shell matches `checkbox-card-shell.tsx`; footer is Discard/Cancel + Apply Changes
- [ ] Settings: correct control (`Switch` vs `Checkbox` vs `Select`); no theme/dark mode controls
- [ ] Settings page uses §4.5 scaffold — not auth-card-centered or table block

---

## 16. Canonical files

| Purpose | Path |
|---------|------|
| Tokens | `docs/design-tokens.md`, `app/globals.css`, `tailwind.config.ts` |
| Providers | `app/layout.tsx` |
| Token preview | `components/blocks/token-preview/index.tsx` |
| Button / input / status | `components/ui/button.tsx`, `input.tsx`, `status-badge.tsx` |
| Table recipe | `components/blocks/table/table-shared.tsx`, `documents-table.tsx` |
| Filter | `components/blocks/filter/filter-panel-shell.tsx`, `filter-sidebar.tsx` |
| Command menu | `components/blocks/command-menu/finance-command-menu.tsx`, `hr-sidebar-command-menu.tsx` |
| Auth | `components/blocks/auth/create-account-card.tsx` |
| Drawer | `components/blocks/drawer/drawer-panel.tsx`, `support-drawer.tsx` |
| Empty state | `components/blocks/empty-state/empty-state.tsx`, `empty-state-demos.tsx` |
| Product banner | `components/blocks/banner/product-announcement-banner.tsx` |
| Destructive confirm | `components/blocks/modal/destructive-confirm-modal.tsx` |
| Feature notification | `components/ui/notification.tsx` |
| Upload states | `components/blocks/file-upload/file-upload-status-cards.tsx` |
| Component showcase | `components/blocks/token-preview/component-showcase.tsx` |
| Settings page | §7.7 skeleton; `notification-preferences-switch.tsx`, `authentication-settings-checkbox.tsx`, `change-password-form.tsx` |
| Settings card shell | `components/blocks/checkbox/checkbox-card-shell.tsx` |
| Settings nav item | `components/blocks/filter/filter-sidebar.tsx` (`FilterNavItem`) |
| Settings drawer demo | `components/blocks/drawer/general-settings-drawer.tsx` (select/radio body only) |

---

## 17. Doc ownership

| Doc | Owns |
|-----|------|
| `AGENTS.md` | Agent entry point — workflow, non-negotiables, links |
| `component-manifest.md` | **Live inventory** — auto-generated from repo (`npm run generate:manifest`) |
| `product-principles.md` | Product promise, users, jobs, quality bar, non-goals |
| `design-tokens.md` | Token **values** |
| **This doc** | **How to build** UI (components, layout, canonical blocks, AI rules) |
| `component-patterns.md` | UX patterns, selection guide, when to use each composition |
| `copy.md` | Voice, wording, state copy, banned words |
| `accessibility.md` | WCAG baseline and component checks |
| `component-conventions.md` | `ui/` vs `blocks/` file layout and imports |
| `figma-agent-rules.md` | Figma MCP supplement (draft) — not canonical |

Add app shell spec, domain status glossary, and SpotGov AI screens in this doc when they exist. Primitive deep specs stay in §5–6; **live inventory** is [`component-manifest.md`](./component-manifest.md).
