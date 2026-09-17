'use client';

// The filter-row specimen tab: every filter kind and its operator variants,
// laid out for side-by-side review, independent of where a row sits on the
// page. Figma: "Filter variants / Buyer" (node 2465:48084).

import * as React from 'react';
import {
  RiBuildingLine,
  RiCalendarEventLine,
  RiCoinsLine,
  RiFileTextLine,
  RiMapPinLine,
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
  FilterRangeSeparator,
  FilterRemoveButton,
  FilterRow,
  FilterValueTrigger,
} from './filter-row';
import { KeywordTargetPicker } from './keyword-target-picker';
import { LocationPicker } from './location-picker';
import { Specimen } from './specimen';

/** "is any of" / "is none of" is the same shape for every set-kind field. */
function SetFieldVariants({
  title,
  icon,
  picker,
}: {
  title: string;
  icon: RemixiconComponentType;
  picker: React.ReactNode;
}) {
  return (
    <Specimen
      title={title}
      description={`A set-kind field: matches when ${title.toLowerCase()} is any of, or none of, the selected values. Click a value trigger to open its picker.`}
    >
      <FilterRow>
        <FilterFieldTrigger label={title} icon={icon} />
        <FilterOperatorTrigger label='is any of' />
        <FilterValueTrigger picker={picker} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label={title} icon={icon} />
        <FilterOperatorTrigger label='is none of' />
        <FilterValueTrigger picker={picker} />
        <FilterRemoveButton />
      </FilterRow>
    </Specimen>
  );
}

/**
 * Both date fields share the same three operators: a range, and two
 * single-bound comparisons.
 *
 * [confirmed] Submission Deadline is Active-stage-only — every tender past
 * Active already has a passed deadline, so the filter can't discriminate
 * anything there. Publication Date has no such restriction. That's a
 * stage-gating rule, not an operator difference, so it doesn't change the
 * shape built here — it belongs wherever fields get shown/hidden per stage.
 */
function DateFieldVariants({ title }: { title: string }) {
  return (
    <Specimen
      title={title}
      description='A date field: a range between two dates, or a single before/after bound. Click a value trigger to open the calendar.'
    >
      <FilterRow>
        <FilterFieldTrigger label={title} icon={RiCalendarEventLine} />
        <FilterOperatorTrigger label='is between' />
        <FilterValueTrigger showChevron={false} picker={<DateFilterCalendar />} />
        <FilterRangeSeparator />
        <FilterValueTrigger showChevron={false} picker={<DateFilterCalendar />} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label={title} icon={RiCalendarEventLine} />
        <FilterOperatorTrigger label='is after' />
        <FilterValueTrigger showChevron={false} picker={<DateFilterCalendar />} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label={title} icon={RiCalendarEventLine} />
        <FilterOperatorTrigger label='is before' />
        <FilterValueTrigger showChevron={false} picker={<DateFilterCalendar />} />
        <FilterRemoveButton />
      </FilterRow>
    </Specimen>
  );
}

/**
 * Base price has a range plus two single-bound comparisons, like Date, and
 * one more case: the range where the lower bound is above the upper bound,
 * which can never match. Both bounds take the error border, not just one.
 */
function BasePriceVariants() {
  return (
    <Specimen
      title='Base price'
      description='A range, a single at-least/at-most bound, or an invalid range where the lower bound exceeds the upper (both sides take the error border).'
    >
      <FilterRow>
        <FilterFieldTrigger label='Base Price' icon={RiCoinsLine} />
        <FilterOperatorTrigger label='is between' />
        <FilterValueTrigger showChevron={false} />
        <FilterRangeSeparator />
        <FilterValueTrigger showChevron={false} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Base Price' icon={RiCoinsLine} />
        <FilterOperatorTrigger label='is at least' />
        <FilterValueTrigger showChevron={false} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Base Price' icon={RiCoinsLine} />
        <FilterOperatorTrigger label='is at most' />
        <FilterValueTrigger showChevron={false} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Base Price' icon={RiCoinsLine} />
        <FilterOperatorTrigger label='is between' />
        <FilterValueTrigger showChevron={false} invalid />
        <FilterRangeSeparator />
        <FilterValueTrigger showChevron={false} invalid />
        <FilterRemoveButton />
      </FilterRow>
    </Specimen>
  );
}

/** Keyword fields (Document, Contract Object) have one fixed operator —
 * "contains" — so there's no operator box, just a plain label. The field
 * trigger (not the value, which is free text) opens the keyword-target
 * picker — the only thing to pick here is Document vs. Contract Object. */
function KeywordFieldVariant({ title }: { title: string }) {
  return (
    <FilterRow>
      <FilterFieldTrigger
        label={title}
        icon={RiFileTextLine}
        picker={<KeywordTargetPicker />}
      />
      <FilterOperatorLabel label='contains' />
      <FilterValueTrigger showChevron={false} placeholder='Enter keywords...' />
      <FilterRemoveButton />
    </FilterRow>
  );
}

function DocumentVariants() {
  return (
    <Specimen
      title='Document / Contract Object'
      description='Keyword fields with one fixed operator — "contains". Click the field trigger to switch between Document and Contract Object.'
    >
      <KeywordFieldVariant title='Document' />
      <KeywordFieldVariant title='Contract Object' />
    </Specimen>
  );
}

export function FilterRowVariants() {
  return (
    <div className='flex flex-col gap-8'>
      <SetFieldVariants
        title='Buyer'
        icon={RiBuildingLine}
        picker={<BuyerPicker />}
      />
      <SetFieldVariants
        title='Category'
        icon={RiNodeTree}
        picker={<CategoryPicker />}
      />
      <SetFieldVariants
        title='Location'
        icon={RiMapPinLine}
        picker={<LocationPicker />}
      />
      <DateFieldVariants title='Submission Deadline' />
      <DateFieldVariants title='Publication Date' />
      <BasePriceVariants />
      <DocumentVariants />
    </div>
  );
}
