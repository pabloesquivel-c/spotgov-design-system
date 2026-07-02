# Code Connect setup

Map AlignUI Figma components to SpotGov code so Figma MCP and Dev Mode can return real `@/components/ui/*` imports.

**Status:** Six mapping files drafted in repo · **publish deferred** (not required on Pro plan).

---

## Is Code Connect essential?

**No.** The near-production loop works without it on a **Figma Pro** seat:

| With repo context only (Pro) | With Code Connect publish (Org/Enterprise) |
|------------------------------|--------------------------------------------|
| `get_design_context` via Figma node URL | Same, plus auto `@/components` snippets in MCP |
| Agent maps primitives using [`component-manifest.md`](./component-manifest.md) | Less manual mapping |
| ~85% fidelity with light polish | ~90–95% fidelity |

Per the [build plan 80/20](https://app.notion.com/p/38e382d615938192a2b4c9057e00c286): **Phases 0–5 + 8** are sufficient. Phase 6 is a ceiling-breaker, not a blocker. **We are not pursuing an Org/Enterprise upgrade** for this; draft `.figma.tsx` files stay in the repo as variant documentation.

---

## Prerequisites (only if you publish later)

| Requirement | Notes |
|-------------|-------|
| Figma **Organization or Enterprise** plan | Required to **publish** mappings and use `get_code_connect_map` API — **not available on Pro** |
| Figma Personal Access Token (PAT) | [Figma settings → Security](https://www.figma.com/settings) · **never commit** |
| `@figma/code-connect` | `npm install` (devDependency in this repo) |

On **Pro**, you can still maintain draft mappings locally and run `code-connect:preview` where the CLI allows parsing without publish.

---

## Project layout

```
components/ui/
  button.tsx
  button.figma.tsx      ← Code Connect mapping (draft)
  input.figma.tsx
  ...
figma.config.json       ← parser, include paths, import aliases
```

Config uses React parser and `@/components/ui/*` import paths (see `figma.config.json`).

---

## First-time auth (publish only)

```bash
export FIGMA_ACCESS_TOKEN=figd_...   # never commit
npx figma connect --help
```

Skip this section if you are not publishing.

---

## Generate / fix node URLs

Each `.figma.tsx` file may have `node-id=REPLACE_ME` until linked to the real Figma component set:

```bash
npx figma connect create \
  "https://www.figma.com/design/zTiVrKUV6Isp2fdWjl2dg3/...?node-id=XXXX-YYYY" \
  --outDir components/ui
```

Refine Figma property names (`Variant`, `Style`, etc.) against generated boilerplate.

---

## Preview locally

```bash
npm run code-connect:preview
npx figma connect preview components/ui/button.figma.tsx
```

---

## Publish to Figma (Org/Enterprise only — deferred)

```bash
export FIGMA_ACCESS_TOKEN=figd_...
npm run code-connect:publish:dry-run
npm run code-connect:publish
```

After publish, `get_design_context` may show SpotGov import snippets. **Not applicable on current Pro seat.**

---

## npm scripts

| Script | Command |
|--------|---------|
| `code-connect:preview` | `figma connect preview` all mappings |
| `code-connect:publish` | `figma connect publish` (Org/Enterprise + PAT) |
| `code-connect:publish:dry-run` | `figma connect publish --dry-run` |

---

## Figma ↔ code name reference

See [`figma-agent-rules.md`](./figma-agent-rules.md) spot-check table and [`code-connect-backlog.md`](./code-connect-backlog.md).

---

## Troubleshooting

| Error | Action |
|-------|--------|
| "Couldn't find a Figma access token" | Export `FIGMA_ACCESS_TOKEN` (publish only) |
| Org/Enterprise required | **Expected on Pro** — skip publish; use manifest + manual mapping |
| Property enum mismatch on publish | Run `figma connect create` for that component |
| MCP shows generic code | Normal on Pro without publish — agent uses [`component-manifest.md`](./component-manifest.md) |
