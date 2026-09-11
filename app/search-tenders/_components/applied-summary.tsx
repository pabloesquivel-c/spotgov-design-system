'use client';

// The applied-search summary: "Matching any/all of:" + a wrapping tag list.
// Figma: "Section / Matching keywords" (node 2454:45941), inside "Section /
// Applied search" (node 2454:45942). Presentational only — dismissing a tag
// doesn't remove anything yet.

import * as React from 'react';

import * as Tag from '@/components/ui/tag';

export type MatchMode = 'all' | 'any';

export type SummaryChip = {
  id: string;
  label: string;
};

export function AppliedSummary({
  chips,
  matchMode,
}: {
  chips: SummaryChip[];
  matchMode: MatchMode;
}) {
  if (chips.length === 0) {
    return null;
  }

  return (
    <div className='flex w-full flex-wrap items-center gap-2'>
      <span className='shrink-0 whitespace-nowrap text-label-sm text-text-soft-400'>
        {matchMode === 'any' ? 'Matching any of:' : 'Matching all of:'}
      </span>
      {chips.map((chip) => (
        // max-w + truncate: a chip's label is free text (a buyer name, a
        // keyword) with no length guarantee, so it gets the same
        // never-wrap-or-overflow treatment as the filter row triggers.
        <Tag.Root key={chip.id} variant='gray' className='max-w-[320px]'>
          <span className='truncate'>{chip.label}</span>
          <Tag.DismissButton aria-label={`Remove ${chip.label}`} />
        </Tag.Root>
      ))}
    </div>
  );
}
