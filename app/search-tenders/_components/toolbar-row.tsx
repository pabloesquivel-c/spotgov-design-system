'use client';

// Toolbar row: stage tabs, keyword search, country + match-mode selects, add
// filter/keyword actions, saved-only toggle. Figma: node 2486:2717 "Header /
// Search filters", inside the Panel / Search filters container. Tabs stack
// above the action row (gap-4), not inline with it.
//
// [suggested] Match-mode moved up here from above the filter-rows list —
// it reads more like a toolbar-level query setting (alongside stage/country)
// than something that belongs inside the rows it governs.
//
// Active/Evaluating/Awarded are all a real controlled toggle — Awarded
// isn't locked or disabled, it's a normal clickable stage like the other
// two. [confirmed] The only variant is whether it's there at all:
// `showAwardedTab={false}` drops it entirely for the one org Market
// Intelligence isn't offered to, rather than showing it disabled with
// nothing to unlock.

import * as React from 'react';
import { RiAddLine, RiFilter3Line, RiSearch2Line } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as Input from '@/components/ui/input';
import * as Select from '@/components/ui/select';
import * as SegmentedControl from '@/components/ui/segmented-control';
import type { MatchMode } from './applied-summary';

const BASE_STAGE_TABS = [
  { value: 'active', label: 'Active' },
  { value: 'evaluating', label: 'Evaluating' },
] as const;

const AWARDED_TAB = { value: 'awarded', label: 'Awarded' } as const;

export type Stage =
  | (typeof BASE_STAGE_TABS)[number]['value']
  | typeof AWARDED_TAB.value;

