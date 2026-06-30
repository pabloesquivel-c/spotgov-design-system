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

## License

AlignUI components follow the [AlignUI license](https://alignui.com). See `LICENSE` for starter template terms.
