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
//
// Limit reached (10 of 10 criteria): [suggested] a search allows up to 10
// criteria total — 7 structured filters + 3 keyword rows. Reuses the same
// neutral hint shape as "Unapplied changes" (hitting a cap isn't an
// error), and additionally disables both toolbar add actions via
// `disableAddActions`.

import * as React from 'react';
import {
  RiAddLine,
  RiInformationFill,
  RiListCheck3,
  RiLoader2Line,
  RiSearch2Line,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import type { MatchMode } from './applied-summary';
import { ToolbarRow, type Stage } from './toolbar-row';

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

const GRID_EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';
// Opening a row is the user waiting to read new content — a touch more
// deliberate. Closing is the system getting out of the way — snappier.
// ("Slow where the user is deciding, fast where the system responds.")
const EXPAND_MS = 220;
const COLLAPSE_MS = 180;

/**
 * One CSS-driven accordion row per panel state (expanded/collapsed), both
 * always mounted and stacked in normal flow. `grid-template-rows` animates
 * between 0fr (its own content collapsed away) and 1fr (its own natural
 * height) — the standard Radix Collapsible/Accordion technique. The browser
 * interpolates the track size continuously, so there's no JS height
 * measurement, no forced reflow, and — because both directions run the
 * exact same CSS rule in reverse (just a different duration) — collapse and
 * expand stay in sync by construction, unlike a hand-measured height that
 * can drift asymmetric between directions.
 *
 * `inert` removes the collapsed side from focus/tab order and the a11y tree
 * without affecting layout, so a hidden search input can't eat a Tab press.
 */
export function AccordionRow({
  open,
  animate = true,
  children,
}: {
  open: boolean;
  /** [confirmed] v1 cut Search's panel collapse down to an instant swap —
   * no transition. Left as a prop rather than deleting the motion code, so
   * the collapse mechanic (and the `inert` a11y behavior below) survives
   * untouched for whenever the animation comes back. */
  animate?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        'grid motion-reduce:transition-none' + (animate ? '' : ' transition-none')
      }
      style={{
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: animate
          ? `grid-template-rows ${open ? EXPAND_MS : COLLAPSE_MS}ms ${GRID_EASE}`
          : undefined,
      }}
    >
      <div
        className={
          'min-h-0 overflow-hidden opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none data-[open]:opacity-100' +
          (animate ? '' : ' transition-none')
        }
        data-open={open ? '' : undefined}
        // @ts-expect-error -- `inert` isn't in this React/TS version's DOM
        // typings yet, but is a real, broadly-supported HTML attribute.
        inert={open ? undefined : ''}
      >
        {children}
      </div>
    </div>
  );
}

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
  onClearAll,
  searchDisabled,
  isSearching,
  searchInputRef,
  disableAddActions,
  disableAddFilter,
  disableAddKeyword,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  savedOnly,
  onSavedOnlyChange,
  onAddFilter,
  onAddKeyword,
  stage,
  onStageChange,
  isEmpty: isEmptyProp,
  matchMode,
  onMatchModeChange,
  showMatchMode,
  showAwardedTab,
}: {
  children?: React.ReactNode;
  hint?: FilterPanelHint;
  /** Fires only on "Search" — not "Clear all", which just empties the rows
   * and leaves the panel expanded for another edit. */
  onSearch?: () => void;
  onClearAll?: () => void;
  /** [confirmed] Search is unavailable when there's nothing pending. */
  searchDisabled?: boolean;
  /** A previous Search is still in flight — disables the button (with
   * `aria-busy` + spinner) so a second click can't fire a duplicate
   * request. */
  isSearching?: boolean;
  searchInputRef?: React.Ref<HTMLInputElement>;
  /** [suggested] 10-criteria cap reached (7 structured filters + 3
   * keyword rows) — disables both add actions in the toolbar. */
  disableAddActions?: boolean;
  /** Per-bucket caps (7 structured, 3 keyword) — take priority over
   * `disableAddActions` when set. */
  disableAddFilter?: boolean;
  disableAddKeyword?: boolean;
  /** Controlled search value + "Saved only", forwarded to ToolbarRow. Omit
   * either to leave that control uncontrolled. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
  savedOnly?: boolean;
  onSavedOnlyChange?: (value: boolean) => void;
  onAddFilter?: () => void;
  onAddKeyword?: () => void;
  stage?: Stage;
  onStageChange?: (stage: Stage) => void;
  /** Overrides the empty-state inferred from `children` — needed when a
   * caller always passes a rows component even with zero rows inside it. */
  isEmpty?: boolean;
  matchMode?: MatchMode;
  onMatchModeChange?: (mode: MatchMode) => void;
  /** [suggested] Only meaningful with 2+ configured rows — with 0 or 1,
   * "any" and "all" produce the same results, so the caller gates this on
   * row count rather than always showing it. */
  showMatchMode?: boolean;
  /** Forwarded to ToolbarRow. [confirmed] Defaults to true (three tabs,
   * Awarded locked behind Market Intelligence) — set false for the org
   * variant where that upsell doesn't apply. */
  showAwardedTab?: boolean;
}) {
  const isEmpty = isEmptyProp ?? !children;

  return (
    <div
      className={
        'flex min-w-0 flex-col items-end overflow-hidden rounded-20 border border-stroke-soft-200 bg-bg-white-0 px-4 pt-4 shadow-regular-xs' +
        (isEmpty ? ' pb-4' : '')
      }
    >
      {/* gap-4, not gap-8: the toolbar and the filter-rows list are two
          widgets in the same dense toolbar surface, not separate sections —
          gap-8 read as a jump next to the row list's own gap-2 and the
          footer's py-4. gap-4 matches ToolbarRow's own internal rhythm and
          the footer gap on either side, so the panel reads as one
          consistent 16px cadence bracketing the tighter 8px between
          repeated rows. */}
      <div className='flex w-full flex-col gap-4'>
        <ToolbarRow
          searchInputRef={searchInputRef}
          disableAddActions={disableAddActions}
          disableAddFilter={disableAddFilter}
          disableAddKeyword={disableAddKeyword}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
          savedOnly={savedOnly}
          onSavedOnlyChange={onSavedOnlyChange}
          onAddFilter={onAddFilter}
          onAddKeyword={onAddKeyword}
          stage={stage}
          onStageChange={onStageChange}
          matchMode={matchMode}
          onMatchModeChange={onMatchModeChange}
          showMatchMode={showMatchMode}
          showAwardedTab={showAwardedTab}
        />

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
              onClick={onClearAll}
            >
              Clear all
            </Button.Root>
            <Button.Root
              variant='neutral'
              mode='filled'
              size='small'
              className='h-9'
              disabled={searchDisabled || isSearching}
              aria-busy={isSearching}
              onClick={onSearch}
            >
              {isSearching ? (
                <Button.Icon as={RiLoader2Line} className='animate-spin' />
              ) : null}
              Search
            </Button.Root>
          </div>
        </div>
      )}
    </div>
  );
}
