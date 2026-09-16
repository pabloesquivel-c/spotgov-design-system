'use client';

// A live, editable filter-row list — what "Add filter"/"Add keywords"
// actually add to, and what each row's field/operator/value pickers
// actually edit. Distinct from MockFilterRows (filter-panel-states.tsx),
// which stays a fixed specimen set for auditing the panel's own states.
//
// Field-type choices are exactly FilterTypePicker's set — Buyer, Category,
// Submission Deadline, Base Price, Winner, Competitor, plus Document, which
// converts the row into a keyword row rather than another structured kind.
// Location and Procedure type aren't reachable from the field-type picker
// yet, so they stay specimen-only.
//
// Winner and Competitor are the only fields that aren't always offerable:
// they need the Awarded stage and a country whose indexed data actually
// carries that information. `availableFilterTypes` below owns that rule and
// `isRowAvailable` is its counterpart for rows already on screen.
//
// Every value is real: Buyer/Category selections come back from their
// checkbox pickers and show on the trigger, Base Price bounds are a real
// text input, keyword terms commit to chips on Enter through FilterTagInput
// (filter-row.tsx) — the same chip look Buyer/Category use, so typed and
// picked values read as one system — and date bounds come back from the
// calendar's Apply. Every edit here — add, remove, field swap, value pick —
// lands in the caller's pending `rows`, which only reaches the results once
// the user presses Search. This component never applies anything itself.
//
// Add/remove both animate height via the same grid-template-rows 0fr↔1fr
// technique as AccordionRow (filter-panel-states.tsx) — a plain
// opacity/translate fade on the row itself (the previous approach) never
// touches layout, so the moment a row's height actually changes (added to
// or spliced from the array), every sibling below it snaps to its new
// position instantly instead of sliding. Animating the row's own track
// size keeps the whole stack moving in lockstep with it.

import * as React from 'react';
import {
  RiBarcodeLine,
  RiBuildingLine,
  RiCalendarEventFill,
  RiCoinsLine,
  RiFileTextLine,
  RiGroupLine,
  RiMedalLine,
  RiNodeTree,
} from '@remixicon/react';
import type { RemixiconComponentType } from '@remixicon/react';

import { BuyerPicker } from './buyer-picker';
import { CategoryPicker } from './category-picker';
import type { MatchMode } from './filter-chips';
import { cpvLabel } from './cpv-data';
import { CpvPicker } from './cpv-picker';
import { DateFilterCalendar } from './date-filter-calendar';
import {
  FilterFieldTrigger,
  FilterOperatorLabel,
  FilterOperatorTrigger,
  FilterPriceInput,
  FilterRangeSeparator,
  FilterRemoveButton,
  FilterRow,
  FilterTagInput,
  FilterValueTrigger,
  formatPriceDigits,
} from './filter-row';
import { FilterTypePicker, type FilterTypeValue } from './filter-type-picker';
import { KeywordTargetPicker, type KeywordTarget } from './keyword-target-picker';
import { SupplierPicker } from './supplier-picker';
import type { CountryCode, Stage } from './toolbar-row';
import {
  DateOperatorPicker,
  PriceOperatorPicker,
  SetOperatorPicker,
  type DateOperatorValue,
  type PriceOperatorValue,
  type SetOperatorValue,
} from './operator-picker';
import type { SelectedValueChip } from './selected-value-chips';
import { cn } from '@/utils/cn';

export type StructuredField =
  | 'buyer'
  | 'category'
  | 'cpv'
  | 'submission-deadline'
  | 'base-price'
  | 'winner'
  | 'competitor';

export const DEFAULT_STRUCTURED_FIELD: StructuredField = 'buyer';

/** The fields whose value is a set of picked labels — they all share the
 * `values: string[]` payload and the same chips-plus-checkbox-picker row
 * shape, differing only in which option list the picker shows. */
const SET_FIELDS = ['buyer', 'category', 'cpv', 'winner', 'competitor'] as const;

type SetField = (typeof SET_FIELDS)[number];

function isSetField(field: StructuredField): field is SetField {
  return (SET_FIELDS as readonly string[]).includes(field);
}

