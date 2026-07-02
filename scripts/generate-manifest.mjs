#!/usr/bin/env node
/**
 * Generates component manifest from repo scan + manifest-overrides.json.
 * Re-run after adding primitives or blocks: npm run generate:manifest
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const UI_DIR = path.join(ROOT, 'components/ui');
const BLOCKS_DIR = path.join(ROOT, 'components/blocks');
const OVERRIDES_PATH = path.join(ROOT, 'scripts/manifest-overrides.json');
const OUT_MD = path.join(ROOT, 'docs/component-manifest.md');
const OUT_JSON = path.join(ROOT, 'docs/component-manifest.json');

const overrides = JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8'));
const primitivesSkip = new Set(overrides.primitivesSkip ?? []);
const exportSkipPatterns = (overrides.exportSkipPatterns ?? []).map(
  (pattern) => new RegExp(pattern),
);

function titleCase(slug) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function shouldSkipExport(name) {
  return exportSkipPatterns.some((re) => re.test(name));
}

function parseStorybookTitle(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/title:\s*['"]([^'"]+)['"]/);
  return match?.[1] ?? null;
}

function parseIndexExports(content) {
  const exports = [];
  const re = /export\s*\{([^}]+)\}/g;
  let match;
  while ((match = re.exec(content)) !== null) {
    for (const part of match[1].split(',')) {
      const trimmed = part.trim();
      if (!trimmed || trimmed.startsWith('type ')) continue;
      const name = trimmed.split(/\s+as\s+/).pop()?.trim();
      if (name && !shouldSkipExport(name)) exports.push(name);
    }
  }
  return exports;
}

function parseTsxExports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const exports = [];
  const fnRe = /export\s+function\s+([A-Z][A-Za-z0-9]*)/g;
  const constRe = /export\s+const\s+([A-Z][A-Za-z0-9]*)/g;
  let match;
  while ((match = fnRe.exec(content)) !== null) {
    if (!shouldSkipExport(match[1])) exports.push(match[1]);
  }
  while ((match = constRe.exec(content)) !== null) {
    if (!shouldSkipExport(match[1])) exports.push(match[1]);
  }
  return exports;
}

function scanPrimitives() {
  const files = fs
    .readdirSync(UI_DIR)
    .filter((f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'))
    .sort();

  return files
    .map((file) => {
      const slug = file.replace(/\.tsx$/, '');
      if (primitivesSkip.has(slug)) return null;

      const meta = overrides.primitives?.[slug] ?? {};
      const storyTitle =
        parseStorybookTitle(path.join(UI_DIR, `${slug}.stories.tsx`)) ??
        `UI/${titleCase(slug)}`;

      return {
        layer: 'primitive',
        slug,
        name: titleCase(slug),
        importPath: `@/components/ui/${slug}`,
        purpose:
          meta.purpose ??
          `AlignUI primitive — see design-system.md §5`,
        avoid: meta.avoid ?? null,
        canonical: true,
        storybook: storyTitle,
        subExports: meta.subExports ?? [],
      };
    })
    .filter(Boolean);
}

function collectBlockExports(categoryDir) {
  const names = new Set();
  const entries = fs.readdirSync(categoryDir, { withFileTypes: true });

  const indexTs = path.join(categoryDir, 'index.ts');
  const indexTsx = path.join(categoryDir, 'index.tsx');
  if (fs.existsSync(indexTs)) {
    parseIndexExports(fs.readFileSync(indexTs, 'utf8')).forEach((n) =>
      names.add(n),
    );
  }
  if (fs.existsSync(indexTsx)) {
    parseTsxExports(indexTsx).forEach((n) => names.add(n));
    parseIndexExports(fs.readFileSync(indexTsx, 'utf8')).forEach((n) =>
      names.add(n),
    );
  }

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith('.tsx')) continue;
    if (entry.name.endsWith('.stories.tsx')) continue;
    if (entry.name === 'index.tsx') continue;
    parseTsxExports(path.join(categoryDir, entry.name)).forEach((n) =>
      names.add(n),
    );
  }

  return [...names].sort();
}

function isCanonicalExport(category, exportName, blockMeta) {
  if (blockMeta.referenceOnly) return false;
  if (blockMeta.referenceOnlyExports?.includes(exportName)) return false;
  if (blockMeta.canonicalExports?.includes(exportName)) return true;
  return false;
}

function scanBlocks() {
  const categories = fs
    .readdirSync(BLOCKS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const items = [];

  for (const category of categories) {
    const categoryDir = path.join(BLOCKS_DIR, category);
    const blockMeta = overrides.blocks?.[category] ?? {};
    const exportNames = collectBlockExports(categoryDir);
    const categoryStory =
      fs
        .readdirSync(categoryDir)
        .find((f) => f.endsWith('.stories.tsx')) ?? null;
    const resolvedStory = categoryStory
      ? parseStorybookTitle(path.join(categoryDir, categoryStory))
      : null;

    if (exportNames.length === 0) {
      items.push({
        layer: 'block',
        category,
        slug: category,
        name: titleCase(category),
        exportName: null,
        importPath: `@/components/blocks/${category}`,
        purpose:
          blockMeta.purpose ??
          `Block category — see components/blocks/${category}/`,
        canonical: blockMeta.referenceOnly ? false : false,
        referenceOnly: Boolean(blockMeta.referenceOnly),
        storybook: resolvedStory,
      });
      continue;
    }

    for (const exportName of exportNames) {
      const canonical = isCanonicalExport(category, exportName, blockMeta);
      items.push({
        layer: 'block',
        category,
        slug: category,
        name: exportName,
        exportName,
        importPath: `@/components/blocks/${category}`,
        purpose:
          blockMeta.purpose ??
          `Composed block — reference demo in Storybook`,
        canonical,
        referenceOnly:
          Boolean(blockMeta.referenceOnly) ||
          blockMeta.referenceOnlyExports?.includes(exportName) ||
          (!canonical && !blockMeta.canonicalExports),
        storybook: resolvedStory,
      });
    }
  }

  return items;
}

function renderMarkdown(primitives, blocks) {
  const canonicalBlocks = blocks.filter((b) => b.canonical);
  const referenceBlocks = blocks.filter((b) => !b.canonical);
  const generatedAt = new Date().toISOString().slice(0, 10);

  const primitiveRows = primitives
    .map((p) => {
      const sub =
        p.subExports.length > 0
          ? ` (+ ${p.subExports.join(', ')})`
          : '';
      return `| \`${p.slug}\`${sub} | \`${p.importPath}\` | ${p.purpose} | ${p.avoid ?? '—'} | \`${p.storybook}\` |`;
    })
    .join('\n');

  const canonicalRows = canonicalBlocks
    .map((b) => {
      const exportCol = b.exportName ? `\`${b.exportName}\`` : '—';
      return `| ${exportCol} | \`${b.importPath}\` | ${b.purpose} | ${b.storybook ? `\`${b.storybook}\`` : '—'} |`;
    })
    .join('\n');

  const referenceRows = referenceBlocks
    .map((b) => {
      const exportCol = b.exportName ? `\`${b.exportName}\`` : '—';
      const cat = b.category ? `\`${b.category}\`` : '—';
      return `| ${exportCol} | ${cat} | \`${b.importPath}\` | ${b.purpose} |`;
    })
    .join('\n');

  return `# Component manifest

> **Auto-generated** — do not edit by hand. Run \`npm run generate:manifest\` after adding primitives or blocks.
>
> Generated: ${generatedAt} · ${primitives.length} primitives · ${new Set(blocks.map((b) => b.category)).size} block categories · ${canonicalBlocks.length} canonical block exports

Agent-facing inventory for SpotGov product UI. Pair with [\`AGENTS.md\`](../AGENTS.md), [\`design-system.md\`](./design-system.md) §8 (which-one-when), and [\`component-patterns.md\`](./component-patterns.md).

**Import primitives:** \`@/components/ui/<name>\` · **Import blocks:** \`@/components/blocks/<category>\` · **Catalog:** \`/storybook\`

---

## Primitives (\`components/ui/\`)

| Primitive | Import | Purpose | Avoid | Storybook |
|-----------|--------|---------|-------|-----------|
${primitiveRows}

---

## Canonical blocks (prefer for product UI)

| Export | Import | Purpose | Storybook |
|--------|--------|---------|-----------|
${canonicalRows || '| — | — | — | — |'}

---

## Reference blocks (Storybook demos — adapt before shipping)

AlignUI catalog demos. Replace placeholder copy and prefer **canonical blocks** above for production. See [\`component-conventions.md\`](./component-conventions.md).

| Export | Category | Import | Notes |
|--------|----------|--------|-------|
${referenceRows || '| — | — | — | — |'}
`;
}

function main() {
  const primitives = scanPrimitives();
  const blocks = scanBlocks();
  const payload = {
    generatedAt: new Date().toISOString(),
    counts: {
      primitives: primitives.length,
      blockCategories: new Set(blocks.map((b) => b.category)).size,
      blockExports: blocks.filter((b) => b.exportName).length,
      canonicalBlockExports: blocks.filter((b) => b.canonical).length,
    },
    primitives,
    blocks,
  };

  fs.writeFileSync(OUT_MD, renderMarkdown(primitives, blocks));
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`);

  console.log(`Wrote ${path.relative(ROOT, OUT_MD)}`);
  console.log(`Wrote ${path.relative(ROOT, OUT_JSON)}`);
  console.log(
    `${payload.counts.primitives} primitives · ${payload.counts.blockCategories} block categories · ${payload.counts.canonicalBlockExports} canonical exports`,
  );
}

main();
