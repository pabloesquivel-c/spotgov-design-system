# Screen composition

Canonical guidance for full-screen SpotGov product UI. Read this after
[`AGENTS.md`](../AGENTS.md) and the
[`component manifest`](./component-manifest.md) when creating or materially
redesigning a page, dashboard, data index, workbench, or settings screen.

This guide defines composition only. It does not replace AlignUI tokens,
primitives, or canonical blocks. Code and
[`design-tokens.md`](./design-tokens.md) remain authoritative.

## Scope and boundaries

- Use existing primitives from `@/components/ui/*` and canonical blocks from
  `components/blocks/*`.
- Do not change tokens, primitive defaults, global styles, dependencies, or
  product data contracts to reproduce a reference screen.
- Preserve the current SpotGov floating `AppSidebar` direction.
- Treat the AlignUI HR Management frames as construction evidence, not product
  specifications. See
  [`screen-references/alignui-hr-management.md`](./screen-references/alignui-hr-management.md).
- Keep procurement terminology, SpotGov status semantics, and accessible
  behavior even when a Figma template differs.

## Reference canvas versus product layout

The source frames use a fixed `1440x900` desktop canvas. A Playground presenter
may preserve and scale that logical canvas for visual comparison.

Production screens must not use transform scaling. They must reflow with CSS,
retain the AlignUI type scale, and keep controls at their primitive-defined
sizes. Scaling a reference is a documentation technique, not responsive product
behavior.

## Shell contract

| Region                 | Rule                                                                     |
| ---------------------- | ------------------------------------------------------------------------ |
| Global navigation      | Reuse `AppSidebar`; expanded width is `272px`                            |
| Floating shell         | Keep the existing outer inset and gap treatment used by product previews |
| Main canvas inset      | `32px` on desktop (`px-8`)                                               |
| Widget and grid rhythm | `24px` (`gap-6`)                                                         |
| Major section rhythm   | `32px` (`gap-8`)                                                         |
| Main content width     | Respect the existing `max-w-[1440px]` product grid                       |
| Background             | Semantic `bg-bg-*` utilities only                                        |

The Figma reference places content directly after a flush sidebar. SpotGov keeps
its floating shell, so do not copy the reference sidebar position or branding.
Adopt the reference's 32px canvas inset and 24px content rhythm inside the
existing shell.

The current `AppSidebar` implements the expanded state only. The token guide
documents an `80px` collapsed shell, but screen work must not invent or locally
patch that behavior. Record a narrow-desktop limitation when it matters and
handle the main canvas without changing sidebar internals.

## Page bands

Compose full screens from stable horizontal bands:

1. **Page header:** Title and short description on the left; one primary action
   and optional secondary actions on the right.
2. **Section navigation:** Tabs or segmented controls only when they switch a
   meaningful view or mode.
3. **Toolbar:** Search, filter, sort, range, and view controls near the content
   they affect.
4. **Primary work region:** Dashboard grid, table, timeline, form, or detail
   surface.
5. **Footer controls:** Pagination or save actions aligned with the region they
   operate on.

The AlignUI header is `88px` high when all actions fit. Treat that as a desktop
reference, not a fixed production height. Let the header grow when actions wrap
or localized copy requires more space.

## Hierarchy and enclosure

Use spacing and typography before adding surface chrome.

- Do not put every section in a card.
- Use a surface when it groups a discrete widget, form, or repeated item.
- Keep table rows flat. Round the table wrapper only when the table is an
  embedded, self-contained block.
- Do not nest cards. Event rows, status rows, and metadata inside a widget stay
  unframed unless they are independently actionable repeated items.
- Use one shadow per element. Prefer rings for dense surfaces.
- Keep one dominant page action.

## Context-specific density

The former blanket `p-6` recommendation is a default, not a mandate.

| Context           | Density                                                           |
| ----------------- | ----------------------------------------------------------------- |
| Page canvas       | `px-8`; major sections `gap-8`                                    |
| Dashboard widget  | `p-4` for dense operational content; `p-6` for simpler summaries  |
| Embedded block    | Trust the canonical block's padding                               |
| Settings card     | Keep the existing `p-5`, `gap-5` pattern                          |
| Table and toolbar | Trust primitive cells; use `gap-2` to `gap-4` around controls     |
| Timeline event    | Compact `p-2` or `p-3`, with readable labels and redundant status |

Do not override primitive padding to force screenshot parity.

## Archetype selection

### Operational dashboard

Use when users need to prioritize work, deadlines, and review queues on one
screen. Do not use for decorative metrics or generic analytics.

