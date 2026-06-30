# SpotGov Design System

SpotGov's shared design system built on AlignUI — the source of truth for UI components, design tokens, and AI agent rules. Run `npm install`, then `npm run dev` for the token playground or `npm run storybook` for the full component catalog. Primitives live in `components/ui/`; composed patterns live in `components/blocks/` (see `docs/component-conventions.md`).

## Commands

```bash
npm install
npm run dev          # http://localhost:3000 — token preview
npm run storybook    # http://localhost:6006 — component catalog
npm run lint
npm run format:write
```

If Storybook shows **“Failed to fetch dynamically imported module”**, clear the cache and restart:

```bash
rm -rf node_modules/.cache/storybook
npm run storybook
```

**Note:** project paths with spaces (e.g. `SG Coding Workspace`) can occasionally confuse Vite. If issues persist, clone to a path without spaces.

## Deploy (Vercel — single project)

One Vercel project serves both surfaces:

| URL | What |
|---|---|
| `/` | Token preview (Next.js) |
| `/storybook` | Component catalog (Storybook) |

Connect the repo in Vercel (Next.js auto-detected). The `vercel-build` script runs `build:deploy`, which builds Storybook into `public/storybook/` then Next.js. Use your **SpotGov team** on Vercel if available; otherwise Personal is fine.

**Vercel settings check:** In Project → Settings → Build & Development, leave **Build Command** empty (or delete any custom override) so Vercel uses `vercel-build` / `vercel.json`. If Build Command is set to `next build` or `pnpm build`, Storybook will not be built and `/storybook` will be blank.

If `/storybook` is blank, try `/storybook/index.html` directly. If that also fails, open the latest deployment build log and confirm `build-storybook` ran successfully.

## License

AlignUI components follow the [AlignUI license](https://alignui.com). See `LICENSE` for starter template terms.
