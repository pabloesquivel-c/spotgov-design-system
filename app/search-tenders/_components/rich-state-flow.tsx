'use client';

// The "Rich state" flow: one continuous, wired-up version of the Search
// Tenders page instead of isolated specimens. Typing in the search box or
// toggling "Saved only" edits the *pending* search; pressing Search commits
// it — that pending/applied split is the page's central mechanic and is
// reachable purely by clicking, no dial needed.
//
// `forceState` covers the states nothing found, a real network can't be
// clicked into on demand (loading, error, empty, no access, ...) — set from
// the "Rich state" dial section in page.tsx.
//
// Filter rows are real: Add filter/Add keywords append rows (new filters
// default to Buyer, per dynamic-filter-rows.tsx), each row's field/operator
// pickers actually edit that row, and the X removes it. Applied rows,
// stage, and match mode all drive the actual result set against the mock
// TENDERS data below — see evaluateTender.
//
// Simplification for this first pass: the country select stays
// presentational (reused as-is from ToolbarRow), and row edits apply
// immediately rather than joining the pending/applied Search mechanic —
// only the search query, "Saved only", rows, and stage join that today.
// None of this is settled as final.
//
// Search collapses the panel (node 2464:48024): clicking "Search" swaps
// FilterPanel for CollapsedFilterPanel via the shared AccordionRow, showing
// the pending query as the collapsed summary. Neither Linear's issue filter
// bar nor Notion's database filters do this — both keep the filter UI
// visible as a persistent, directly-editable chip row instead of hiding it
// behind an extra "Edit Search" click. SpotGov's Figma spec calls for the
// hide-behind-a-summary version anyway, likely because a 7-filter builder
// takes up far more vertical space than a handful of chips — so this earns
// its keep on collapse. Collapsing happens on click, not once the 500ms
// mock request resolves, so the action reads as caused by the click rather
// than a delayed reaction to it; loading feedback moves to the results
// skeleton below instead of the (now hidden) Search button spinner.
// [confirmed] v1 cut: the swap itself is instant (`AccordionRow`'s
// `animate={false}`), not eased — motion here is a later pass, not a
// launch blocker.

import * as React from 'react';
import {
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiGlobalLine,
  RiInformationFill,
  RiRadarLine,
} from '@remixicon/react';

import { EmptyState } from '@/components/blocks/empty-state/empty-state';
import { toast, Toaster } from '@/components/ui/toast';
import * as AlertToast from '@/components/ui/toast-alert';
import { AppliedSummary, type MatchMode, type SummaryChip } from './applied-summary';
import {
  createKeywordRow,
  createStructuredRow,
  DynamicFilterRows,
  hasInvalidPriceRange,
  type FilterRowState,
  type StructuredField,
} from './dynamic-filter-rows';
import { ErrorMockRows } from './filter-panel-states';
import { AccordionRow, CollapsedFilterPanel, FilterPanel } from './filter-panel';
import type { ForceStateId } from './flows';
import type { KeywordTarget } from './keyword-target-picker';
import { PageHeader } from './page-header';
import { ResultsSummary, type SortValue } from './results-summary';
import type { Stage } from './toolbar-row';
import {
  TenderResultCard,
  type DeadlineStatus,
  type MatchedFilterField,
  type MatchedKeyword,
} from './tender-result-card';
import { VIEWS } from './views-picker';

function baseValueNumber(value: string): number {
  return Number(value.replace(/[^0-9.-]/g, '')) || 0;
}

