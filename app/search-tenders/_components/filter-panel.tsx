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
// footer "Unapplied changes" variant. Rendered as a count ("3 unapplied
// changes") sitting immediately left of Search rather than as a hint on the
// far side of the footer — it's a property of the button you're about to
// press, and the number tells you how much is pending in a way the original
// sentence couldn't. The left-hand hint slot stays for the things that are
// genuinely about the rows: validation errors and criteria caps.
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
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import type { MatchMode } from './filter-chips';
import { ToolbarRow, type CountryCode, type Stage } from './toolbar-row';

/**
 * Collapsed panel: node 2585:23754 "Popover / Search filters — Collapsed".
 * A different shape from the expanded panel, not a variant of it — a
 * single-line bar stating what the applied search found, plus one action to
 * reopen the full form. Presentational only: this doesn't decide when the
 * form collapses, it just renders the collapsed state once something else
 * says to.
 *
 * The count moved here from the results toolbar below. It reads as the
 * outcome of the search that's collapsed into this bar ("this is what that
 * search returned") rather than as a caption on the list.
 *
 * While a re-search is in flight, `loadingIndicator` takes this slot instead
 * of the frozen previous count — a stale-but-real-looking number read as
 * already correct, then hard-swapped, which is worse than admitting the
 * count isn't known yet. It also folds what used to be a second,
 * uncoordinated loading tell (an orb+status row under this bar) into the one
 * place already announcing "still working."
 *
 * pl-5/pr-4, not an even padding: Figma (node 2603:28006) gives the text
 * side more room than the button side — the count text is sharp-edged and
 * sits flush in its own box, while Edit Search is a rounded, filled shape
 * whose corner radius already recedes its visual mass inward, so equal
 * geometric padding reads as tighter on the text side.
 *
 * rounded-xl (12px), not the expanded panel's rounded-20: Figma matches this
 * bar to the tender cards below it, which use the same 12px radius — a
 * collapsed search reads as one more row in that stack.
 */
export const CollapsedFilterPanel = React.forwardRef<
  HTMLButtonElement,
  {
    /** How many tenders the applied search returned. Omit to render the bar
     * with no count, as the static specimens do. */
    count?: number;
    onEditSearch?: () => void;
    /** Pending edits made while collapsed. The chip bar below this panel is
     * live in both states, so a condition can be removed with the full form
     * shut — without this the user would get no feedback and no way to run
     * the edit short of reopening the panel. Omit/0 to hide both. */
    unappliedCount?: number;
    onSearch?: () => void;
    isSearching?: boolean;
    /** Renders in place of the count whenever passed — the orb+status
     * line from the real flow's loading state, handed in rather than owned
     * here so this component stays presentational. One signal, not two:
     * this replaces the count line instead of sitting in a second row below
     * it.
     * 220ms ease-out blur crossfade between the two (state indication /
     * preventing a jarring swap, not the phrase-to-phrase pacing crossfade
     * the indicator's own text may use internally). */
    loadingIndicator?: React.ReactNode;
  }
