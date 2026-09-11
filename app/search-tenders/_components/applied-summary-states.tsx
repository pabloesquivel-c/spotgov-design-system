'use client';

// The applied-summary specimen tab: the "Matching any/all of:" tag row on
// its own, independent of the panel above it. Figma: "Section / Matching
// keywords" (node 2454:45941).

import * as React from 'react';

import { AppliedSummary, type SummaryChip } from './applied-summary';

const SHORT_CHIPS: SummaryChip[] = [
  { id: 'q', label: 'Keyword "Escola"' },
  { id: 'saved', label: 'Saved only' },
  { id: 'category', label: 'Category is any of Construction, Civil engineering' },
];

/** Mock chips matching the placeholder set in Figma — several repeats of
 * "Civil engineering" so the row has enough content to wrap. Reused by the
 * composed page too, until real applied-filter data exists. */
export const WRAPPING_CHIPS: SummaryChip[] = [
  { id: 'construction', label: 'Construction' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'public-works', label: 'Public works' },
  { id: 'project-management', label: 'Project management' },
  { id: 'civil-engineering-1', label: 'Civil engineering' },
  { id: 'civil-engineering-2', label: 'Civil engineering' },
  { id: 'civil-engineering-3', label: 'Civil engineering' },
  { id: 'civil-engineering-4', label: 'Civil engineering' },
  { id: 'civil-engineering-5', label: 'Civil engineering' },
  { id: 'civil-engineering-6', label: 'Civil engineering' },
];

const LONG_CHIP: SummaryChip[] = [
  {
    id: 'buyer',
    label:
      'Buyer is any of Direção-Geral dos Estabelecimentos Escolares do Ministério da Educação e Ciência',
  },
];

export function AppliedSummaryStates() {
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Matching any of (few chips)
        </h2>
        <AppliedSummary chips={SHORT_CHIPS} matchMode='any' />
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Matching all of
        </h2>
        <AppliedSummary chips={SHORT_CHIPS} matchMode='all' />
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Wrapping to a second line
        </h2>
        <AppliedSummary chips={WRAPPING_CHIPS} matchMode='any' />
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          One chip long enough to need its own truncation
        </h2>
        <AppliedSummary chips={LONG_CHIP} matchMode='all' />
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Nothing applied — renders null
        </h2>
        <p className='text-paragraph-xs text-text-sub-600'>
          (Empty on purpose — <code>AppliedSummary</code> returns nothing
          when there are no chips.)
        </p>
      </div>
    </div>
  );
}
