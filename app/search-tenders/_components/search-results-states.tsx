'use client';

// The search results specimen tab: every Tender Result card variant,
// independent of page state.

import * as React from 'react';

import { ResultsSummary } from './results-summary';
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
        title='Results header'
        description='Running count + sort control, sitting between the applied-search summary and the result list. Interactive — try the sort dropdown.'
      >
        <ResultsSummary count={1234} stage='active' country='Portugal' />
      </Specimen>

      <Specimen
        title='Rich'
        description='Every field populated: deadline, location, procedure type, and matched filters.'
      >
        <TenderResultCard
          {...BASE_CARD_PROPS}
          deadlineStatus={{ type: 'days', days: 5 }}
        />
      </Specimen>

      <Specimen
        title='Awarded — winner across lots'
        description='Awarded results always name the winner. A medal tag carries "who won" without spending a word on it; lots won by the same supplier collapse into one tag rather than repeating the name.'
      >
        <TenderResultCard
          {...BASE_CARD_PROPS}
          name='Renovação integral de duas escolas básicas (Lote 1 e Lote 2)'
          deadlineStatus={{ type: 'closed' }}
          award={[
            { supplier: 'Mota-Engil', lots: 'Lot 1' },
            { supplier: 'Acme Construction', lots: 'Lot 2' },
          ]}
          matchedFilters={['Winner', 'Category']}
        />
      </Specimen>

      <Specimen
        title='Awarded — competitor outcome'
        description='Only shown when a Competitor filter matched, since it answers that filter’s question. Reads "Bid submitted" rather than "Lost": the records show a bid, not a defeat.'
      >
        <TenderResultCard
          {...BASE_CARD_PROPS}
          name='Prestação de serviços de apoio informático municipal'
          deadlineStatus={{ type: 'closed' }}
          award={[{ supplier: 'NovaRede Sistemas' }]}
          competitorOutcome={{ supplier: 'BuildCo', outcome: 'Bid submitted' }}
          matchedFilters={['Competitor']}
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
          deadlineStatus={{ type: 'days', days: 5 }}
        />
      </Specimen>

      <Specimen
        title='Saved'
        description='The tender has already been saved — filled bookmark, and the action reads "Unsave" instead of "Save".'
      >
        <TenderResultCard
          {...BASE_CARD_PROPS}
          deadlineStatus={{ type: 'days', days: 5 }}
          saved
        />
      </Specimen>

      <Specimen
        title='Deadline status'
        description='Every state the countdown pill can be in. [confirmed] No green/"success" tier — a deadline that still needs action is never a safe state, so a pill only ever means "act now" (today, error/red) or "pay attention soon" (tomorrow through 7 days out, warning/orange). Past 7 days, the pill drops entirely — the "Deadline: <date>" meta tag still carries the date, but nothing here is urgent enough to color.'
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
            deadlineStatus={{ type: 'days', days: 5 }}
          />
          <TenderResultCard
            {...BASE_CARD_PROPS}
            deadlineStatus={{ type: 'days', days: 7 }}
          />
          <TenderResultCard
            {...BASE_CARD_PROPS}
            deadlineStatus={{ type: 'closed' }}
          />
          <TenderResultCard
            {...BASE_CARD_PROPS}
            deadlineStatus={{ type: 'unavailable' }}
          />
          <TenderResultCard
            {...BASE_CARD_PROPS}
            deadlineStatus={{ type: 'days', days: 9 }}
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
          deadlineStatus={{ type: 'days', days: 5 }}
        />
      </Specimen>

      <Specimen
        title='Matching filters expanded'
        description='The "+N more filters" disclosure opened, revealing every matched filter instead of just the first three.'
      >
        <TenderResultCard
          {...BASE_CARD_PROPS}
          deadlineStatus={{ type: 'days', days: 5 }}
          defaultExpanded
        />
      </Specimen>

      <Specimen
        title='Long title and buyer name'
        description='Title and buyer name long enough to clip. The title wraps to 2 lines before truncating (real tender titles run long); the buyer name stays 1 line. Both show the full text on hover.'
      >
        <TenderResultCard
          {...BASE_CARD_PROPS}
          name='Aquisição de mobiliário escolar, equipamento informático e material didático para as escolas básicas e secundárias do concelho de Lisboa'
          buyer='Direção-Geral dos Estabelecimentos Escolares e Administração Educativa da Área Metropolitana de Lisboa e Vale do Tejo'
          deadlineStatus={{ type: 'days', days: 5 }}
        />
      </Specimen>
    </div>
  );
}