export function ToolbarRow({
  searchInputRef,
  disableAddActions = false,
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
  matchMode,
  onMatchModeChange,
  showMatchMode,
  showAwardedTab = true,
}: {
  /** Lets a parent (e.g. the collapse/expand toggle) move focus into the
   * search input right after it expands. */
  searchInputRef?: React.Ref<HTMLInputElement>;
  /** Disables both add actions at once. `disableAddFilter`/
   * `disableAddKeyword` take priority when set — the two caps (7
   * structured, 3 keyword) are reached independently. */
  disableAddActions?: boolean;
  disableAddFilter?: boolean;
  disableAddKeyword?: boolean;
  /** Controlled search value + "Saved only" — omit either to leave that
   * control uncontrolled, as every existing specimen usage does. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** [confirmed] Pressing Enter in the lookup field performs the same
   * action as Search. */
  onSearchSubmit?: () => void;
  savedOnly?: boolean;
  onSavedOnlyChange?: (value: boolean) => void;
  onAddFilter?: () => void;
  onAddKeyword?: () => void;
  /** Controlled stage toggle. Omit to leave it uncontrolled. */
  stage?: Stage;
  onStageChange?: (stage: Stage) => void;
  matchMode?: MatchMode;
  onMatchModeChange?: (mode: MatchMode) => void;
  /** [suggested] Only meaningful with 2+ configured rows — with 0 or 1,
   * "any" and "all" produce the same results, so the caller gates this on
   * row count rather than always showing it. */
  showMatchMode?: boolean;
  /** [confirmed] Default is three real, clickable tabs — Active,
   * Evaluating, Awarded. Set false for the one org variant Market
   * Intelligence isn't offered to, dropping Awarded entirely rather than
   * showing it disabled. */
  showAwardedTab?: boolean;
}) {
  const stageTabs = showAwardedTab ? [...BASE_STAGE_TABS, AWARDED_TAB] : BASE_STAGE_TABS;

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-3'>
        {/* SegmentedControl.List's own height (p-1 padding + h-7 trigger =
            28px + 4px + 4px = 36px) already lands on the same h-9 token the
            "Saved only" pill uses — both trace back to the 4px spacing
            scale, so lining them up here needs no height override, just
            items-center in a shared row. */}
        <SegmentedControl.Root
          value={stage}
          defaultValue={stage ? undefined : 'active'}
          onValueChange={
            onStageChange ? (value) => onStageChange(value as Stage) : undefined
          }
          className='w-[368px] shrink-0'
        >
          <SegmentedControl.List>
            {stageTabs.map((tab) => (
              <SegmentedControl.Trigger key={tab.value} value={tab.value}>
                {tab.label}
              </SegmentedControl.Trigger>
            ))}
          </SegmentedControl.List>
        </SegmentedControl.Root>

        {/* Not a Button: Figma shows a checkbox + label inside the same
            stroked pill shell, not an icon-leading button. Paired with the
            stage tabs (both scope which tenders show) rather than living in
            the search/action row below, which was getting crowded. */}
        <label className='flex h-9 shrink-0 items-center gap-1 rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-2 shadow-regular-xs'>
          <Checkbox.Root
            checked={savedOnly}
            onCheckedChange={
              onSavedOnlyChange
                ? (checked) => onSavedOnlyChange(checked === true)
                : undefined
            }
          />
          <span className='px-1 text-label-sm text-text-sub-600'>
            Saved only
          </span>
        </label>
      </div>

      {/* gap-6: the one deliberate section break in this row — 3x the
          gap-2 used inside the group below it, so "Results must" reads as
          its own thing rather than just another item at the same spacing
          as everything else. (A gap only signals grouping when the ratio
          between "boundary" and "same group" is unmistakable — 12px vs
          20px, as this used to be, isn't.) */}
      <div className='flex min-w-0 items-center gap-6'>
        {showMatchMode ? (
          <div className='flex shrink-0 items-center gap-1.5'>
            <span className='shrink-0 whitespace-nowrap text-paragraph-sm text-text-sub-600'>
              Results must
            </span>
            <Select.Root
              size='small'
              variant='compact'
              value={matchMode}
              onValueChange={onMatchModeChange}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value='all'>match all filters</Select.Item>
                <Select.Item value='any'>match any filter</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        ) : null}

        {/* Everything else in the row — search, country, both add actions —
            as one cluster at a single uniform gap-2, so it reads as one
            group instead of three siblings each patched with their own
            margin. */}
        <div className='flex min-w-0 flex-1 items-center gap-2'>
          {/* size='small' = h-9/rounded-lg, matching the 36px/8px-radius row
              height set by Select and the buttons below (medium is 40px/10px).
              flex-1 fills all remaining row width (Figma: flex-[1_0_0]),
              min-w-0 lets it shrink below its content size instead of
              overflowing past the panel's rounded corner at narrower widths. */}
          <Input.Root
            size='small'
            className='min-w-0 flex-1 hover:shadow-regular-xs active:scale-[0.99]'
          >
            <Input.Wrapper className='[&:has(input:focus)]:hover:bg-bg-weak-50'>
              <Input.Icon
                as={RiSearch2Line}
                className='group-has-[:placeholder-shown]:group-hover/input-wrapper:text-text-soft-400'
              />
              {/* [confirmed] Scoped to reference/contract number, buyer name,
                  and tender title/contract object only — the three fields
                  that can return suggestions without new search logic.
                  Everything else (category, location, dates, value) stays in
                  the filter rows; document text stays in the Documents
                  keyword row; fuzzy/supplier/competitor matching is deferred.
                  Copy avoids "keyword" so this never reads as the same
                  mechanism as the Document/Contract Object rows. */}
              <Input.Input
                ref={searchInputRef}
                className='group-hover/input-wrapper:placeholder:text-text-soft-400'
                placeholder='Reference, buyer, or tender title'
                value={searchValue}
                onChange={
                  onSearchChange
                    ? (e) => onSearchChange(e.target.value)
                    : undefined
                }
                onKeyDown={
                  onSearchSubmit
                    ? (e) => {
                        if (e.key === 'Enter') {
                          onSearchSubmit();
                        }
                      }
                    : undefined
                }
              />
            </Input.Wrapper>
          </Input.Root>

          {/* variant='compact' hugs its content (flag + siglas) instead of
              a fixed width — full country names ate too much of the row, and
              the flag already carries the country at a glance. textValue
              keeps "Portugal" as the accessible name.
              w-24 pins the trigger to a fixed width despite `compact`'s
              `w-auto`: different flag glyphs measure a couple pixels apart
              (e.g. 🇬🇧 vs 🇪🇸), so hugging content shifted the search input's
              right edge by ~2px on every country change. Sized to the widest
              current option (UK, ~91px) with a little headroom. */}
          <Select.Root size='small' variant='compact' defaultValue='pt'>
            <Select.Trigger className='w-24'>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='pt' textValue='Portugal'>
                <span aria-hidden='true' className='text-label-md leading-none'>
                  🇵🇹
                </span>
                PT
              </Select.Item>
              <Select.Item value='es' textValue='Spain'>
                <span aria-hidden='true' className='text-label-md leading-none'>
                  🇪🇸
                </span>
                ES
              </Select.Item>
              <Select.Item value='uk' textValue='United Kingdom'>
                <span aria-hidden='true' className='text-label-md leading-none'>
                  🇬🇧
                </span>
                UK
              </Select.Item>
              <Select.Item value='eu' textValue='European Union'>
                <span aria-hidden='true' className='text-label-md leading-none'>
                  🇪🇺
                </span>
                EU
              </Select.Item>
            </Select.Content>
          </Select.Root>

          {/* h-9 override: Button has no 36px size (small is 32px), but the
              Figma row height is 36px throughout. */}
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            className='h-9'
            disabled={disableAddFilter ?? disableAddActions}
            onClick={onAddFilter}
          >
            <Button.Icon as={RiFilter3Line} />
            Add filter
          </Button.Root>

          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            className='h-9'
            disabled={disableAddKeyword ?? disableAddActions}
            onClick={onAddKeyword}
          >
            <Button.Icon as={RiAddLine} />
            Add keywords
          </Button.Root>
        </div>
      </div>
    </div>
  );
}
