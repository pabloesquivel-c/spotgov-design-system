# Search Tenders — demo recording script

A ~2.5 minute silent screen recording that walks the rich-state flow like a
real user would: build a search, run it, refine it, hit the empty state.

Everything below is clickable. No dev controls on camera.

## Before you hit record

1. `npm run dev`, open `/search-tenders`.
2. In the DialKit panel: **Flows → flow → `rich-state`**. Leave `forceState`
   at `none`.
3. Scroll the right-hand pane back to the top.
4. Now start recording.

The panel stays visible in the recording — that's fine, it's a workbench.
Just don't touch it once you're rolling.

---

## Act 1 — Land · 0:00–0:10

Open on the expanded filter panel with all 11 Portuguese active tenders
below it. Slow-scroll to the bottom and back up. Click nothing — let the
cards, deadline pills and matched-filter badges read on their own.

## Act 2 — Build a search · 0:10–1:00

You're a construction firm in Portugal looking for work over €150k.

1. **Row 1** → click the field trigger → the filter-type picker opens with
   all 8 types → pick **Category** → click the value trigger → check
   **Construction**, **Electrical works**, **Road maintenance**.
   Watch the chip bar fill in below the panel and the footer count tick up.
   **Search enables.**
2. **Row 2** → **CPV** → value trigger → the CPV picker, two lines per row
   (name over code). Type `45233` to show the search working, clear it,
   then pick **Construction work · 45000000**. The picked codes merge into
   one summary chip.
3. Click **Add filter** → **Base Price** → operator **is at least** → type
   `150000`. The digits format as you go.
4. Hold a beat on the footer: **"3 unapplied changes"** next to an enabled
   Search. That's the deferred-apply model in one frame — nothing has run
   yet.

## Act 3 — Search · 1:00–1:20 · the money shot

5. Click **Search**, then don't touch anything for ~5 seconds. In order:
   - the panel collapses (240ms),
   - the orb + shimmering **"Looking through tenders…"** takes over the
     count slot,
   - skeleton rows cascade in,
   - the status line crossfades to **"Matching your filters…"** at 1.5s and
     **"Almost there…"** at 3s,
   - at 4.5s the skeletons clear and the toolbar + 6 cards cascade up
     together.
6. **Sort by → Closest deadline.** Instant reorder; the red *Closes today*
   card jumps to the top.
7. Click the **bookmark** on a card → success toast with **Undo**. Let it
   expire; don't undo.
8. Click **+N more filters** on a card to expand its matched-filter badges.

## Act 4 — Refine · 1:20–2:20

9. Click the **Category chip** in the chip bar → the panel expands *and*
   focuses that exact row. Chips are a map back into the panel.
10. Click **Add keywords** → target **Documents** → type `amianto` → Enter.
    It commits to a chip.
11. **Search** again → 6 skeleton rows (it holds the previous count rather
    than jumping) → **2 cards**, each with a blue **Matched keyword** tag.
    Hover one → tooltip with the document title and the matching snippet.
12. Push it too far: **Edit Search** → change Base Price to at least
    `5000000` → **Search** → **"No active tenders match your search"**.
13. Click **Clear all** in the empty state → the panel drops to its own
    empty state and Search re-enables on the collapsed bar → click
    **Search** → back to all 11. End on the full list.

---

## Expected counts

If a step lands on a different number, something drifted in the fixtures.

| Step | Applied filters (matching **all**) | Results |
| --- | --- | --- |
| Act 1 | none | 11 |
| Act 3 | Category ∈ {Construction, Electrical works, Road maintenance} + CPV 45000000 + price ≥ €150,000 | 6 — t1, t2, t6, t9, t12, t13 |
| Act 4 step 11 | …+ Documents contains `amianto` | 2 — t1, t9 |
| Act 4 step 12 | …price ≥ €5,000,000 | 0 → empty state |
| Act 4 step 13 | cleared | 11 |

Why those: `isCpvOrDescendant` strips trailing zeros, so `45000000` matches
every `45*` code and keeps all six. `amianto` appears in exactly two
document texts (t1, t9), and both already pass the other three filters.

The Act 3 set also happens to carry a full spread of deadline pills — one
red *Closes today*, one *Closes tomorrow*, one *Closes in 5 days*, one
*Deadline not available*, and two far enough out to show no pill at all.

## Deliberately not in the recording

Shown in person instead, all reachable from the DialKit `forceState` dial:
search unavailable, no country access, the impossible-filter-range error,
and the dropped-filter toast. The Awarded stage (winner / competitor
filters), saving a view and Export CSV are also left out to keep the
recording to one continuous story.
