---
name: add-to-playground
description: >-
  Scaffold a new content/playground/*.mdx page for a component or feature
  that's just been finished. Pulls the design brief from the current
  conversation and/or an inspected file path, interviews the user for
  anything missing, and drafts a live demo. Use when the user says to add,
  ship, or put something "in the playground" after building or discussing
  a component.
argument-hint: "[path-or-component-name]"
---

# Add to Playground

## Read first

1. [`content/playground/contract-status-badge.mdx`](../../../content/playground/contract-status-badge.mdx): the canonical example, frontmatter shape, heading structure, how components get used inline
2. [`lib/playground.ts`](../../../lib/playground.ts): the frontmatter contract and outline extraction (only `##`/`###` headings become nav entries, ids come from `github-slugger`)
3. [`components/playground/mdx-components.tsx`](../../../components/playground/mdx-components.tsx): everything already importable inside MDX content
4. [`components/playground/demo-frame.tsx`](../../../components/playground/demo-frame.tsx): exact `DemoFrame` props (`variants`, `replay`, `children`)
5. [`docs/copy.md`](../../../docs/copy.md): voice and punctuation rules that apply to every word this skill writes

## Workflow

### 1. Resolve the subject

If given an argument, it's a file, directory, or component name. Resolve and read it. Otherwise, infer the subject from what was just built or discussed in this conversation. If neither gives you a clear subject, ask.

### 2. Gather what's already known

Pull from every source available before asking anything:

- **This conversation**, if the subject was just built or discussed here: the stated problem, the why, the thought process, decisions made along the way.
- **The code itself**: read the component/feature files. Note the real import path and export name(s). Look for a `tv()` variants block, an enum prop, or similar to seed sensible demo variants. Read inline comments closely: a header comment like "Recommended (A × C)" or a note about why something aligns a certain way is often real design rationale someone already wrote down.
- **Git history** on the path (`git log`, `git diff`) when the chat has nothing and the code doesn't fully explain itself.

If none of that surfaces the "why," don't get clever about it. Don't go digging through other worktrees, other sessions, or anywhere outside this conversation and this repo. That kind of context is real but it isn't reliably reachable, and guessing at it is worse than just asking. Move straight to the interview.

### 3. Interview for gaps

Ask directly (`AskUserQuestion` or plain conversation) for whatever step 2 didn't cover:

- Title and a one-line summary.
- The brief: what it is, why it was built, the problem it tackles. Never invent this part.
- For multi-part features (a nav with a modal and animations, say): confirm or correct the piece breakdown you're proposing before drafting it.

The demo code gets a best-effort draft (see step 4). The narrative never does.

### 4. Draft `content/playground/<slug>.mdx`

- Kebab-case slug from the title. `order` = current highest `order` across `content/playground/*.mdx` plus one (the index sorts newest-first).
- Frontmatter: `title`, `summary`, `order`.
- Opening prose right under the title: the brief, in 1-3 short paragraphs. This is the most important part of the page and the part that must sound like a person, not a changelog.
- Main live demo next, via `<DemoFrame>`, importing the real component. Pick 1-2 variants when step 2 gave you enough to be confident about what's worth toggling. When you're not confident, leave a plain-language TODO instead of guessing at an import or prop that might not exist.
- For multi-part features: one `##` per piece, each with its own short explanation and, where it earns one, its own demo. This is the same shape the site already uses for iteration versions (see B1/B2 in the canonical example), reused here for composition instead of iteration.
- A "how it's built" passage, its own `##` or folded into the intro, whichever reads more natural. This is where thought process, trade-offs, and rejected directions belong. If part of the story is a dead-end explored on Paper or otherwise not a real buildable component, tell it as prose. Don't fake a toggle for something that never shipped as code.

### 5. Wire up anything new

If the component isn't already importable in MDX, add the import and registration to `components/playground/mdx-components.tsx`. If it needs a bespoke demo wrapper because it has state or animation that can't just be dropped in directly, write a small one under `components/playground/demo-content/` (see `pulse-demo.tsx` for the shape).

### 6. Verify

- Confirm the slug doesn't collide with an existing file.
- Re-check every import used in the demo actually exists at that path. Never ship a hallucinated import.
- Run `npm run lint` and `npm run build`, or at minimum load the new route locally, before calling it done.

## Tone

Write like you're walking a teammate through it over coffee. Specific, a little informal, first person is fine. Follow [`docs/copy.md`](../../../docs/copy.md): no em dashes, no marketing language, no "seamless"/"powerful"/"effortless."

**Bad** (formal, says nothing): "This component provides a robust solution for status visualization, enhancing user experience through intuitive design patterns."

**Good** (specific, has a reason): "Contract status was buried in a table column with no visual weight. This badge carries enough meaning on its own, color plus label plus icon, so a reviewer can scan a list and spot what needs attention."

## Non-negotiables

- Never invent the brief. If you don't know why something was built, ask.
- Never hallucinate an import or a prop. Read the actual file before referencing it.
- Never fake a live toggle for a state that doesn't exist in code. Prose is fine for that.
- Always run lint/build before telling the user it's done.