/**
 * Which award data each country actually publishes in the indexed data.
 * Winner data is generally public once a contract is awarded; bidder lists
 * are not — they depend on country, procedure, and source. Both gate
 * independently, so a country can offer Winner without Competitor (the
 * common case) but never the reverse in practice.
 *
 * Mock policy for the demo, not a legal statement about any procurement
 * regime — it becomes a real per-country capability flag from the API.
 */
export const AWARD_DATA_AVAILABILITY: Record<
  CountryCode,
  { winner: boolean; competitor: boolean }
> = {
  pt: { winner: true, competitor: true },
  es: { winner: true, competitor: false },
  uk: { winner: false, competitor: false },
  eu: { winner: true, competitor: false },
};

/**
 * Which filter types the current stage + country actually support. One
 * predicate, used both to build the field dropdown and to decide which
 * already-placed rows have to be dropped when the stage or country changes
 * — two copies of this rule would drift, and the failure mode is a row the
 * user can't reach in the dropdown but still sees in the panel.
 *
 * Winner/Competitor are Awarded-only (nothing is awarded before the award)
 * and country-gated: winner data is generally public after award, bidder
 * data depends on country, procedure, and source. See
 * AWARD_DATA_AVAILABILITY above.
 *
 * The other confirmed stage rule — Submission Deadline is Active-only,
 * documented at filter-row-variants.tsx:66-75 — now has somewhere to live,
 * but is deliberately not wired here; that's a separate behaviour change.
 */
export function isFilterTypeAvailable(
  field: FilterTypeValue,
  stage: Stage,
  country: CountryCode,
): boolean {
  if (field === 'winner') {
    return stage === 'awarded' && AWARD_DATA_AVAILABILITY[country].winner;
  }
  if (field === 'competitor') {
    return stage === 'awarded' && AWARD_DATA_AVAILABILITY[country].competitor;
  }
  return true;
}

const ALL_FILTER_TYPES: FilterTypeValue[] = [
  'buyer',
  'category',
  'cpv',
  'submission-deadline',
  'base-price',
  'winner',
  'competitor',
  'document',
];

export function availableFilterTypes(
  stage: Stage,
  country: CountryCode,
): FilterTypeValue[] {
  return ALL_FILTER_TYPES.filter((field) =>
    isFilterTypeAvailable(field, stage, country),
  );
}

/**
 * One CPV row per search.
 *
 * A second CPV row wouldn't mean what it looks like it means. Rows AND
 * together, so "CPV is any of A" plus "CPV is any of B" reads as a widening
 * ("either of these") and behaves as a narrowing (both, on the same
 * tender) — the exact trap `isConfiguredDuplicate` already flags for Buyer
 * and Category, except here nothing is lost by making it unreachable: one
 * row holds as many codes as you like, which is the whole shape of a CPV
 * filter. The single chip in the bar below already reads as one filter.
 *
 * Shown blocked rather than dropped, unlike the country-gated fields. The
 * difference is whether the user can do anything about it: a field this
 * country's data doesn't carry has no way to unlock, so a row that isn't
 * there is honest. This one unlocks the moment they remove or repoint the
 * CPV row sitting in the panel, and a field that silently vanishes gives
 * them no way to learn that. The CPV row itself is never blocked, or its
 * own field trigger would be showing a field its picker refuses.
 */
export function disabledFieldsForRow(
  rows: FilterRowState[],
  row: FilterRowState,
): Partial<Record<FilterTypeValue, string>> | undefined {
  if (row.kind === 'structured' && row.field === 'cpv') {
    return undefined;
  }
  const cpvTaken = rows.some(
    (other) => other.kind === 'structured' && other.field === 'cpv',
  );
  // No period, no sentence: this sits inline on a 220px row, not in the
  // panel's hint line (docs/copy.md — short standalone UI text).
  return cpvTaken ? { cpv: 'Already added' } : undefined;
}

/** True when a row can no longer exist under this stage + country — the
 * signal to drop it and tell the user. Keyword rows are never gated. */
export function isRowAvailable(
  row: FilterRowState,
  stage: Stage,
  country: CountryCode,
): boolean {
  return row.kind === 'keyword' || isFilterTypeAvailable(row.field, stage, country);
}

