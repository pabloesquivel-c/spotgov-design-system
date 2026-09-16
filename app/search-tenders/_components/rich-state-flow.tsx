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
// Stage and country both decide which filters exist: Winner and Competitor
// are Awarded-only, and each is gated on whether that country's indexed
// data actually carries winner / bidder information (AWARD_DATA_AVAILABILITY
// in dynamic-filter-rows.tsx). Changing either drops the rows that can no
// longer apply and says so in a toast with Undo — see changeSearchContext.
//
// Simplification for this first pass: row edits apply immediately rather
// than joining the pending/applied Search mechanic — the search query,
// "Saved only", rows, stage, and country join that today. None of this is
// settled as final.
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
// The swap eases via `AccordionRow`'s unified-morph transition (240ms
// cubic-bezier(0.77, 0, 0.175, 1), same curve/duration both directions) —
// picked after prototyping three directions on the "Panel Animation"
// specimen tab.

import * as React from 'react';
import {
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiGlobalLine,
  RiInformationFill,
  RiRadarLine,
} from '@remixicon/react';

import { EmptyState } from '@/components/blocks/empty-state/empty-state';
import { toast } from '@/components/ui/toast';
import * as AlertToast from '@/components/ui/toast-alert';
import { cn } from '@/utils/cn';
import { isCpvOrDescendant } from './cpv-data';
import { FilterChips, type FilterChip, type MatchMode } from './filter-chips';
import {
  availableFilterTypes,
  createKeywordRow,
  createStructuredRow,
  describeRow,
  isRowConfigured,
  DynamicFilterRows,
  impossibleRowReason,
  isRowAvailable,
  type FilterRowState,
  type StructuredField,
} from './dynamic-filter-rows';
import { ErrorMockRows } from './filter-panel-states';
import { AccordionRow, CollapsedFilterPanel, FilterPanel, GRID_MS } from './filter-panel';
import type { ForceStateId } from './flows';
import type { KeywordTarget } from './keyword-target-picker';
import { Orb } from './orb';
import { PageHeader } from './page-header';
import { ResultsSummary, type SortValue } from './results-summary';
import shimmerStyles from './shimmer-text.module.css';
import { COUNTRIES, STAGE_LABELS, type CountryCode, type Stage } from './toolbar-row';
import {
  TenderResultCard,
  type AwardWinner,
  type CompetitorOutcome,
  type DeadlineStatus,
  type MatchedFilterField,
  type MatchedKeyword,
} from './tender-result-card';
import { VIEWS } from './views-picker';

/** Keeps a just-shown loading state visible for at least `minMs` even if the
 * real request finishes sooner — without it, a fast connection makes the
 * skeleton's own entrance stagger flash and cut itself off mid-animation
 * instead of settling. Doesn't delay *showing* it, only hiding it. */
function useMinimumVisibleDuration(active: boolean, minMs: number): boolean {
  const [visible, setVisible] = React.useState(active);
  const shownAtRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (active) {
      shownAtRef.current = Date.now();
      setVisible(true);
      return;
    }
    const shownAt = shownAtRef.current;
    if (shownAt === null) {
      setVisible(false);
      return;
    }
    const remaining = Math.max(minMs - (Date.now() - shownAt), 0);
    const id = window.setTimeout(() => setVisible(false), remaining);
    return () => window.clearTimeout(id);
  }, [active, minMs]);

  return visible;
}

/** Steps through `phraseCount` phrases once, `phraseMs` apart, then holds on
 * the last one for as long as `active` stays true — timed off elapsed time
 * rather than a chain of timeouts, so it advances smoothly however long the
 * real request takes. Deliberately doesn't loop back to the first phrase:
 * repeating "Looking through tenders…" after "Almost there…" read as the
 * search restarting, which undercuts the one thing this line exists to
 * communicate. */
function usePhraseSequence(active: boolean, phraseCount: number, phraseMs: number): number {
  const [phraseIndex, setPhraseIndex] = React.useState(0);

  React.useEffect(() => {
    if (!active) {
      setPhraseIndex(0);
      return;
    }
    const start = Date.now();
    const id = window.setInterval(() => {
      setPhraseIndex(Math.min(Math.floor((Date.now() - start) / phraseMs), phraseCount - 1));
    }, 80);
    return () => window.clearInterval(id);
  }, [active, phraseCount, phraseMs]);

  return phraseIndex;
}

// Per docs/copy.md: specific over clever ("Bad: Working magic…"), name the
// object, no em dashes.
const STATUS_PHRASES = [
  'Looking through tenders…',
  'Matching your filters…',
  'Almost there…',
];
// 1500ms/phrase, not the previous 1000ms: this is a deliberate "thinking"
// pause, not a snappy UI transition, and 1000ms still read as short once
// the rest of the treatment made the sequence feel more alive — the pace
// should feel unhurried, not just technically readable. The resulting
// 4500ms floor (below) derives from that pace instead of the pace being
// squeezed to fit a pre-picked floor.
const PHRASE_MS = 1500;
// Chosen after prototyping three directions on the "Loading pacing"
// specimen tab: a fixed floor long enough to read as real work — the "LLM
// thinking tokens" reference — rather than resolving the instant a response
// is ready. Equal to the full phrase sequence's own length (not a separate,
// independently-picked number) so the floor never cuts the last phrase's
// dwell time short.
const FIXED_FLOOR_MS = PHRASE_MS * STATUS_PHRASES.length;
// A real crossfade (both texts briefly overlap, blur-masked), not a hard
// cut with a fade-in bolted on — see CrossfadeText below.
const CROSSFADE_MS = 350;
// The skeleton's own stagger (below) starts this many ms after Search is
// clicked — not at 0 — so its entrance plays out *after* the filter panel
// has (mostly) finished collapsing (AccordionRow's GRID_MS) instead of
// racing it: the results area is still shifting vertically while the panel
// animates closed, so anything fading in during that window judders against
// a moving container. HANDOFF_OVERLAP_MS pulls it slightly earlier than a
// full serial wait so the handoff reads as one continuous motion rather
// than a dead pause between two unrelated ones.
const HANDOFF_OVERLAP_MS = 40;
const SKELETON_STAGGER_START_MS = GRID_MS - HANDOFF_OVERLAP_MS;
const SKELETON_MAX_VISIBLE_ROWS = 6;
const SKELETON_STAGGER_STEP_MS = 50;
const SKELETON_STAGGER_CAP = 4;

