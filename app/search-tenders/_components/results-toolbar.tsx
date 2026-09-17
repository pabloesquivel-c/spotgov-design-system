'use client';

// The results toolbar: the shelf directly above the result list. Figma:
// node 2495:20710 "Header / Results". Sort on the left, Views + Export CSV
// on the right.
//
// The running count used to lead this row; it now lives in the collapsed
// search panel above (filter-panel.tsx), where it reads as the result of
// the applied search rather than a caption on the list. Views and Export
// came the other way, down from PageHeader — every control here acts on the
// result list, so they sit with it.
//
// No side padding: Figma flushes this row to the same outer edge as the
// card content on both sides.
//
// Views is real when a caller passes `views` — it opens the same
// ViewsPicker used in the Modals specimen tab, wired to select/search/save.
// Selecting a view, updating it, or saving as new all close the popover
// (decisive actions); Reset doesn't, so you can keep adjusting. Omit
// `views` to keep the button decorative, as the static specimens do.

import * as React from 'react';
import { RiFileZipLine, RiStackLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Popover from '@/components/ui/popover';
import * as Select from '@/components/ui/select';
import * as Tag from '@/components/ui/tag';
import { ViewsPicker } from './views-picker';

export type SortValue =
  | 'most-recent'
  | 'oldest'
  | 'closest-deadline'
  | 'furthest-deadline'
  | 'highest-value'
  | 'lowest-value';

// [confirmed] Most recent is the default; the rest are the spec's named
// sort options (date, deadline, base value). No relevance or
// contract-number sort — search here is deterministic.
const SORT_OPTIONS: Array<{ value: SortValue; label: string }> = [
  { value: 'most-recent', label: 'Most recent' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'closest-deadline', label: 'Closest deadline' },
  { value: 'furthest-deadline', label: 'Furthest deadline' },
  { value: 'highest-value', label: 'Highest base value' },
  { value: 'lowest-value', label: 'Lowest base value' },
];

export function ResultsToolbar({
  sort = 'most-recent',
  onSortChange,
  currentView,
  onExitView,
  views,
  onSelectView,
  viewSearch,
  onViewSearchChange,
  hasUnsavedViewChanges,
  onUpdateView,
  onSaveAsNewView,
  onResetView,
  onExport,
}: {
  sort?: SortValue;
  onSortChange?: (value: SortValue) => void;
  /** The named view this search is currently framed as, e.g. "My open
   * bids". Omit (or pass '') to show no indicator — an ad hoc search that
   * was never opened from a saved view has no "current view" to name. */
  currentView?: string;
  /** The badge's "x" — exits the current view without touching the search
   * itself, same distinction a browser tab's "x" draws between closing the
   * tab and clearing its page. */
  onExitView?: () => void;
  views?: string[];
  onSelectView?: (view: string) => void;
  viewSearch?: string;
  onViewSearchChange?: (value: string) => void;
  hasUnsavedViewChanges?: boolean;
  onUpdateView?: () => void;
  onSaveAsNewView?: (name: string) => void;
  onResetView?: () => void;
  onExport?: () => void;
}) {
  const [viewsOpen, setViewsOpen] = React.useState(false);

  const viewsButton = (
    <Button.Root variant='neutral' mode='stroke' size='xsmall'>
      <Button.Icon as={RiStackLine} />
      Views
    </Button.Root>
  );

  return (
    <div className='flex items-center justify-between'>
      {/* gap-6: "how results are sorted" and "which view you're in" are two
          independent mini-widgets sharing this shelf, not one group — same
          widget-to-widget break ToolbarRow uses to separate "Results must"
          from its own row. Each pairs its label tightly to its control via
          gap-3/gap-1.5, matching that same precedent. */}
      <div className='flex items-center gap-6'>
        <div className='flex items-center gap-3'>
          <span className='shrink-0 whitespace-nowrap text-paragraph-sm text-text-sub-600'>
            Sort by
          </span>
          <Select.Root
            size='xsmall'
            variant='compact'
            value={sort}
            onValueChange={onSortChange}
          >
            <Select.Trigger className='w-[125px] shrink-0'>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {SORT_OPTIONS.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        {currentView ? (
          <div className='flex shrink-0 items-center gap-1.5'>
            <span className='whitespace-nowrap text-paragraph-sm text-text-sub-600'>
              Current view:
            </span>
            {/* Figma (node 2454:45549) specs this as the same Tag [1.1]
                component SelectedValueChips/AppliedSummary already use for
                dismissible chips — gray, not the blue Badge tried earlier.
                Tag.DismissButton's built-in -mr-1 against the root's px-2
                already produces the design's pl-8/pr-4 optical asymmetry,
                so no padding override is needed here. text-paragraph-sm
                overrides Tag's own default text-label-xs (12px/medium) —
                at 12px the view name read visibly smaller than "Sort by"'s
                14px/regular select value right next to it; scoped to this
                instance only, since every other chip (Buyer/Category
                picks, AppliedSummary) is a compact 12px label on purpose. */}
            <Tag.Root variant='gray' className='text-paragraph-sm'>
              {currentView}
              <Tag.DismissButton
                aria-label={`Exit "${currentView}" view`}
                onClick={onExitView}
              />
            </Tag.Root>
          </div>
        ) : null}
      </div>

      <div className='flex shrink-0 items-center gap-3'>
        {views ? (
          <Popover.Root open={viewsOpen} onOpenChange={setViewsOpen}>
            <Popover.Trigger asChild>{viewsButton}</Popover.Trigger>
            <Popover.Content align='end' unstyled showArrow={false}>
              <ViewsPicker
                views={views}
                current={currentView}
                onSelectView={(view) => {
                  onSelectView?.(view);
                  setViewsOpen(false);
                }}
                searchValue={viewSearch}
                onSearchChange={onViewSearchChange}
                hasUnsavedChanges={hasUnsavedViewChanges}
                onUpdateView={() => {
                  onUpdateView?.();
                  setViewsOpen(false);
                }}
                onSaveAsNewView={(name) => {
                  onSaveAsNewView?.(name);
                  setViewsOpen(false);
                }}
                onReset={onResetView}
              />
            </Popover.Content>
          </Popover.Root>
        ) : (
          viewsButton
        )}

        {/* Stroke, not filled: Figma puts Views and Export CSV in the same
            neutral/stroke shell here. Export used to be the filled button in
            the page header, where it was the only action on the row; sitting
            beside Views it has no claim to more weight than its neighbour. */}
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xsmall'
          onClick={onExport}
        >
          <Button.Icon as={RiFileZipLine} />
          Export CSV
        </Button.Root>
      </div>
    </div>
  );
}
