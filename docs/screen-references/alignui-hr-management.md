# AlignUI HR Management desktop references

Evidence library for the full-screen composition rules in
[`screen-composition.md`](../screen-composition.md).

**Figma file:** `zTiVrKUV6Isp2fdWjl2dg3`

**Inspected:** 23 July 2026
**Scope:** Eight unique desktop frames at `1440x900`; mobile frames excluded

Repo code and semantic tokens remain authoritative. The screenshots document
structure and hierarchy only.

## Node registry

| Node           | Figma frame                           | Reference assets                                                                                                                                                          | SpotGov use                       |
| -------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `191592:43616` | Dashboard [HR Management]             | [PNG](../assets/screen-references/alignui-hr-management/191592-43616.png) · [Annotated SVG](../assets/screen-references/alignui-hr-management/191592-43616-annotated.svg) | Bid operations dashboard exemplar |
| `191592:52936` | Teams [HR Management]                 | [PNG](../assets/screen-references/alignui-hr-management/191592-52936.png) · [Annotated SVG](../assets/screen-references/alignui-hr-management/191592-52936-annotated.svg) | Saved tenders data index exemplar |
| `191592:52925` | Calendar Page [HR Management]         | [PNG](../assets/screen-references/alignui-hr-management/191592-52925.png) · [Annotated SVG](../assets/screen-references/alignui-hr-management/191592-52925-annotated.svg) | Pipeline workbench exemplar       |
| `191592:53006` | Integrations [HR Management]          | [PNG](../assets/screen-references/alignui-hr-management/191592-53006.png) · [Annotated SVG](../assets/screen-references/alignui-hr-management/191592-53006-annotated.svg) | Reference only                    |
| `191592:56039` | Profile Settings [HR Management]      | [PNG](../assets/screen-references/alignui-hr-management/191592-56039.png) · [Annotated SVG](../assets/screen-references/alignui-hr-management/191592-56039-annotated.svg) | Reference only                    |
| `191592:56055` | Company Settings [HR Management]      | [PNG](../assets/screen-references/alignui-hr-management/191592-56055.png) · [Annotated SVG](../assets/screen-references/alignui-hr-management/191592-56055-annotated.svg) | Reference only                    |
| `191592:56072` | Notification Settings [HR Management] | [PNG](../assets/screen-references/alignui-hr-management/191592-56072.png) · [Annotated SVG](../assets/screen-references/alignui-hr-management/191592-56072-annotated.svg) | Reference only                    |
| `191592:56088` | Privacy & Security [HR Management]    | [PNG](../assets/screen-references/alignui-hr-management/191592-56088.png) · [Annotated SVG](../assets/screen-references/alignui-hr-management/191592-56088-annotated.svg) | Reference only                    |

The first three labels in the supplied implementation plan were rotated. The
registry above uses the frame names returned by Figma metadata.

## Shared construction

- Root frame: `1440x900`, clipped, white, `24px` corner radius.
- Sidebar: `272x900`; page region begins at `x=272`.
- Page header: `1168x88`.
- Content inset: `32px`; content begins at `x=304`.
- Content width: `1104px`.
- Repeated horizontal and vertical grid gap: `24px`.
- Typeface: Inter.
- Repeated roles: 18/24 medium page title, 16/24 medium panel title, 14/20
  label or body, 12/16 caption or status.
- Common variables: `bg/white-0`, `bg/weak-50`, `stroke/soft-200`,
  `text/strong-950`, `text/sub-600`, `primary-base`, and semantic state
  families.
- Common elevation: one extra-small shadow plus a soft stroke.
- Most root children use absolute placement and `MIN` constraints. Responsive
  behavior is not modeled.
- Visible root overflow is `NONE`, including the Calendar frame whose content
  extends below the viewport.

Do not copy the flush reference sidebar. SpotGov keeps its floating
`AppSidebar`, then applies the transferable 32px canvas inset and 24px content
rhythm.

## Dashboard

**Node:** `191592:43616`

### Anatomy and measurements

- Four widgets at `352x380` occupy two columns.
- Column positions are `304`, `680`, and `1056`.
- A `352x784` Schedule region fills the third column.
- Grid gaps are `24px`; the bottom inset is `24px`.
- Dense widgets use approximately `16px` internal padding and `16px` internal
  gaps.
- Header actions include search, notifications, a secondary action, and one
  primary action.

### Visible state

Time-off rows show pending, confirmed, and rejected states with text and icons.
Notes show unchecked and completed items. Schedule includes a selected date and
meeting rows. The widget instances use their populated variants; no loading,
empty, error, or permission view is visible.

### Transferable rules

- Three-track operational grid with one tall priority region.
- Compact card interiors are appropriate when the content is a repeated
  operational list.
- A widget has one job and one clear heading.
- Dense descriptions may truncate visually, but full text must remain
  available.

### SpotGov adaptation

Use priority summary, active bid, review queue, deadline tracker, and pipeline
schedule content. Compose from existing Button, StatusBadge, Tooltip, Divider,
and sidebar primitives. Do not create a dashboard primitive.

### Risks not to copy

Low-contrast captions, unnamed icon buttons, avatar-driven identity, Fill
icons, and decorative template branding.

## Teams

**Node:** `191592:52936`

### Anatomy and measurements

- Section header: `1168x80` with `32px` horizontal padding.
- Filter row: `1104x36`.
- Flat table begins at `y=240` and is `1104x564`.
- Column widths: `268`, `180`, `256`, `216`, `120`, and `64px`.
- Header height: `36px`; data rows: `64px`.
- Pagination begins at `y=844` and leaves a `24px` bottom inset.

### Visible state

