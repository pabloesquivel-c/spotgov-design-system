# Component patterns

Agent-facing pattern catalog for SpotGov product UI. Use with [`AGENTS.md`](../AGENTS.md), [`design-system.md`](./design-system.md), [`screen-composition.md`](./screen-composition.md) for full-screen work, and [`component-conventions.md`](./component-conventions.md) (imports and file layout).

**Primitives:** `@/components/ui/*` · **Composed patterns:** `components/blocks/*` · **Catalog:** `/storybook`

---

## Pattern template

For each pattern document:

| Field | What to capture |
|-------|-----------------|
| **Purpose** | What user job this pattern serves |
| **When to use** | Triggers and context |
| **When not to use** | Better alternatives |
| **Anatomy** | Required regions and order |
| **Layout rules** | Spacing, width caps, density |
| **Responsive / desktop adaptability** | Breakpoint behavior |
| **States** | Default, loading, empty, error, disabled, etc. |
| **Accessibility** | Focus, labels, announcements |
| **Copy rules** | Tone, label style, button verbs |
| **Good examples in repo** | Canonical block files |
| **Anti-patterns** | What to avoid |

---

## Pattern selection guide

| User need | Use | Avoid |
|-----------|-----|-------|
| Configure something | Settings section | Modal stack |
| Choose from many items | Searchable list / command menu | Giant dropdown |
| Explain missing data | Empty state | Blank page |
| Prevent dangerous action | Confirmation dialog | Disabled button with no reason |
| Compare records | Page-level data index or embedded table block | Card grid |
| Prioritize active work | Operational dashboard | Generic metric-card wall |
| Plan around deadlines | Calendar / pipeline workbench | Decorative calendar |
| Guide first setup | Setup flow | Tooltip tour |
| Filter a large dataset | Filter panel + table | Inline filter wall on page load |
| Quick contextual edit (2–4 fields) | Drawer | Full-page form |
| Focused decision or alert | Modal | Drawer or new route |
| Auth / account creation | Auth card (full page) | Modal wizard |
| Find a setting or record fast | Command menu | Nested settings nav only |
| Upload files | File upload modal / status cards | Unstyled `<input type="file">` |
| Static few rows (&lt;5) | `Table.Root` only | Full `TableBlock` chrome |

---

## Common patterns

### Settings section

**Purpose** — Group related configuration so users can scan, change, and save preferences without leaving context.

**When to use**
- Account, security, notifications, regional preferences, privacy
- Multiple controls that belong to one topic
- Changes that benefit from **Discard** / **Apply Changes** per card

**When not to use**
- One quick edit → `Modal`
- Contextual panel while viewing another surface → `Drawer` (`general-settings-drawer.tsx` is a drawer demo, not a page layout)
- Data filtering → `FilterPanelShell` (Clear/Apply semantics differ)

**Anatomy**
1. Optional section nav (`FilterNavItem` or `TabMenuVertical`)
2. Card shell (`CheckboxCardShell`)
3. Section header — icon, title, description (`CheckboxCardHeader`)
4. Divider (`Divider.Root variant='line-spacing'`)
5. Control rows (switch, checkbox, select, input)
6. Optional info callout (`Alert` `status='information'`)
7. Footer — **Discard** or **Cancel** + **Apply Changes**

**Layout rules**
- Page: `max-w-[1440px]`, `gap-8`, `px-8 py-8` — see `design-system.md` §4.5
- Two-column body: nav `lg:w-[224px]`, main `flex-1 min-w-0 gap-6`
- Card: `max-w-[440px]`, `rounded-20`, `p-5`, `gap-5`, `shadow-regular-md`
- Labels specific; nest at most **two levels** (page → card → control row)

**Responsive / desktop adaptability**
- Nav stacks above content whenever the combined rail and form minimums do not fit; single column on `< md`
- Card stays `max-w-[440px]` — do not stretch settings forms full bleed

**States**
- Default, saving/loading (`aria-busy` on primary), validation error on fields, disabled controls
- Unsaved changes: enable Apply; Discard resets or confirms if dirty (product decision)