>(function CollapsedFilterPanel(
  {
    count,
    onEditSearch,
    unappliedCount = 0,
    onSearch,
    isSearching,
    loadingIndicator,
  },
  ref,
) {
  const showSearch = unappliedCount > 0 && Boolean(onSearch);
  // Callers hand in `loadingIndicator` only for the window it should be
  // shown (see rich-state-flow.tsx — keyed to the floored `showLoading`
  // signal, not raw `isSearching`, so this doesn't swap back a beat before
  // the skeleton/status line clear), so presence alone gates the swap.
  const showLoadingIndicator = Boolean(loadingIndicator);

  return (
    <div className='flex min-w-0 items-center justify-between gap-2 rounded-xl border border-stroke-soft-200 bg-bg-white-0 py-4 pl-5 pr-4 shadow-regular-xs'>
      <div className='grid min-w-0 flex-1 items-center'>
        <p
          className='col-start-1 row-start-1 min-w-0 truncate text-label-md text-text-strong-950 transition-[opacity,filter] duration-[220ms] ease-out motion-reduce:transition-none'
          style={
            showLoadingIndicator
              ? { opacity: 0, filter: 'blur(2px)' }
              : { opacity: 1, filter: 'blur(0px)' }
          }
          aria-hidden={showLoadingIndicator}
        >
          {count === undefined ? (
            'Search filters'
          ) : (
            <>
              {count.toLocaleString('en-US')}{' '}
              <span className='text-text-sub-600'>
                {count === 1 ? 'tender' : 'tenders'} found
              </span>
            </>
          )}
        </p>
        {loadingIndicator ? (
          <div
            className='col-start-1 row-start-1 flex min-w-0 items-center transition-[opacity,filter] duration-[220ms] ease-out motion-reduce:transition-none'
            style={
              showLoadingIndicator
                ? { opacity: 1, filter: 'blur(0px)' }
                : { opacity: 0, filter: 'blur(2px)', pointerEvents: 'none' }
            }
            aria-hidden={!showLoadingIndicator}
          >
            {loadingIndicator}
          </div>
        ) : null}
      </div>

      <div className='flex shrink-0 items-center gap-4'>
        {showSearch ? (
          <p className='whitespace-nowrap text-paragraph-xs text-text-sub-600'>
            {unappliedCount === 1
              ? '1 unapplied change'
              : `${unappliedCount} unapplied changes`}
          </p>
        ) : null}

        <Button.Root
          ref={ref}
          variant='neutral'
          mode='filled'
          size='small'
          className='h-9 shrink-0'
          onClick={onEditSearch}
        >
          <Button.Icon as={RiAddLine} />
          Edit Search
        </Button.Root>

        {showSearch ? (
          <Button.Root
            variant='neutral'
            mode='filled'
            size='small'
            className='h-9 shrink-0'
            disabled={isSearching}
            aria-busy={isSearching}
            onClick={onSearch}
          >
            {isSearching ? (
              <Button.Icon as={RiLoader2Line} className='animate-spin' />
            ) : null}
            Search
          </Button.Root>
        ) : null}
      </div>
    </div>
  );
});

// Unified morph: collapsed and expanded are one shape changing into
// another, not two separate enter/exit transitions — so both directions
// share one curve and one duration instead of an asymmetric ease-out.
// Picked over the asymmetric-ease-out and snappier alternatives after
// prototyping all three on the "Panel Animation" specimen tab.
const GRID_EASE = 'cubic-bezier(0.77, 0, 0.175, 1)';
// Exported so the results skeleton that appears as this panel collapses
// (rich-state-flow.tsx) can key its own entrance off the same duration
// instead of a second, driftable 240 literal.
export const GRID_MS = 240;
const FADE_MS = 160;

