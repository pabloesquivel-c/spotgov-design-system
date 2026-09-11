'use client';

// Workbench for the Search Tenders screen, built brick by brick from Figma
// frames. Not production.
// Archetype: page-level data index (screen-composition.md:119).
// Four views: "Page" is the one composed screen, reading a page-level state
// (see states.ts). "Filter rows", "Filter panel" and "Applied summary" are
// specimen tabs for auditing a component family's variants/states side by
// side, independent of page state.
// Teardown: rm -rf app/search-tenders

import * as React from 'react';
import { DialRoot, useDialKit } from 'dialkit';
import 'dialkit/styles.css';

import { AppliedSummary } from './_components/applied-summary';
import {
  AppliedSummaryStates,
  WRAPPING_CHIPS,
} from './_components/applied-summary-states';
import { FilterPanel } from './_components/filter-panel';
import {
  FilterPanelStates,
  MockFilterRows,
} from './_components/filter-panel-states';
import { FilterRowVariants } from './_components/filter-row-variants';
import { ModalStates } from './_components/modal-states';
import { PageHeader } from './_components/page-header';
import { DEFAULT_STATE, STATE_IDS, type StateId } from './_components/states';

const VIEW_IDS = [
  'page',
  'filter rows',
  'filter panel',
  'applied summary',
  'modals',
] as const;
type ViewId = (typeof VIEW_IDS)[number];

export default function SearchTendersWorkbenchPage() {
  const values = useDialKit('Search Tenders', {
    view: {
      view: {
        type: 'select',
        options: [...VIEW_IDS],
        default: 'page',
      },
    },
    state: {
      state: {
        type: 'select',
        options: [...STATE_IDS],
        default: DEFAULT_STATE,
      },
    },
  } as const);

  const view = values.view.view as ViewId;
  const state = values.state.state as StateId;

  return (
    <div className='grid h-screen grid-cols-[320px_1fr] gap-4 bg-bg-weak-50 p-4'>
      <div className='min-h-0 overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0'>
        <DialRoot mode='inline' />
      </div>

      <div className='flex min-h-0 flex-col overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0'>
        <div className='flex shrink-0 items-baseline gap-3 border-b border-stroke-soft-200 px-6 py-3'>
          <p className='text-label-sm text-text-strong-950'>Search Tenders</p>
          <p className='text-paragraph-xs text-text-sub-600'>
            {view === 'page' ? `${state} state` : `${view} specimens`}
          </p>
        </div>

        <div className='min-h-0 flex-1 overflow-auto px-6 py-6'>
          <div className='mx-auto max-w-[1180px]'>
            {view === 'page' ? <SearchTendersScreen state={state} /> : null}
            {view === 'filter rows' ? <FilterRowVariants /> : null}
            {view === 'filter panel' ? <FilterPanelStates /> : null}
            {view === 'applied summary' ? <AppliedSummaryStates /> : null}
            {view === 'modals' ? <ModalStates /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchTendersScreen({ state: _state }: { state: StateId }) {
  // Every section reads `_state` once more than one is built.
  return (
    <div className='flex flex-col gap-6'>
      <PageHeader />

      <div className='flex flex-col gap-4 px-8'>
        <FilterPanel>
          <MockFilterRows />
        </FilterPanel>

        <AppliedSummary chips={WRAPPING_CHIPS} matchMode='any' />
      </div>
    </div>
  );
}