**Accessibility**
- `Label.Root htmlFor` matches control `id`
- Switch/checkbox: visible label text, not color alone
- Section title is a heading or labelled region

**Copy rules**
- Title: `text-label-sm` — specific (`Notification Preferences`, not `Preferences`)
- Description: one line, outcome-focused
- Buttons: **Apply Changes**, **Discard** — not Filter **Clear** / **Apply**

**Good examples in repo**
- `components/blocks/checkbox/checkbox-card-shell.tsx`
- `components/blocks/switch/notification-preferences-switch.tsx`
- `components/blocks/checkbox/authentication-settings-checkbox.tsx`
- `components/blocks/checkbox/privacy-settings-checkbox.tsx`
- `components/blocks/text-input/change-password-form.tsx`
- `components/blocks/filter/filter-sidebar.tsx` (`FilterNavItem`)

**Anti-patterns**
- Modal stack for multi-section settings
- `TabMenuHorizontal` for settings nav (that pattern is for table tabs)
- Per-field save buttons
- Theme/dark-mode toggles (light-only product)
- Nesting cards inside cards beyond two levels

---

### Form page

**Purpose** — Collect input for a discrete task with a clear outcome (register, change password, profile update).

**When to use**
- Auth flows, account setup, password change, multi-field create/edit on a dedicated screen
- Task needs space for helpers, validation, and a single primary submit

**When not to use**
- Two fields or less while user is mid-task → inline edit or drawer
- Whole account setup with many unrelated sections → settings cards or setup flow
- Destructive-only action → confirmation dialog

**Anatomy**
1. Page or card header (title + short description)
2. Field stack (`gap-4` between fields, `gap-1` label → input)
3. Optional dividers between logical groups
4. Primary submit + secondary link/cancel
5. Destructive actions separated (below fold or visually distinct row)

**Layout rules**
- Auth cards: `max-w-[400px]`–`max-w-[440px]`, `rounded-20`, `p-5`–`p-8`, `gap-6`
- Form field stack: `gap-4`; label → field: `gap-1` or `gap-2`
- One clear primary action per form

**Responsive / desktop adaptability**
- Centered card on auth; capped width on wide viewports — never full-bleed form fields

**States**
- Default, focus, inline validation, submit loading, submit error (field + form level), success redirect or confirmation

**Accessibility**
- Required fields: `Label.Asterisk` + `required` where applicable
- Errors: `Hint hasError` with fix instruction, not error code alone
- Submit loading: `aria-busy`, prevent double submit

**Copy rules**
- Labels: sentence case (`Email Address`, `Full Name`)
- Helper text: explains **consequence** or constraint, not obvious mechanics
- Buttons: verb-first (`Register`, `Save password`, `Continue`)
- Placeholders: short examples; replace AlignUI demo strings in product work

**Good examples in repo**
- `components/blocks/auth/create-account-card.tsx`
- `components/blocks/auth/login-card.tsx`
- `components/blocks/text-input/change-password-form.tsx`
- `components/blocks/auth/password-field.tsx`

**Anti-patterns**
- Multiple competing primary buttons
- Destructive action adjacent to submit without separation
- Validation only on submit when inline is possible
- Marketing hero layout inside app forms

---

### Empty state

**Purpose** — Tell users what is missing, why it matters, and what to do next when a list, table, or panel has no data.

**When to use**
- Zero search results, no records yet, filtered to nothing, permission-limited view with no items

**When not to use**
- Loading (use skeleton or spinner in place)
- Error fetching data (use error alert with retry)
- Truly blank chrome with no user expectation of content

**Anatomy**
1. Optional icon (meaningful, not decorative)
2. Title — what is missing
3. Short description — why it matters or how items get here
4. One primary action (create, clear filters, adjust search)
5. Optional secondary link

**Layout rules**
- Center in content area; breathable padding (`p-6` minimum)
- Typography: title `text-label-md` or `text-label-sm`; body `text-paragraph-sm text-text-sub-600`
- Do not wrap in heavy card chrome unless inside an existing card/table body

**Responsive / desktop adaptability**
- Same message at all breakpoints; action button stays visible without horizontal scroll