type StructuredRow = {
  id: string;
  kind: 'structured';
  field: StructuredField;
  operator: SetOperatorValue | DateOperatorValue | PriceOperatorValue;
  // Buyer/Category/Winner/Competitor — the checked option labels. CPV
  // stores 8-digit codes instead: labels are display-only there, and the
  // is-or-is-under-it test runs on the digits.
  values: string[];
  // Submission Deadline — set from the calendar's Apply.
  dateFrom?: Date;
  dateTo?: Date;
  // Base Price — plain text so a half-typed number isn't coerced away.
  priceFrom: string;
  priceTo: string;
};

type KeywordRow = {
  id: string;
  kind: 'keyword';
  target: KeywordTarget;
  terms: string[];
};

export type FilterRowState = StructuredRow | KeywordRow;

const STRUCTURED_FIELD_META: Record<
  StructuredField,
  {
    label: string;
    icon: RemixiconComponentType;
    defaultOperator: SetOperatorValue | DateOperatorValue | PriceOperatorValue;
  }
> = {
  buyer: { label: 'Buyer', icon: RiBuildingLine, defaultOperator: 'any-of' },
  category: { label: 'Category', icon: RiNodeTree, defaultOperator: 'any-of' },
  cpv: { label: 'CPV', icon: RiBarcodeLine, defaultOperator: 'any-of' },
  'submission-deadline': {
    label: 'Submission Deadline',
    icon: RiCalendarEventFill,
    defaultOperator: 'between',
  },
  'base-price': {
    label: 'Base Price',
    icon: RiCoinsLine,
    defaultOperator: 'at-least',
  },
  winner: { label: 'Winner', icon: RiMedalLine, defaultOperator: 'any-of' },
  competitor: { label: 'Competitor', icon: RiGroupLine, defaultOperator: 'any-of' },
};

const SET_OPERATOR_LABELS: Record<SetOperatorValue, string> = {
  'any-of': 'is any of',
  'none-of': 'is none of',
};

const DATE_OPERATOR_LABELS: Record<DateOperatorValue, string> = {
  between: 'is between',
  after: 'is after',
  before: 'is before',
};

const PRICE_OPERATOR_LABELS: Record<PriceOperatorValue, string> = {
  between: 'is between',
  'at-least': 'is at least',
  'at-most': 'is at most',
};

const KEYWORD_TARGET_LABELS: Record<KeywordTarget, string> = {
  'contract-object': 'Contract Object',
  documents: 'Documents',
};

/** How many CPV names a summary prints before collapsing the rest into
 * "+N". Two, not the three the other set fields show: CPV names are long
 * ("Construction work for sports facilities"), so a third would push the
 * chip straight into its truncation instead of reading. */
const CPV_SUMMARY_VISIBLE = 2;

/**
 * The one-chip CPV summary: "CPV: Construction work, Roadworks +3". A
 * flatter shape than the other fields' "Buyer is any of ..." on purpose —
 * a CPV filter is routinely ten codes deep, and spending the chip's first
 * three words on grammar leaves nothing for the codes themselves. The
 * operator only shows when it isn't the default, since an exclusion
 * inverts what the filter means and silence would misrepresent it.
 *
 * Exported because the chip bar merges every CPV row into a single chip
 * rather than calling `describeRow` per row — see rich-state-flow.tsx.
 */
export function describeCpvSelection(
  codes: string[],
  operator: SetOperatorValue,
): string {
  const shown = codes.slice(0, CPV_SUMMARY_VISIBLE).map(cpvLabel).join(', ');
  const rest = codes.length - CPV_SUMMARY_VISIBLE;
  const prefix = operator === 'none-of' ? 'CPV: none of ' : 'CPV: ';
  return `${prefix}${shown}${rest > 0 ? ` +${rest}` : ''}`;
}

/** One-line plain-language summary of a row, for the toast that tells the
 * user which filter just got removed. Naming the filter matters more than
 * the count does: "Removed 1 filter" alone leaves them hunting the panel
 * for what changed. Values are truncated to the first two, since a row can
 * hold many and the toast is one line. */
