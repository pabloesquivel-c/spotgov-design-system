'use client';

// The modals specimen tab: every modal/popover this screen opens,
// independent of page state.

import * as React from 'react';

import { BuyerPicker } from './buyer-picker';
import { CategoryPicker } from './category-picker';
import { DateFilterCalendar } from './date-filter-calendar';
import { KeywordMatchTooltip } from './keyword-match-tooltip';
import { KeywordTargetPicker } from './keyword-target-picker';
import { LocationPicker } from './location-picker';
import { ProcedurePicker } from './procedure-picker';
import { Specimen } from './specimen';
import {
  ViewsPicker,
  ViewsPickerEmpty,
  ViewsPickerNoMatch,
} from './views-picker';

export function ModalStates() {
  return (
    <div className='flex flex-col gap-8'>
      <Specimen
        title='Buyer picker'
        description='Opens from the Buyer filter row’s value trigger.'
      >
        <BuyerPicker />
      </Specimen>

      <Specimen
        title='Category picker'
        description='Opens from the Category filter row’s value trigger.'
      >
        <CategoryPicker />
      </Specimen>

      <Specimen
        title='Location picker'
        description='Opens from the Location filter row’s value trigger.'
      >
        <LocationPicker />
      </Specimen>

      <Specimen
        title='Procedure type picker'
        description='Opens from the Procedure type filter row’s value trigger.'
      >
        <ProcedurePicker />
      </Specimen>

      <Specimen
        title='Keyword target picker'
        description='Opens from "Add keyword" — choosing whether a keyword searches the contract object or documents.'
      >
        <KeywordTargetPicker />
      </Specimen>

      <Specimen
        title='Date calendar'
        description='Opens from a date field’s value trigger. Try it — this one actually works.'
      >
        <DateFilterCalendar />
      </Specimen>

      <Specimen
        title='Views picker'
        description='Opens from the page header’s "Views" button, with multiple saved views.'
      >
        <ViewsPicker />
      </Specimen>

      <Specimen
        title='Views picker — editing a view'
        description='A saved view with unsaved changes — "Update view" and "Save as new view" become available.'
      >
        <ViewsPicker hasUnsavedChanges />
      </Specimen>

      <Specimen
        title='Views picker — empty'
        description='No views have been created yet.'
      >
        <ViewsPickerEmpty />
      </Specimen>

      <Specimen
        title='Views picker — no matches'
        description='The views search matched nothing.'
      >
        <ViewsPickerNoMatch query='xyz' />
      </Specimen>

      <Specimen
        title='Keyword match tooltip'
        description='Shown on a result that only matched because of a keyword, hit inside a document.'
      >
        <KeywordMatchTooltip
          documentTitle='technical_annex.pdf'
          snippet='…must comply with condições técnicas requirements as set out in this document…'
          side='bottom'
        />
      </Specimen>

      <Specimen
        title='Keyword match tooltip — long document title'
        description='The document title truncates; the full name is available on hover.'
      >
        <KeywordMatchTooltip
          documentTitle='anexo_tecnico_condicoes_especiais_procedimento_2026.pdf'
          snippet='…must comply with condições técnicas requirements as set out in this document…'
          side='bottom'
        />
      </Specimen>
    </div>
  );
}