**States**
- Empty (this pattern), loading skeleton, error, no-permission (explain restriction + contact/admin action if applicable)

**Accessibility**
- Message is plain text, not color-only
- Primary action is a real `button` or `link` with accessible name

**Copy rules**
- Explain what is missing and why it matters
- One next action — specific (`Create contract`, `Clear filters`)
- No cute filler or marketing tone unless brand explicitly supports it
- Example shape: *"No contracts match these filters."* + **Clear filters**

**Good examples in repo**
- `components/blocks/empty-state/empty-state.tsx`
- `components/blocks/empty-state/empty-state-demos.tsx` (`FilteredTendersEmptyState`, `NoSavedTendersEmptyState`)
- Storybook: `Blocks/Empty State`

**Anti-patterns**
- Blank white area with no copy
- Empty state that sounds like marketing (*"Unlock your potential"*)
- Multiple equal CTAs
- Empty state inside a modal for a whole workflow

---

### Data table / list

**Purpose** — Let users scan, sort, filter, compare, and act on many homogeneous records (tenders, contracts, documents, transactions).

**When to use**
- Sortable, filterable, or paginated datasets
- Row actions, bulk selection, or column sort needed
- Comparable values across rows

**When not to use**
- Fewer than ~5 static rows → `Table.Root` only, no toolbar block
- Rich card comparison → not a table (but prefer table for procurement lists)
- Primary task is editing one record's fields → detail form, not grid

**Anatomy**
1. Page or section title and actions
2. Optional tabs or segmented mode switch
3. Search, Filter, and Sort by controls
4. Semantic table with dense rows
5. Pagination
6. Optional row selection column + bulk action bar, only when selection exists

**Enclosure**
- Page-dominant dataset: compose the regions flat on the page canvas.
- Embedded dataset: use `TableBlock`, optional `TableBlockTabs`,
  `TableBlockToolbar`, `BlockDataTable`, and `TableBlockFooter`.
- Fewer than five static rows: use `Table.Root` only.

**Layout rules**
- Rows dense: default cell `h-16 px-3` (`components/ui/table.tsx`)
- Align comparable columns (dates, amounts, status); right-align numbers
- `truncate` / `line-clamp-*` + `min-w-0` on long text
- `overflow-x-auto` on table wrapper — horizontal scroll OK for data, not for page shell

**Responsive / desktop adaptability**
- Desktop-first; table scrolls inside its own region before crushing column readability
- Toolbar and pagination wrap at narrow desktop
- Page shell never gains horizontal overflow

**States**
- Default, loading skeleton (preserve column layout), empty, error, selected rows, sorted column, disabled row actions

**Accessibility**
- `aria-label` on select-all and row checkboxes (`createSelectColumn` in `table-shared.tsx`)
- Sort buttons keyboard operable; status uses text + icon
- 12–14px metadata: `text-text-sub-600` minimum on white

**Copy rules**
- Column headers: short, scannable (`Contract period`, `Status`)
- Status labels always visible (`Completed`, `Pending`, `Failed`)
- Toolbar placeholder: `Search...`; actions verb-first (`Filter`, `Export`)

**Good examples in repo**
- `components/blocks/table/table-shared.tsx`
- `components/blocks/table/contracts-table.tsx`
- `components/blocks/table/documents-table.tsx`
- `components/blocks/table/transactions-ledger-table.tsx`
- Storybook: `Blocks/Table`

**Anti-patterns**
- Card grid for comparable records
- Rounded `TableBlock` around a dataset that already dominates the page
- Bulk action bar always visible with zero selection
- Loading spinner that collapses table layout
- Generous row padding that wastes tender/procurement viewport
- Decorative icons per row without meaning

---

### Operational dashboard

**Purpose** — Help bid teams prioritize active opportunities, reviews, and deadlines without turning the page into generic analytics.

**When to use**
- Several independent operational queues need simultaneous visibility
- A schedule or deadline region materially affects prioritization

**When not to use**
- One dataset dominates the task → page-level data index
- Metrics do not lead to a decision or action

