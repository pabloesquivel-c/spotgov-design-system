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
// Active/Evaluating/Awarded are a real controlled toggle. [confirmed] Three
// variants: a normal clickable tab (default), dropped entirely via
// `showAwardedTab={false}` for the one org Market Intelligence isn't
// offered to at all, or — the common case — visible but disabled via
// `awardedLocked`, with a tooltip naming Market Intelligence on hover or
// keyboard focus. Locked uses `aria-disabled`, not the native `disabled`
// attribute, so the tab stays focusable and hoverable enough for that
// tooltip to actually reach keyboard users.

import * as React from 'react';
import {
  RiAddLine,
  RiArrowUpSLine,
  RiFilter3Line,
  RiSearch2Line,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as CompactButton from '@/components/ui/compact-button';
import * as Input from '@/components/ui/input';
import * as Select from '@/components/ui/select';
import * as SegmentedControl from '@/components/ui/segmented-control';
import * as Tooltip from '@/components/ui/tooltip';
import type { MatchMode } from './filter-chips';

const BASE_STAGE_TABS = [
  { value: 'active', label: 'Active' },
  { value: 'evaluating', label: 'Evaluating' },
] as const;

const AWARDED_TAB = { value: 'awarded', label: 'Awarded' } as const;

export type Stage =
  | (typeof BASE_STAGE_TABS)[number]['value']
  | typeof AWARDED_TAB.value;

export const STAGE_LABELS: Record<Stage, string> = {
  active: BASE_STAGE_TABS[0].label,
  evaluating: BASE_STAGE_TABS[1].label,
  awarded: AWARDED_TAB.label,
};

export type CountryCode = 'pt' | 'es' | 'uk' | 'eu';

/** One table instead of four hand-written Select.Items: the country is now
 * real state (it gates which Awarded filters exist, see
 * dynamic-filter-rows.tsx), so its label has to be readable from
 * rich-state-flow.tsx too — for the results count line and for the "filter
 * unavailable in <country>" toast. A second hardcoded list there would
 * drift from this one. */
export const COUNTRIES: Record<
  CountryCode,
  { label: string; short: string; flag: string }
> = {
  pt: { label: 'Portugal', short: 'PT', flag: '🇵🇹' },
  es: { label: 'Spain', short: 'ES', flag: '🇪🇸' },
  uk: { label: 'United Kingdom', short: 'UK', flag: '🇬🇧' },
  eu: { label: 'European Union', short: 'EU', flag: '🇪🇺' },
};

export const COUNTRY_CODES = Object.keys(COUNTRIES) as CountryCode[];

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
  showMatchMode = true,
  country,
  onCountryChange,
  showAwardedTab = true,
  awardedLocked,
  onCollapse,
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
  /** Whether to show the "Results must match all/any" control. Defaults on:
   * it decides how every condition combines, so hiding it until a second
   * row exists made the rule look like it appeared out of nowhere, and left
   * it absent from the panel specimens entirely. Set false only for a
   * surface that genuinely has no conditions to combine. */
  showMatchMode?: boolean;
  /** Controlled country. Omit to leave the select uncontrolled (defaults to
   * Portugal), as the static specimens do — only the wired flow needs it,
   * since the country decides which Awarded filters are offered at all. */
  country?: CountryCode;
  onCountryChange?: (country: CountryCode) => void;
  /** [confirmed] Default is three real, clickable tabs — Active,
   * Evaluating, Awarded. Set false for the one org variant Market
   * Intelligence isn't offered to, dropping Awarded entirely rather than
   * showing it disabled. */
  showAwardedTab?: boolean;
  /** [confirmed] The common case for orgs without Market Intelligence:
   * Awarded stays visible but can't be selected. A tooltip on hover or
   * keyboard focus explains why. Ignored when `showAwardedTab` is false. */
  awardedLocked?: boolean;
  /** Collapses the whole panel. Given by callers that render the panel as a
   * disclosure — the panel had a way in ("Edit Search" on the collapsed
   * bar) but no way out, so the only exit was pressing Search. Omit on a
   * surface where the panel is always open. */
  onCollapse?: () => void;
}) {
  const stageTabs = showAwardedTab ? [...BASE_STAGE_TABS, AWARDED_TAB] : BASE_STAGE_TABS;

  // Radix's Tabs.Root only respects a guard in `onValueChange` while it's
  // controlled (a `value` prop is passed) — left uncontrolled, it commits
  // its own internal selection regardless of what the callback does. An
  // internal fallback keeps the lock real (can't be clicked or arrowed
  // into) for every specimen and caller, not just ones that happen to wire
  // `stage`/`onStageChange` themselves.
  const [internalStage, setInternalStage] = React.useState<Stage>('active');
  const resolvedStage = stage ?? internalStage;

  function handleStageChange(value: string) {
    if (awardedLocked && value === 'awarded') {
      return;
    }
    if (onStageChange) {
      onStageChange(value as Stage);
    } else {
      setInternalStage(value as Stage);
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-3'>
        {/* SegmentedControl.List's own height (p-1 padding + h-7 trigger =
            28px + 4px + 4px = 36px) already lands on the same h-9 token the
            "Saved only" pill uses — both trace back to the 4px spacing
            scale, so lining them up here needs no height override, just
            items-center in a shared row. */}
        <SegmentedControl.Root
          value={resolvedStage}
          onValueChange={handleStageChange}
          className='w-[368px] shrink-0'
        >
          <SegmentedControl.List>
            {stageTabs.map((tab) => {
              const locked = awardedLocked && tab.value === 'awarded';
              const trigger = (
                <SegmentedControl.Trigger
                  value={tab.value}
                  aria-disabled={locked}
                  className='aria-disabled:cursor-not-allowed aria-disabled:text-text-disabled-300'
                >
                  {tab.label}
                </SegmentedControl.Trigger>
              );

              if (!locked) {
                return <React.Fragment key={tab.value}>{trigger}</React.Fragment>;
              }

              return (
                <Tooltip.Root key={tab.value}>
                  <Tooltip.Trigger asChild>{trigger}</Tooltip.Trigger>
                  <Tooltip.Content side='bottom'>
                    Available only with Market Intelligence
                  </Tooltip.Content>
                </Tooltip.Root>
              );
            })}
          </SegmentedControl.List>
        </SegmentedControl.Root>

        {/* Not a Button: Figma shows a checkbox + label inside the same
            stroked pill shell, not an icon-leading button. Paired with the
            stage tabs (both scope which tenders show) rather than living in
            the search/action row below, which was getting crowded. */}
        {/* gap-3 matches the row's own outer gap: "Saved only" scopes which
            tenders show, the collapse control acts on the panel itself, and
            they're only adjacent because both belong at this edge. */}
        <div className='flex shrink-0 items-center gap-3'>
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

          {/* The panel's way out, in the same top-right corner the collapsed
              bar puts "Edit Search" — so opening and closing read as one
              control in one place rather than two unrelated buttons. Ghost,
              not stroke: a second bordered box beside the "Saved only" pill
              would compete with it, and this is panel chrome, not a filter.
              Collapsing keeps every pending edit — the chip bar and the
              unapplied-changes count stay visible below with their own
              Search, so this only ever means "give me more room". */}
          {onCollapse ? (
            <CompactButton.Root
              variant='ghost'
              size='large'
              aria-label='Collapse search filters'
              onClick={onCollapse}
            >
              <CompactButton.Icon as={RiArrowUpSLine} />
            </CompactButton.Root>
          ) : null}
        </div>
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
            {/* Same controlled/uncontrolled idiom as the country select
                below: a caller that passes no `matchMode` still gets a
                working control defaulted to "match all". */}
            <Select.Root
              size='small'
              variant='compact'
              value={matchMode}
              defaultValue={matchMode ? undefined : 'all'}
              onValueChange={
                onMatchModeChange
                  ? (value) => onMatchModeChange(value as MatchMode)
                  : undefined
              }
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
          <Select.Root
            size='small'
            variant='compact'
            value={country}
            defaultValue={country ? undefined : 'pt'}
            onValueChange={
              onCountryChange
                ? (value) => onCountryChange(value as CountryCode)
                : undefined
            }
          >
            <Select.Trigger className='w-24'>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {COUNTRY_CODES.map((code) => (
                <Select.Item
                  key={code}
                  value={code}
                  textValue={COUNTRIES[code].label}
                >
                  <span aria-hidden='true' className='text-label-md leading-none'>
                    {COUNTRIES[code].flag}
                  </span>
                  {COUNTRIES[code].short}
                </Select.Item>
              ))}
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
