# Product principles

Agent-facing product intent for SpotGov. Use with [`AGENTS.md`](../AGENTS.md) and [`design-system.md`](./design-system.md) when making UI or flow decisions.

---

## Product promise

SpotGov helps bid teams **discover relevant public tenders, understand requirements faster with AI, and move opportunities through decision and submission** — without losing deadlines or context across tools.

## Target users

- **Who they are:** Companies bidding on public contracts — bid managers, sales teams, proposal writers, and consultants supporting them.
- **What they are trying to accomplish:** Find fit early, decide bid/no-bid, prepare and submit proposals, track pipeline phases, and meet submission deadlines as a team.
- **Sophistication level:** Experienced in tenders, entities, deadlines, and document-heavy bids; not necessarily expert in software. They value speed, reliability, and trustworthy AI over novelty.
- **What they already understand / don't understand:**
  - **Understand:** Tender lifecycle, entities, base price, submission deadlines, CPV, saved searches, organization and workspace context.
  - **Don't assume:** Product navigation, feature names, what AI generated vs platform-sourced data, sync/export status, credit limits, or background job state — make system status and next steps explicit.

## Core jobs

- **Find and filter opportunities** — Tender Radar, active and past search, Search Agent, saved searches, alerts, save/ignore.
- **Qualify and prioritize** — deadlines, price, fit, labels, assignment, and market context to decide what deserves effort.
- **Prepare and submit** — tender documents, AI analysis, proposal generation and revision, compliance checks before submission.
- **Track pipeline and collaborate** — saved tender phases, notes, mentions, notifications, and org files without losing ownership or deadline pressure.

## Experience principles

- **Fast over flashy** — optimize for scanability, keyboard use, and repeat visits; no decorative motion or chrome.
- **Clarity over cleverness** — plain language, obvious labels, visible status; domain terms (tender, solicitation, award) are fine when they match user vocabulary.
- **Progressive disclosure over upfront complexity** — show summary first; filters, detail panels, and advanced actions on demand.
- **Dense when useful, calm by default** — tables and toolbars stay compact for data work; page layout stays breathable so nothing feels like a widget wall.
- **Power-user workflows should not punish new users** — shortcuts and bulk actions exist, but the default path is understandable on first use.
- **Show AI work explicitly** — surface what is analyzed, generating, failed, or stale; never imply human review where there is none.

## Decision principles

When choosing between options:

- Prefer the path that **reduces user uncertainty** — show what happened, what is loading, and what to do next.
- Prefer **reusable concepts** over one-off features — same table, filter, status, and empty-state patterns across domains.
- Prefer **visible system state** over hidden magic — sync status, errors, permissions, and AI output should be inspectable.
- Prefer **inspectable AI output** over black-box summaries — source documents, job status, and retry paths should be available.
- Prefer **recoverable actions** over confirmation spam — undo, draft, and clear cancel paths beat modal walls for routine work.
- Prefer **fewer stronger primitives** over many special cases — compose from existing blocks before inventing a new surface pattern.

## Quality bar

Define what “good enough to ship” means:

- **Clear first-use experience** — page title, short description, and obvious primary action without a tour.
- **No dead ends** — every empty, error, or permission state offers a next step or explanation.
- **Obvious primary action** — one dominant CTA per screen; secondary actions visually subordinate.
- **Deadlines and time remaining are scannable** — on radar, saved tenders, and notifications.
- **Useful empty, loading, and error states** — specific copy (“No tenders match these filters”) not marketing filler; loading labels name what is happening.
- **Keyboard and focus behavior works** — tab order, focus-visible, and screen reader names on icon-only controls.
- **Copy is short and specific** — verb-first buttons, sentence-case labels, errors that say how to fix the problem.
- **Visual hierarchy matches importance** — spacing and typography carry structure before color; status uses text + icon, not hue alone.

## Non-goals

What the product should not become:

- **Not a dashboard of random widgets** — no metric cards or charts unless they drive a bid decision on that screen.
- **Not a generic BI dashboard** — market intelligence serves qualification and pipeline, not charts for their own sake.
- **Not a settings maze** — preferences grouped in scannable cards; no buried toggles for core workflow.
- **Not a marketing surface inside the app** — no hero layouts, hype copy, or promotional empty states in product UI.
- **Not an AI chatbox product** — AI attaches to tenders, documents, and proposals; it is not the whole interface.
- **Not a feature pile** — new capability must map to a core job; defer one-off chrome and modal-heavy flows.