/**
 * One CSS-driven accordion row per panel state (expanded/collapsed), both
 * always mounted and stacked in normal flow. `grid-template-rows` animates
 * between 0fr (its own content collapsed away) and 1fr (its own natural
 * height) — the standard Radix Collapsible/Accordion technique. The browser
 * interpolates the track size continuously, so there's no JS height
 * measurement, no forced reflow, and — because both directions run the
 * exact same CSS rule and duration — collapse and expand stay in sync by
 * construction, unlike a hand-measured height that can drift asymmetric
 * between directions.
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
  /** Escape hatch to disable the transition (e.g. for a context that
   * needs an instant swap) — everything real should leave this at the
   * default. */
  animate?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        // `!` on the motion-reduce variant, not on the inner opacity row's:
        // this row's transition is an inline style (it interpolates GRID_MS
        // and GRID_EASE), and a plain utility class loses to inline styles,
        // so the reduced-motion opt-out this line already declares was never
        // actually taking effect. `!important` from a stylesheet does beat a
        // non-important inline style. The inner row sets only
        // `transition-duration` inline and gets its property from a class,
        // so its own `motion-reduce:transition-none` already wins outright.
        'grid motion-reduce:!transition-none' +
        (animate ? '' : ' transition-none')
      }
      style={{
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: animate
          ? `grid-template-rows ${GRID_MS}ms ${GRID_EASE}`
          : undefined,
      }}
    >
      <div
        className={
          'min-h-0 overflow-hidden opacity-0 transition-opacity ease-out motion-reduce:transition-none data-[open]:opacity-100' +
          (animate ? '' : ' transition-none')
        }
        style={{ transitionDuration: `${FADE_MS}ms` }}
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
    <div className='flex h-[250px] w-full flex-col items-center justify-center gap-3'>
      <div className='flex size-10 shrink-0 items-center justify-center rounded-full border border-stroke-soft-200 shadow-regular-xs'>
        <RiListCheck3 className='size-5 text-text-sub-600' />
      </div>
      <div className='flex max-w-[250px] flex-col items-center text-center'>
        <p className='text-label-sm text-text-strong-950'>
          No filters or keywords
        </p>
        <p className='text-label-sm text-text-sub-600'>
          You are searching everything in this country and stage
        </p>
      </div>
    </div>
  );
}

/**
 * ── Where a problem goes, and whether it blocks Search ──────────────────
 *
 * The panel can be "wrong" in several ways at once, and reasoning about the
 * combinations is hopeless. It isn't a product of states; it's one question
 * asked of each condition independently:
 *
 *     If the user presses Search right now, can they trust the answer?
 *
 * There are only three ways to answer, and the answer picks both the
 * surface and the consequence:
 *
 * 1. NO, THE ANSWER WOULD LIE — block Search. `tone: 'error'`, in this hint.
 *    A condition that can never match returns zero tenders, and the user
 *    reads that zero as "nothing out there" rather than "my filter is
 *    impossible". Only the inverted price range qualifies today.
 *
 * 2. YES, BUT A ROW ISN'T DOING WHAT IT SAYS — Search runs. A note under
 *    that row, not here. The results are correct; one row's wording just
 *    oversells it (two rows on the same field, a keyword row at its term
 *    limit). Wrong results would be case 1; this is a wording gap.
 *
 * 3. YES, YOU JUST CAN'T ADD MORE — Search runs. Disable the control that
 *    would add it and say why *at that control*. The filter/keyword/total
 *    caps do this via the Add buttons plus a `tone: 'neutral'` hint here;
 *    the one-CPV-row cap does it as a blocked row inside the field picker.
 *    Nothing about the current search is wrong, so blocking Search would
 *    punish the user for a limit they've already respected.
 *
 * (A fourth case isn't a problem at all: the system changed their search
 * for them — a row dropped by a stage or country switch — which gets a
 * toast with Undo, because it needs to be reversible, not explained.)
 *
 * The placement rule falls out of it: **the message lives where the cause
 * lives.** One row's problem goes under that row. The panel's problem goes
 * in this hint. A blocked action goes on the control. Something done *to*
 * the user goes in a toast.
 *
 * And the Search rule stays a flat OR, never a matrix — see `canSearch` in
 * rich-state-flow.tsx. A new impossible condition adds one clause there.
 * A new cap adds none.
 */
export type FilterPanelHint = {
  message: string;
  /** error: the search can't run as configured (e.g. lower bound above
   * upper bound) — pairs with a disabled Search button.
   * neutral: the search runs fine; this is a cap or a pending edit. */
  tone: 'error' | 'neutral';
};

