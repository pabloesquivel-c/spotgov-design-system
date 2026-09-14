'use client';

// The search filters panel: toolbar + stacked filter rows + footer actions.
// Figma: node 2454:45531 "Panel / Search filters". The rows inside that
// frame are placeholders, not a fixed set — callers pass whatever rows
// apply.
//
// Empty (no filters, no keywords): node 2454:46269 "Section / Search
// filters — Notifications". The footer disappears entirely in this case —
// nothing to clear or search when the list is already everything.
//
// Validation error (e.g. an invalid range row): node 2454:46685, footer
// "Validation error" variant. The footer stays, but gains a hint on the
// left — the actions don't disappear just because a row is invalid; the
// user still needs Clear all/Search to get out of it.
//
// Unapplied changes (edited since the last Search): node 2454:47095,
// footer "Unapplied changes" variant. Same shape as the error hint, same
// information-fill icon, but neutral tone — editing filters isn't a
// mistake, it just hasn't been searched yet.

import * as React from 'react';
import { RiAddLine, RiInformationFill, RiListCheck3, RiSearch2Line } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import { ToolbarRow } from './toolbar-row';

/**
 * Collapsed panel: node 2464:48024 "Popover / Search filters — Collapsed".
 * A different shape from the expanded panel, not a variant of it — a
 * single-line bar with a plain search icon + a summary/placeholder in place
 * of the real input, and one action to reopen the full form. Presentational
 * only: this doesn't decide when the form collapses, it just renders the
 * collapsed state once something else says to.
 */
export const CollapsedFilterPanel = React.forwardRef<
  HTMLButtonElement,
  {
    /** What the search input showed before collapsing, e.g. the applied
     * query. Falls back to the input's own placeholder when there is none. */
    summary?: string;
    onEditSearch?: () => void;
  }
>(function CollapsedFilterPanel({ summary = 'Search...', onEditSearch }, ref) {
  return (
    <div className='flex min-w-0 items-start justify-between gap-2 rounded-20 border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-regular-xs'>
      <div className='flex min-w-0 flex-1 items-center gap-2 p-2'>
        <RiSearch2Line className='size-5 shrink-0 text-text-sub-600' />
        <span className='min-w-0 flex-1 truncate whitespace-nowrap text-paragraph-sm text-text-sub-600'>
          {summary}
        </span>
      </div>

      <Button.Root
        ref={ref}
        variant='neutral'
        mode='stroke'
        size='small'
        className='h-9 shrink-0'
        onClick={onEditSearch}
      >
        <Button.Icon as={RiAddLine} />
        Edit Search
      </Button.Root>
    </div>
  );
});

function EmptyFilters() {
  return (
    <div className='flex h-[200px] w-full flex-col items-center justify-center gap-3'>
      <div className='flex size-10 shrink-0 items-center justify-center rounded-full border border-stroke-soft-200 shadow-regular-xs'>
        <RiListCheck3 className='size-5 text-text-sub-600' />
      </div>
      <div className='flex max-w-[250px] flex-col items-center text-center'>
        <p className='text-label-sm text-text-strong-950'>
          No filters or keywords
        </p>
        <p className='text-label-sm text-text-soft-400'>
          You are searching everything in this country and stage
        </p>
      </div>
    </div>
  );
}

export type FilterPanelHint = {
  message: string;
  /** error: an invalid row (e.g. lower bound above upper bound).
   * neutral: edits since the last Search haven't been applied yet. */
  tone: 'error' | 'neutral';
};

export function FilterPanel({
  children,
  hint,
  onSearch,
  searchInputRef,
}: {
  children?: React.ReactNode;
  hint?: FilterPanelHint;
  /** Fires only on "Search" — not "Clear all", which just empties the rows
   * and leaves the panel expanded for another edit. */
  onSearch?: () => void;
  searchInputRef?: React.Ref<HTMLInputElement>;
}) {
  const isEmpty = !children;

  return (
    <div
      className={
        'flex min-w-0 flex-col items-end overflow-hidden rounded-20 border border-stroke-soft-200 bg-bg-white-0 px-4 pt-4 shadow-regular-xs' +
        (isEmpty ? ' pb-4' : '')
      }
    >
      <div className='flex w-full flex-col gap-8'>
        <ToolbarRow searchInputRef={searchInputRef} />

        {isEmpty ? (
          <EmptyFilters />
        ) : (
          <div className='flex w-full flex-col gap-2'>{children}</div>
        )}
      </div>

      {isEmpty ? null : (
        <div
          className={
            'flex w-full items-center gap-4 py-4' +
            (hint ? ' justify-between' : ' justify-end')
          }
        >
          {hint ? (
            <p
              className={
                'flex items-start gap-1 text-paragraph-xs ' +
                (hint.tone === 'error' ? 'text-error-base' : 'text-text-soft-400')
              }
            >
              <RiInformationFill className='size-4 shrink-0' />
              {hint.message}
            </p>
          ) : null}

          <div className='flex shrink-0 items-center gap-4'>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              className='h-9'
            >
              Clear all
            </Button.Root>
            <Button.Root
              variant='neutral'
              mode='filled'
              size='small'
              className='h-9'
              onClick={onSearch}
            >
              Search
            </Button.Root>
          </div>
        </div>
      )}
    </div>
  );
}
