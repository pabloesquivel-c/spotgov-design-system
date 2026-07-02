# Product principles

Agent-facing product intent for SpotGov. Use with [`AGENTS.md`](../AGENTS.md) and [`design-system.md`](./design-system.md) when making UI or flow decisions.

---

## Product promise

SpotGov helps procurement teams find, evaluate, and act on government opportunities and contracts — without losing track of what matters or drowning in scattered sources.

## Target users

- **Who they are:** Procurement and contracting professionals — in-house teams, agencies, and vendors — who work with public-sector tenders, solicitations, bids, awards, and contracts on a recurring basis.
- **What they are trying to accomplish:** Spot the right opportunities early, understand requirements quickly, track status and deadlines, and keep documents and decisions organized enough to move work forward.
- **Sophistication level:** Experienced in procurement domain concepts; not necessarily expert in software. They value speed and reliability over novelty.
- **What they already understand / don't understand:**
  - **Understand:** Tender lifecycle, agencies, solicitations, bids, awards, contract periods, compliance deadlines, document-heavy workflows.
  - **Don't assume:** Internal product navigation, feature names, AI behavior, or where data came from — state system status and next steps explicitly.

## Core jobs

- **Discover and prioritize** — surface relevant tenders and opportunities, filter noise, and show why something matters (deadline, agency, status, fit).
- **Track and decide** — follow items through review, bid/no-bid, submission, and award with clear status, ownership, and history.
- **Manage contracts and documents** — find files, periods, parties, and related records without hunting across screens.

## Experience principles

- **Fast over flashy** — optimize for scanability, keyboard use, and repeat visits; no decorative motion or chrome.
- **Clarity over cleverness** — plain language, obvious labels, visible status; domain terms (tender, solicitation, award) are fine when they match user vocabulary.
- **Progressive disclosure over upfront complexity** — show summary first; filters, detail panels, and advanced actions on demand.
- **Dense when useful, calm by default** — tables and toolbars stay compact for data work; page layout stays breathable so nothing feels like a widget wall.
- **Power-user workflows should not punish new users** — shortcuts and bulk actions exist, but the default path is understandable on first use.

## Decision principles

When choosing between options:

- Prefer the path that **reduces user uncertainty** — show what happened, what is loading, and what to do next.
- Prefer **reusable concepts** over one-off features — same table, filter, status, and empty-state patterns across domains.
- Prefer **visible system state** over hidden magic — sync status, errors, permissions, and AI output should be inspectable.
- Prefer **recoverable actions** over confirmation spam — undo, draft, and clear cancel paths beat modal walls for routine work.
- Prefer **fewer stronger primitives** over many special cases — compose from existing blocks before inventing a new surface pattern.

## Quality bar

Define what “good enough to ship” means:

- **Clear first-use experience** — page title, short description, and obvious primary action without a tour.
- **No dead ends** — every empty, error, or permission state offers a next step or explanation.
- **Obvious primary action** — one dominant CTA per screen; secondary actions visually subordinate.
- **Useful empty, loading, and error states** — specific copy (“No contracts match these filters”) not marketing filler; loading does not block understanding of what is happening.
- **Keyboard and focus behavior works** — tab order, focus-visible, and screen reader names on icon-only controls.
- **Copy is short and specific** — verb-first buttons, sentence-case labels, errors that say how to fix the problem.
- **Visual hierarchy matches importance** — spacing and typography carry structure before color; status uses text + icon, not hue alone.

## Non-goals

What the product should not become:

- **Not a dashboard of random widgets** — no metric cards or charts unless they drive a decision on that screen.
- **Not a settings maze** — preferences grouped in scannable cards; no buried toggles for core workflow.
- **Not a marketing surface inside the app** — no hero layouts, hype copy, or promotional empty states in product UI.
- **Not a feature pile** — new capability must map to a core job; defer one-off chrome and modal-heavy flows.
