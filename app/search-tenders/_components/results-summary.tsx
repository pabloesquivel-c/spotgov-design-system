'use client';

// The results header: running count + "Sort by" control, sitting between
// the applied-search summary and the result list. Figma: node 2454:45879
// "Header / Results".

import * as React from 'react';

import * as Select from '@/components/ui/select';
import * as Tag from '@/components/ui/tag';

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

export function ResultsSummary({
  count,
  stage,
  country,
  sort = 'most-recent',
  onSortChange,
  currentView,
  onExitView,
}: {
  count: number;
  /** e.g. "active" — names the stage actually being viewed, per spec. */
  stage: string;
  country: string;
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
}) {
  return (
    <div className='flex items-center justify-between'>
      <p className='text-label-md text-text-strong-950'>
        {count.toLocaleString('en-US')} {stage} tenders in {country}
      </p>

      {/* gap-6: "which view you're in" and "how results are sorted" are two
          independent mini-widgets sharing this shelf, not one group — same
          widget-to-widget break ToolbarRow uses to separate "Results must"
          from its own row. Each pairs its label tightly to its control via
          gap-1.5, matching that same precedent. */}
      <div className='flex items-center gap-6'>
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

        <div className='flex items-center gap-3'>
          <span className='shrink-0 whitespace-nowrap text-paragraph-sm text-text-sub-600'>
            Sort by
          </span>
          <Select.Root
            size='small'
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
      </div>
    </div>
  );
}
