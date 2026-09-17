'use client';

// Tender Result card: one row in the Search Tenders results list. Figma:
// node 2602:27893 "Tender Result Redesigned" (current layout — base value
// and a deadline-status pill promoted to their own top-right column, a
// smaller icon+label Save button below them, uniform 16px card padding,
// wider meta-tag spacing), 2602:27917 (base value drops its stroke and fill,
// with even 6px side padding — unlike every other meta tag's bordered,
// asymmetric shell), 2602:27918 (Save button's shorter
// px-1.5/py-1 padding), 2495:21275 "+3 more filters" (matched-filter
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
  RiCoinsLine,
  RiErrorWarningFill,
  RiFileTextLine,
  RiForbidFill,
  RiGroupLine,
  RiMedalLine,
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

// [confirmed] Beyond this, the deadline isn't close enough to warrant a
// pill at all — the "Deadline: <date>" meta tag already carries the date
// for anyone who wants it. No green/"success" tier for a deadline that
// still needs action: a pill only ever means "pay attention" (warning,
// 2-7 days) or "act now" (error, today) — a comfortable amount of runway
// gets silence, not a color that reads as safe. Pills for today/tomorrow/
// closed/unavailable are unaffected; only a "days" status this far out is
// suppressed.
const DEADLINE_URGENCY_WINDOW_DAYS = 7;

// Figma: 2516:22519 (today, error/red), 2516:22515 (tomorrow, warning/
// orange), 2516:22524 (closed, faded/grey). "Deadline not available" isn't
// its own Figma tag — it reuses the closed style per the user's
// instruction, since both mean "there's nothing actionable here," just for
// different reasons. The rest of the "days" bucket (2-7 days) reuses
// tomorrow's warning styling rather than Figma's own success/green tag —
// [confirmed] 5 days left isn't a "safe" state, so it shouldn't read as one.
const DEADLINE_STATUS_STYLES = {
  error: {
    icon: RiErrorWarningFill,
    bg: 'bg-error-lighter',
    text: 'text-error-base',
  },
  warning: {
    icon: RiAlertFill,
    bg: 'bg-warning-lighter',
    text: 'text-warning-base',
  },
  faded: {
    icon: RiForbidFill,
    bg: 'bg-faded-lighter',
    text: 'text-text-sub-600',
  },
} as const;

function DeadlineStatusPill({ status }: { status: DeadlineStatus }) {
  if (status.type === 'days' && status.days > DEADLINE_URGENCY_WINDOW_DAYS) {
    return null;
  }

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

  const tier =
    status.type === 'today'
      ? 'error'
      : status.type === 'closed' || status.type === 'unavailable'
        ? 'faded'
        : 'warning'; // tomorrow, or a "days" status within the urgency window

  const { icon: Icon, bg, text } = DEADLINE_STATUS_STYLES[tier];

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
  'CPV',
  'Location',
  'Procedure type',
  'Publication date',
  'Base value',
  'Winner',
  'Competitor',
  'Contract Object',
  'Documents',
] as const;

export type MatchedFilterField = (typeof MATCHED_FILTER_FIELDS)[number];

export type MatchedKeyword = {
  documentTitle: string;
  snippet: string;
};

/** Awarded tenders only. One entry per distinct winning supplier, with that
 * supplier's lots already grouped into a display string ("Lot 2", "Lots 1,
 * 3", or undefined for a single-lot tender where naming a lot adds nothing).
 * Grouping happens upstream so this card stays presentational, the same way
 * `matchedKeyword` arrives pre-resolved. */
export type AwardWinner = {
  supplier: string;
  lots?: string;
};

/** The picked supplier's recorded outcome on this tender — only set when a
 * Competitor filter actually matched, since it exists to answer that
 * filter's question ("did they win or lose this one?"). */