export function FilterPanel({
  children,
  hint,
  onSearch,
  onClearAll,
  searchDisabled,
  isSearching,
  unappliedCount = 0,
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
  country,
  onCountryChange,
  showAwardedTab,
  awardedLocked,
  onCollapse,
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
  /** How many pending edits haven't been searched yet. 0 hides the
   * indicator. Counts one per changed setting (lookup text, saved-only,
   * stage, country, match mode) plus one per condition added, removed or
   * edited. */
  unappliedCount?: number;
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
  /** Forwarded to ToolbarRow. Controlled country — omit to leave the select
   * uncontrolled, as the static specimens do. */
  country?: CountryCode;
  onCountryChange?: (country: CountryCode) => void;
  /** Forwarded to ToolbarRow. [confirmed] Defaults to true (three tabs) —
   * set false for the one org variant Market Intelligence isn't offered
   * to at all, dropping Awarded entirely. */
  showAwardedTab?: boolean;
  /** Forwarded to ToolbarRow. [confirmed] The common case for orgs
   * without Market Intelligence: Awarded stays visible but disabled,
   * with a tooltip explaining why on hover or keyboard focus. */
  awardedLocked?: boolean;
  /** Collapses the panel. Wires up two affordances at once: the arrow in
   * the toolbar's top-right, and Escape while focus is anywhere inside the
   * panel. Omit where the panel is always open. */
  onCollapse?: () => void;
}) {
  const isEmpty = isEmptyProp ?? !children;
  // The footer normally disappears with the rows — nothing to clear or
  // search when the list is already everything. But "Clear all" empties the
  // rows *pending*, so an empty panel can still have changes waiting: hiding
  // the footer there would strand the user with a cleared search and no
  // Search button to apply it.
  const showFooter = !isEmpty || unappliedCount > 0;

  // Escape collapses the panel — deliberately a native DOM listener on this
  // element, not React's onKeyDown. Every picker in here is a Radix popover
  // rendered into a portal; React's synthetic events bubble through the
  // *React* tree, so a portalled popover's Escape would reach this handler
  // and close the popover and the panel in one press. Native events follow
  // the DOM tree, where the portal is a sibling of the whole app, so the
  // first Escape closes the popover and only a second one gets here.
  const rootRef = React.useRef<HTMLDivElement>(null);
  const onCollapseRef = React.useRef(onCollapse);
  onCollapseRef.current = onCollapse;

  React.useEffect(() => {
    const node = rootRef.current;
    if (!node) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCollapseRef.current?.();
      }
    };
    node.addEventListener('keydown', handleKeyDown);
    return () => node.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={rootRef}
      className={
        'flex min-w-0 flex-col items-end overflow-hidden rounded-20 border border-stroke-soft-200 bg-bg-white-0 px-4 pt-4 shadow-regular-xs' +
        (isEmpty && !showFooter ? ' pb-4' : '')
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
          country={country}
          onCountryChange={onCountryChange}
          showAwardedTab={showAwardedTab}
          awardedLocked={awardedLocked}
          onCollapse={onCollapse}
        />

        {isEmpty ? (
          <EmptyFilters />
        ) : (
          <div className='flex w-full flex-col gap-2'>{children}</div>
        )}
      </div>

      {showFooter ? (
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
                // sub-600, not soft-400: soft-400 is 2.52:1 on white,
                // under the AA 4.5:1 floor at any size. Same call as the
                // unapplied-count line below.
                (hint.tone === 'error' ? 'text-error-base' : 'text-text-sub-600')
              }
            >
              <RiInformationFill className='size-4 shrink-0' />
              {hint.message}
            </p>
          ) : null}

          <div className='flex shrink-0 items-center gap-4'>
            {unappliedCount > 0 ? (
              // text-sub-600, not soft-400: this is 12px text on white, where
              // soft-400 falls under the AA contrast floor.
              <p className='whitespace-nowrap text-paragraph-xs text-text-sub-600'>
                {unappliedCount === 1
                  ? '1 unapplied change'
                  : `${unappliedCount} unapplied changes`}
              </p>
            ) : null}
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
      ) : null}
    </div>
  );
}
