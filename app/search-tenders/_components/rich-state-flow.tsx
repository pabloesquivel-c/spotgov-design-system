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
// pickers actually edit that row, and the X removes it.
//
// Simplification for this first pass: the stage tabs and country select
// stay presentational (reused as-is from ToolbarRow), and row edits apply
// immediately rather than joining the pending/applied Search mechanic —
// only the search query and "Saved only" drive that today. "Awarded
// locked" is shown as a banner rather than wired onto the stage tab itself.
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

import * as React from 'react';
import {
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiGlobalLine,
  RiInformationFill,
  RiLockLine,
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
} from './dynamic-filter-rows';
import { ErrorMockRows } from './filter-panel-states';
import { AccordionRow, CollapsedFilterPanel, FilterPanel } from './filter-panel';
import type { ForceStateId } from './flows';
import { PageHeader } from './page-header';
import { ResultsSummary, type SortValue } from './results-summary';
import type { Stage } from './toolbar-row';
import {
  TenderResultCard,
  type DeadlineStatus,
  type MatchedFilterField,
} from './tender-result-card';
import { VIEWS } from './views-picker';

function baseValueNumber(value: string): number {
  return Number(value.replace(/[^0-9.-]/g, '')) || 0;
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
  location: string;
  countryFlag: string;
  procedureType: string;
  deadlineDate: string;
  baseValue: string;
  deadlineStatus: DeadlineStatus;
  matchedFilters: MatchedFilterField[];
};

const TENDERS: MockTender[] = [
  {
    id: 't1',
    name: 'Aquisição de mobiliário escolar para as escolas básicas do concelho',
    buyer: 'Direção-Geral dos Estabelecimentos Escolares',
    location: 'Lisbon, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Concurso público',
    deadlineDate: '24th Sept, 2026',
    baseValue: '€2,450,000',
    deadlineStatus: { type: 'days', days: 9 },
    matchedFilters: ['Category', 'Location', 'Base value'],
  },
  {
    id: 't2',
    name: 'Reabilitação de pavimento e sinalização rodoviária na Avenida Central',
    buyer: 'Câmara Municipal de Sintra',
    location: 'Sintra, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Ajuste direto',
    deadlineDate: '16th Sept, 2026',
    baseValue: '€185,000',
    deadlineStatus: { type: 'tomorrow' },
    matchedFilters: ['Category', 'Procedure type', 'Publication date', 'Buyer'],
  },
  {
    id: 't3',
    name: 'Manutenção de elevadores em edifícios públicos',
    buyer: 'Infraestruturas de Portugal',
    location: 'Porto, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Concurso público',
    deadlineDate: '15th Sept, 2026',
    baseValue: '€96,000',
    deadlineStatus: { type: 'today' },
    matchedFilters: ['Category'],
  },
  {
    id: 't4',
    name: 'Fornecimento de equipamento informático para serviços administrativos',
    buyer: 'Universidade de Coimbra',
    location: 'Coimbra, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Concurso público',
    deadlineDate: '2nd Aug, 2026',
    baseValue: '€412,000',
    deadlineStatus: { type: 'closed' },
    matchedFilters: ['Category', 'Base value'],
  },
  {
    id: 't5',
    name: 'Apoio jurídico especializado em contratação pública',
    buyer: 'Município do Porto',
    location: 'Porto, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Consulta prévia',
    deadlineDate: '—',
    baseValue: '€58,000',
    deadlineStatus: { type: 'unavailable' },
    matchedFilters: [],
  },
];

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

function AwardedLockedNote() {
  return (
    <div className='mx-8 flex items-center gap-2 rounded-lg border border-stroke-soft-200 bg-bg-weak-50 px-3 py-2 text-paragraph-xs text-text-sub-600'>
      <RiLockLine className='size-4 shrink-0' />
      Awarded is available only with Market Intelligence — contact your admin
      to unlock it.
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
  // configurations) — this proves the interaction (name collision handling,
  // becoming the current view, confirmation) rather than real persistence.
  const handleSaveAsNewView = React.useCallback(() => {
    let name = 'New view';
    let suffix = 2;
    while (views.includes(name)) {
      name = `New view ${suffix}`;
      suffix += 1;
    }
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
  }, [views]);

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

  const results = TENDERS.filter((t) => {
    if (appliedSavedOnly && !savedIds.has(t.id)) {
      return false;
    }
    if (
      appliedQuery &&
      !`${t.name} ${t.buyer}`.toLowerCase().includes(appliedQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

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

        <AccordionRow open={!isPanelExpanded}>
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

      {forceState === 'locked' ? <AwardedLockedNote /> : null}

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
              {...tender}
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
