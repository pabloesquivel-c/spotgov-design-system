# Figma agent rules (supplement)

**Status:** Draft supplement for Phase 5+ Figma MCP workflows. **Not a source of truth** — canonical rules live in [`AGENTS.md`](../AGENTS.md), [`design-system.md`](./design-system.md), and [`component-manifest.md`](./component-manifest.md).

**Figma library:** [AlignUI Design System 2.0](https://www.figma.com/design/zTiVrKUV6Isp2fdWjl2dg3/AlignUI---Design-System-2.0--Current-) · `fileKey: zTiVrKUV6Isp2fdWjl2dg3`

**Token authority:** Repo code + [`design-tokens.md`](./design-tokens.md) win over Figma variable defaults. SpotGov uses `primary-base` `#335CFF`; Figma may still show stock AlignUI values until variable push (Phase 2 follow-up).

---

## When reading Figma via MCP

1. **Import from code, not from generated markup.** Map Figma components to repo imports in [`component-manifest.md`](./component-manifest.md).
2. **Prefer canonical blocks** for composed patterns (`EmptyState`, `DestructiveConfirmModal`, `ProductAnnouncementBanner`, `FilterPanelShell`, `ContractsTable`).
3. **Read [`screen-composition.md`](./screen-composition.md)** before translating a full page, dashboard, data index, workbench, or settings screen.
4. **Ignore** AlignUI marketing/custom/crypto/AI-template components unless explicitly requested.
5. **Icons:** `@remixicon/react` Line only — do not use AlignUI Figma custom icon components or `*Fill` icons.
6. **Variants:** Figma variant axes should match code props (e.g. Button `variant` + `mode` + `size`). Token *values* may differ by design (SpotGov curation).

---

## Spot-check: top primitives (2 Jul 2026)

Verified via Figma MCP `search_design_system` against AlignUI library `lk-d3981c3e2e2918557c09f034be72138ffc08fa303f7e86ac3080f56c0416f12e4e417268e4146f49d53d67c8a72cadd98078ed7560dca2c35ba916da7c21c040`.

| Code (`components/ui/`) | Figma component set | Match |
|-------------------------|---------------------|-------|
| `button` | Buttons [1.1] | Yes |
| `link-button` | Link Buttons [1.1] | Yes |
| `fancy-button` | Fancy Buttons [1.1] | Yes |
| `compact-button` | Compact Button [1.1] | Yes |
| `button-group` | Button Group [1.1] | Yes |
| `social-button` | Social Buttons [1.1] | Yes |
| `input` | Text Input [1.1] | Yes |
| `digit-input` | Digit Input [1.1] | Yes |
| `status-badge` | Status Badge [1.1] | Yes |
| `banner` | Banner [1.1] | Yes |
| `badge` | *(search separately)* | — |
| `modal` | *(search separately)* | — |
| `select` | *(search separately)* | — |
| `table` | Table Row Cell [1.1] (partial) | Partial — use `table-shared` block recipe in code |
| `input` + `textarea` + `button` + `tab-menu-*` | Company Settings [HR Management] `191592:56225` | Partial — composed HR settings template; map instances to primitives, not a single block |

**Gaps / notes**

- Figma library includes many **non-product** sets (crypto, landing, AI templates). Agents must filter to `[1.1]` core primitives above.
- Full parity mapping is optional **Phase 6 Code Connect** — requires Org/Enterprise to publish; **not required on Pro**. Use this doc + [`component-manifest.md`](./component-manifest.md) for name alignment.

---

## Standard Figma → code prompt pattern

```
Read the selected Figma frame. Build using SpotGov design system:
- Import real components from @/components/ui/* and canonical blocks (see docs/component-manifest.md)
- Follow AGENTS.md and docs/design-system.md
- Semantic tokens only (no raw hex)
- Remix Line icons
- Light-only product UI
Output to a new playground route or block file; copy structure from canonical examples in design-system.md §16.
```

---

## Maintenance

- Re-run Figma spot-check when adding primitives or after major AlignUI library updates.
- Fold learnings into [`manifest-overrides.json`](../scripts/manifest-overrides.json) and regenerate: `npm run generate:manifest`.
- Do not merge raw Figma MCP output into `AGENTS.md` without human review.
