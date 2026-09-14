'use client';

// Tender Result card: one row in the Search Tenders results list. Figma:
// node 2508:22253 "Tender Result Redesigned" (current layout — base value
// and a deadline-status pill promoted to their own top-right column, a
// smaller icon+label Save button below them, tighter card padding, wider
// meta-tag spacing), 2495:21275 "+3 more filters" (matched-filter
// overflow).
//
// The "Matched keyword" meta tag is the same signal the keyword-match
// tooltip (keyword-match-tooltip.tsx) explains — this card is where that
// tooltip will eventually attach, once results are wired to real data.
//
// Matched-filter chips explain which *applied criteria* this tender
// satisfies — plain-language field names, not the selected values (a
// result matching on Category doesn't repeat "Construction" here; the
// applied-filter summary above the list already shows that). They're
// read-only result metadata, not interactive filters. Country and stage
// are separate metadata shown elsewhere on the page, never in this list.

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import {
  RiAlertFill,
  RiBookmarkFill,
  RiBookmarkLine,
  RiCalendarCloseLine,
  RiCheckboxCircleFill,
  RiCoinsLine,
  RiErrorWarningFill,
  RiFileTextLine,
  RiForbidFill,
  RiNodeTree,
} from '@remixicon/react';

import * as Badge from '@/components/ui/badge';
import * as Tooltip from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import { KeywordMatchTooltip } from './keyword-match-tooltip';

const MATCHED_FILTERS_VISIBLE_COUNT = 3;

// "Closes today"/"tomorrow" read more naturally than "Closes in 0/1 days",
// and are common enough (every open tender passes through them) to warrant
// their own copy. No "Urgent" label — thresholds for that aren't defined
// yet, and guessing one here would bake in a product decision.
export type DeadlineStatus =
  | { type: 'today' }
  | { type: 'tomorrow' }
  | { type: 'days'; days: number }
  | { type: 'closed' }
  | { type: 'unavailable' };

// Figma: 2516:22519 (today, error/red), 2516:22515 (tomorrow, warning/
// orange), 2516:22511 (days, success/green), 2516:22524 (closed, faded/
// grey). "Deadline not available" isn't its own Figma tag — it reuses the
// closed style per the user's instruction, since both mean "there's
// nothing actionable here," just for different reasons.
const DEADLINE_STATUS_STYLES = {
  today: {
    icon: RiErrorWarningFill,
    bg: 'bg-error-lighter',
    text: 'text-error-base',
  },
  tomorrow: {
    icon: RiAlertFill,
    bg: 'bg-warning-lighter',
    text: 'text-warning-base',
  },
  days: {
    icon: RiCheckboxCircleFill,
    bg: 'bg-success-lighter',
    text: 'text-success-base',
  },
  closed: {
    icon: RiForbidFill,
    bg: 'bg-faded-lighter',
    text: 'text-text-sub-600',
  },
} as const;

function DeadlineStatusPill({ status }: { status: DeadlineStatus }) {
  const label =
    status.type === 'today'
      ? 'Closes today'
      : status.type === 'tomorrow'
        ? 'Closes tomorrow'
        : status.type === 'days'
          ? `Closes in ${status.days} days`
          : status.type === 'closed'
            ? 'Closed'
            : 'Deadline not available';

  const { icon: Icon, bg, text } =
    DEADLINE_STATUS_STYLES[
      status.type === 'unavailable' ? 'closed' : status.type
    ];

  return (
    <div className={cn('flex items-center gap-1 rounded-md py-1 pl-1 pr-2', bg)}>
      <Icon className={cn('size-4', text)} />
      <span className={cn('whitespace-nowrap text-label-xs', text)}>
        {label}
      </span>
    </div>
  );
}

export const MATCHED_FILTER_FIELDS = [
  'Buyer',
  'Category',
  'Location',
  'Procedure type',
  'Publication date',
  'Base value',
  'Contract Object',
  'Documents',
] as const;

export type MatchedFilterField = (typeof MATCHED_FILTER_FIELDS)[number];