**Anatomy**
1. Page title, context, and one primary action
2. Optional mode or date controls
3. Three-track baseline grid
4. Focused widgets with one job each
5. Optional tall schedule or priority region

**Layout rules**
- `32px` desktop canvas inset and `gap-6` between widgets
- Dense operational widgets may use `p-4`; standard summaries use `p-6`
- No nested cards; use flat rows inside widgets

**Responsive / desktop adaptability**
- Three tracks at the 1440px baseline
- Two tracks at narrow desktop; tall schedule spans both or moves below
- At 1728px, cap the grid instead of stretching it

**States**
- Default, loading, empty, recoverable error, disabled, and permission-limited
- Preserve widget dimensions while loading

**Accessibility**
- Widget titles label regions
- Status is text plus icon or shape
- Truncated tender names expose their full value on hover, focus, and to assistive technology

**Good examples in repo**
- Playground reference: `components/playground/screen-references/bid-operations-dashboard.tsx`
- Shell: `components/blocks/sidebar/app-sidebar.tsx`

**Anti-patterns**
- Decorative metrics
- Generic card wall
- Chart without a procurement decision

---

### Calendar / pipeline workbench

**Purpose** — Let users understand deadline placement, conflicts, reviews, and submission work over time.

**When to use**
- Time placement is central to the task
- Users compare deadlines or scheduled work across days

**When not to use**
- Users only need a sortable deadline list → data index
- A date picker alone solves the task

**Anatomy**
1. Range and filter toolbar
2. View tabs
3. Optional deadline summary row
4. Time gutter and labelled day columns
5. Event blocks with title, time, and status

**Layout rules**
- `32px` desktop canvas inset and `gap-6` between major regions
- Timeline owns horizontal overflow
- Production height scrolls intentionally; never clip to a screenshot height

**Responsive / desktop adaptability**
- Four summary items at the baseline, two at narrow desktop
- Keep a readable timeline minimum width and scroll internally
- Never scale product type or controls

**States**
- Selected view, conflict, cancelled, disabled time, loading, empty, and error

**Accessibility**
- Events expose day, time, title, and state as text
- Icon-only navigation has accessible names
- Color is never the only event category or conflict cue

**Good examples in repo**
- Playground reference: `components/playground/screen-references/pipeline-workbench.tsx`
- Date selection: `components/ui/datepicker.tsx`

**Anti-patterns**
- Color-only events
- Non-semantic unlabeled time grid
- Page-level horizontal scrolling

---

### Modal / dialog

**Purpose** — Focus attention on a single decision, confirmation, or short form without navigating away.

**When to use**
- Confirm or cancel a specific action
- Short form (verification code, single payment acknowledgment)
- Interrupt with important status user must acknowledge

**When not to use**
- Whole workflows or multi-section setup → dedicated page or setup flow
- Large filter panels → drawer (`filter-sidebar.tsx` width pattern)
- Settings → settings section on a page
- Frequent edits → inline or drawer

**Anatomy**
1. `Modal.Content` — `max-w-[440px]`, `rounded-20`
2. Optional status icon in header area
3. `Modal.Title` — describes decision or action
4. `Modal.Description` — consequence or context
5. Body (minimal fields if any)
6. `Modal.Footer` — secondary cancel + specific primary

**Layout rules**
- One primary action; full-width buttons OK in narrow modal footer
- Destructive primary uses error styling and clear label (`Delete contract`)

**Responsive / desktop adaptability**
- `max-w-[440px]`; `w-[min(440px,calc(100vw-32px))]` on small viewports
- Scrim: `bg-overlay`

**States**
- Open/closed, loading on primary, validation error inline, success close

**Accessibility**
- Focus trap while open; restore focus on close
- `Modal.Title` / `Description` wired for screen readers
- Close control `aria-label='Close'` when shown

**Copy rules**
- Title = decision (`Delete this contract?`, not `Are you sure?`)
- Primary button specific (`View receipt`, `Delete contract`)
- Cancel/secondary explicit

