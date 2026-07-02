# Code Connect backlog

Tracked progress for Phase 6 — top primitives mapped to AlignUI Figma library (`fileKey: zTiVrKUV6Isp2fdWjl2dg3`).

**Legend:** Draft = `.figma.tsx` in repo · Published = live in Figma Dev Mode · Unmapped = not started

---

## Mapped (draft files in repo)

| Code | Figma component set | componentKey | Mapping file | Published |
|------|---------------------|--------------|--------------|-----------|
| `button` | Buttons [1.1] | `196a29c0924360b8486b10079aef5a7b0ba7672a` | `components/ui/button.figma.tsx` | No |
| `input` | Text Input [1.1] | `04ea634a1ebce022c42d58bcd2571e417716e264` | `components/ui/input.figma.tsx` | No |
| `status-badge` | Status Badge [1.1] | `bafd94858f3d0fca74ac21ed0e5024ea93909be6` | `components/ui/status-badge.figma.tsx` | No |
| `badge` | Badge [1.1] (confirm name) | TBD | `components/ui/badge.figma.tsx` | No |
| `banner` | Banner [1.1] | TBD | `components/ui/banner.figma.tsx` | No |
| `modal` | Modal [1.1] (confirm name) | TBD | `components/ui/modal.figma.tsx` | No |

**Publish status:** Deferred — Org/Enterprise required to publish; **not pursuing upgrade**. Draft files remain useful as variant docs. See [`code-connect.md`](./code-connect.md).

---

## Priority unmapped (next 10–14)

| Code | Figma target (from spot-check) | Priority |
|------|-------------------------------|----------|
| `select` | Select [1.1] | High |
| `dropdown` | Dropdown [1.1] | High |
| `checkbox` | Checkbox [1.1] | High |
| `switch` | Switch [1.1] | High |
| `tag` | Tag [1.1] | Medium |
| `avatar` | Avatar [1.1] | Medium |
| `alert` | Alert [1.1] | Medium |
| `drawer` | Drawer [1.1] | Medium |
| `table` + `table-shared` block | Table Row Cell [1.1] (partial) | Medium |
| `link-button` | Link Buttons [1.1] | Low |
| `compact-button` | Compact Button [1.1] | Low |
| `button-group` | Button Group [1.1] | Low |
| `EmptyState` block | Compose from primitives | Medium |
| `ProductAnnouncementBanner` block | Banner + layout | Low |

---

## Non-product Figma sets (ignore)

AlignUI library includes crypto, landing, and AI template components. Agents should filter to `[1.1]` core primitives — see [`figma-agent-rules.md`](./figma-agent-rules.md).

---

## Maintenance

1. Add `components/ui/<name>.figma.tsx`
2. Update this table
3. `npm run code-connect:preview`
4. `npm run code-connect:publish` — **only if** Org/Enterprise seat (deferred on Pro)
5. Re-test Figma MCP `get_design_context` on mapped component
