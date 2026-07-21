---
name: brief-stress-test
description: >-
  Stress-test a product or feature brief before design exploration —
  runs a clarity, product-logic, design-system, state-matrix, and
  consistency critique, refines the brief, then emits exploration
  directions and a ready-to-use design-agent handoff prompt. Use when
  the user shares a brief and wants it critiqued, pressure-tested, or
  tightened before designing; mentions a feature brief, PRD, or spec to
  review; asks to run a clarity check, product-logic check, state matrix,
  or exploration directions; or says something like "poke holes in this
  brief" or "am I ready to start designing this?"
argument-hint: "[notion-url | brief-path | paste brief]"
---

# Brief Stress-Test

Pressure-test a brief **before** design explorations begin, so downstream design work builds on a
solid foundation instead of producing pretty nonsense. The mental model is a pipeline:

`brief → critique → constraints → exploration prompts → handoff prompt`

You (Claude) **run each check as real analysis** and produce a consolidated report — you don't just
hand back prompt templates. The one hard rule of flow: **pause after the clarity check** so the human
can resolve ambiguity and green-light brief edits before anything else runs.

## Workflow

### 1. Resolve the brief

Figure out what the brief is and — just as important — *where it lives*, because that decides where
refinements get written later.

- **Notion URL or page id** → fetch it with the Notion MCP (`notion-fetch`; `notion-search` if you
  only have a title). Keep the page id.
- **File path** → read the file.
- **Pasted text** → use it directly.
- **The current conversation** → if a brief was just discussed here and no source was given, confirm
  you're using that.

If none of these resolve to an actual brief, ask for one. Record the source as `notion` / `file` /
`chat` — you'll need it in step 4.

### 2. Clarity check

Read the brief critically and surface where it's vague. Identify:

- unclear user goals
- missing context
- undefined terms
- unstated assumptions
- decisions that need product input
- places where design could reasonably fork in multiple directions
- questions worth answering before exploring

*Why this is first:* ambiguity here is what turns into five random, contradictory designs later. Catch
it while it's cheap.

### 3. Pause + refine gate

**Stop and hand control back to the human.** Present two things:

1. **Open questions / product decisions** — the things only the product owner can answer.
2. **Proposed brief refinements** — a concrete, itemized list, each as **before → after**, so the human
   can react to specifics rather than vibes.

Then ask them to green-light, edit, or reject each item. **Do not write anything to the brief yet.**
Use `AskUserQuestion` or plain conversation, whichever fits the number of items.

### 4. Apply approved refinements to the source

Only after an explicit green light, and only for the items that were approved:

- **Notion brief** → update the page with the Notion MCP (`notion-update-page`), then briefly state what
  changed.
- **File brief** → edit the file.
- **Chat / pasted brief** → output the revised brief inline so they can paste it back themselves.

Writing to Notion or a file is an outward-facing, hard-to-undo change: treat the green light as
per-change permission. If the human didn't approve an item, leave it alone. If they gave no green light
at all, skip the write and just carry the proposed wording forward in your own analysis.

### 5. Product-logic check

Pressure-test the (now-refined) brief as a product person would. Does the proposed feature:

- solve a real user job?
- fit the current product model?
- introduce genuinely new concepts?
- duplicate an existing flow?
- create edge cases?
- require onboarding or education?
- affect permissions, states, or data models?

*Why:* design work almost always exposes product confusion. Better to find it here.

### 6. Design-system check

Compare the brief against the available design system. Identify:

- components you can reuse as-is
- components that need a new variant
- new primitives you may have to introduce
- token / style constraints
- interaction patterns already available
- risks of inventing one-off UI

**Grounding it (portable):** this skill is product-agnostic. If the repo exposes design-system docs —
e.g. an `AGENTS.md`, a component manifest, a `docs/design-system.md`, a Storybook — read them so this
check is concrete. If it doesn't, ask which design system applies, or keep the check framework-agnostic
and flag that it's un-grounded. *Why:* this is what stops agents from quietly building a second product.