export function describeRow(row: FilterRowState): string {
  if (row.kind === 'keyword') {
    return `${KEYWORD_TARGET_LABELS[row.target]} contains ${row.terms.join(', ')}`;
  }

  const label = STRUCTURED_FIELD_META[row.field].label;

  if (row.field === 'cpv') {
    return describeCpvSelection(row.values, row.operator as SetOperatorValue);
  }

  if (isSetField(row.field)) {
    const operator = SET_OPERATOR_LABELS[row.operator as SetOperatorValue];
    const shown = row.values.slice(0, 2).join(', ');
    const rest = row.values.length - 2;
    return `${label} ${operator} ${rest > 0 ? `${shown} and ${rest} more` : shown}`;
  }
  if (row.field === 'submission-deadline') {
    const operator = DATE_OPERATOR_LABELS[row.operator as DateOperatorValue];
    return `${label} ${operator} ${[formatDate(row.dateFrom), formatDate(row.dateTo)]
      .filter(Boolean)
      .join(' and ')}`;
  }
  const operator = PRICE_OPERATOR_LABELS[row.operator as PriceOperatorValue];
  // Formatted the same way the row's own input shows it — a chip reading
  // "at least 100000" next to a field reading "€ 100,000" makes the user
  // check whether they're even the same number.
  return `${label} ${operator} ${[row.priceFrom, row.priceTo]
    .filter(Boolean)
    .map((value) => `€${formatPriceDigits(value)}`)
    .join(' and ')}`;
}

/** A row with nothing picked yet (no values/dates/price/terms) contributes
 * no constraint. Two callers depend on it: the matcher, which must not let
 * an untouched default row filter out every tender, and the chip bar, which
 * only shows complete conditions. */
export function isRowConfigured(row: FilterRowState): boolean {
  if (row.kind === 'keyword') {
    return row.terms.length > 0;
  }
  if (isSetField(row.field)) {
    return row.values.length > 0;
  }
  if (row.field === 'submission-deadline') {
    return Boolean(row.dateFrom);
  }
  return row.priceFrom.trim() !== '' || row.priceTo.trim() !== '';
}

let rowIdCounter = 0;
function newRowId(prefix: string): string {
  rowIdCounter += 1;
  return `${prefix}-${rowIdCounter}`;
}

export function createStructuredRow(
  field: StructuredField = DEFAULT_STRUCTURED_FIELD,
): StructuredRow {
  return {
    id: newRowId('structured'),
    kind: 'structured',
    field,
    operator: STRUCTURED_FIELD_META[field].defaultOperator,
    values: [],
    priceFrom: '',
    priceTo: '',
  };
}

export function createKeywordRow(target: KeywordTarget = 'contract-object'): KeywordRow {
  return { id: newRowId('keyword'), kind: 'keyword', target, terms: [] };
}

