#!/usr/bin/env node
/**
 * Verifies agent context files exist, cross-link, and manifest is fresh.
 * Run: npm run verify:agent-context
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const REQUIRED_FILES = [
  'AGENTS.md',
  'CLAUDE.md',
  '.cursor/rules/spotgov-design-system.mdc',
  '.claude/skills/spotgov-design-system/SKILL.md',
  '.cursor/skills/spotgov-design-system/SKILL.md',
  'docs/component-manifest.md',
  'docs/component-manifest.json',
  'docs/figma-agent-rules.md',
  'docs/design-system.md',
  'docs/component-patterns.md',
  'docs/screen-composition.md',
  'docs/screen-references/alignui-hr-management.md',
  'docs/design-tokens.md',
  'scripts/generate-manifest.mjs',
  'scripts/manifest-overrides.json',
];

const CROSS_LINK_CHECKS = [
  {
    file: 'AGENTS.md',
    mustContain: ['docs/screen-composition.md'],
  },
  {
    file: 'CLAUDE.md',
    mustContain: [
      'AGENTS.md',
      'docs/component-manifest.md',
      'docs/screen-composition.md',
    ],
  },
  {
    file: '.cursor/rules/spotgov-design-system.mdc',
    mustContain: [
      'AGENTS.md',
      'docs/component-manifest.md',
      'docs/screen-composition.md',
    ],
  },
  {
    file: '.claude/skills/spotgov-design-system/SKILL.md',
    mustContain: [
      'AGENTS.md',
      'docs/component-manifest.md',
      'docs/design-system.md',
      'docs/screen-composition.md',
    ],
  },
  {
    file: '.cursor/skills/spotgov-design-system/SKILL.md',
    mustContain: [
      'AGENTS.md',
      'docs/component-manifest.md',
      'docs/screen-composition.md',
    ],
  },
  {
    file: 'docs/figma-agent-rules.md',
    mustContain: [
      'AGENTS.md',
      'component-manifest.md',
      'screen-composition.md',
      'zTiVrKUV6Isp2fdWjl2dg3',
    ],
  },
  {
    file: 'docs/screen-composition.md',
    mustContain: [
      'component-manifest.md',
      'design-tokens.md',
      'screen-references/alignui-hr-management.md',
    ],
  },
];

const OPTIONAL_FILES = [
  'docs/ai-tool-setup.md',
  '.cursor/mcp.json',
  'figma.config.json',
  'docs/code-connect.md',
];

function newestMtime(dir) {
  if (!fs.existsSync(dir)) return 0;
  let newest = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      newest = Math.max(newest, newestMtime(full));
    } else if (
      entry.isFile() &&
      entry.name.endsWith('.tsx') &&
      !entry.name.endsWith('.figma.tsx')
    ) {
      newest = Math.max(newest, fs.statSync(full).mtimeMs);
    }
  }
  return newest;
}

function checkManifestFreshness() {
  const manifestPath = path.join(ROOT, 'docs/component-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    return { ok: false, message: 'docs/component-manifest.json missing' };
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const generatedAt = Date.parse(manifest.generatedAt ?? '');
  if (Number.isNaN(generatedAt)) {
    return { ok: false, message: 'manifest missing valid generatedAt' };
  }

  const uiMtime = newestMtime(path.join(ROOT, 'components/ui'));
  const blocksMtime = newestMtime(path.join(ROOT, 'components/blocks'));
  const sourceMtime = Math.max(uiMtime, blocksMtime);

  if (sourceMtime > generatedAt + 1000) {
    return {
      ok: false,
      message:
        'component source newer than manifest — run `npm run generate:manifest`',
    };
  }

  return {
    ok: true,
    message: `manifest fresh (${manifest.counts?.primitives ?? '?'} primitives)`,
  };
}

function main() {
  const results = [];
  let failed = 0;

  for (const rel of REQUIRED_FILES) {
    const full = path.join(ROOT, rel);
    const ok = fs.existsSync(full);
    results.push({ check: `exists: ${rel}`, ok });
    if (!ok) failed += 1;
  }

  for (const { file, mustContain } of CROSS_LINK_CHECKS) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) continue;
    const content = fs.readFileSync(full, 'utf8');
    for (const needle of mustContain) {
      const ok = content.includes(needle);
      results.push({ check: `link: ${file} → ${needle}`, ok });
      if (!ok) failed += 1;
    }
  }

  const manifestCheck = checkManifestFreshness();
  results.push({ check: `manifest: ${manifestCheck.message}`, ok: manifestCheck.ok });
  if (!manifestCheck.ok) failed += 1;

  for (const rel of OPTIONAL_FILES) {
    const ok = fs.existsSync(path.join(ROOT, rel));
    results.push({ check: `optional: ${rel}`, ok, optional: true });
  }

  const codeConnectFiles = fs
    .readdirSync(path.join(ROOT, 'components/ui'))
    .filter((f) => f.endsWith('.figma.tsx'));
  results.push({
    check: `code-connect: ${codeConnectFiles.length} mapping file(s) in components/ui`,
    ok: codeConnectFiles.length > 0,
    optional: true,
  });

  console.log('SpotGov agent context verification\n');
  for (const r of results) {
    const icon = r.ok ? '✓' : r.optional ? '○' : '✗';
    const suffix = r.optional && !r.ok ? ' (optional — not yet set up)' : '';
    console.log(`${icon} ${r.check}${suffix}`);
  }

  console.log(`\n${failed === 0 ? 'PASS' : 'FAIL'} — ${failed} required check(s) failed`);
  process.exit(failed === 0 ? 0 : 1);
}

main();