function parsePrice(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

function deadlineRank(status: DeadlineStatus): number {
  if (status.type === 'today') {
    return 0;
  }
  if (status.type === 'tomorrow') {
    return 1;
  }
  if (status.type === 'days') {
    return status.days;
  }
  return Number.POSITIVE_INFINITY;
}

function sortTenders<T extends { deadlineStatus: DeadlineStatus; baseValue: string }>(
  tenders: T[],
  sort: SortValue,
): T[] {
  const list = [...tenders];
  switch (sort) {
    case 'oldest':
      return list.reverse();
    case 'closest-deadline':
      return list.sort(
        (a, b) => deadlineRank(a.deadlineStatus) - deadlineRank(b.deadlineStatus),
      );
    case 'furthest-deadline':
      return list.sort(
        (a, b) => deadlineRank(b.deadlineStatus) - deadlineRank(a.deadlineStatus),
      );
    case 'highest-value':
      return list.sort(
        (a, b) => baseValueNumber(b.baseValue) - baseValueNumber(a.baseValue),
      );
    case 'lowest-value':
      return list.sort(
        (a, b) => baseValueNumber(a.baseValue) - baseValueNumber(b.baseValue),
      );
    case 'most-recent':
    default:
      return list;
  }
}

type MockTender = {
  id: string;
  name: string;
  buyer: string;
  category: string;
  location: string;
  countryFlag: string;
  procedureType: string;
  deadlineDate: string;
  // Real date backing Submission Deadline's between/after/before operators
  // — `deadlineDate` above stays the display string. `null` mirrors
  // `deadlineStatus: 'unavailable'`.
  submissionDeadlineDate: Date | null;
  baseValue: string;
  deadlineStatus: DeadlineStatus;
  stage: Stage;
  // Longer description a keyword row targeting "Contract Object" searches.
  contractObjectText: string;
  // Mock document snippets a keyword row targeting "Documents" searches.
  documents: { title: string; text: string }[];
};

// Mock "today" for every deadline below: 15th Sept, 2026.
const TENDERS: MockTender[] = [
  {
    id: 't1',
    name: 'Construção de um novo pavilhão polidesportivo municipal',
    buyer: 'Município de Lisboa',
    category: 'Construction',
    location: 'Lisbon, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Concurso público',
    deadlineDate: '24th Sept, 2026',
    submissionDeadlineDate: new Date(2026, 8, 24),
    baseValue: '€2,450,000',
    deadlineStatus: { type: 'days', days: 9 },
    stage: 'active',
    contractObjectText:
      'Construção de um novo pavilhão polidesportivo municipal, incluindo estrutura em betão armado e cobertura metálica.',
    documents: [
      {
        title: 'Caderno de Encargos',
        text: 'O caderno de encargos exige verificação de amianto na estrutura existente antes do início da obra.',
      },
    ],
  },
  {
    id: 't2',
    name: 'Reabilitação de pavimento e sinalização rodoviária na Avenida Central',
    buyer: 'Município do Porto',
    category: 'Road maintenance',
    location: 'Porto, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Ajuste direto',
    deadlineDate: '16th Sept, 2026',
    submissionDeadlineDate: new Date(2026, 8, 16),
    baseValue: '€185,000',
    deadlineStatus: { type: 'tomorrow' },
    stage: 'active',
    contractObjectText:
      'Reabilitação de pavimento e sinalização rodoviária na Avenida Central, incluindo repavimentação total do troço.',
    documents: [
      {
        title: 'Termos de Referência',
        text: 'É exigida garantia bancária no valor de 5% do valor base do contrato.',
      },
    ],
  },
  {
    id: 't3',
    name: 'Manutenção de elevadores em edifícios públicos',
    buyer: 'Câmara Municipal de Sintra',
    category: 'Civil engineering',
    location: 'Sintra, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Concurso público',
    deadlineDate: '15th Sept, 2026',
    submissionDeadlineDate: new Date(2026, 8, 15),
    baseValue: '€96,000',
    deadlineStatus: { type: 'today' },
    stage: 'active',
    contractObjectText:
      'Manutenção preventiva e corretiva de elevadores em edifícios públicos, com disponibilidade permanente 24/7.',
    documents: [
      {
        title: 'Memória Descritiva',
        text: 'Inclui plano de manutenção preventiva trimestral para todos os elevadores instalados.',
      },
    ],
  },
  {
    id: 't4',
    name: 'Fornecimento de equipamento informático para serviços administrativos',
    buyer: 'Infraestruturas de Portugal',
    category: 'IT services',
    location: 'Braga, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Concurso público',
    deadlineDate: '2nd Aug, 2026',
    submissionDeadlineDate: new Date(2026, 7, 2),
    baseValue: '€412,000',
    deadlineStatus: { type: 'closed' },
    stage: 'evaluating',
    contractObjectText:
      'Fornecimento de equipamento informático para serviços administrativos, incluindo instalação e suporte técnico.',
    documents: [
      {
        title: 'Especificações Técnicas',
        text: 'Lista detalhada do equipamento informático a fornecer, incluindo garantia de 3 anos.',
      },
    ],
  },
  {
    id: 't5',
    name: 'Aquisição de equipamento médico e laboratorial para hospital universitário',
    buyer: 'Universidade de Coimbra',
    category: 'Medical equipment',
    location: 'Coimbra, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Consulta prévia',
    deadlineDate: '—',
    submissionDeadlineDate: null,
    baseValue: '€58,000',
    deadlineStatus: { type: 'unavailable' },
    stage: 'active',
    contractObjectText:
      'Aquisição de equipamento médico e laboratorial para o hospital universitário, incluindo instalação e formação.',
    documents: [
      {
        title: 'Ficha Técnica',
        text: 'Especificações do equipamento médico e laboratorial exigido, com certificação CE.',
      },
    ],
  },
  {
    id: 't6',
    name: 'Remodelação da instalação elétrica de edifícios escolares',
    buyer: 'Município de Lisboa',
    category: 'Electrical works',
    location: 'Lisbon, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Ajuste direto',
    deadlineDate: '20th Sept, 2026',
    submissionDeadlineDate: new Date(2026, 8, 20),
    baseValue: '€340,000',
    deadlineStatus: { type: 'days', days: 5 },
    stage: 'active',
    contractObjectText:
      'Remodelação da instalação elétrica de edifícios escolares, incluindo novos quadros elétricos e iluminação LED.',
    documents: [
      {
        title: 'Relatório Técnico',
        text: 'Inclui certificação energética obrigatória após conclusão da remodelação elétrica.',
      },
    ],
  },
  {
    id: 't7',
    name: 'Aquisição de licenças de software de gestão documental',
    buyer: 'Município do Porto',
    category: 'Software licences',
    location: 'Porto, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Consulta prévia',
    deadlineDate: '5th Oct, 2026',
    submissionDeadlineDate: new Date(2026, 9, 5),
    baseValue: '€1,150,000',
    deadlineStatus: { type: 'days', days: 20 },
    stage: 'active',
    contractObjectText:
      'Aquisição de licenças de software de gestão documental para os serviços municipais, com suporte anual incluído.',
    documents: [
      {
        title: 'Termos de Referência',
        text: 'É exigida garantia bancária correspondente a 5% do valor total das licenças de software.',
      },
    ],
  },
  {
    id: 't8',
    name: 'Aquisição de equipamento médico de diagnóstico para unidades de saúde locais',
    buyer: 'Câmara Municipal de Sintra',
    category: 'Medical equipment',
    location: 'Sintra, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Concurso público',
    deadlineDate: '10th Jul, 2026',
    submissionDeadlineDate: new Date(2026, 6, 10),
    baseValue: '€125,000',
    deadlineStatus: { type: 'closed' },
    stage: 'evaluating',
    contractObjectText:
      'Aquisição de equipamento médico de diagnóstico por imagem para unidades de saúde locais.',
    documents: [
      {
        title: 'Ficha Técnica',
        text: 'Lista do equipamento médico de diagnóstico e respetiva certificação CE.',
      },
    ],
  },
  {
    id: 't9',
    name: 'Construção de um novo edifício administrativo',
    buyer: 'Infraestruturas de Portugal',
    category: 'Construction',
    location: 'Faro, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Concurso público',
    deadlineDate: '30th Nov, 2026',
    submissionDeadlineDate: new Date(2026, 10, 30),
    baseValue: '€2,980,000',
    deadlineStatus: { type: 'days', days: 76 },
    stage: 'active',
    contractObjectText:
      'Construção de um novo edifício administrativo com fundações reforçadas e estrutura em betão armado.',
    documents: [
      {
        title: 'Caderno de Encargos',
        text: 'Estudo prévio identificou presença de amianto na estrutura do edifício a demolir.',
      },
    ],
  },
  {
    id: 't10',
    name: 'Prestação de serviços de apoio técnico informático e manutenção de rede',
    buyer: 'Universidade de Coimbra',
    category: 'IT services',
    location: 'Coimbra, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Ajuste direto',
    deadlineDate: '17th Sept, 2026',
    submissionDeadlineDate: new Date(2026, 8, 17),
    baseValue: '€210,000',
    deadlineStatus: { type: 'days', days: 2 },
    stage: 'active',
    contractObjectText:
      'Prestação de serviços de apoio técnico informático e manutenção de rede para os serviços centrais.',
    documents: [
      {
        title: 'Especificações Técnicas',
        text: 'Requisitos de suporte técnico informático e SLA de resposta em 4 horas.',
      },
    ],
  },
  {
    id: 't11',
    name: 'Reabilitação estrutural de pontes pedonais e manutenção de elevadores',
    buyer: 'Município de Lisboa',
    category: 'Civil engineering',
    location: 'Lisbon, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Concurso público',
    deadlineDate: '13th Sept, 2026',
    submissionDeadlineDate: new Date(2026, 8, 13),
    baseValue: '€45,000',
    deadlineStatus: { type: 'closed' },
    stage: 'evaluating',
    contractObjectText:
      'Reabilitação estrutural de pontes pedonais e manutenção de elevadores de acesso público.',
    documents: [
      {
        title: 'Memória Descritiva',
        text: 'Inspeção estrutural das pontes e verificação dos elevadores de acesso público.',
      },
    ],
  },
  {
    id: 't12',
    name: 'Reparação de pavimento degradado e substituição de sinalização vertical',
    buyer: 'Município do Porto',
    category: 'Road maintenance',
    location: 'Porto, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Ajuste direto',
    deadlineDate: '—',
    submissionDeadlineDate: null,
    baseValue: '€480,000',
    deadlineStatus: { type: 'unavailable' },
    stage: 'active',
    contractObjectText:
      'Reparação de pavimento degradado e substituição de sinalização vertical em vias municipais.',
    documents: [
      {
        title: 'Termos de Referência',
        text: 'É exigida garantia bancária no valor de 5% do valor base do contrato.',
      },
    ],
  },
  {
    id: 't13',
    name: 'Substituição da rede elétrica interna e iluminação pública',
    buyer: 'Câmara Municipal de Sintra',
    category: 'Electrical works',
    location: 'Sintra, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Concurso público',
    deadlineDate: '15th Sept, 2026',
    submissionDeadlineDate: new Date(2026, 8, 15),
    baseValue: '€650,000',
    deadlineStatus: { type: 'today' },
    stage: 'active',
    contractObjectText:
      'Substituição da rede elétrica interna e iluminação pública em zona histórica.',
    documents: [
      {
        title: 'Relatório Técnico',
        text: 'Certificação energética exigida para toda a instalação elétrica renovada.',
      },
    ],
  },
  {
    id: 't14',
    name: 'Renovação de licenças de software de engenharia e modelação estrutural',
    buyer: 'Infraestruturas de Portugal',
    category: 'Software licences',
    location: 'Aveiro, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Consulta prévia',
    deadlineDate: '16th Sept, 2026',
    submissionDeadlineDate: new Date(2026, 8, 16),
    baseValue: '€890,000',
    deadlineStatus: { type: 'tomorrow' },
    stage: 'evaluating',
    contractObjectText:
      'Renovação de licenças de software de engenharia e modelação estrutural para projetos de infraestrutura.',
    documents: [
      {
        title: 'Especificações Técnicas',
        text: 'Requisitos de licenciamento de software de engenharia estrutural.',
      },
    ],
  },
  {
    id: 't15',
    name: 'Serviços de helpdesk informático e gestão de infraestrutura de rede',
    buyer: 'Universidade de Coimbra',
    category: 'IT services',
    location: 'Coimbra, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Ajuste direto',
    deadlineDate: '1st Dec, 2026',
    submissionDeadlineDate: new Date(2026, 11, 1),
    baseValue: '€1,450,000',
    deadlineStatus: { type: 'days', days: 77 },
    stage: 'active',
    contractObjectText:
      'Serviços de helpdesk informático e gestão de infraestrutura de rede para a universidade.',
    documents: [
      {
        title: 'Especificações Técnicas',
        text: 'Requisitos de suporte técnico informático e gestão de rede universitária.',
      },
    ],
  },
  {
    id: 't16',
    name: 'Obras de construção civil para ampliação do edifício sede da câmara',
    buyer: 'Município de Lisboa',
    category: 'Construction',
    location: 'Lisbon, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Concurso público',
    deadlineDate: '25th Sept, 2026',
    submissionDeadlineDate: new Date(2026, 8, 25),
    baseValue: '€275,000',
    deadlineStatus: { type: 'days', days: 10 },
    stage: 'evaluating',
    contractObjectText:
      'Obras de construção civil para ampliação do edifício sede da câmara municipal.',
    documents: [
      {
        title: 'Caderno de Encargos',
        text: 'Obras de ampliação sujeitas a verificação de amianto na estrutura existente.',
      },
    ],
  },
];

type TenderResult = MockTender & {
  matchedFilters: MatchedFilterField[];
  matchedKeyword?: MatchedKeyword;
};

const FIELD_TO_MATCHED_LABEL: Record<StructuredField, MatchedFilterField> = {
  buyer: 'Buyer',
  category: 'Category',
  'submission-deadline': 'Publication date',
  'base-price': 'Base value',
};

const KEYWORD_TARGET_TO_MATCHED_LABEL: Record<KeywordTarget, MatchedFilterField> = {
  'contract-object': 'Contract Object',
  documents: 'Documents',
};

/** A row with nothing picked yet (no values/dates/price/terms) contributes
 * no constraint — this is what keeps the panel's default unconfigured rows
 * from filtering out every tender before the user has touched anything. */
function isRowConfigured(row: FilterRowState): boolean {
  if (row.kind === 'keyword') {
    return row.terms.length > 0;
  }
  if (row.field === 'buyer' || row.field === 'category') {
    return row.values.length > 0;
  }
  if (row.field === 'submission-deadline') {
    return Boolean(row.dateFrom);
  }
  return row.priceFrom.trim() !== '' || row.priceTo.trim() !== '';
}

function tenderMatchesRow(tender: MockTender, row: FilterRowState): boolean {
  if (row.kind === 'keyword') {
    const haystack =
      row.target === 'documents'
        ? tender.documents.map((doc) => doc.text).join(' ')
        : tender.contractObjectText;
    const lower = haystack.toLowerCase();
    return row.terms.some((term) => lower.includes(term.toLowerCase()));
  }

  if (row.field === 'buyer' || row.field === 'category') {
    const value = row.field === 'buyer' ? tender.buyer : tender.category;
    const inSet = row.values.includes(value);
    return row.operator === 'none-of' ? !inSet : inSet;
  }

  if (row.field === 'submission-deadline') {
    if (!tender.submissionDeadlineDate) {
      return false;
    }
    const time = tender.submissionDeadlineDate.getTime();
    const from = row.dateFrom?.getTime();
    const to = row.dateTo?.getTime();
    if (row.operator === 'after') {
      return from !== undefined && time >= from;
    }
    if (row.operator === 'before') {
      return from !== undefined && time <= from;
    }
    if (from === undefined) {
      return false;
    }
    return to === undefined ? time >= from : time >= from && time <= to;
  }

  // base-price
  const value = baseValueNumber(tender.baseValue);
  const from = parsePrice(row.priceFrom);
  const to = parsePrice(row.priceTo);
  if (row.operator === 'at-least') {
    return from !== null && value >= from;
  }
  if (row.operator === 'at-most') {
    return from !== null && value <= from;
  }
  if (from !== null && to !== null) {
    return value >= from && value <= to;
  }
  if (from !== null) {
    return value >= from;
  }
  if (to !== null) {
    return value <= to;
  }
  return true;
}

function LoadingResults() {
  return (
    <div className='flex flex-col gap-3'>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className='h-[140px] w-full animate-pulse rounded-xl bg-bg-weak-50'
        />
      ))}
    </div>
  );
}