function formatDate(date: Date | undefined): string | undefined {
  if (!date) {
    return undefined;
  }
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function parsePrice(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

/** True for a "between" Base Price row whose bounds are both filled in and
 * inverted — a range that can never match anything. */
function isInvalidPriceRow(row: FilterRowState): boolean {
  if (row.kind !== 'structured' || row.field !== 'base-price' || row.operator !== 'between') {
    return false;
  }
  const from = parsePrice(row.priceFrom);
  const to = parsePrice(row.priceTo);
  return from !== null && to !== null && from > to;
}

/** The same fault on a Submission Deadline row: a "between" whose start is
 * after its end. Two separate calendars set the bounds and neither knows
 * about the other, so nothing stopped it — and unlike an inverted price it
 * had no error state at all, just an empty result list the user reads as
 * "no tenders" instead of "impossible dates". */
export function isInvalidDateRow(row: FilterRowState): boolean {
  if (
    row.kind !== 'structured' ||
    row.field !== 'submission-deadline' ||
    row.operator !== 'between'
  ) {
    return false;
  }
  return Boolean(row.dateFrom && row.dateTo && row.dateFrom.getTime() > row.dateTo.getTime());
}

/**
 * Why the search can't run, or undefined if it can.
 *
 * The one place "impossible" is defined, and the only input to the panel's
 * disabled-Search rule — see the decision rule above `FilterPanelHint`
 * (filter-panel.tsx). Impossible means *this condition can never match
 * anything*, not "this is probably not what you meant": a filter that
 * returns zero because it contradicts itself teaches the user there are no
 * tenders, which is a lie. Caps, duplicate rows and half-built rows all
 * return real results and stay out of here.
 *
 * Returns a message rather than a boolean so a new fault adds one clause
 * and its own wording together, instead of a bool here and a matching
 * string somewhere else that drifts from it.
 *
 * Scope is deliberately one row at a time. Rows can contradict each other
 * too — "Buyer is any of Lisboa" and "Buyer is none of Lisboa" under match
 * all can never both hold — but chasing that in general is a satisfiability
 * problem, and a half-complete version is worse than none: it would block
 * some impossible searches and let others through, so the user couldn't
 * learn what an enabled Search button means. Within a row the check is
 * cheap and exhaustive, which is what makes it trustworthy.
 */
export function impossibleRowReason(rows: FilterRowState[]): string | undefined {
  if (rows.some(isInvalidPriceRow)) {
    return 'Base Price: the lower bound is above the upper bound, so this can never match.';
  }
  if (rows.some(isInvalidDateRow)) {
    return 'Submission Deadline: the start date is after the end date, so this can never match.';
  }
  return undefined;
}

function toChips(
  values: string[],
  onRemove: (value: string) => void,
): SelectedValueChip[] {
  return values.map((value) => ({
    id: value,
    label: value,
    onRemove: () => onRemove(value),
  }));
}

// Same curve as AccordionRow — a strong ease-out with enough punch to read
// as intentional at this size. Expanding is the user waiting to read a new
// row, so it's a touch more deliberate; collapsing is the system getting
// out of the way, so it's snappier. ("Slow where the user is deciding,
// fast where the system responds.")
const ROW_EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';
const ROW_EXPAND_MS = 200;
const ROW_COLLAPSE_MS = 160;

// Row exit takes this long before it actually leaves the array — matches
// ROW_COLLAPSE_MS so the row finishes collapsing before it's spliced out.
const ROW_EXIT_MS = ROW_COLLAPSE_MS;

/**
 * One row, height-animated via `grid-template-rows` (0fr collapsed, 1fr
 * natural height) exactly like AccordionRow — the browser interpolates the
 * track size continuously, so siblings above/below reflow in step with it
 * instead of snapping. A freshly-mounted row starts collapsed and flips
 * open on the next tick, so adding a row grows it into place instead of
 * having it appear at full height already. `isRemoving` reverses that for
 * the exit, driven by the same state that (after ROW_EXIT_MS) actually
 * splices the row out of the array.
 */
function AnimatedFilterRow({
  isRemoving,
  shouldFocus,
  onFocused,
  children,
}: {
  isRemoving: boolean;
  /** Set when the chip bar sent the user here to edit this condition. */
  shouldFocus?: boolean;
  onFocused?: () => void;
  children: React.ReactNode;
}) {
  const [entered, setEntered] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setEntered(true);
  }, []);

  // Focus the row's field trigger — the leftmost control, so the user lands
  // at the start of the condition and can Tab through operator and value
  // from there. Waits on `entered` because the row is still collapsed to
  // 0fr on its first frame, and focusing inside a zero-height box makes the
  // browser scroll to the wrong place.
  React.useEffect(() => {
    if (!shouldFocus || !entered) {
      return;
    }
    const first = contentRef.current?.querySelector<HTMLElement>(
      '[tabindex]:not([tabindex="-1"]), button, input',
    );
    contentRef.current?.scrollIntoView({ block: 'nearest' });
    first?.focus();
    onFocused?.();
  }, [shouldFocus, entered, onFocused]);

  const open = entered && !isRemoving;

  return (
    <div
      className='-my-1 grid motion-reduce:transition-none'
      style={{
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: `grid-template-rows ${open ? ROW_EXPAND_MS : ROW_COLLAPSE_MS}ms ${ROW_EASE}`,
      }}
    >
      <div
        ref={contentRef}
        className={cn(
          // py-1: the overflow-hidden below is required for the 0fr/1fr
          // collapse trick, but it also clips anything a child renders
          // outside its own box — including a focused input's
          // shadow-button-important-focus halo, which bleeds 4px past the
          // border on every side. This gives that top/bottom bleed
          // somewhere to go instead of getting sliced flat. -my-1 on the
          // grid track below cancels the padding back out so collapsed/
          // idle rows don't visibly grow.
          'flex min-h-0 flex-col gap-1 overflow-hidden py-1 opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none',
          open && 'opacity-100',
          isRemoving && 'pointer-events-none',
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** True when `row` repeats `other`'s configuration closely enough that
 * stacking them is redundant or misleading, with both sides actually
 * filled in. Two blank rows of the same field are never flagged; there's
 * nothing "already applied" about an unconfigured row yet.
 *
 * For buyer/category "is any of" rows, any two configured rows on the same
 * field count — even with different values — because two such rows don't
 * OR together the way the phrasing suggests: as separate AND'd filter
 * rows, they intersect, silently narrowing results in a way users reading
 * "is any of" wouldn't expect. */
function isConfiguredDuplicate(row: FilterRowState, other: FilterRowState): boolean {
  if (row.kind === 'keyword' && other.kind === 'keyword') {
    if (row.terms.length === 0 || other.terms.length === 0 || row.target !== other.target) {
      return false;
    }
    const normalize = (terms: string[]) =>
      [...new Set(terms.map((term) => term.trim().toLowerCase()))].sort().join(' ');
    return normalize(row.terms) === normalize(other.terms);
  }

  if (row.kind !== 'structured' || other.kind !== 'structured') {
    return false;
  }
  if (row.field !== other.field || row.operator !== other.operator) {
    return false;
  }

  if (isSetField(row.field)) {
    return row.values.length > 0 && other.values.length > 0;
  }
  if (row.field === 'submission-deadline') {
    if (!row.dateFrom) {
      return false;
    }
    const sameFrom = row.dateFrom?.getTime() === other.dateFrom?.getTime();
    const sameTo = (row.dateTo?.getTime() ?? null) === (other.dateTo?.getTime() ?? null);
    return sameFrom && sameTo;
  }
  // base-price
  return row.priceFrom.trim().length > 0 && row.priceFrom === other.priceFrom && row.priceTo === other.priceTo;
}

/**
 * What two rows on the same field actually do — which depends on the match
 * mode, and which the previous copy ("This filter is already applied
 * above.") got wrong in the mode the panel defaults to.
 *
 * Under "match all", the rows AND together: "Buyer is any of Lisboa, Porto"
 * plus "Buyer is any of Lisboa" returns Lisboa only. The second row isn't
 * already applied, it's the one throwing Porto away. Telling the user it's
 * a no-op invites them to leave it there.
 *
 * Under "match any" the rows OR together and the wording was fair, but the
 * advice is the same either way: this belongs in one row. `isConfiguredDuplicate`
 * only fires when the operator matches too, so "is any of X" plus "is none
 * of Y" — a real query — never lands here.
 */
function DuplicateNote({ matchMode }: { matchMode: MatchMode }) {
  return (
    <p className='px-1 text-paragraph-xs text-text-sub-600'>
      {matchMode === 'all'
        ? 'Both rows must match, so this narrows your results. Add these values to the row above instead.'
        : 'This repeats the filter above. Add these values to the row above instead.'}
    </p>
  );
}

const MAX_KEYWORD_TERMS = 5;

function KeywordLimitNote() {
  return (
    <p className='px-1 text-paragraph-xs text-text-soft-400'>
      You’ve reached the limit of {MAX_KEYWORD_TERMS} keyword terms.
    </p>
  );
}

export function DynamicFilterRows({
  rows,
  onChange,
  availableFields,
  matchMode,
  focusRowId,
  onFocusRowHandled,
  openPickerRowId,
  onOpenPickerHandled,
}: {
  rows: FilterRowState[];
  onChange: (rows: FilterRowState[]) => void;
  /** Which fields each row's field picker may offer, from
   * `availableFilterTypes(stage, country)`. Omit to offer everything. */
  availableFields?: FilterTypeValue[];
  /** How the panel combines rows. Only the duplicate-row note reads it, but
   * it has to: the same two rows narrow under "all" and repeat under "any",
   * and a note that picks one reading is wrong half the time. */
  matchMode?: MatchMode;
  /** The row to move focus to, set when the user clicks that condition's
   * chip in the bar below. Cleared via `onFocusRowHandled` once focus has
   * landed, so clicking the same chip twice works. */
  focusRowId?: string;
  onFocusRowHandled?: () => void;
  /** The row whose *value* picker should open on its own, set when the user
   * clicks the merged CPV chip in the bar below — that chip's whole job is
   * to reopen the list of selected codes, which lives in the picker, not
   * on the row. Cleared via `onOpenPickerHandled` once open. */
  openPickerRowId?: string;
  onOpenPickerHandled?: () => void;
}) {
  const [removingIds, setRemovingIds] = React.useState<Set<string>>(new Set());

  function updateRow(id: string, next: FilterRowState) {
    onChange(rows.map((row) => (row.id === id ? next : row)));
  }

  function removeRow(id: string) {
    setRemovingIds((prev) => new Set(prev).add(id));
    window.setTimeout(() => {
      onChange(rows.filter((row) => row.id !== id));
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, ROW_EXIT_MS);
  }

  function changeField(row: StructuredRow, value: FilterTypeValue) {
    if (value === 'document') {
      updateRow(row.id, createKeywordRow());
      return;
    }
    updateRow(row.id, {
      ...row,
      field: value,
      operator: STRUCTURED_FIELD_META[value].defaultOperator,
      values: [],
      dateFrom: undefined,
      dateTo: undefined,
      priceFrom: '',
      priceTo: '',
    });
  }

  return (
    <>
      {rows.map((row, index) => {
        const isRemoving = removingIds.has(row.id);
        const isDuplicate = rows
          .slice(0, index)
          .some((other) => isConfiguredDuplicate(row, other));

        let content: React.ReactNode;

        if (row.kind === 'keyword') {
          content = (
            <FilterRow>
              <FilterFieldTrigger
                label={KEYWORD_TARGET_LABELS[row.target]}
                icon={RiFileTextLine}
                picker={
                  <KeywordTargetPicker
                    defaultValue={row.target}
                    onSelect={(target) => updateRow(row.id, { ...row, target })}
                  />
                }
              />
              <FilterOperatorLabel label='contains' />
              <FilterTagInput
                terms={row.terms}
                onTermsChange={(terms) => updateRow(row.id, { ...row, terms })}
                maxTerms={MAX_KEYWORD_TERMS}
              />
              <FilterRemoveButton onClick={() => removeRow(row.id)} />
            </FilterRow>
          );
        } else {
          const meta = STRUCTURED_FIELD_META[row.field];
          const fieldPicker = (
            <FilterTypePicker
              defaultValue={row.field}
              available={availableFields}
              disabledFields={disabledFieldsForRow(rows, row)}
              onSelect={(value) => changeField(row, value)}
            />
          );

          if (isSetField(row.field)) {
            const field = row.field;
            const operator = row.operator as SetOperatorValue;
            const removeValue = (value: string) =>
              updateRow(row.id, {
                ...row,
                values: row.values.filter((v) => v !== value),
              });
            const setValues = (values: string[]) =>
              updateRow(row.id, { ...row, values });
            const valuePicker =
              field === 'buyer' ? (
                <BuyerPicker selected={row.values} onChange={setValues} />
              ) : field === 'category' ? (
                <CategoryPicker selected={row.values} onChange={setValues} />
              ) : field === 'cpv' ? (
                <CpvPicker selected={row.values} onChange={setValues} />
              ) : (
                <SupplierPicker selected={row.values} onChange={setValues} />
              );
            // CPV chips show the name, not the code the row actually
            // stores — "Roadworks" is what the user picked; "45233140" is
            // how it's matched. The code stays one click away in the
            // picker, where there's room for both.
            const valueChips =
              field === 'cpv'
                ? row.values.map((code) => ({
                    id: code,
                    label: cpvLabel(code),
                    onRemove: () => removeValue(code),
                  }))
                : toChips(row.values, removeValue);
            content = (
              <FilterRow>
                <FilterFieldTrigger label={meta.label} icon={meta.icon} picker={fieldPicker} />
                {/* Competitor gets a fixed "is any of" label instead of the
                    operator picker. Bidder data is incomplete by country,
                    procedure, and source, so "is none of X" would confidently
                    return tenders X did bid on but where no bidder list was
                    published — a filter that lies. Winner keeps both
                    operators: winner data is reliably published after award,
                    so the negation is a truthful question. Same w-[130px]
                    label primitive the keyword row uses, so the value column
                    stays aligned across every row. */}
                {field === 'competitor' ? (
                  <FilterOperatorLabel label={SET_OPERATOR_LABELS['any-of']} />
                ) : (
                  <FilterOperatorTrigger
                    label={SET_OPERATOR_LABELS[operator]}
                    picker={
                      <SetOperatorPicker
                        defaultValue={operator}
                        onSelect={(value) => updateRow(row.id, { ...row, operator: value })}
                      />
                    }
                  />
                )}
                <FilterValueTrigger
                  chips={valueChips}
                  picker={valuePicker}
                  openPicker={row.id === openPickerRowId}
                  onPickerOpened={onOpenPickerHandled}
                />
                <FilterRemoveButton onClick={() => removeRow(row.id)} />
              </FilterRow>
            );
          } else if (row.field === 'submission-deadline') {
            const operator = row.operator as DateOperatorValue;
            // Both bounds take the error border, not just the offending
            // one — same call the price row makes: the fault is the pair,
            // and reddening one end implies the other is the correct one.
            const invalidRange = isInvalidDateRow(row);
            content = (
              <FilterRow>
                <FilterFieldTrigger label={meta.label} icon={meta.icon} picker={fieldPicker} />
                <FilterOperatorTrigger
                  label={DATE_OPERATOR_LABELS[operator]}
                  picker={
                    <DateOperatorPicker
                      defaultValue={operator}
                      onSelect={(value) => updateRow(row.id, { ...row, operator: value })}
                    />
                  }
                />
                <FilterValueTrigger
                  showChevron={false}
                  invalid={invalidRange}
                  placeholder={formatDate(row.dateFrom)}
                  filled={Boolean(row.dateFrom)}
                  picker={
                    <DateFilterCalendar
                      value={row.dateFrom}
                      onSelect={(date) => updateRow(row.id, { ...row, dateFrom: date })}
                    />
                  }
                />
                {operator === 'between' ? (
                  <>
                    <FilterRangeSeparator />
                    <FilterValueTrigger
                      showChevron={false}
                      invalid={invalidRange}
                      placeholder={formatDate(row.dateTo)}
                      filled={Boolean(row.dateTo)}
                      picker={
                        <DateFilterCalendar
                          value={row.dateTo}
                          onSelect={(date) => updateRow(row.id, { ...row, dateTo: date })}
                        />
                      }
                    />
                  </>
                ) : null}
                <FilterRemoveButton onClick={() => removeRow(row.id)} />
              </FilterRow>
            );
          } else {
            // Base Price
            const operator = row.operator as PriceOperatorValue;
            const invalidRange = isInvalidPriceRow(row);
            content = (
              <FilterRow>
                <FilterFieldTrigger label={meta.label} icon={meta.icon} picker={fieldPicker} />
                <FilterOperatorTrigger
                  label={PRICE_OPERATOR_LABELS[operator]}
                  picker={
                    <PriceOperatorPicker
                      defaultValue={operator}
                      onSelect={(value) => updateRow(row.id, { ...row, operator: value })}
                    />
                  }
                />
                <FilterPriceInput
                  value={row.priceFrom}
                  onValueChange={(priceFrom) => updateRow(row.id, { ...row, priceFrom })}
                  invalid={invalidRange}
                />
                {operator === 'between' ? (
                  <>
                    <FilterRangeSeparator />
                    <FilterPriceInput
                      value={row.priceTo}
                      onValueChange={(priceTo) => updateRow(row.id, { ...row, priceTo })}
                      invalid={invalidRange}
                    />
                  </>
                ) : null}
                <FilterRemoveButton onClick={() => removeRow(row.id)} />
              </FilterRow>
            );
          }
        }

        return (
          <AnimatedFilterRow
            key={row.id}
            isRemoving={isRemoving}
            shouldFocus={row.id === focusRowId}
            onFocused={onFocusRowHandled}
          >
            {content}
            {isDuplicate ? <DuplicateNote matchMode={matchMode ?? 'all'} /> : null}
            {row.kind === 'keyword' && row.terms.length >= MAX_KEYWORD_TERMS ? (
              <KeywordLimitNote />
            ) : null}
          </AnimatedFilterRow>
        );
      })}
    </>
  );
}
