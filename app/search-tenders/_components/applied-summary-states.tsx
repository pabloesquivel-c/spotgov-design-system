'use client';

// The applied-summary specimen tab: the "Matching any/all of:" tag row on
// its own, independent of the panel above it. Figma: "Section / Matching
// keywords" (node 2454:45941).

import * as React from 'react';

import { AppliedSummary, type SummaryChip } from './applied-summary';
import { Specimen } from './specimen';

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
      <Specimen
        title='Matching any of'
        description='A few applied chips under an "any" match mode.'
      >
        <AppliedSummary chips={SHORT_CHIPS} matchMode='any' />
      </Specimen>

      <Specimen
        title='Matching all of'
        description='The same chips under an "all" match mode.'
      >
        <AppliedSummary chips={SHORT_CHIPS} matchMode='all' />
      </Specimen>

      <Specimen
        title='Wrapping to a second line'
        description='Enough chips that the row wraps instead of overflowing.'
      >
        <AppliedSummary chips={WRAPPING_CHIPS} matchMode='any' />
      </Specimen>

      <Specimen
        title='One long chip'
        description='A single chip long enough to need its own truncation.'
      >
        <AppliedSummary chips={LONG_CHIP} matchMode='all' />
      </Specimen>

      <Specimen
        title='Nothing applied'
        description='Empty on purpose — AppliedSummary returns nothing when there are no chips.'
      >
        <p className='text-paragraph-xs text-text-sub-600'>
          (Renders null — nothing to show here.)
        </p>
      </Specimen>
    </div>
  );
}
