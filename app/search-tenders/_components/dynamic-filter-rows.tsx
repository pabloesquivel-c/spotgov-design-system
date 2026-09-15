'use client';

// A live, editable filter-row list — what "Add filter"/"Add keywords"
// actually add to, and what each row's field/operator/value pickers
// actually edit. Distinct from MockFilterRows (filter-panel-states.tsx),
// which stays a fixed specimen set for auditing the panel's own states.
//
// Field-type choices are exactly FilterTypePicker's set — Buyer, Category,
// Submission Deadline, Base Price, plus Document, which converts the row
// into a keyword row rather than a fifth structured kind. Location and
// Procedure type aren't reachable from the field-type picker yet, so they
// stay specimen-only.
//
// Every value is real: Buyer/Category selections come back from their
// checkbox pickers and show on the trigger, Base Price bounds are a real
// text input, keyword terms commit to chips on Enter through FilterTagInput
// (filter-row.tsx) — the same chip look Buyer/Category use, so typed and
// picked values read as one system — and date bounds come back from the
// calendar's Apply. Row add/remove/field-swap apply immediately — they
// aren't folded into the pending/applied Search mechanic yet. That's a
// reasonable next step, not settled as final.
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
  RiBuildingLine,
  RiCalendarEventFill,
  RiCoinsLine,
  RiFileTextLine,
  RiNodeTree,
} from '@remixicon/react';
import type { RemixiconComponentType } from '@remixicon/react';

import { BuyerPicker } from './buyer-picker';
import { CategoryPicker } from './category-picker';
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
} from './filter-row';
import { FilterTypePicker, type FilterTypeValue } from './filter-type-picker';
import { KeywordTargetPicker, type KeywordTarget } from './keyword-target-picker';
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

export type StructuredField = 'buyer' | 'category' | 'submission-deadline' | 'base-price';

export const DEFAULT_STRUCTURED_FIELD: StructuredField = 'buyer';

type StructuredRow = {
  id: string;
  kind: 'structured';
  field: StructuredField;
  operator: SetOperatorValue | DateOperatorValue | PriceOperatorValue;
  // Buyer/Category — the checked option labels.
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

export function hasInvalidPriceRange(rows: FilterRowState[]): boolean {
  return rows.some(isInvalidPriceRow);
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
  children,
}: {
  isRemoving: boolean;
  children: React.ReactNode;
}) {
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    setEntered(true);
  }, []);

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

  if (row.field === 'buyer' || row.field === 'category') {
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

function DuplicateNote() {
  return (
    <p className='px-1 text-paragraph-xs text-text-soft-400'>
      This filter is already applied above.
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
}: {
  rows: FilterRowState[];
  onChange: (rows: FilterRowState[]) => void;
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
              onSelect={(value) => changeField(row, value)}
            />
          );

          if (row.field === 'buyer' || row.field === 'category') {
            const operator = row.operator as SetOperatorValue;
            const removeValue = (value: string) =>
              updateRow(row.id, {
                ...row,
                values: row.values.filter((v) => v !== value),
              });
            content = (
              <FilterRow>
                <FilterFieldTrigger label={meta.label} icon={meta.icon} picker={fieldPicker} />
                <FilterOperatorTrigger
                  label={SET_OPERATOR_LABELS[operator]}
                  picker={
                    <SetOperatorPicker
                      defaultValue={operator}
                      onSelect={(value) => updateRow(row.id, { ...row, operator: value })}
                    />
                  }
                />
                <FilterValueTrigger
                  chips={toChips(row.values, removeValue)}
                  picker={
                    row.field === 'buyer' ? (
                      <BuyerPicker
                        selected={row.values}
                        onChange={(values) => updateRow(row.id, { ...row, values })}
                      />
                    ) : (
                      <CategoryPicker
                        selected={row.values}
                        onChange={(values) => updateRow(row.id, { ...row, values })}
                      />
                    )
                  }
                />
                <FilterRemoveButton onClick={() => removeRow(row.id)} />
              </FilterRow>
            );
          } else if (row.field === 'submission-deadline') {
            const operator = row.operator as DateOperatorValue;
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
          <AnimatedFilterRow key={row.id} isRemoving={isRemoving}>
            {content}
            {isDuplicate ? <DuplicateNote /> : null}
            {row.kind === 'keyword' && row.terms.length >= MAX_KEYWORD_TERMS ? (
              <KeywordLimitNote />
            ) : null}
          </AnimatedFilterRow>
        );
      })}
    </>
  );
}