export type MatchedKeyword = {
  documentTitle: string;
  snippet: string;
};

// Figma: 2519:22815 (badge), 2446:35205 "Tooltip [1.1]" (keyword-match-
// tooltip.tsx, the hover content). This tag is a distinct match type, not
// a generic meta fact — it only appears when the tender matched because a
// keyword was found inside a Contract Object or a Document (the same
// "target" concept from keyword-target-picker.tsx). The label always
// reads "Matched keyword" rather than the term itself: keywords are free
// text with no length guarantee, so a fixed label keeps the tag's width
// predictable — the actual term lives in the tooltip, on hover.
function MatchedKeywordTag({ documentTitle, snippet }: MatchedKeyword) {
  return (
    <Tooltip.Root>
      <TooltipPrimitive.Trigger asChild>
        <button
          type='button'
          className='flex shrink-0 items-center gap-0.5 rounded-md bg-information-lighter py-1 pl-1 pr-2 outline-none'
        >
          <RiFileTextLine className='size-4 text-information-base' />
          <span className='whitespace-nowrap text-label-xs text-information-base'>
            Matched keyword
          </span>
        </button>
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side='bottom'
          sideOffset={6}
          className={cn(
            'z-50 origin-[var(--radix-tooltip-content-transform-origin)]',
            'data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'duration-150 ease-out',
          )}
        >
          <KeywordMatchTooltip
            documentTitle={documentTitle}
            snippet={snippet}
            side='bottom'
          />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </Tooltip.Root>
  );
}

type BorderedMetaTagProps = {
  fieldLabel: string;
  value: string;
  showFieldLabel?: boolean;
  // Location's Figma tag (2519:22873) shows a country flag, not an icon —
  // an emoji flag matches the existing convention in toolbar-row.tsx
  // rather than pulling in a per-country flag asset.
  icon?: React.ElementType;
  flag?: string;
};

// Figma: 2519:22873 (location, flag), 2519:22896 (procedure type — this
// bordered shell only; the glyph itself stays the existing RiNodeTree per
// the user's instruction, not Figma's swap-2-line), 2519:22889 (deadline,
// calendar-close icon).
function BorderedMetaTag({
  icon: Icon,
  flag,
  fieldLabel,
  value,
  showFieldLabel,
}: BorderedMetaTagProps) {
  return (
    <div className='flex shrink-0 items-center gap-1 rounded-md border border-stroke-soft-200 bg-bg-white-0 py-1 pl-1 pr-2'>
      {flag ? (
        <span className='flex size-4 shrink-0 items-center justify-center text-[13px] leading-none'>
          {flag}
        </span>
      ) : Icon ? (
        <Icon className='size-4 text-text-sub-600' />
      ) : null}
      <span className='whitespace-nowrap text-label-xs text-text-sub-600'>
        {showFieldLabel ? `${fieldLabel}: ${value}` : value}
      </span>
    </div>
  );
}

export type TenderResultCardProps = {
  name: string;
  buyer: string;
  location: string;
  // Emoji flag shown on the location tag (e.g. '🇵🇹'), matching the
  // convention already used in toolbar-row.tsx's country select. Falls
  // back to no icon if omitted, rather than guessing a country.
  countryFlag?: string;
  procedureType: string;
  deadlineDate: string;
  baseValue: string;
  deadlineStatus: DeadlineStatus;
  matchedKeyword?: MatchedKeyword;
  matchedFilters: MatchedFilterField[];
  // Spells out each meta tag as "Field: value" instead of relying on the
  // icon alone, so the meaning doesn't depend on recognizing the icon or
  // hovering it. Same fields, more explicit copy — not a new layout.
  showFieldLabels?: boolean;
  // Renders the matched-filters row already expanded. For specimens/
  // documentation only — real usage always starts collapsed.
  defaultExpanded?: boolean;
  saved?: boolean;
  onToggleSave?: () => void;
};

