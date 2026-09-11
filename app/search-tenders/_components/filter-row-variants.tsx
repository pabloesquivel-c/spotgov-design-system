'use client';

// The filter-row specimen tab: every filter kind and its operator variants,
// laid out for side-by-side review, independent of where a row sits on the
// page. Figma: "Filter variants / Buyer" (node 2465:48084).

import * as React from 'react';
import {
  RiBuildingLine,
  RiCalendarEventFill,
  RiCoinsLine,
  RiFileTextLine,
  RiMapPinLine,
  RiNodeTree,
} from '@remixicon/react';
import type { RemixiconComponentType } from '@remixicon/react';

import {
  FilterFieldTrigger,
  FilterOperatorLabel,
  FilterOperatorTrigger,
  FilterRangeSeparator,
  FilterRemoveButton,
  FilterRow,
  FilterValueTrigger,
} from './filter-row';

/** "is any of" / "is none of" is the same shape for every set-kind field. */
function SetFieldVariants({
  title,
  icon,
}: {
  title: string;
  icon: RemixiconComponentType;
}) {
  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-label-sm text-text-strong-950'>{title}</h2>

      <FilterRow>
        <FilterFieldTrigger label={title} icon={icon} />
        <FilterOperatorTrigger label='is any of' />
        <FilterValueTrigger />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label={title} icon={icon} />
        <FilterOperatorTrigger label='is none of' />
        <FilterValueTrigger />
        <FilterRemoveButton />
      </FilterRow>
    </div>
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
    <div className='flex flex-col gap-4'>
      <h2 className='text-label-sm text-text-strong-950'>{title}</h2>

      <FilterRow>
        <FilterFieldTrigger label={title} icon={RiCalendarEventFill} />
        <FilterOperatorTrigger label='is between' />
        <FilterValueTrigger showChevron={false} />
        <FilterRangeSeparator />
        <FilterValueTrigger showChevron={false} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label={title} icon={RiCalendarEventFill} />
        <FilterOperatorTrigger label='is after' />
        <FilterValueTrigger showChevron={false} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label={title} icon={RiCalendarEventFill} />
        <FilterOperatorTrigger label='is before' />
        <FilterValueTrigger showChevron={false} />
        <FilterRemoveButton />
      </FilterRow>
    </div>
  );
}

/**
 * Base price has a range plus two single-bound comparisons, like Date, and
 * one more case: the range where the lower bound is above the upper bound,
 * which can never match. Both bounds take the error border, not just one.
 */
function BasePriceVariants() {
  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-label-sm text-text-strong-950'>Base price</h2>

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
    </div>
  );
}

/** Keyword fields (Document, Contract Object) have one fixed operator —
 * "contains" — so there's no operator box, just a plain label. */
function KeywordFieldVariant({ title }: { title: string }) {
  return (
    <FilterRow>
      <FilterFieldTrigger label={title} icon={RiFileTextLine} />
      <FilterOperatorLabel label='contains' />
      <FilterValueTrigger showChevron={false} placeholder='Enter keywords...' />
      <FilterRemoveButton />
    </FilterRow>
  );
}

function DocumentVariants() {
  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-label-sm text-text-strong-950'>
        Document / Contract Object
      </h2>

      <KeywordFieldVariant title='Document' />
      <KeywordFieldVariant title='Contract Object' />
    </div>
  );
}

export function FilterRowVariants() {
  return (
    <div className='flex flex-col gap-8'>
      <SetFieldVariants title='Buyer' icon={RiBuildingLine} />
      <SetFieldVariants title='Category' icon={RiNodeTree} />
      <SetFieldVariants title='Location' icon={RiMapPinLine} />
      <DateFieldVariants title='Submission Deadline' />
      <DateFieldVariants title='Publication Date' />
      <BasePriceVariants />
      <DocumentVariants />
    </div>
  );
}
