'use client';

// The search results specimen tab: every Tender Result card variant,
// independent of page state.

import * as React from 'react';

import { Specimen } from './specimen';
import {
  TenderResultCard,
  type MatchedFilterField,
} from './tender-result-card';

const BASE_CARD_PROPS = {
  name: 'Aquisição de mobiliário escolar para as escolas básicas do concelho',
  buyer: 'Direção-Geral dos Estabelecimentos Escolares',
  location: 'Lisbon, Portugal',
  countryFlag: '🇵🇹',
  procedureType: 'Concurso público',
  deadlineDate: '24th Sept, 2026',
  baseValue: '€2,450,000',
  matchedFilters: [
    'Category',
    'Location',
    'Procedure type',
    'Base value',
    'Contract Object',
  ] satisfies MatchedFilterField[] as MatchedFilterField[],
};

export function SearchResultsStates() {
  return (
    <div className='flex flex-col gap-8'>
      <Specimen
        title='Rich'
        description='Every field populated: deadline, location, procedure type, and matched filters.'
      >
        <TenderResultCard
          {...BASE_CARD_PROPS}
          deadlineStatus={{ type: 'days', days: 34 }}
        />
      </Specimen>

      <Specimen
        title='Matched via keyword in a document'
        description='A distinct match type: the tender only matched because a keyword was found inside a Contract Object or Document. The tag always reads "Matched keyword" — hover it to see which document and where.'
      >
        <TenderResultCard
          {...BASE_CARD_PROPS}
          matchedKeyword={{
            documentTitle: 'technical_annex.pdf',
            snippet:
              '…must comply with condições técnicas requirements as set out in this document…',
          }}
          deadlineStatus={{ type: 'days', days: 34 }}
        />
      </Specimen>

      <Specimen
        title='Saved'
        description='The tender has already been saved — filled bookmark, and the action reads "Unsave" instead of "Save".'
      >
        <TenderResultCard
          {...BASE_CARD_PROPS}
          deadlineStatus={{ type: 'days', days: 34 }}
          saved
        />
      </Specimen>

      <Specimen
        title='Deadline status'
        description='Every state the countdown pill can be in: closes today, closes tomorrow, closes in N days, closed, and deadline not available.'
      >
        <div className='flex flex-col gap-4'>
          <TenderResultCard
            {...BASE_CARD_PROPS}
            deadlineStatus={{ type: 'today' }}
          />
          <TenderResultCard
            {...BASE_CARD_PROPS}
            deadlineStatus={{ type: 'tomorrow' }}
          />
          <TenderResultCard
            {...BASE_CARD_PROPS}
            deadlineStatus={{ type: 'days', days: 34 }}
          />
          <TenderResultCard
            {...BASE_CARD_PROPS}
            deadlineStatus={{ type: 'closed' }}
          />
          <TenderResultCard
            {...BASE_CARD_PROPS}
            deadlineStatus={{ type: 'unavailable' }}
          />
        </div>
      </Specimen>

      <Specimen
        title='No matching filters'
        description='The user hasn’t added any keywords or filters yet, so every result is just "all results" — there’s nothing to explain a match against.'
      >
        <TenderResultCard
          {...BASE_CARD_PROPS}
          matchedFilters={[]}
          deadlineStatus={{ type: 'days', days: 34 }}
        />
      </Specimen>

      <Specimen
        title='Matching filters expanded'
        description='The "+N more filters" disclosure opened, revealing every matched filter instead of just the first three.'
      >
        <TenderResultCard
          {...BASE_CARD_PROPS}
          deadlineStatus={{ type: 'days', days: 34 }}
          defaultExpanded
        />
      </Specimen>

      <Specimen
        title='Long title and buyer name'
        description='Title and buyer name long enough to clip — proves both truncate to one line instead of wrapping or overflowing the card.'
      >
        <TenderResultCard
          {...BASE_CARD_PROPS}
          name='Aquisição de mobiliário escolar, equipamento informático e material didático para as escolas básicas e secundárias do concelho de Lisboa'
          buyer='Direção-Geral dos Estabelecimentos Escolares e Administração Educativa da Área Metropolitana de Lisboa e Vale do Tejo'
          deadlineStatus={{ type: 'days', days: 34 }}
        />
      </Specimen>
    </div>
  );
}