export function TenderResultCard({
  name,
  buyer,
  location,
  countryFlag,
  procedureType,
  deadlineDate,
  baseValue,
  deadlineStatus,
  matchedKeyword,
  matchedFilters,
  showFieldLabels = false,
  defaultExpanded = false,
  saved = false,
  onToggleSave,
}: TenderResultCardProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const hasMatchedFilters = matchedFilters.length > 0;
  const hasOverflow = matchedFilters.length > MATCHED_FILTERS_VISIBLE_COUNT;
  const visibleFilters =
    expanded || !hasOverflow
      ? matchedFilters
      : matchedFilters.slice(0, MATCHED_FILTERS_VISIBLE_COUNT);
  const hiddenCount = matchedFilters.length - MATCHED_FILTERS_VISIBLE_COUNT;

  return (
    <div className='flex w-full flex-col gap-4 rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3 pb-3 pt-2.5 shadow-regular-xs'>
      <div className='flex w-full items-start gap-4'>
        <div className='flex min-w-0 flex-1 flex-col gap-3'>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col gap-1'>
              <p className='truncate text-label-sm text-text-strong-950'>
                {name}
              </p>
              <p className='truncate text-label-sm text-text-sub-600'>
                {buyer}
              </p>
            </div>

            <div className='flex flex-wrap items-center gap-2'>
              <BorderedMetaTag
                icon={RiCalendarCloseLine}
                fieldLabel='Deadline'
                value={deadlineDate}
                showFieldLabel={showFieldLabels}
              />
              <BorderedMetaTag
                flag={countryFlag}
                fieldLabel='Location'
                value={location}
                showFieldLabel={showFieldLabels}
              />
              <BorderedMetaTag
                icon={RiNodeTree}
                fieldLabel='Procedure type'
                value={procedureType}
                showFieldLabel={showFieldLabels}
              />
              {matchedKeyword ? (
                <MatchedKeywordTag
                  documentTitle={matchedKeyword.documentTitle}
                  snippet={matchedKeyword.snippet}
                />
              ) : null}
            </div>
          </div>

          {hasMatchedFilters ? (
            <div className='flex w-full flex-wrap items-center gap-1'>
              {visibleFilters.map((filter, index) => (
                // Field names aren't unique across a result set, but they
                // are within one card, so the value alone is a fine key.
                <Badge.Root
                  key={`${filter}-${index}`}
                  variant='lighter'
                  color='gray'
                  size='medium'
                >
                  {filter}
                </Badge.Root>
              ))}
              {hasOverflow ? (
                <button
                  type='button'
                  onClick={() => setExpanded((prev) => !prev)}
                  aria-expanded={expanded}
                  className='shrink-0 whitespace-nowrap text-label-xs text-text-disabled-300 underline-offset-2 transition-[color,transform] duration-100 ease-out hover:text-text-sub-600 hover:underline active:scale-[0.97]'
                >
                  {expanded ? 'Show less' : `+${hiddenCount} more filters`}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            'flex shrink-0 flex-col items-end self-stretch',
            // A card with no matched filters has a shorter left column (no
            // badges row). Stretching this column to match via
            // justify-between would leave the Save button stranded far
            // below the value/status block — a layout jump for what's
            // otherwise the same card. Fixed 12px spacing instead keeps it
            // compact when there's nothing pushing it down.
            hasMatchedFilters ? 'justify-between' : 'justify-start gap-3',
          )}
        >
          <div className='flex items-center justify-end gap-1'>
            <DeadlineStatusPill status={deadlineStatus} />
            <BorderedMetaTag
              icon={RiCoinsLine}
              fieldLabel='Base value'
              value={baseValue}
              showFieldLabel={showFieldLabels}
            />
          </div>

          <button
            type='button'
            onClick={onToggleSave}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from saved' : 'Save tender'}
            className='flex items-center gap-0.5 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-1.5 shadow-regular-xs transition hover:bg-bg-weak-50'
          >
            {saved ? (
              <RiBookmarkFill className='size-5 text-text-sub-600' />
            ) : (
              <RiBookmarkLine className='size-5 text-text-sub-600' />
            )}
            <span className='px-1 text-label-sm text-text-sub-600'>
              {saved ? 'Unsave' : 'Save'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