export type CompetitorOutcome = {
  supplier: string;
  outcome: string;
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
  // Base value (Figma node 2602:27917) drops the stroke every other meta
  // tag keeps — it sits beside the deadline-status pill in its own
  // top-right column rather than in the shared meta-tag row, so it reads as
  // that column's plain second line rather than one more bordered chip.
  bordered?: boolean;
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
  bordered = true,
}: BorderedMetaTagProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center gap-1 rounded-md py-1',
        bordered
          ? 'border border-stroke-soft-200 bg-bg-white-0 pl-1 pr-2'
          // Base value (the only unbordered caller, Figma node 2602:27917):
          // no fill, and even 6px side padding rather than the bordered
          // tags' asymmetric pl-1/pr-2 (theirs compensates for a border and
          // icon inset this one doesn't have).
          : 'px-1.5',
      )}
    >
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
  /** Awarded tenders only — omitted entirely on Active/Evaluating, and on
   * an awarded tender with no recorded winner. */
  award?: AwardWinner[];
  competitorOutcome?: CompetitorOutcome;
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
  award,
  competitorOutcome,
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
    // Hover-only affordance for the side drawer this card will open — no
    // click handler yet.
    //
    // :hover bubbles, so hovering Save/"+N more filters"/the keyword tag
    // would trigger the card's own hover *and* highlight the button at
    // once — two hovers reading as one blurry one. :not(:has(button:hover))
    // drops the card's own hover the moment a nested button is the real
    // target, so only that button's hover shows.
    //
    // border-color only, never a bg fill: this row is scanned tens of
    // times a session (list hover), so per /animate's frequency gate the
    // treatment stays near-imperceptible — and a grey fill also broke
    // visually against the nested white bordered tags, white Save button,
    // and colored deadline pill, which all assumed a white card underneath
    // them. Picked over two other border-based directions (a lift shadow,
    // an inset ring) on the "Results hover state" specimen tab — this one
    // was the decision, the other two were torn down rather than left to
    // go stale, same precedent as "Ready results"/"Loading pacing".
    // 150ms `ease` (hover/color change, not an entrance/exit) —
    // border-color is a paint-only property, the accepted exception to
    // transform/opacity-only for a static row hover like this one.
    <div className='flex w-full cursor-pointer flex-col gap-4 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-regular-xs transition-[border-color] duration-150 ease [&:hover:not(:has(button:hover))]:border-stroke-sub-300'>
      <div className='flex w-full items-start gap-4'>
        <div className='flex min-w-0 flex-1 flex-col gap-3'>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col gap-1'>
              <p
                title={name}
                className='line-clamp-2 text-label-sm text-text-strong-950'
              >
                {name}
              </p>
              <p
                title={buyer}
                className='truncate text-label-sm text-text-sub-600'
              >
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
              {/* Winner reads as a fact about the tender, so it joins the
                  existing meta-tag row rather than getting its own line —
                  a medal carries "who won" without spending a word on it,
                  and `showFieldLabels` still spells out "Winner:" for the
                  variant that doesn't rely on icon recognition. Fixtures
                  keep at most two distinct winners per tender, so the row's
                  own flex-wrap is enough; no "+N more" disclosure is built
                  for a case that can't occur yet. */}
              {award?.map((winner) => (
                <BorderedMetaTag
                  key={winner.supplier}
                  icon={RiMedalLine}
                  fieldLabel='Winner'
                  value={
                    winner.lots
                      ? `${winner.supplier} · ${winner.lots}`
                      : winner.supplier
                  }
                  showFieldLabel={showFieldLabels}
                />
              ))}
              {competitorOutcome ? (
                <BorderedMetaTag
                  icon={RiGroupLine}
                  fieldLabel='Competitor'
                  value={`${competitorOutcome.supplier} · ${competitorOutcome.outcome}`}
                  showFieldLabel={showFieldLabels}
                />
              ) : null}
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
          // Figma (node 2602:27914): Save always pins to the card's bottom
          // edge, with or without a matched-filters row — self-stretch +
          // justify-between unconditionally, so this column always spans
          // the card's full height rather than shrinking to its own content
          // when there's no badges row to stretch against.
          className='flex shrink-0 flex-col items-end justify-between self-stretch'
        >
          <div className='flex items-center justify-end gap-1'>
            <DeadlineStatusPill status={deadlineStatus} />
            <BorderedMetaTag
              icon={RiCoinsLine}
              fieldLabel='Base value'
              value={baseValue}
              showFieldLabel={showFieldLabels}
              bordered={false}
            />
          </div>

          <button
            type='button'
            onClick={onToggleSave}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from saved' : 'Save tender'}
            className='flex items-center gap-0.5 rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-1.5 py-1 shadow-regular-xs transition hover:bg-bg-weak-50'
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
