'use client';

// The filter-panel specimen tab: the panel's own states, independent of
// which exact filters are inside it. Figma: node 2454:45531 "Panel / Search
// filters" — the 5 rows in that frame are placeholders, not a fixed set.

import * as React from 'react';
import {
  RiBuildingLine,
  RiCalendarEventFill,
  RiCoinsLine,
  RiFileTextLine,
  RiMapPinLine,
  RiNodeTree,
} from '@remixicon/react';

import {
  FilterFieldTrigger,
  FilterOperatorLabel,
  FilterOperatorTrigger,
  FilterRangeSeparator,
  FilterRemoveButton,
  FilterRow,
  FilterValueTrigger,
} from './filter-row';
import { CollapsedFilterPanel, FilterPanel } from './filter-panel';

/** One row of each filter kind, so the panel isn't empty while the real
 * applied filters are still placeholders. */
export function MockFilterRows() {
  return (
    <>
      <FilterRow>
        <FilterFieldTrigger label='Buyer' icon={RiBuildingLine} />
        <FilterOperatorTrigger label='is any of' />
        <FilterValueTrigger />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Category' icon={RiNodeTree} />
        <FilterOperatorTrigger label='is none of' />
        <FilterValueTrigger />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Submission Deadline' icon={RiCalendarEventFill} />
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
        <FilterFieldTrigger label='Document' icon={RiFileTextLine} />
        <FilterOperatorLabel label='contains' />
        <FilterValueTrigger showChevron={false} placeholder='Enter keywords...' />
        <FilterRemoveButton />
      </FilterRow>
    </>
  );
}

/** Same mock set as MockFilterRows, except Base Price is the invalid
 * range from node 2454:46685 — lower bound above the upper bound. */
function ErrorMockRows() {
  return (
    <>
      <FilterRow>
        <FilterFieldTrigger
          label='Submission Deadline'
          icon={RiCalendarEventFill}
        />
        <FilterOperatorTrigger label='is between' />
        <FilterValueTrigger showChevron={false} />
        <FilterRangeSeparator />
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

      <FilterRow>
        <FilterFieldTrigger label='Buyer' icon={RiBuildingLine} />
        <FilterOperatorTrigger label='is any of' />
        <FilterValueTrigger />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Location' icon={RiMapPinLine} />
        <FilterOperatorTrigger label='is any of' />
        <FilterValueTrigger />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Document' icon={RiFileTextLine} />
        <FilterOperatorLabel label='contains' />
        <FilterValueTrigger showChevron={false} placeholder='Enter keywords...' />
        <FilterRemoveButton />
      </FilterRow>
    </>
  );
}

export function FilterPanelStates() {
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Empty (no filters or keywords)
        </h2>
        <FilterPanel />
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Populated (mock rows)
        </h2>
        <FilterPanel>
          <MockFilterRows />
        </FilterPanel>
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Validation error (invalid range)
        </h2>
        <FilterPanel
          hint={{
            tone: 'error',
            message:
              'The lower bound is above the upper bound, so this can never match.',
          }}
        >
          <ErrorMockRows />
        </FilterPanel>
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Unapplied changes
        </h2>
        <FilterPanel
          hint={{
            tone: 'neutral',
            message: 'Unapplied changes. Results below still show your last search.',
          }}
        >
          <MockFilterRows />
        </FilterPanel>
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Collapsed (placeholder)
        </h2>
        <CollapsedFilterPanel />
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Collapsed (applied search)
        </h2>
        <CollapsedFilterPanel summary='Escola' />
      </div>
    </div>
  );
}