function ResultCardSkeleton() {
  return (
    <div className='flex w-full items-start gap-4 rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3 pb-3 pt-2.5 shadow-regular-xs'>
      <div className='flex min-w-0 flex-1 flex-col gap-3'>
        <div className='flex flex-col gap-1.5'>
          <div className='h-4 w-4/5 animate-pulse rounded-md bg-bg-weak-50' />
          <div className='h-4 w-2/5 animate-pulse rounded-md bg-bg-weak-50' />
        </div>
        <div className='flex gap-2'>
          <div className='h-6 w-24 animate-pulse rounded-md bg-bg-weak-50' />
          <div className='h-6 w-20 animate-pulse rounded-md bg-bg-weak-50' />
          <div className='h-6 w-28 animate-pulse rounded-md bg-bg-weak-50' />
        </div>
      </div>
      <div className='flex shrink-0 flex-col items-end gap-3 self-stretch'>
        <div className='h-6 w-28 animate-pulse rounded-md bg-bg-weak-50' />
        <div className='h-8 w-20 animate-pulse rounded-lg bg-bg-weak-50' />
      </div>
    </div>
  );
}

/** A real crossfade, not a hard cut with a fade-in bolted on: the outgoing
 * text fades out (with a light blur, masking the swap per Emil Kowalski's
 * "blur bridges two states that would otherwise read as two objects
 * swapping") while the incoming text fades in, both driven by CSS
 * transitions so a fast re-trigger retargets smoothly instead of restarting
 * from zero. `ease`, not `ease-out` — the same "slightly slower, more
 * elegant" choice Sonner makes for a component with personality, rather
 * than the snappier default for functional UI chrome.
 *
 * The base layer only carries the transition *while* something is
 * crossfading over it — applying it unconditionally caused a bug where the
 * final handoff (clearing `incoming`) replayed as a second, unwanted
 * fade-in right after the first one finished. No transition rule at rest
 * means that handoff is instant.
 *
 * `shimmerStyles.shimmer` folds into `className` at the call site below —
 * the shimmer's `animation` (mask-position, infinite) and this component's
 * `transition` (opacity/filter) target different properties on the same
 * element, so they run independently: the phrase change still gets a real
 * crossfade, on top of which the shimmer keeps sweeping continuously
 * throughout. Dropping the crossfade for a shimmer-only treatment (an
 * earlier pass, on the specimen tab) was a mistake — the shimmer's motion
 * doesn't stand in for a transition on the text *content* changing; a
 * phrase swap with zero transition read as a jump cut regardless. */
function CrossfadeText({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = React.useState(text);
  const [incoming, setIncoming] = React.useState<string | null>(null);
  const [settled, setSettled] = React.useState(true);

  React.useEffect(() => {
    if (text === displayed) {
      return;
    }
    setIncoming(text);
    setSettled(false);
    const raf = requestAnimationFrame(() => setSettled(true));
    const id = window.setTimeout(() => {
      setDisplayed(text);
      setIncoming(null);
    }, CROSSFADE_MS);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(id);
    };
  }, [text, displayed]);

  const layerClassName = cn(className, 'col-start-1 row-start-1');
  const crossfadeClassName = cn(layerClassName, 'transition-[opacity,filter] ease');

  return (
    <span className='relative inline-grid'>
      <span
        className={incoming ? crossfadeClassName : layerClassName}
        style={
          incoming
            ? {
                transitionDuration: `${CROSSFADE_MS}ms`,
                opacity: settled ? 0 : 1,
                filter: settled ? 'blur(2px)' : 'blur(0px)',
              }
            : undefined
        }
      >
        {displayed}
      </span>
      {incoming ? (
        <span
          className={crossfadeClassName}
          style={{
            transitionDuration: `${CROSSFADE_MS}ms`,
            opacity: settled ? 1 : 0,
            filter: settled ? 'blur(0px)' : 'blur(2px)',
          }}
        >
          {incoming}
        </span>
      ) : null}
    </span>
  );
}

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

/** What the indexed data records about an awarded contract. Absent on
 * Active/Evaluating tenders — nothing is awarded before the award. */
type Award = {
  // One entry per recorded winning lot. A single-lot tender has one entry
  // with `lot: null`; an awarded tender whose winner was never published has
  // an empty array, which is what keeps it out of every Winner result.
  lots: { lot: string | null; winner: string }[];
  // Every supplier recorded as having submitted a bid, winners included.
  // `null` means no bidder list was published at all — deliberately distinct
  // from `[]`, which would claim "published, and nobody bid".
  bidders: string[] | null;
};

type MockTender = {
  id: string;
  name: string;
  buyer: string;
  category: string;
  // Every CPV code the notice carries, main one first. A list, not a single
  // code: real notices publish a main CPV plus additional ones, and that's
  // exactly what makes a CPV "is all of" filter answerable.
  cpvCodes: string[];
  location: string;
  // Drives both the results filter and the card's flag, via COUNTRIES —
  // a per-fixture flag string would drift from the country it claims.
  country: CountryCode;
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
  award?: Award;
};