Segmented filters, search, filter, sort, status values, row selection controls,
row actions, and page 2 are visible. Loading, empty, fetch error, and permission
states are absent.

### Transferable rules

- When the dataset is the page, keep header, toolbar, flat rows, and pagination
  in one continuous work region.
- Round the header cells, not every data row.
- Keep table semantics and align comparable data.
- Preserve full values behind any visual truncation.

### SpotGov adaptation

Use tender title and reference, authority, deadline, procedure or value, status,
and actions. Compose directly with Table, Checkbox, Input, SegmentedControl,
Button, StatusBadge, Tooltip, and Pagination.

### Risks not to copy

Figma frames are not semantic tables. Sort controls lack `aria-sort`; row action
names are ambiguous; truncation has no full-text affordance; the source includes
the typo “HR Asistant.”

## Calendar Page

**Node:** `191592:52925`

### Anatomy and measurements

- Filter row: `1104x36`.
- View tabs: `1104x48`.
- Four upcoming cards: `264x108` with `16px` gaps.
- Calendar region: `1104x654`, starting at `y=340`.
- Time gutter: `104px`; hour rows use a `120px` rhythm.
- Event blocks use compact `8px` to `12px` padding.
- The natural calendar bottom is approximately `y=994`, below the clipped
  `900px` root.

### Visible state

Selected tabs, conflicting and cancelled counts, disabled hatched time slots,
and several event categories are visible. No loading, empty, error, or
permission overlay is shown.

### Transferable rules

- Range controls precede view tabs.
- Deadline summaries support the timeline rather than replacing it.
- Timeline overflow belongs to the timeline.
- Event title, time, and state remain visible as text.

### SpotGov adaptation

Use bid deadlines, clarification cutoffs, review meetings, submission dates,
and award milestones. Keep the time gutter and column headers accessible.

### Risks not to copy

Color-led categories, micro copy, unnamed navigation controls, clipped vertical
content, non-semantic event layout, and the copy defect “1 events.”

## Integrations

**Node:** `191592:53006`

### Anatomy and measurements

- Shared segmented filter and search toolbar.
- Three columns of `352x176` cards.
- Horizontal gap `24px`; vertical gap `20px`.
- Cards use `16px` padding, a soft stroke, and one extra-small shadow.

### Visible state

Connected and disconnected switches are visible. Upcoming integrations show a
“Soon” label, but their Manage actions still appear available.

### Transferable rules

Use a three-column service grid only when each integration is an independently
actionable item. At narrow desktop, use two columns.

### Risks not to copy

Third-party branding, low-contrast inactive segment labels, switches without
descriptions, and enabled-looking actions for unavailable integrations.

## Profile Settings

**Node:** `191592:56039`

### Anatomy and measurements

- Horizontal settings tabs: `1104x48`.
- Vertical settings menu: `258x220`.
- Form column: `352px`, beginning at `x=680`.
- Image upload region: `92px`.
- Two text inputs, one textarea, and two `170px` footer actions.

### Transferable rules

Use a vertical section rail, capped form width, persistent labels, one save
footer, and explicit dirty state.

### Risks not to copy

Required indication by color alone, upload controls without programmatic labels,
and no visible validation, disabled, saving, or success state.

## Company Settings

**Node:** `191592:56055`

### Anatomy and measurements

The shell matches Profile Settings. The `352px` form adds company name,
compound website address, slogan, and description fields.

### Transferable rules

Reuse the existing settings pattern and compound input primitives. Do not create
a company-settings layout component.

### Risks not to copy

“Company Description” is marked both required and optional. The hard-coded
AlignUI URL prefix is template content, not a transferable interaction rule.

## Notification Settings

**Node:** `191592:56072`

### Anatomy and measurements

- Same tab and vertical navigation shell.
- Main preference region: `352x408`.
- Three `56px` switch rows with `16px` gaps.
- Information alert followed by two footer actions.

### Transferable rules

Use labelled Switch controls with descriptions, explicit dirty state, and one
save footer. Keep an alert only when it explains a real consequence.

### Risks not to copy

Color-only switch interpretation, no saving or failure feedback, and
promotional alert copy.

## Privacy & Security

**Node:** `191592:56088`

### Anatomy and measurements

- Same settings shell.
- Main form region: `352x470`.
- Three password fields.
- Strength display contains three bars and a requirement list.

### Transferable rules

Password controls need specific show/hide names, linked requirements, textual
strength, mismatch validation, and explicit save feedback.

### Risks not to copy

Color-only strength bars, unnamed eye controls, generic Apply Changes copy, and
no mismatch, server error, or loading state.

## Source inconsistencies

These are evidence limitations, not rules to reproduce:

- Fixed canvas, mostly minimum constraints, and no meaningful responsive setup.
- Calendar content extends below a clipped, non-scrolling root.
- One malformed component-set variant getter fails without defensive access.
- Some frames use deprecated `verified`, `highlighted`, and template-specific
  variables that SpotGov explicitly drops.
- Several instances use AlignUI custom icons or Remix Fill icons.
- Small `text/soft-400` labels fail the SpotGov contrast requirement.
- Negative letter spacing from generated output must not override the repo type
  utilities.

## Responsive interpretation

Responsive behavior is inferred from content jobs and the SpotGov shell, not
from Figma constraints.

- `1440px` is the visual baseline, not a fixed production width.
- At `1280px`, tracks flex while preserving the expanded sidebar and main
  canvas inset.
- At `1024px`, dashboards and service grids move to two columns, settings stack
  when needed, table and timeline overflow remains internal, and no product
  type is scaled.
- At `1728px`, content stays capped rather than stretching.
- The Playground presenter may scale the complete reference and offers a 100%
  inspection mode. That behavior must not be copied into a product route.