### 7. State / edge-case matrix

Force the full set of states into the open, as a table. Cover at least:

| State | Notes |
|-------|-------|
| Default | |
| Empty | |
| Loading | |
| Error | |
| Disabled | |
| Success | |
| Permission denied | |
| Partial data | |
| Long content | |
| Mobile / responsive | |
| First-time vs returning user | |

*Why force this:* agents (and humans) skip states unless made to enumerate them, and skipped states are
where designs fall apart.

### 8. What-should-not-change check

List what must stay consistent with the existing product, so exploration doesn't erode coherence:

- navigation patterns
- component behavior
- terminology
- layout structure
- interaction rules
- visual language

### 9. Exploration angles

Only now, propose **4** design exploration directions chosen to fit *this* brief. For each:

- core hypothesis
- user-experience angle
- tradeoffs
- components likely needed
- risks
- what would make it fail

Draw from this menu but pick the four that actually apply — don't force all of them: simplest path,
power-user-dense, guided / onboarding-first, dashboard-native, modal / drawer-first, progressive
disclosure.

### 10. Final design-agent handoff prompt

Assemble the prompt that seeds the next design session. It must fold in everything above and carry the
guardrails:

```
You are designing within an existing product and design system.

Use:
- brief: <refined brief>
- clarified user goal: <from clarity check>
- constraints: <product-logic + design-system findings>
- reusable components: <from design-system check>
- state matrix: <from step 7>
- exploration direction: <the chosen angle>

Do not:
- invent new visual language
- create one-off components unless necessary
- ignore empty / loading / error states
- change the navigation model unless explicitly justified
```

## Output

Deliver a single consolidated report in chat, one section per check, ending with the exploration angles
and the handoff prompt(s) ready to copy. Offer to write the report to a markdown file; only do so if the
human asks.

## Non-negotiables

- **Always pause after the clarity check** (step 3). Never run the whole pipeline silently to the end —
  the human resolving ambiguity mid-way is the entire point.
- **Never write to Notion or a file without an explicit green light** on the specific changes.
- **Stay product-agnostic.** Ground the design-system check in real docs when they exist, but don't
  hard-wire any one product's paths into your analysis.
- **The handoff prompt always includes the guardrails** in step 10 — that's what keeps the next agent on
  the rails.

## Templates

The raw prompt for each check, in case you want to re-run one in isolation or hand it to another tool.
These mirror the analysis above; the workflow is the source of truth.

**Clarity check**
```
Review this feature brief for ambiguity. Identify: unclear user goals, missing context, undefined
terms, assumptions, decisions that need product input, places where design could go in multiple
directions, and questions we should answer before exploring.
```

**Product-logic check**
```
Stress-test this brief from a product perspective. Does the proposed feature: solve a real user job,
fit the current product model, introduce new concepts, duplicate existing flows, create edge cases,
require onboarding or education, affect permissions, states, or data models?
```

**Design-system check**
```
Compare this brief against our existing design system. Identify: components we can reuse, components
that need variants, new primitives we may need, token/style constraints, interaction patterns already
available, and risks of creating one-off UI.
```

**State / edge-case check**
```
Generate a state matrix for this feature. Include: default, empty, loading, error, disabled, success,
permission denied, partial data, long content, mobile/responsive, and first-time vs returning user.
```

**What-should-not-change check**
```
Based on this brief, list what should remain consistent with the existing product. Include: navigation
patterns, component behavior, terminology, layout structure, interaction rules, and visual language.
```

**Exploration angles**
```
Propose 4 design exploration directions for this feature. Each direction should have: core hypothesis,
user-experience angle, tradeoffs, components likely needed, risks, and what would make it fail.
```

**Final agent prompt**
```
You are designing within an existing product and design system. Use: brief, clarified user goal,
constraints, reusable components, state matrix, and exploration direction. Do not: invent new visual
language, create one-off components unless necessary, ignore empty/loading/error states, or change the
navigation model unless explicitly justified.
```