**Good examples in repo**
- `components/blocks/modal/payment-received-modal.tsx`
- `components/blocks/modal/feature-announcement-modal.tsx`
- `components/blocks/modal/email-verification-modal.tsx`
- `components/blocks/file-upload/file-upload-modal.tsx`

**Anti-patterns**
- Modal for entire settings or onboarding
- Stacked modals
- Generic primary label (`OK`, `Submit`) when action is specific
- Modal with no escape except destructive choice

---

### Onboarding / setup step

**Purpose** — Guide first-time or infrequent setup without blocking experts forever.

**When to use**
- Initial account completion, required integrations, first data import
- Sequential steps where each step has one concept

**When not to use**
- Teaching the whole product upfront
- Optional preferences → settings section
- Repeatable task → standard form or drawer

**Anatomy**
1. Step indicator (only if multiple steps and progress helps)
2. One concept per step — title, short description
3. Minimal fields or actions for that step only
4. Primary continue + secondary skip/back when safe
5. Optional accordion for advanced sections (`account-setup-modal.tsx`)

**Layout rules**
- Same width caps as forms (`max-w-[440px]` card or modal content)
- `gap-6` between step header and fields

**Responsive / desktop adaptability**
- Single column; avoid side-by-side teaching panels

**States**
- Step active, completed (badge/check), skipped, error on step, loading on continue

**Accessibility**
- Step progress announced if visual progress indicator exists
- Skip must not skip required compliance without explicit warning

**Copy rules**
- One concept per step
- Skip only when safe; say what user misses if they skip
- Progress label optional — hide if only two trivial steps

**Good examples in repo**
- `components/blocks/text-input/account-setup-modal.tsx` (multi-section accordion — adapt to linear steps for product)
- `components/blocks/file-upload/design-space-setup-form.tsx`
- `components/blocks/auth/verification-code-card.tsx`

**Anti-patterns**
- Tooltip tour as substitute for setup
- Forced linear wizard with no skip for optional steps
- Teaching every feature before first value

---

### Confirmation flow

**Purpose** — Prevent irreversible or high-risk mistakes while keeping low-risk actions friction-free.

**When to use**
- Delete, revoke access, cancel subscription, discard unsaved destructive edits
- Irreversible or hard-to-undo operations

**When not to use**
- Low-risk reversible actions → prefer undo toast/snackbar
- Routine navigation → no confirm
- Disabled button with no explanation → explain or hide

**Anatomy**
1. Clear title naming the object (`Delete "Q3 Agency Contract"?`)
2. Consequence sentence (what happens, what cannot be undone)
3. Optional checkbox for extra friction on catastrophic actions
4. Secondary cancel (safe default focus) + destructive or primary confirm
5. Specific confirm label matching action (`Delete contract`, not `Yes`)

**Layout rules**
- Use `Modal` pattern; compact, no extra chrome
- Destructive confirm: `variant` / `status='error'` per button tokens

**Responsive / desktop adaptability**
- Same as modal — narrow, centered

**States**
- Confirm loading, confirm error (action failed), success close parent view

**Accessibility**
- Focus safe default on cancel for destructive flows (product policy)
- Confirm button name includes action + object

**Copy rules**
- Name the object and consequence
- Prefer undo for low-risk: *"Contract archived. Undo"*
- No vague *"Are you sure?"* without specifics

**Good examples in repo**
- `components/blocks/modal/destructive-confirm-modal.tsx` (`DestructiveConfirmModal`, `DeleteSavedSearchModal`)
- Acknowledgment pattern: `payment-received-modal.tsx` (non-destructive)
- Status/error language: `components/ui/hint.tsx`, `Alert status='error'`

**Anti-patterns**
- Confirm on every save
- Disabled destructive button with no tooltip or message
- Generic copy that does not name the record
- Irreversible action with only one click and no modal

---

## Adding a new pattern

1. Copy the **pattern template** section above into a PR or new subsection here.
2. Link canonical block files — do not document patterns with no repo anchor unless marked *planned*.
3. Cross-check `design-system.md` §7, `screen-composition.md`, and Storybook `Blocks/*` before inventing layout.
4. Update the **pattern selection guide** table if the pattern changes common routing decisions.
