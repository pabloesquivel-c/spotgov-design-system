# SpotGov Design System

SpotGov's shared design system built on [AlignUI](https://alignui.com). This repo is the team's source of truth for UI components, design tokens, and AI agent rules.

Based on the [AlignUI Next.js TypeScript starter](https://github.com/alignui/alignui-nextjs-typescript-starter), pre-configured with tokens, utilities, icons, and base components.

## What's included

- AlignUI design tokens in `app/globals.css`
- All AlignUI base components in `components/ui/`
- Required utilities in `utils/` (`cn`, `tv`, `polymorphic`, `recursive-clone-children`)
- Inter font + dark mode via `next-themes`
- Remix Icon (`@remixicon/react`)

## Folder structure

```
app/
  globals.css       ← design tokens (customize in Step 3 of the playbook)
components/
  ui/               ← AlignUI base components
  blocks/           ← Pro blocks and composed patterns (add as needed)
utils/              ← AlignUI helper utilities
hooks/              ← shared React hooks
```

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Playbook

Setup follows the [AlignUI Setup Playbook](https://app.notion.com/p/38c382d6159381608549fcb8c633b6a8) in Notion:

- **Step 2 (done):** Repo + AlignUI foundation
- **Step 3 (next):** Customize tokens in `globals.css` after style direction session
- **Step 4:** Pull additional components as needed
- **Step 5:** Build 2–3 reference pages
- **Step 6:** Add AI rules (`.cursor/rules/`, `AGENTS.md`, etc.)

## License

AlignUI components follow the [AlignUI license](https://alignui.com). See `LICENSE` for the starter template terms.
