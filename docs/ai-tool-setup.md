# AI tool setup (Cursor, Claude Code, Codex)

Team rollout guide for Phase 5 — wiring AI agents to SpotGov design system context and Figma.

**Figma library:** [AlignUI Design System 2.0](https://www.figma.com/design/zTiVrKUV6Isp2fdWjl2dg3/AlignUI---Design-System-2.0--Current-) · `fileKey: zTiVrKUV6Isp2fdWjl2dg3`

---

## 1. Agent rulebook (already in repo)

Agents should load these automatically when working in this repo:

| File | Role |
|------|------|
| [`AGENTS.md`](../AGENTS.md) | Primary rulebook — tokens, typography, patterns |
| [`CLAUDE.md`](../CLAUDE.md) | Claude Code entry point → AGENTS.md |
| [`.cursor/rules/spotgov-design-system.mdc`](../.cursor/rules/spotgov-design-system.mdc) | Cursor rule (summary + links) |
| [`.claude/skills/spotgov-design-system/SKILL.md`](../.claude/skills/spotgov-design-system/SKILL.md) | Claude skill routing |
| [`.cursor/skills/spotgov-design-system/SKILL.md`](../.cursor/skills/spotgov-design-system/SKILL.md) | Cursor skill routing |
| [`docs/component-manifest.md`](./component-manifest.md) | Live component inventory |
| [`docs/figma-agent-rules.md`](./figma-agent-rules.md) | Figma MCP supplement |

Verify anytime:

```bash
npm run verify:agent-context
```

Regenerate manifest after adding components:

```bash
npm run generate:manifest
```

---

## 2. Figma MCP (recommended)

**Working option:** Figma plugin MCP at `https://mcp.figma.com/mcp` (Cursor Figma plugin / marketplace).

### Cursor (project template)

Copy or merge [`.cursor/mcp.json`](../.cursor/mcp.json) into your Cursor MCP config:

```json
{
  "mcpServers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp"
    },
    "figma-dev-mode": {
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

- **`figma`** — Figma plugin MCP (cloud). Authenticate via Cursor when prompted.
- **`figma-dev-mode`** — Optional local server from Figma desktop Dev Mode. Only works when Figma desktop is open and MCP is enabled.

### Claude Code (`~/.claude/settings.json` or project `.mcp.json`)

```json
{
  "mcpServers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

### Codex / other MCP clients

Use the same `https://mcp.figma.com/mcp` URL. Dev Mode alternative: `http://127.0.0.1:3845/mcp` when Figma desktop MCP is on.

---

## 3. Figma Dev Mode MCP (optional)

1. Open **Figma desktop** (not browser-only).
2. Open AlignUI file → switch to **Dev Mode**.
3. Enable **MCP server** in Dev Mode settings.
4. Confirm reachability: `curl http://127.0.0.1:3845/mcp` should return JSON (400 `Invalid sessionId` means server is up; full MCP handshake happens in the IDE).

If Dev Mode MCP is unavailable, use the **plugin MCP** (`https://mcp.figma.com/mcp`) — it is the supported path for this repo.

---

## 4. Verification checklist

Run after setup or when onboarding a teammate:

| Step | Command / action | Expected |
|------|------------------|----------|
| Agent context files | `npm run verify:agent-context` | All required checks pass |
| Manifest fresh | `npm run generate:manifest` then re-run verify | No stale-manifest warning |
| Figma auth | MCP `whoami` | Returns your Figma user |
| Design system search | MCP `search_design_system` query `Button`, fileKey `zTiVrKUV6Isp2fdWjl2dg3` | Returns `Buttons [1.1]` etc. |
| Selection / node context | MCP `get_design_context` with a node URL | Returns screenshot + reference code |
| Code Connect CLI | `npx figma connect --help` | Help text (no install required) |
| Code Connect publish | See [`code-connect.md`](./code-connect.md) | **Optional** — Org/Enterprise only; deferred on Pro |

Record session results in [`p5-verification-results.md`](./p5-verification-results.md).

---

## 5. Standard Figma → code prompt

```
Read the selected Figma frame. Build using SpotGov design system:
- Import from @/components/ui/* and canonical blocks (docs/component-manifest.md)
- Follow AGENTS.md and docs/design-system.md
- Semantic tokens only (no raw hex)
- Remix Line icons
- Light-only product UI
```

See also [`figma-agent-rules.md`](./figma-agent-rules.md).

---

## 6. Troubleshooting

| Issue | Fix |
|-------|-----|
| Agent ignores tokens | Ensure `AGENTS.md` / `.cursor/rules` are in workspace; re-open chat |
| Figma MCP tools missing | Restart Cursor; enable Figma plugin MCP; sign in to Figma |
| Dev Mode MCP 400 | Normal without IDE session — use plugin MCP instead |
| `get_design_context` returns raw hex | Expected from Figma reference output — map to semantic tokens in code |
| Code Connect publish fails | **Expected on Pro** — publish deferred; use manifest for mapping (see `code-connect.md`) |

---

## 7. Maintenance

- After new primitives/blocks: `npm run generate:manifest`
- After Figma library updates: re-run spot-check in `figma-agent-rules.md`
- After Code Connect mappings (Org/Enterprise only): `npm run code-connect:publish` (with PAT)
