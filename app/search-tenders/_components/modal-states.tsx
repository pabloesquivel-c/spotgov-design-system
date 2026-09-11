'use client';

// The modals specimen tab: every modal/popover this screen opens,
// independent of page state.

import * as React from 'react';

import { BuyerPicker } from './buyer-picker';
import { CategoryPicker } from './category-picker';
import { DateFilterCalendar } from './date-filter-calendar';
import { KeywordTargetPicker } from './keyword-target-picker';
import { LocationPicker } from './location-picker';
import { ProcedurePicker } from './procedure-picker';
import {
  ViewsPicker,
  ViewsPickerEmpty,
  ViewsPickerNoMatch,
} from './views-picker';

export function ModalStates() {
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Buyer picker (opens from the Buyer filter row's value trigger)
        </h2>
        <BuyerPicker />
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Category picker (opens from the Category filter row's value trigger)
        </h2>
        <CategoryPicker />
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Location picker (opens from the Location filter row's value trigger)
        </h2>
        <LocationPicker />
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Procedure type picker (opens from the Procedure type filter row's
          value trigger)
        </h2>
        <ProcedurePicker />
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Keyword target picker (opens from "Add keyword")
        </h2>
        <KeywordTargetPicker />
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Date calendar (opens from a date field's value trigger) — try it,
          this one actually works
        </h2>
        <DateFilterCalendar />
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Views picker (opens from the page header's "Views" button) — with
          multiple saved views
        </h2>
        <ViewsPicker />
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Views picker — editing a view (unsaved changes)
        </h2>
        <ViewsPicker hasUnsavedChanges />
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Views picker — empty (no views created yet)
        </h2>
        <ViewsPickerEmpty />
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-label-sm text-text-strong-950'>
          Views picker — search matched nothing
        </h2>
        <ViewsPickerNoMatch query='xyz' />
      </div>
    </div>
  );
}