function NothingFound({ onClearAll }: { onClearAll: () => void }) {
  return (
    <EmptyState
      icon={RiRadarLine}
      title='No active tenders match your search'
      description='Try removing a filter or clearing your search to see more results.'
      actionLabel='Clear all'
      onAction={onClearAll}
    />
  );
}

function NoCountryAccess() {
  return (
    <div className='flex flex-col gap-6'>
      <div className='px-8'>
        <PageHeader />
      </div>
      <div className='px-8 py-16'>
        <EmptyState
          icon={RiGlobalLine}
          title='No country access'
          description='Your organization doesn’t have access to any country yet. Contact your admin to get set up.'
        />
      </div>
    </div>
  );
}

function SearchUnavailable({ onRetry }: { onRetry: () => void }) {
  return (
    <div className='flex flex-col gap-6'>
      <div className='px-8'>
        <PageHeader />
      </div>
      <div className='px-8 py-16'>
        <EmptyState
          icon={RiErrorWarningFill}
          title='Search unavailable'
          description='Something went wrong on our end. Try again in a moment.'
          actionLabel='Retry'
          onAction={onRetry}
        />
      </div>
    </div>
  );
}

export function RichStateFlow({ forceState }: { forceState: ForceStateId }) {
  const [searchValue, setSearchValue] = React.useState('');
  const [appliedQuery, setAppliedQuery] = React.useState('');
  const [savedOnly, setSavedOnly] = React.useState(false);
  const [appliedSavedOnly, setAppliedSavedOnly] = React.useState(false);
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = React.useState(false);
  const [sort, setSort] = React.useState<SortValue>('most-recent');
  const initialRows = React.useMemo<FilterRowState[]>(
    () => [
      createStructuredRow('buyer'),
      createStructuredRow('category'),
      createStructuredRow('submission-deadline'),
      createStructuredRow('base-price'),
      createKeywordRow('contract-object'),
    ],
    [],
  );
  const [rows, setRows] = React.useState<FilterRowState[]>(initialRows);
  const [appliedRows, setAppliedRows] = React.useState<FilterRowState[]>(initialRows);
  const [stage, setStage] = React.useState<Stage>('active');
  const [appliedStage, setAppliedStage] = React.useState<Stage>('active');
  const [matchMode, setMatchMode] = React.useState<MatchMode>('all');
  const [appliedMatchMode, setAppliedMatchMode] = React.useState<MatchMode>('all');
  const [views, setViews] = React.useState<string[]>(VIEWS);
  const [currentView, setCurrentView] = React.useState<string>(VIEWS[1]);
  const [viewSearch, setViewSearch] = React.useState('');
  const [isPanelExpanded, setIsPanelExpanded] = React.useState(true);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const editSearchRef = React.useRef<HTMLButtonElement>(null);
  const isFirstPanelRender = React.useRef(true);

  // Mirrors the "Collapse ↔ Expand" specimen in filter-panel-states.tsx:
  // move focus to whichever control just became reachable, so keyboard and
  // screen-reader users land somewhere sensible instead of on a body that
  // just lost its previously-focused element to `inert`.
  React.useEffect(() => {
    if (isFirstPanelRender.current) {
      isFirstPanelRender.current = false;
      return;
    }
    if (isPanelExpanded) {
      searchInputRef.current?.focus();
    } else {
      editSearchRef.current?.focus();
    }
  }, [isPanelExpanded]);

  const dirty =
    searchValue !== appliedQuery ||
    savedOnly !== appliedSavedOnly ||
    rows !== appliedRows ||
    stage !== appliedStage ||
    matchMode !== appliedMatchMode;

  const handleSearch = React.useCallback(() => {
    // Collapse immediately on click, not once results land — the click is
    // the user's signal they're done editing, and results loading is a
    // separate concern the skeleton rows below already communicate. Waiting
    // for the 500ms round-trip would make the collapse feel like a delayed
    // reaction to the click instead of its direct result.
    setIsPanelExpanded(false);
    setIsSearching(true);
    window.setTimeout(() => {
      setAppliedQuery(searchValue);
      setAppliedSavedOnly(savedOnly);
      setAppliedRows(rows);
      setAppliedStage(stage);
      setAppliedMatchMode(matchMode);
      setIsSearching(false);
    }, 500);
  }, [searchValue, savedOnly, rows, stage, matchMode]);

  const handleClearAll = React.useCallback(() => {
    setSearchValue('');
    setSavedOnly(false);
    setStage('active');
    setRows([]);
    setMatchMode('all');
    setAppliedQuery('');
    setAppliedSavedOnly(false);
    setAppliedStage('active');
    setAppliedRows([]);
    setAppliedMatchMode('all');
  }, []);

  const handleSelectView = React.useCallback((view: string) => {
    setCurrentView(view);
  }, []);

  // The results-row badge's "x" — leaves the named view without touching
  // the search itself, same distinction Clear all/Search already draw
  // between resetting criteria and running them.
  const handleExitView = React.useCallback(() => {
    setCurrentView('');
  }, []);

  // Instant, not a fake network delay like Search's 500ms — Export just
  // hands off to a background job, so the toast confirming that handoff
  // fires the moment the button is clicked. Download would fetch the real
  // file once the export finishes; not wired here, out of scope for the
  // demo.
  //
  // A fixed `id` (rather than none, which lets Sonner mint a new one each
  // call) makes a second click while the toast is still up replace it in
  // place instead of stacking a duplicate — no visible disabled/loading
  // state needed on the button itself, since the action really is instant.
  const handleExport = React.useCallback(() => {
    toast.custom(
      (t) => (
        <AlertToast.Root
          t={t}
          status='success'
          size='xsmall'
          message='Your export is ready'
          icon={RiCheckboxCircleFill}
          action={{ label: 'Download', onClick: () => toast.dismiss(t) }}
        />
      ),
      { id: 'export-ready' },
    );
  }, []);

  const handleUpdateView = React.useCallback(() => {
    toast.custom((t) => (
      <AlertToast.Root
        t={t}
        status='success'
        size='xsmall'
        message={`Updated "${currentView}"`}
        icon={RiCheckboxCircleFill}
      />
    ));
  }, [currentView]);

  // Not tied to any real per-view snapshot yet (views are names, not saved
  // configurations) — this proves the interaction (becoming the current
  // view, confirmation) rather than real persistence. The name itself now
  // comes from ViewsPicker's own naming step, which already blocks
  // duplicates before this ever fires.
  const handleSaveAsNewView = React.useCallback((name: string) => {
    setViews((prev) => [name, ...prev]);
    setCurrentView(name);
    toast.custom((t) => (
      <AlertToast.Root
        t={t}
        status='success'
        size='xsmall'
        message={`Saved as "${name}"`}
        icon={RiCheckboxCircleFill}
      />
    ));
  }, []);

  // Discards pending edits — reverts the pending search back to whatever
  // is currently applied, the same "undo my unsearched changes" job Reset
  // does for a view.
  const handleResetView = React.useCallback(() => {
    setSearchValue(appliedQuery);
    setSavedOnly(appliedSavedOnly);
    setRows(appliedRows);
    setStage(appliedStage);
  }, [appliedQuery, appliedSavedOnly, appliedRows, appliedStage]);

  const toggleSave = React.useCallback((id: string, name: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      const wasSaved = next.has(id);
      if (wasSaved) {
        next.delete(id);
      } else {
        next.add(id);
        toast.custom((t) => (
          <AlertToast.Root
            t={t}
            status='success'
            size='xsmall'
            message={`Saved "${name}"`}
            icon={RiCheckboxCircleFill}
            action={{
              label: 'Undo',
              onClick: () => {
                setSavedIds((current) => {
                  const reverted = new Set(current);
                  reverted.delete(id);
                  return reverted;
                });
                toast.dismiss(t);
              },
            }}
          />
        ));
      }
      return next;
    });
  }, []);

  React.useEffect(() => {
    if (forceState !== 'dropped') {
      return;
    }
    const id = toast.custom(
      (t) => (
        <AlertToast.Root
          t={t}
          status='information'
          size='xsmall'
          message='Removed 1 filter unavailable in the United Kingdom: Buyer is any of Município de Lisboa.'
          icon={RiInformationFill}
          action={{ label: 'Undo', onClick: () => toast.dismiss(t) }}
        />
      ),
      { duration: 5000 },
    );
    return () => {
      toast.dismiss(id);
    };
  }, [forceState]);

  if (forceState === 'denied') {
    return <NoCountryAccess />;
  }
  if (forceState === 'error') {
    return (
      <SearchUnavailable onRetry={() => window.location.reload()} />
    );
  }

  const configuredRows = appliedRows.filter(isRowConfigured);

  function evaluateTender(tender: MockTender): TenderResult | null {
    if (appliedSavedOnly && !savedIds.has(tender.id)) {
      return null;
    }
    if (
      appliedQuery &&
      !`${tender.name} ${tender.buyer}`.toLowerCase().includes(appliedQuery.toLowerCase())
    ) {
      return null;
    }
    if (tender.stage !== appliedStage) {
      return null;
    }

    const matchedRows = configuredRows.filter((row) => tenderMatchesRow(tender, row));

    if (configuredRows.length > 0) {
      const passes =
        appliedMatchMode === 'all'
          ? matchedRows.length === configuredRows.length
          : matchedRows.length > 0;
      if (!passes) {
        return null;
      }
    }

    const matchedFilters: MatchedFilterField[] = [];
    let matchedKeyword: MatchedKeyword | undefined;

    for (const row of matchedRows) {
      if (row.kind === 'keyword') {
        matchedFilters.push(KEYWORD_TARGET_TO_MATCHED_LABEL[row.target]);
        if (!matchedKeyword) {
          if (row.target === 'documents') {
            const doc = tender.documents.find((d) =>
              row.terms.some((term) => d.text.toLowerCase().includes(term.toLowerCase())),
            );
            if (doc) {
              matchedKeyword = { documentTitle: doc.title, snippet: doc.text };
            }
          } else {
            const lower = tender.contractObjectText.toLowerCase();
            const hasTerm = row.terms.some((term) => lower.includes(term.toLowerCase()));
            if (hasTerm) {
              matchedKeyword = {
                documentTitle: 'Contract Object',
                snippet: tender.contractObjectText,
              };
            }
          }
        }
      } else {
        matchedFilters.push(FIELD_TO_MATCHED_LABEL[row.field]);
      }
    }

    return { ...tender, matchedFilters, matchedKeyword };
  }

  const results = TENDERS.map(evaluateTender).filter(
    (tender): tender is TenderResult => tender !== null,
  );

  const sortedResults = sortTenders(results, sort);

  const chips: SummaryChip[] = [
    appliedQuery ? { id: 'q', label: `"${appliedQuery}"` } : null,
    appliedSavedOnly ? { id: 'saved', label: 'Saved only' } : null,
  ].filter((chip): chip is SummaryChip => chip !== null);

  const showLoading = isSearching || forceState === 'searching';
  const showNothingFound =
    !showLoading && (forceState === 'no-results' || results.length === 0);

  // [suggested] 10 criteria total: 7 structured filters + 3 keyword rows,
  // each bucket capped independently.
  const structuredCount = rows.filter((row) => row.kind === 'structured').length;
  const keywordCount = rows.filter((row) => row.kind === 'keyword').length;
  const atStructuredCap = structuredCount >= 7;
  const atKeywordCap = keywordCount >= 3;
  const atTotalCap = rows.length >= 10;
  // forceState 'filter-error' swaps in its own static ErrorMockRows, so the
  // real row-derived check only applies outside that demo state.
  const invalidPriceRange = forceState !== 'filter-error' && hasInvalidPriceRange(rows);
  const canSearch = dirty && !invalidPriceRange && !isSearching;
  // Match-any vs match-all only changes results once there's more than one
  // row to combine.
  const showMatchMode = rows.length > 1;

  return (
    <div className='flex flex-col gap-6'>
      <div className='px-8'>
        <PageHeader
          views={views}
          currentView={currentView}
          onSelectView={handleSelectView}
          viewSearch={viewSearch}
          onViewSearchChange={setViewSearch}
          hasUnsavedViewChanges={dirty}
          onUpdateView={handleUpdateView}
          onSaveAsNewView={handleSaveAsNewView}
          onResetView={handleResetView}
          onExport={handleExport}
        />
      </div>

      <div className='flex flex-col gap-4 px-8'>
        <AccordionRow open={isPanelExpanded} animate={false}>
          <FilterPanel
            searchInputRef={searchInputRef}
            onSearch={handleSearch}
            onClearAll={handleClearAll}
            searchDisabled={!canSearch}
            isSearching={isSearching}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearchSubmit={canSearch ? handleSearch : undefined}
            savedOnly={savedOnly}
            onSavedOnlyChange={setSavedOnly}
            stage={stage}
            onStageChange={setStage}
            matchMode={matchMode}
            onMatchModeChange={setMatchMode}
            showMatchMode={showMatchMode}
            isEmpty={rows.length === 0}
            disableAddFilter={atStructuredCap || atTotalCap}
            disableAddKeyword={atKeywordCap || atTotalCap}
            onAddFilter={() => setRows((prev) => [...prev, createStructuredRow()])}
            onAddKeyword={() => setRows((prev) => [...prev, createKeywordRow()])}
            hint={
              forceState === 'filter-error' || invalidPriceRange
                ? {
                    tone: 'error',
                    message:
                      'The lower bound is above the upper bound, so this can never match.',
                  }
                : atTotalCap || atStructuredCap || atKeywordCap
                  ? {
                      tone: 'neutral',
                      // Names which cap was actually hit — hitting the 7-
                      // structured or 3-keyword sub-limit long before the
                      // 10-total ceiling is the common case, and "up to 10
                      // criteria" alone doesn't explain why just one of the
                      // two Add buttons went gray.
                      message: atTotalCap
                        ? 'You’ve reached the 10-criteria limit for a search.'
                        : atStructuredCap
                          ? 'You’ve reached the limit of 7 structured filters. Remove one, or add a keyword instead.'
                          : 'You’ve reached the limit of 3 keyword rows. Remove one, or add a filter instead.',
                    }
                  : dirty
                    ? {
                        tone: 'neutral',
                        message:
                          'Unapplied changes. Results below still show your last search.',
                      }
                    : undefined
            }
          >
            {forceState === 'filter-error' ? (
              <ErrorMockRows />
            ) : (
              <DynamicFilterRows rows={rows} onChange={setRows} />
            )}
          </FilterPanel>
        </AccordionRow>

        <AccordionRow open={!isPanelExpanded} animate={false}>
          <CollapsedFilterPanel
            ref={editSearchRef}
            summary={searchValue || undefined}
            onEditSearch={() => setIsPanelExpanded(true)}
          />
        </AccordionRow>

        {chips.length > 0 ? (
          <AppliedSummary chips={chips} matchMode={appliedMatchMode} />
        ) : null}
      </div>

      {/* ResultsSummary lives with the cards it captions, not with the
          panel above it — it's describing "5 active tenders..." for the
          list right below, so proximity should point down, not up. Sharing
          this group's gap-4 with the cards (was gap-3) also gives these
          content-rich cards a touch more breathing room than a dense
          table row gets. */}
      <div className='flex flex-col gap-4 px-8 pb-8'>
        {showLoading ? null : (
          <ResultsSummary
            count={results.length}
            stage={appliedStage}
            country='Portugal'
            sort={sort}
            onSortChange={setSort}
            currentView={currentView}
            onExitView={handleExitView}
          />
        )}

        {showLoading ? (
          <LoadingResults />
        ) : showNothingFound ? (
          <NothingFound onClearAll={handleClearAll} />
        ) : (
          sortedResults.map((tender) => (
            <TenderResultCard
              key={tender.id}
              name={tender.name}
              buyer={tender.buyer}
              location={tender.location}
              countryFlag={tender.countryFlag}
              procedureType={tender.procedureType}
              deadlineDate={tender.deadlineDate}
              baseValue={tender.baseValue}
              deadlineStatus={tender.deadlineStatus}
              matchedFilters={tender.matchedFilters}
              matchedKeyword={tender.matchedKeyword}
              saved={savedIds.has(tender.id)}
              onToggleSave={() => toggleSave(tender.id, tender.name)}
            />
          ))
        )}
      </div>

      <Toaster />
    </div>
  );
}