// Mock "today" for every deadline below: 15th Sept, 2026.
const TENDERS: MockTender[] = [
  {
    id: 't1',
    name: 'Construção de um novo pavilhão polidesportivo municipal',
    buyer: 'Município de Lisboa',
    category: 'Construction',
    cpvCodes: ['45212200'],
    location: 'Lisbon, Portugal',
    country: 'pt',
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
    cpvCodes: ['45233140', '45233290'],
    location: 'Porto, Portugal',
    country: 'pt',
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
    cpvCodes: ['50750000'],
    location: 'Sintra, Portugal',
    country: 'pt',
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
    cpvCodes: ['30213000'],
    location: 'Braga, Portugal',
    country: 'pt',
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
    cpvCodes: ['33100000'],
    location: 'Coimbra, Portugal',
    country: 'pt',
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
    cpvCodes: ['45310000', '45214200'],
    location: 'Lisbon, Portugal',
    country: 'pt',
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
    cpvCodes: ['48311000'],
    location: 'Porto, Portugal',
    country: 'pt',
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
    cpvCodes: ['33111000'],
    location: 'Sintra, Portugal',
    country: 'pt',
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
    cpvCodes: ['45213000'],
    location: 'Faro, Portugal',
    country: 'pt',
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
    cpvCodes: ['72600000'],
    location: 'Coimbra, Portugal',
    country: 'pt',
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
    cpvCodes: ['45221100', '50750000'],
    location: 'Lisbon, Portugal',
    country: 'pt',
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
    cpvCodes: ['45233140', '45233290'],
    location: 'Porto, Portugal',
    country: 'pt',
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
    cpvCodes: ['45310000', '45316100'],
    location: 'Sintra, Portugal',
    country: 'pt',
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
    cpvCodes: ['48900000'],
    location: 'Aveiro, Portugal',
    country: 'pt',
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
    cpvCodes: ['72253000'],
    location: 'Coimbra, Portugal',
    country: 'pt',
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
    cpvCodes: ['45210000'],
    location: 'Lisbon, Portugal',
    country: 'pt',
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

  // --- Awarded, Portugal. Winner and bidder data both published here, so
  // both Awarded-only filters are offered (AWARD_DATA_AVAILABILITY).
  {
    id: 't17',
    name: 'Renovação integral de duas escolas básicas (Lote 1 e Lote 2)',
    buyer: 'Município de Lisboa',
    category: 'Construction',
    cpvCodes: ['45214200', '45310000', '77310000'],
    location: 'Lisbon, Portugal',
    country: 'pt',
    procedureType: 'Concurso público',
    deadlineDate: '12th Jun, 2026',
    submissionDeadlineDate: new Date(2026, 5, 12),
    baseValue: '€3,120,000',
    deadlineStatus: { type: 'closed' },
    stage: 'awarded',
    contractObjectText:
      'Renovação integral de duas escolas básicas, incluindo cobertura, instalação elétrica e requalificação dos espaços exteriores.',
    documents: [
      {
        title: 'Relatório Final',
        text: 'Adjudicação por lotes na sequência do relatório final do júri do procedimento.',
      },
    ],
    // The multi-lot case: a Winner filter on Acme Construction has to keep
    // this tender even though another supplier took Lot 1.
    award: {
      lots: [
        { lot: 'Lot 1', winner: 'Mota-Engil' },
        { lot: 'Lot 2', winner: 'Acme Construction' },
      ],
      bidders: ['Mota-Engil', 'Acme Construction', 'Teixeira Duarte', 'BuildCo'],
    },
  },
  {
    id: 't18',
    name: 'Prestação de serviços de apoio informático municipal',
    buyer: 'Município do Porto',
    category: 'IT services',
    cpvCodes: ['72253000'],
    location: 'Porto, Portugal',
    country: 'pt',
    procedureType: 'Concurso público',
    deadlineDate: '28th May, 2026',
    submissionDeadlineDate: new Date(2026, 4, 28),
    baseValue: '€540,000',
    deadlineStatus: { type: 'closed' },
    stage: 'awarded',
    contractObjectText:
      'Prestação de serviços de apoio informático municipal, incluindo helpdesk e manutenção de postos de trabalho.',
    documents: [
      {
        title: 'Relatório Final',
        text: 'Proposta economicamente mais vantajosa apurada entre três concorrentes admitidos.',
      },
    ],
    // BuildCo bid and lost — it shows up under Competitor, never under
    // Winner.
    award: {
      lots: [{ lot: null, winner: 'NovaRede Sistemas' }],
      bidders: ['NovaRede Sistemas', 'BuildCo', 'Grupo Elecnor'],
    },
  },
  {
    id: 't19',
    name: 'Fornecimento de equipamento hospitalar de diagnóstico',
    buyer: 'Universidade de Coimbra',
    category: 'Medical equipment',
    cpvCodes: ['33111000'],
    location: 'Coimbra, Portugal',
    country: 'pt',
    procedureType: 'Consulta prévia',
    deadlineDate: '4th Apr, 2026',
    submissionDeadlineDate: new Date(2026, 3, 4),
    baseValue: '€760,000',
    deadlineStatus: { type: 'closed' },
    stage: 'awarded',
    contractObjectText:
      'Fornecimento e instalação de equipamento hospitalar de diagnóstico por imagem, com formação da equipa clínica.',
    documents: [
      {
        title: 'Ficha Técnica',
        text: 'Equipamento de diagnóstico com certificação CE e garantia alargada de 5 anos.',
      },
    ],
    // Winner published, bidder list never was — a Competitor filter must
    // return nothing here rather than guessing.
    award: {
      lots: [{ lot: null, winner: 'MediSupply Ibérica' }],
      bidders: null,
    },
  },
  {
    id: 't20',
    name: 'Empreitada de repavimentação da via circular interna',
    buyer: 'Infraestruturas de Portugal',
    category: 'Road maintenance',
    cpvCodes: ['45233220'],
    location: 'Faro, Portugal',
    country: 'pt',
    procedureType: 'Concurso público',
    deadlineDate: '19th Mar, 2026',
    submissionDeadlineDate: new Date(2026, 2, 19),
    baseValue: '€1,880,000',
    deadlineStatus: { type: 'closed' },
    stage: 'awarded',
    contractObjectText:
      'Empreitada de repavimentação da via circular interna, incluindo drenagem e sinalização horizontal.',
    documents: [
      {
        title: 'Relatório Final',
        text: 'Ambos os lotes adjudicados ao mesmo concorrente por proposta conjunta mais vantajosa.',
      },
    ],
    // One supplier, two lots — the card groups them into a single tag
    // ("Teixeira Duarte · Lots 1, 2") rather than repeating the name.
    award: {
      lots: [
        { lot: 'Lot 1', winner: 'Teixeira Duarte' },
        { lot: 'Lot 2', winner: 'Teixeira Duarte' },
      ],
      bidders: ['Teixeira Duarte', 'Mota-Engil'],
    },
  },
  {
    id: 't21',
    name: 'Manutenção de espaços verdes e mobiliário urbano',
    buyer: 'Câmara Municipal de Sintra',
    category: 'Civil engineering',
    cpvCodes: ['77310000'],
    location: 'Sintra, Portugal',
    country: 'pt',
    procedureType: 'Ajuste direto',
    deadlineDate: '7th Feb, 2026',
    submissionDeadlineDate: new Date(2026, 1, 7),
    baseValue: '€230,000',
    deadlineStatus: { type: 'closed' },
    stage: 'awarded',
    contractObjectText:
      'Manutenção de espaços verdes e mobiliário urbano em freguesias do concelho.',
    documents: [
      {
        title: 'Termos de Referência',
        text: 'Procedimento concluído sem publicação do relatório de adjudicação.',
      },
    ],
    // Bids recorded, winner never published — Competitor matches, Winner
    // must not, under either operator.
    award: { lots: [], bidders: ['BuildCo', 'Acme Construction'] },
  },

  // --- Spain. Winner data is indexed, bidder lists are not, so only the
  // Winner filter is offered here.
  {
    id: 't22',
    name: 'Suministro de equipamiento informático para centros educativos',
    buyer: 'Ayuntamiento de Madrid',
    category: 'IT services',
    cpvCodes: ['30213000'],
    location: 'Madrid, Spain',
    country: 'es',
    procedureType: 'Procedimiento abierto',
    deadlineDate: '3rd Jun, 2026',
    submissionDeadlineDate: new Date(2026, 5, 3),
    baseValue: '€1,240,000',
    deadlineStatus: { type: 'closed' },
    stage: 'awarded',
    contractObjectText:
      'Suministro e instalación de equipamiento informático para centros educativos municipales.',
    documents: [
      {
        title: 'Pliego de Prescripciones',
        text: 'Se exige garantía definitiva del 5% del importe de adjudicación.',
      },
    ],
    award: { lots: [{ lot: null, winner: 'Grupo Elecnor' }], bidders: null },
  },
  {
    id: 't23',
    name: 'Obras de rehabilitación del mercado municipal',
    buyer: 'Ayuntamiento de Sevilla',
    category: 'Construction',
    cpvCodes: ['45213000'],
    location: 'Seville, Spain',
    country: 'es',
    procedureType: 'Procedimiento abierto',
    deadlineDate: '21st Apr, 2026',
    submissionDeadlineDate: new Date(2026, 3, 21),
    baseValue: '€2,650,000',
    deadlineStatus: { type: 'closed' },
    stage: 'awarded',
    contractObjectText:
      'Obras de rehabilitación estructural del mercado municipal, incluida la cubierta y las instalaciones eléctricas.',
    documents: [
      {
        title: 'Memoria Técnica',
        text: 'Rehabilitación por lotes con plazos de ejecución independientes.',
      },
    ],
    award: {
      lots: [
        { lot: 'Lot 1', winner: 'Ferrovial Construcción' },
        { lot: 'Lot 2', winner: 'Acme Construction' },
      ],
      bidders: null,
    },
  },
  {
    id: 't24',
    name: 'Servicio de mantenimiento del alumbrado público',
    buyer: 'Ayuntamiento de Valencia',
    category: 'Electrical works',
    cpvCodes: ['50232100', '45316100'],
    location: 'Valencia, Spain',
    country: 'es',
    procedureType: 'Procedimiento abierto',
    deadlineDate: '29th Sept, 2026',
    submissionDeadlineDate: new Date(2026, 8, 29),
    baseValue: '€870,000',
    deadlineStatus: { type: 'days', days: 14 },
    stage: 'active',
    contractObjectText:
      'Servicio de mantenimiento preventivo y correctivo del alumbrado público del término municipal.',
    documents: [
      {
        title: 'Pliego de Prescripciones',
        text: 'Incluye sustitución progresiva de luminarias por tecnología LED.',
      },
    ],
  },
  {
    id: 't25',
    name: 'Adquisición de material sanitario para centros de atención primaria',
    buyer: 'Diputación de Barcelona',
    category: 'Medical equipment',
    cpvCodes: ['33190000'],
    location: 'Barcelona, Spain',
    country: 'es',
    procedureType: 'Procedimiento negociado',
    deadlineDate: '8th Aug, 2026',
    submissionDeadlineDate: new Date(2026, 7, 8),
    baseValue: '€395,000',
    deadlineStatus: { type: 'closed' },
    stage: 'evaluating',
    contractObjectText:
      'Adquisición de material sanitario fungible para centros de atención primaria.',
    documents: [
      {
        title: 'Memoria Técnica',
        text: 'Material sanitario con certificación CE y trazabilidad por lote.',
      },
    ],
  },

  // --- United Kingdom. Neither winner nor bidder data is indexed, so the
  // Awarded tab works but offers neither filter — awarded tenders here
  // simply carry no `award` block.
  {
    id: 't26',
    name: 'School catering services framework',
    buyer: 'Manchester City Council',
    category: 'Civil engineering',
    cpvCodes: ['55520000'],
    location: 'Manchester, United Kingdom',
    country: 'uk',
    procedureType: 'Open procedure',
    deadlineDate: '15th May, 2026',
    submissionDeadlineDate: new Date(2026, 4, 15),
    baseValue: '£1,420,000',
    deadlineStatus: { type: 'closed' },
    stage: 'awarded',
    contractObjectText:
      'Framework agreement for the provision of school catering services across primary and secondary sites.',
    documents: [
      {
        title: 'Specification',
        text: 'Catering provision must meet the School Food Standards for all menu cycles.',
      },
    ],
  },
  {
    id: 't27',
    name: 'Highways resurfacing and drainage works',
    buyer: 'Leeds City Council',
    category: 'Road maintenance',
    cpvCodes: ['45233220', '45233000'],
    location: 'Leeds, United Kingdom',
    country: 'uk',
    procedureType: 'Restricted procedure',
    deadlineDate: '6th Oct, 2026',
    submissionDeadlineDate: new Date(2026, 9, 6),
    baseValue: '£2,310,000',
    deadlineStatus: { type: 'days', days: 21 },
    stage: 'active',
    contractObjectText:
      'Highways resurfacing and drainage works across the adopted road network, including footway reinstatement.',
    documents: [
      {
        title: 'Works Information',
        text: 'A performance bond of 10% of the contract sum is required before works commence.',
      },
    ],
  },
  {
    id: 't28',
    name: 'Corporate software licence renewal',
    buyer: 'Manchester City Council',
    category: 'Software licences',
    cpvCodes: ['48900000'],
    location: 'Manchester, United Kingdom',
    country: 'uk',
    procedureType: 'Open procedure',
    deadlineDate: '31st Jul, 2026',
    submissionDeadlineDate: new Date(2026, 6, 31),
    baseValue: '£680,000',
    deadlineStatus: { type: 'closed' },
    stage: 'evaluating',
    contractObjectText:
      'Renewal of corporate software licences covering productivity, finance and case management systems.',
    documents: [
      {
        title: 'Specification',
        text: 'Licence renewal must include three years of vendor support and security updates.',
      },
    ],
  },
];

type TenderResult = MockTender & {
  matchedFilters: MatchedFilterField[];
  matchedKeyword?: MatchedKeyword;
  // Display-ready, grouped by supplier — see `awardWinners` below.
  awardWinners?: AwardWinner[];
  competitorOutcome?: CompetitorOutcome;
};

const FIELD_TO_MATCHED_LABEL: Record<StructuredField, MatchedFilterField> = {
  buyer: 'Buyer',
  category: 'Category',
  cpv: 'CPV',
  'submission-deadline': 'Publication date',
  'base-price': 'Base value',
  winner: 'Winner',
  competitor: 'Competitor',
};

/** Every supplier recorded as winning at least one lot. Empty for an
 * awarded tender whose winner was never published — which is exactly the
 * case the Winner filter must never return. */
function winnersOf(tender: MockTender): string[] {
  return [...new Set(tender.award?.lots.map((lot) => lot.winner) ?? [])];
}

/** One card tag per distinct winner, that supplier's lots folded into a
 * single string — "Acme Construction · Lots 2, 3" beats the same name
 * twice. A single-lot tender gets no lot suffix at all; naming "Lot 1" when
 * there is only one lot is noise. */
function awardWinners(tender: MockTender): AwardWinner[] | undefined {
  const lots = tender.award?.lots;
  if (!lots || lots.length === 0) {
    return undefined;
  }
  return winnersOf(tender).map((supplier) => {
    const names = lots
      .filter((lot) => lot.winner === supplier && lot.lot)
      .map((lot) => lot.lot as string);
    if (names.length === 0) {
      return { supplier };
    }
    return {
      supplier,
      lots: names.length === 1 ? names[0] : `Lots ${names.map(stripLotPrefix).join(', ')}`,
    };
  });
}

/** "Lot 2" -> "2", so a grouped tag reads "Lots 1, 2" rather than "Lots Lot
 * 1, Lot 2". Falls back to the raw label if it isn't in that shape. */
function stripLotPrefix(lot: string): string {
  return lot.replace(/^Lots?\s+/i, '');
}

/** What the picked supplier actually did on this tender — shown only when a
 * Competitor row matched, because that's the row whose question it answers.
 * "Bid submitted" rather than "Lost": the records show a bid, not a defeat,
 * and on a tender with no published winner nobody is known to have lost. */
function competitorOutcomeFor(
  tender: MockTender,
  supplier: string,
): CompetitorOutcome {
  const won = tender.award?.lots.filter((lot) => lot.winner === supplier) ?? [];
  if (won.length === 0) {
    return { supplier, outcome: 'Bid submitted' };
  }
  const named = won.filter((lot) => lot.lot).map((lot) => lot.lot as string);
  if (named.length === 0) {
    return { supplier, outcome: 'Won' };
  }
  return {
    supplier,
    outcome:
      named.length === 1
        ? `Won ${named[0]}`
        : `Won Lots ${named.map(stripLotPrefix).join(', ')}`,
  };
}

const KEYWORD_TARGET_TO_MATCHED_LABEL: Record<KeywordTarget, MatchedFilterField> = {
  'contract-object': 'Contract Object',
  documents: 'Documents',
};

function tenderMatchesRow(tender: MockTender, row: FilterRowState): boolean {
  if (row.kind === 'keyword') {
    const haystack =
      row.target === 'documents'
        ? tender.documents.map((doc) => doc.text).join(' ')
        : tender.contractObjectText;
    const lower = haystack.toLowerCase();
    return row.terms.some((term) => lower.includes(term.toLowerCase()));
  }

  if (row.field === 'cpv') {
    // The build rule, applied per selected code: the tender matches that
    // code if any of its own CPVs *is* it or sits under it. "is none of"
    // inverts the whole test rather than each code, so excluding
    // "Construction work" drops every tender tagged anywhere under it.
    const inSet = row.values.some((selected) =>
      tender.cpvCodes.some((code) => isCpvOrDescendant(code, selected)),
    );
    return row.operator === 'none-of' ? !inSet : inSet;
  }

  if (row.field === 'buyer' || row.field === 'category') {
    const value = row.field === 'buyer' ? tender.buyer : tender.category;
    const inSet = row.values.includes(value);
    return row.operator === 'none-of' ? !inSet : inSet;
  }

  if (row.field === 'winner') {
    const winners = winnersOf(tender);
    // Above the operator, not inside it: a tender with no recorded winner
    // isn't a tender the picked supplier failed to win, it's one we know
    // nothing about — so "is none of" must not sweep it in either.
    if (winners.length === 0) {
      return false;
    }
    const inSet = row.values.some((value) => winners.includes(value));
    return row.operator === 'none-of' ? !inSet : inSet;
  }

  if (row.field === 'competitor') {
    // `null` (no bidder list published) and `[]` both mean there is nothing
    // to match against. No negation here by design — see the operator
    // comment in dynamic-filter-rows.tsx.
    const bidders = tender.award?.bidders;
    if (!bidders || bidders.length === 0) {
      return false;
    }
    return row.values.some((value) => bidders.includes(value));
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

/** Orb + status line + adaptive stagger — chosen after prototyping three
 * loading-pacing directions, then two status-line treatments (plain vs.
 * this one), on the "Loading pacing" specimen tab. `previousCount` sizes
 * the skeleton to the last known result count (capped) rather than a fixed
 * number, so a 3-result search and a 480-result one don't show the same
 * three placeholder rows. `phraseIndex` drives the status line
 * (see usePhraseSequence above) — it steps through the sequence once and
 * holds on the last phrase, so a genuinely slow request reads as "almost
 * there" rather than restarting its own narration. The text shimmers
 * (`shimmerStyles.shimmer` folded into CrossfadeText's className — an
 * alpha mask, not a background-clip gradient, so it isn't fighting
 * `text-text-sub-600` for the `color` property) continuously, independent
 * of and on top of the crossfade that still plays on every phrase change. */
function LoadingResults({
  previousCount,
  phraseIndex,
}: {
  previousCount: number;
  phraseIndex: number;
}) {
  const visibleRows = Math.min(Math.max(previousCount, 1), SKELETON_MAX_VISIBLE_ROWS);
  const overflow = previousCount - visibleRows;

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex min-h-5 items-center gap-2 px-0.5'>
        <Orb />
        <CrossfadeText
          text={STATUS_PHRASES[phraseIndex]}
          className={cn('text-label-sm text-text-sub-600', shimmerStyles.shimmer)}
        />
      </div>
      {Array.from({ length: visibleRows }).map((_, i) => (
        <div
          key={i}
          className='motion-safe:animate-fade-in-up motion-reduce:animate-fade-in'
          style={{
            animationDelay: `${SKELETON_STAGGER_START_MS + Math.min(i, SKELETON_STAGGER_CAP) * SKELETON_STAGGER_STEP_MS}ms`,
          }}
        >
          <ResultCardSkeleton />
        </div>
      ))}
      {overflow > 0 ? (
        <p
          className='motion-safe:animate-fade-in motion-reduce:animate-fade-in px-1 text-paragraph-xs text-text-soft-400'
          style={{ animationDelay: `${SKELETON_STAGGER_START_MS + 250}ms` }}
        >
          Loading {overflow.toLocaleString('en-US')} more…
        </p>
      ) : null}
    </div>
  );
}

// [confirmed] Names the stage actually being viewed — the prototype this
// spec replaces hardcoded "no active tenders" on every stage, which reads
// as wrong the moment someone is looking at Evaluating or Awarded.
function NothingFound({
  stage,
  onClearAll,
}: {
  stage: Stage;
  onClearAll: () => void;
}) {
  return (
    <EmptyState
      icon={RiRadarLine}
      title={`No ${STAGE_LABELS[stage].toLowerCase()} tenders match your search`}
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

/** Structural equality for one row. `rows !== appliedRows` alone is
 * reference identity, so any edit marks the panel dirty forever — including
 * an edit the user hand-undoes back to where they started, which then shows
 * a phantom "1 unapplied change" beside an enabled Search that does nothing.
 * Rows are small and there are at most 10, so a field-by-field compare is
 * cheaper than the bug. */
function rowEquals(a: FilterRowState, b: FilterRowState): boolean {
  if (a.kind !== b.kind || a.id !== b.id) {
    return false;
  }
  if (a.kind === 'keyword' && b.kind === 'keyword') {
    return (
      a.target === b.target &&
      a.terms.length === b.terms.length &&
      a.terms.every((term, i) => term === b.terms[i])
    );
  }
  if (a.kind === 'structured' && b.kind === 'structured') {
    return (
      a.field === b.field &&
      a.operator === b.operator &&
      a.priceFrom === b.priceFrom &&
      a.priceTo === b.priceTo &&
      a.dateFrom?.getTime() === b.dateFrom?.getTime() &&
      a.dateTo?.getTime() === b.dateTo?.getTime() &&
      a.values.length === b.values.length &&
      a.values.every((value, i) => value === b.values[i])
    );
  }
  return false;
}

/** How many unsearched edits the user has made. One per changed setting,
 * plus one per condition added, removed or edited — which is what makes the
 * number track what they did rather than how the state is stored: adding
 * three filters reads "3 unapplied changes", and removing one of them reads
 * "2", not "4".
 *
 * Unconfigured rows are skipped. Pressing "Add filter" isn't yet a change to
 * the search, and counting it would make the number tick up before there is
 * anything to search for. */
function countUnappliedChanges(
  pending: {
    query: string;
    savedOnly: boolean;
    stage: Stage;
    country: CountryCode;
    matchMode: MatchMode;
    rows: FilterRowState[];
  },
  applied: typeof pending,
): number {
  let count = 0;
  if (pending.query !== applied.query) count += 1;
  if (pending.savedOnly !== applied.savedOnly) count += 1;
  if (pending.stage !== applied.stage) count += 1;
  if (pending.country !== applied.country) count += 1;
  if (pending.matchMode !== applied.matchMode) count += 1;

  const pendingRows = pending.rows.filter(isRowConfigured);
  const appliedRows = applied.rows.filter(isRowConfigured);
  const appliedById = new Map(appliedRows.map((row) => [row.id, row]));

  for (const row of pendingRows) {
    const previous = appliedById.get(row.id);
    // Added, or edited since the last search.
    if (!previous || !rowEquals(row, previous)) count += 1;
  }
  // Removed, or edited down to nothing.
  const pendingIds = new Set(pendingRows.map((row) => row.id));
  for (const row of appliedRows) {
    if (!pendingIds.has(row.id)) count += 1;
  }

  return count;
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
      createStructuredRow('cpv'),
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
  const [country, setCountry] = React.useState<CountryCode>('pt');
  const [appliedCountry, setAppliedCountry] = React.useState<CountryCode>('pt');
  const [matchMode, setMatchMode] = React.useState<MatchMode>('all');
  const [appliedMatchMode, setAppliedMatchMode] = React.useState<MatchMode>('all');
  const [views, setViews] = React.useState<string[]>(VIEWS);
  const [currentView, setCurrentView] = React.useState<string>(VIEWS[1]);
  const [viewSearch, setViewSearch] = React.useState('');
  const [isPanelExpanded, setIsPanelExpanded] = React.useState(true);
  // Set when the user clicks a chip body; DynamicFilterRows focuses that
  // row's field trigger and calls back to clear it, so clicking the same
  // chip a second time works.
  const [focusRowId, setFocusRowId] = React.useState<string | undefined>();
  // Same idea for the merged CPV chip, except it opens that row's *value*
  // picker rather than focusing the row: the chip is a summary of picked
  // codes, so clicking it should land on the list of picked codes.
  const [openPickerRowId, setOpenPickerRowId] = React.useState<string | undefined>();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const editSearchRef = React.useRef<HTMLButtonElement>(null);
  const isFirstPanelRender = React.useRef(true);
  // Snapshot of the result count from *before* the in-flight search — kept
  // frozen for the entire loading + minimum-visible-duration window so the
  // skeleton's row count can't jump right as `results` recomputes to the new
  // (already-applied) count a beat before the floor timer lets it disappear.
  const previousResultCountRef = React.useRef(0);

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
      // Unless the expand was a chip click asking to edit one condition —
      // then the row owns focus. DynamicFilterRows' effect runs first (it's
      // the deeper node), so without this check the search input would take
      // focus straight back off the row the user actually asked for.
      if (!focusRowId) {
        searchInputRef.current?.focus();
      }
    } else {
      editSearchRef.current?.focus();
    }
    // focusRowId is read, not tracked: this effect is about the panel
    // opening or closing, and re-running it when focus lands (which clears
    // focusRowId) would immediately yank focus to the search input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPanelExpanded]);

  const unappliedCount = countUnappliedChanges(
    { query: searchValue, savedOnly, stage, country, matchMode, rows },
    {
      query: appliedQuery,
      savedOnly: appliedSavedOnly,
      stage: appliedStage,
      country: appliedCountry,
      matchMode: appliedMatchMode,
      rows: appliedRows,
    },
  );
  // Derived from the count rather than compared separately, so the button
  // and the number can never disagree. Note this also means adding an empty
  // filter row doesn't enable Search: there is nothing new to search for
  // until you pick a value.
  const dirty = unappliedCount > 0;

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
      setAppliedCountry(country);
      setAppliedMatchMode(matchMode);
      setIsSearching(false);
    }, 500);
  }, [searchValue, savedOnly, rows, stage, country, matchMode]);

  // Pending only. Deferred-apply is an all-or-nothing contract: if Clear all
  // wiped the results while every other edit waited for Search, the user
  // could no longer trust that nothing moves until they press it. The
  // cleared configuration shows up as unapplied changes like anything else,
  // and Search applies it.
  const handleClearAll = React.useCallback(() => {
    setSearchValue('');
    setSavedOnly(false);
    setStage('active');
    setRows([]);
    setMatchMode('all');
    // Country is deliberately left alone: "Clear all" resets the criteria
    // you built, not which market you're looking at. Snapping back to
    // Portugal would empty a Spanish user's results for no reason they
    // asked for.
  }, []);

  // Expanding the panel and opening a popover in the same frame anchors it
  // against a container that's still mid-collapse (AccordionRow animates
  // grid-template-rows over GRID_MS), so the picker lands visibly off its
  // trigger and doesn't follow it. Waiting the animation out only when the
  // panel was actually closed keeps the already-open case instant.
  // Stable identity: DynamicFilterRows passes it straight into an effect's
  // dependency list, and a fresh closure every render would re-run it.
  const handleOpenPickerHandled = React.useCallback(
    () => setOpenPickerRowId(undefined),
    [],
  );

  const openCpvPicker = React.useCallback(
    (rowId: string) => {
      if (isPanelExpanded) {
        setOpenPickerRowId(rowId);
        return;
      }
      setIsPanelExpanded(true);
      window.setTimeout(() => setOpenPickerRowId(rowId), GRID_MS);
    },
    [isPanelExpanded],
  );

  // Stage and country both decide which filters can exist at all (Winner
  // and Competitor are Awarded-only and country-gated, see
  // `isFilterTypeAvailable`), so changing either can strand a row the user
  // already configured. One handler for both: the rule, the removal and the
  // message are identical, only the reason differs.
  //
  // Rows are dropped rather than left disabled. A disabled row is a promise
  // the panel can't keep — there's nothing to unlock and no way to make the
  // data exist — so it would just sit there taking space and adding doubt
  // about whether it's still affecting results.
  const changeSearchContext = React.useCallback(
    (next: { stage?: Stage; country?: CountryCode }) => {
      const nextStage = next.stage ?? stage;
      const nextCountry = next.country ?? country;
      setStage(nextStage);
      setCountry(nextCountry);

      const dropped = rows.filter(
        (row) => !isRowAvailable(row, nextStage, nextCountry),
      );
      if (dropped.length === 0) {
        return;
      }

      const previousRows = rows;
      const previousStage = stage;
      const previousCountry = country;
      setRows(rows.filter((row) => isRowAvailable(row, nextStage, nextCountry)));

      // Names the reason the user actually acted on. After a country switch
      // that's the country; after a stage switch it's the tab, and "removed
      // 1 filter unavailable in Portugal" would be simply untrue there.
      const reason = next.country
        ? `in ${COUNTRIES[nextCountry].label}`
        : `on the ${STAGE_LABELS[nextStage]} tab`;

      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status='information'
            size='xsmall'
            message={`Removed ${dropped.length} ${
              dropped.length === 1 ? 'filter' : 'filters'
            } unavailable ${reason}: ${dropped.map(describeRow).join(', ')}.`}
            icon={RiInformationFill}
            action={{
              label: 'Undo',
              onClick: () => {
                // Restores the rows *and* the context they were valid in.
                // Putting the rows back alone would drop them again on the
                // next render, which reads as Undo doing nothing.
                setRows(previousRows);
                setStage(previousStage);
                setCountry(previousCountry);
                toast.dismiss(t);
              },
            }}
          />
        ),
        { duration: 5000 },
      );
    },
    [rows, stage, country],
  );

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
    setCountry(appliedCountry);
    setMatchMode(appliedMatchMode);
  }, [
    appliedQuery,
    appliedSavedOnly,
    appliedRows,
    appliedStage,
    appliedCountry,
    appliedMatchMode,
  ]);

  const toggleSave = React.useCallback((id: string, name: string) => {
    let wasSaved = false;
    setSavedIds((prev) => {
      wasSaved = prev.has(id);
      const next = new Set(prev);
      if (wasSaved) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    if (!wasSaved) {
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
  }, []);

  // The DialKit demo of the dropped-filter toast, kept so the state is
  // reachable without building a filter first. The real path is
  // changeSearchContext above, which produces the same toast from actual
  // state — this one's country and filter are canned.
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

  const isLoadingRaw = isSearching || forceState === 'searching';
  const showLoading = useMinimumVisibleDuration(isLoadingRaw, FIXED_FLOOR_MS);
  // Driven by `showLoading` (the floored, visible signal), not the raw
  // request state — the status line should keep narrating for the entire
  // time it's on screen, not stop early just because a fast backend already
  // answered underneath it.
  const phraseIndex = usePhraseSequence(showLoading, STATUS_PHRASES.length, PHRASE_MS);

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
    if (tender.country !== appliedCountry) {
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
    let competitorOutcome: CompetitorOutcome | undefined;

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
        if (row.field === 'competitor' && !competitorOutcome) {
          // The first picked supplier this tender actually recorded a bid
          // from — with several picked, showing one outcome per row keeps
          // the card readable, and it's the row's own question being
          // answered, not a full bidder list.
          const bidders = tender.award?.bidders ?? [];
          const supplier = row.values.find((value) => bidders.includes(value));
          if (supplier) {
            competitorOutcome = competitorOutcomeFor(tender, supplier);
          }
        }
      }
    }

    return {
      ...tender,
      matchedFilters,
      matchedKeyword,
      awardWinners: awardWinners(tender),
      competitorOutcome,
    };
  }

  const results = TENDERS.map(evaluateTender).filter(
    (tender): tender is TenderResult => tender !== null,
  );

  const sortedResults = sortTenders(results, sort);

  if (!showLoading) {
    previousResultCountRef.current = results.length;
  }

  // Built from pending state, in the same order the panel above reads:
  // lookup text, saved-only, then one chip per configured condition. These
  // describe the search being prepared, not the results on screen — which is
  // the whole point of the unapplied-changes count next to Search.
  //
  // The query and saved-only chips get no onEdit: their controls are right
  // there in the toolbar, and a chip that looks clickable but goes nowhere
  // is worse than one that plainly doesn't.
  //
  // CPV gets one chip holding every picked code, rather than one chip per
  // code: a CPV search is routinely ten codes deep, and ten chips would
  // bury every other condition in the bar. There's exactly one CPV row to
  // read it from — see `fieldsAvailableToRow` — so this is a different
  // *label* for that row's chip, not a merge across rows. Clicking it opens
  // the picker, which is the only place the full list (and the per-code
  // remove) fits.
  const configuredPendingRows = rows.filter(isRowConfigured);

  const chips: FilterChip[] = [
    searchValue
      ? {
          id: 'q',
          label: `"${searchValue}"`,
          onRemove: () => setSearchValue(''),
        }
      : null,
    savedOnly
      ? {
          id: 'saved',
          label: 'Saved only',
          onRemove: () => setSavedOnly(false),
        }
      : null,
    ...configuredPendingRows.map((row) => ({
      id: row.id,
      // describeRow already gives CPV its own compact "CPV: a, b +3" form.
      label: describeRow(row),
      onRemove: () => setRows((prev) => prev.filter((other) => other.id !== row.id)),
      // CPV opens straight into its picker, where the codes actually live;
      // every other field puts you on its row.
      onEdit:
        row.kind === 'structured' && row.field === 'cpv'
          ? () => openCpvPicker(row.id)
          : () => {
              setIsPanelExpanded(true);
              setFocusRowId(row.id);
            },
    })),
  ].filter((chip): chip is FilterChip => chip !== null);

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
  // One predicate, never a matrix of panel states: `impossibleRowReason`
  // owns the whole definition of "this can never match" and returns the
  // wording with it. Caps and duplicate-row notes deliberately aren't in
  // there — those searches run and return correct results (see the decision
  // rule above FilterPanelHint in filter-panel.tsx).
  const impossibleReason =
    forceState === 'filter-error' ? undefined : impossibleRowReason(rows);
  const canSearch = dirty && !impossibleReason && !isSearching;

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
        <AccordionRow open={isPanelExpanded}>
          <FilterPanel
            searchInputRef={searchInputRef}
            onSearch={handleSearch}
            onClearAll={handleClearAll}
            searchDisabled={!canSearch}
            isSearching={isSearching}
            unappliedCount={unappliedCount}
            onCollapse={() => setIsPanelExpanded(false)}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearchSubmit={canSearch ? handleSearch : undefined}
            savedOnly={savedOnly}
            onSavedOnlyChange={setSavedOnly}
            stage={stage}
            onStageChange={(next) => changeSearchContext({ stage: next })}
            country={country}
            onCountryChange={(next) => changeSearchContext({ country: next })}
            matchMode={matchMode}
            onMatchModeChange={setMatchMode}
            isEmpty={rows.length === 0}
            disableAddFilter={atStructuredCap || atTotalCap}
            disableAddKeyword={atKeywordCap || atTotalCap}
            onAddFilter={() => setRows((prev) => [...prev, createStructuredRow()])}
            onAddKeyword={() => setRows((prev) => [...prev, createKeywordRow()])}
            hint={
              forceState === 'filter-error' || impossibleReason
                ? {
                    tone: 'error',
                    message:
                      impossibleReason ??
                      'Base Price: the lower bound is above the upper bound, so this can never match.',
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
                  : undefined
            }
          >
            {forceState === 'filter-error' ? (
              <ErrorMockRows />
            ) : (
              <DynamicFilterRows
                rows={rows}
                onChange={setRows}
                availableFields={availableFilterTypes(stage, country)}
                matchMode={matchMode}
                focusRowId={focusRowId}
                onFocusRowHandled={() => setFocusRowId(undefined)}
                openPickerRowId={openPickerRowId}
                onOpenPickerHandled={handleOpenPickerHandled}
              />
            )}
          </FilterPanel>
        </AccordionRow>

        <AccordionRow open={!isPanelExpanded}>
          <CollapsedFilterPanel
            ref={editSearchRef}
            summary={searchValue || undefined}
            onEditSearch={() => setIsPanelExpanded(true)}
            unappliedCount={unappliedCount}
            onSearch={canSearch ? handleSearch : undefined}
            isSearching={isSearching}
          />
        </AccordionRow>

        <FilterChips chips={chips} matchMode={matchMode} />
      </div>

      {/* ResultsSummary lives with the cards it captions, not with the
          panel above it — it's describing "5 active tenders..." for the
          list right below, so proximity should point down, not up. Sharing
          this group's gap-4 with the cards (was gap-3) also gives these
          content-rich cards a touch more breathing room than a dense
          table row gets. */}
      <div className='flex flex-col gap-4 px-8 pb-8'>
        {showLoading ? null : (
          // Index 0 of the same cascade the cards below join — fade-in-up,
          // not a plain fade, so it rises exactly like they do instead of
          // mixing two motion vocabularies for two things landing back to
          // back. Chosen after prototyping three directions (this matched
          // stagger, a header-leads two-beat version, and a blur-masked
          // handoff) on the "Ready results" specimen tab — this one reuses
          // the skeleton's own established cadence (SKELETON_STAGGER_STEP_MS
          // / SKELETON_STAGGER_CAP below) rather than introducing a new one.
          <div className='motion-safe:animate-fade-in-up motion-reduce:animate-fade-in'>
            <ResultsSummary
              count={results.length}
              stage={appliedStage}
              country={COUNTRIES[appliedCountry].label}
              sort={sort}
              onSortChange={setSort}
              currentView={currentView}
              onExitView={handleExitView}
            />
          </div>
        )}

        {showLoading ? (
          <LoadingResults
            previousCount={previousResultCountRef.current}
            phraseIndex={phraseIndex}
          />
        ) : showNothingFound ? (
          <NothingFound stage={appliedStage} onClearAll={handleClearAll} />
        ) : (
          sortedResults.map((tender, i) => (
            // Cards start at index+1 (50ms), not 0 — the header already
            // took index 0, so nothing shares its frame and the whole
            // block reads as one continuous cascade rather than the header
            // and the first card popping in together.
            <div
              key={tender.id}
              className='motion-safe:animate-fade-in-up motion-reduce:animate-fade-in'
              style={{
                animationDelay: `${Math.min(i + 1, SKELETON_STAGGER_CAP) * SKELETON_STAGGER_STEP_MS}ms`,
              }}
            >
              <TenderResultCard
                name={tender.name}
                buyer={tender.buyer}
                location={tender.location}
                countryFlag={COUNTRIES[tender.country].flag}
                procedureType={tender.procedureType}
                deadlineDate={tender.deadlineDate}
                baseValue={tender.baseValue}
                deadlineStatus={tender.deadlineStatus}
                award={tender.awardWinners}
                competitorOutcome={tender.competitorOutcome}
                matchedFilters={tender.matchedFilters}
                matchedKeyword={tender.matchedKeyword}
                saved={savedIds.has(tender.id)}
                onToggleSave={() => toggleSave(tender.id, tender.name)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
