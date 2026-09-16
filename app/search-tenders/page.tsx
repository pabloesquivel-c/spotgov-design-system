'use client';

// Workbench for the Search Tenders screen, built brick by brick from Figma
// frames. Not production.
// Archetype: page-level data index (screen-composition.md:119).
// "Page" is the one composed screen, reading a page-level state (see
// states.ts). Everything else is a specimen tab auditing one component
// family's variants/states in isolation: "Filter rows", "Filter panel",
// "Filter chips", "Modals", "Toasts", "Search results", "Loading pacing"
// (the results-area loading treatment) and "Ready results" (the reveal
// once loading finishes) — both also wired into the real flow, in
// rich-state-flow.tsx's LoadingResults and the block right after it.
// Teardown: rm -rf app/search-tenders

import * as React from 'react';
import { DialRoot, useDialKit } from 'dialkit';
import 'dialkit/styles.css';

import { FilterChips, type MatchMode } from './_components/filter-chips';
import {
  FilterChipsStates,
  WRAPPING_CHIPS,
} from './_components/filter-chips-states';
import { FilterPanel } from './_components/filter-panel';
import {
  FilterPanelStates,
  MockFilterRows,
} from './_components/filter-panel-states';
import { FilterRowVariants } from './_components/filter-row-variants';
import { FLOW_IDS, FORCE_STATE_IDS, FlowsDemo } from './_components/flows';
import { LoadingPacing } from './_components/loading-pacing';
import { ReadyResults } from './_components/ready-results';
import { ModalStates } from './_components/modal-states';
import { PageHeader } from './_components/page-header';
import { ResultsSummary } from './_components/results-summary';
import { SearchResultsStates } from './_components/search-results-states';
import { DEFAULT_STATE, STATE_IDS, type StateId } from './_components/states';
import { ToastStates } from './_components/toast-states';

const VIEW_IDS = [
  'page',
  'filter rows',
  'filter panel',
  'filter chips',
  'modals',
  'toasts',
  'search results',
  'loading pacing',
  'ready results',
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
    flows: {
      flow: {
        type: 'select',
        options: [...FLOW_IDS],
        default: FLOW_IDS[0],
      },
      forceState: {
        type: 'select',
        options: [...FORCE_STATE_IDS],
        default: FORCE_STATE_IDS[0],
      },
    },
  } as const);

  const view = values.view.view as ViewId;
  const state = values.state.state as StateId;
  const flow = values.flows.flow as (typeof FLOW_IDS)[number];
  const forceState = values.flows.forceState as (typeof FORCE_STATE_IDS)[number];

  return (
    <div className='grid h-screen grid-cols-[320px_1fr] gap-4 bg-bg-weak-50 p-4'>
      <div className='min-h-0 overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0'>
        {/* Defaults to dev-only — force it on so the panel also shows up on
            Vercel previews, which build with NODE_ENV=production. This
            page is a workbench, never real production. */}
        <DialRoot mode='inline' productionEnabled />
      </div>

      <div className='flex min-h-0 flex-col overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0'>
        <div className='flex shrink-0 items-baseline gap-3 border-b border-stroke-soft-200 px-6 py-3'>
          <p className='text-label-sm text-text-strong-950'>Search Tenders</p>
          <p className='text-paragraph-xs text-text-sub-600'>
            {flow !== 'none'
              ? `${flow} flow`
              : view === 'page'
                ? `${state} state`
                : `${view} specimens`}
          </p>
        </div>

        <div className='min-h-0 flex-1 overflow-auto px-6 py-6'>
          <div className='mx-auto max-w-[1180px]'>
            {flow !== 'none' ? (
              <FlowsDemo flow={flow} forceState={forceState} />
            ) : null}
            {flow === 'none' && view === 'page' ? (
              <SearchTendersScreen state={state} />
            ) : null}
            {flow === 'none' && view === 'filter rows' ? (
              <FilterRowVariants />
            ) : null}
            {flow === 'none' && view === 'filter panel' ? (
              <FilterPanelStates />
            ) : null}
            {flow === 'none' && view === 'filter chips' ? (
              <FilterChipsStates />
            ) : null}
            {flow === 'none' && view === 'modals' ? <ModalStates /> : null}
            {flow === 'none' && view === 'toasts' ? <ToastStates /> : null}
            {flow === 'none' && view === 'search results' ? (
              <SearchResultsStates />
            ) : null}
            {flow === 'none' && view === 'loading pacing' ? <LoadingPacing /> : null}
            {flow === 'none' && view === 'ready results' ? <ReadyResults /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- `state` will be read once more than one section is built
function SearchTendersScreen({ state: _state }: { state: StateId }) {
  // Static composition, but the match-mode control is real: it decides how
  // every condition combines, so a screen that shows the panel without it
  // isn't showing the panel. The chips below stay mock (this screen has no
  // pending-search state of its own) — the wired version is the rich-state
  // flow.
  const [matchMode, setMatchMode] = React.useState<MatchMode>('any');

  return (
    <div className='flex flex-col gap-6'>
      <div className='px-8'>
        <PageHeader />
      </div>

      <div className='flex flex-col gap-4 px-8'>
        <FilterPanel matchMode={matchMode} onMatchModeChange={setMatchMode}>
          <MockFilterRows />
        </FilterPanel>

        <FilterChips chips={WRAPPING_CHIPS} matchMode={matchMode} />

        <ResultsSummary count={1234} stage='active' country='Portugal' />
      </div>
    </div>
  );
}