- Baseline desktop: three equal tracks with `gap-6`.
- A tall priority or schedule region may occupy the final track.
- Each widget needs a clear title, one job, and explicit default, loading,
  empty, error, and permission behavior.
- Use status text plus a Line icon or dot.
- Long tender names may truncate visually only when the full value remains
  available to assistive technology and on hover or focus.

### Page-level data index

Use when a dataset is the primary page task, such as Saved Tenders.

- Keep the page header, filter row, table, and pagination as one continuous
  work region.
- Compose directly with `Table.Root`, existing toolbar controls, checkboxes,
  status badges, and `Pagination`.
- Do not add a rounded `TableBlock` shell around a table that already dominates
  the page.
- Preserve semantic `<table>` markup, `aria-sort`, named row actions, and named
  selection controls.

### Embedded data block

Use `TableBlock`, `TableBlockToolbar`, `BlockDataTable`, and
`TableBlockFooter` when the dataset is one self-contained region among other
page content. This remains the default for Storybook blocks, dashboards, and
detail pages.

### Calendar or pipeline workbench

Use when time placement and conflicts are central to the task.

- Put range and filter controls before view tabs.
- Use compact deadline summaries above the timeline only when they help users
  act.
- Keep the time gutter and day headers understandable while the timeline
  scrolls.
- Events require a visible label, time, and state cue beyond fill color.
- The workbench owns horizontal overflow. The page shell must not scroll
  horizontally.
- Production height follows the viewport or content and scrolls intentionally.
  Do not clip to the reference's 900px frame.

### Settings

Follow the existing settings section pattern. Use vertical section navigation,
capped form cards, visible labels, Discard/Apply semantics, and explicit
permission states. Do not turn the settings references into a new layout
primitive.

## Responsive desktop contract

Desktop-only does not mean 1440px-only. Verify every full-screen composition at
1024, 1280, 1440, and 1728px.

| Viewport | Required behavior                                                                                        |
| -------- | -------------------------------------------------------------------------------------------------------- |
| `1728px` | Keep content within the existing max-width grid; do not stretch tracks indefinitely                      |
| `1440px` | Reference composition and primary alignment baseline                                                     |
| `1280px` | Preserve the expanded sidebar and 32px canvas inset; allow tracks and toolbars to flex                   |
| `1024px` | Preserve the current sidebar implementation; reflow the main task without page-level horizontal overflow |

Archetype behavior:

- **Dashboard:** Three tracks at the baseline. Use two tracks at narrow desktop;
  move the tall schedule region below or let it span both tracks.
- **Data index:** Wrap toolbar and pagination controls. Keep readable table
  column minimums and scroll inside the table region.
- **Calendar:** Change four deadline summaries to two columns. Keep the timeline
  at a readable minimum width with internal horizontal scrolling.
- **Settings:** Keep rail and form side by side only when both remain readable;
  otherwise stack the rail before the form.
- **Integration grid:** Three columns at the baseline and two at narrow desktop.

At any width:

- Do not scale product fonts with viewport width.
- Do not shrink controls below primitive dimensions.
- Do not hide the primary action without an equivalent reachable control.
- Do not allow page-level horizontal overflow.
- Re-check focus order after any visual reflow.

## State coverage

Every coded screen example and production implementation must account for:

- default and selected
- loading without layout collapse
- empty with a specific next action
- recoverable error
- disabled with an explanation where needed
- permission-limited
- keyboard focus and active interaction

Not every state must be visible simultaneously. The implementation or its
documentation must make the behavior explicit.

## Accessibility

- Use AlignUI type utilities and `text-text-sub-600` or stronger for readable
  12 to 14px copy on white.
- Use Remix Line icons only.
- Name icon-only controls.
- Status requires text plus an icon or shape.
- Tabs, segmented controls, switches, pagination, and menus keep their native
  primitive semantics.
- Tables use headers and real rows, not a grid of `div` elements.
- Timeline events expose day, time, title, and state as text.
- Truncation never removes access to the complete value.

## Implementation checklist

- [ ] Existing primitive or canonical block selected first
- [ ] No token, global style, dependency, or primitive change
- [ ] 32px canvas inset and 24px grid rhythm used at layout level
- [ ] Page bands and one primary action are clear
- [ ] Enclosure matches the content job
- [ ] Default, loading, empty, error, disabled, and permission behavior covered
- [ ] 1024, 1280, 1440, and 1728px reviewed
- [ ] No page-level horizontal overflow
- [ ] Keyboard, focus, names, status redundancy, and truncation checked
