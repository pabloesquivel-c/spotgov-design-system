'use client';

// The filter chip bar: "Matching any/all of:" + a wrapping list of one
// condition per chip. Figma: "Section / Matching keywords" (node 2454:45941),
// inside "Section / Applied search" (node 2454:45942).
//
// These chips render the *pending* search, not the results on screen. That's
// the whole point of the deferred-apply mechanic: you build a search here,
// press Search, and only then do the results move. Naming it AppliedSummary
// (its previous name) described the Figma frame but lied about the state.
//
// Each chip is a complete, readable condition — "Winner is none of Acme",
// "Documents contains asphalt" — built by describeRow() in
// dynamic-filter-rows.tsx, the same string builder the dropped-filter toast
// uses. One sentence per chip, no inline field/operator segments: the panel
// above already *is* the segmented editor (FilterRow + its field/operator/
// value triggers), so a second editor inside a popover would rebuild that
// mechanic twice. Clicking a chip sends you to its row instead.
//
// A chip is always a complete condition. A half-built row (a Buyer with
// nothing picked yet) has no value to print, so it stays in the panel where
// you're editing it and never appears here as a ghost chip.

import * as React from 'react';

import * as Tag from '@/components/ui/tag';

export type MatchMode = 'all' | 'any';

export type FilterChip = {
  id: string;
  label: string;
  onRemove: () => void;
  /** Sends the user to this condition's editor. Omit for chips that have no
   * row behind them (the lookup query, "Saved only") — those are edited in
   * the toolbar, and a chip that looks clickable but goes nowhere is worse
   * than one that doesn't. */
  onEdit?: () => void;
};

export function FilterChips({
  chips,
  matchMode,
}: {
  chips: FilterChip[];
  matchMode: MatchMode;
}) {
  if (chips.length === 0) {
    return null;
  }

  return (
    <div className='flex w-full flex-wrap items-center gap-2'>
      <span className='shrink-0 whitespace-nowrap text-label-sm text-text-sub-600'>
        {matchMode === 'any' ? 'Matching any of:' : 'Matching all of:'}
      </span>
      {chips.map((chip) => (
        <ConditionChip key={chip.id} chip={chip} />
      ))}
    </div>
  );
}

function ConditionChip({ chip }: { chip: FilterChip }) {
  const editable = Boolean(chip.onEdit);

  return (
    // max-w + truncate: a chip's label is free text (a buyer name, a
    // keyword) with no length guarantee, so it gets the same
    // never-wrap-or-overflow treatment as the filter row triggers.
    //
    // role='button' on the Tag div rather than wrapping the label in a real
    // <button>: the chip already contains the dismiss <button>, and
    // button-in-button is invalid HTML. Same resolution FilterValueTrigger's
    // chips mode reached in filter-row.tsx.
    <Tag.Root
      variant='gray'
      className={
        'max-w-[320px]' +
        (editable
          ? ' cursor-pointer select-none focus-visible:outline-none focus-visible:ring-stroke-strong-950'
          : '')
      }
      role={editable ? 'button' : undefined}
      tabIndex={editable ? 0 : undefined}
      onClick={chip.onEdit}
      onKeyDown={
        editable
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                chip.onEdit?.();
              }
            }
          : undefined
      }
    >
      <span className='truncate'>{chip.label}</span>
      <Tag.DismissButton
        aria-label={`Remove ${chip.label}`}
        onClick={(event) => {
          // Stops the click from also reaching the chip's own onClick, which
          // would send the user to edit the row they just removed.
          event.stopPropagation();
          chip.onRemove();
        }}
      />
    </Tag.Root>
  );
}
