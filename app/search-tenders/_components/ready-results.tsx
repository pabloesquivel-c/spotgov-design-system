'use client';

// The "Ready results" specimen tab: how the header + result cards land once
// loading finishes. Replaced the previous hard, un-animated conditional
// swap (`{showLoading ? null : <ResultsToolbar .../>}` and a plain
// `sortedResults.map(...)`) that read as a regression right after the
// orb/shimmer loading sequence's own polish — an /animate escalation
// trigger on its own ("everything-at-once entrance where a 30-80ms stagger
// belongs").
//
// Started as three directions (this matched stagger, a header-leads
// two-beat version, and a blur-masked handoff); this one was the decision —
// reusing the skeleton's own established tokens (fade-in-up/fade-in, its
// 50ms stagger step capped at 4, cubic-bezier(0.23, 1, 0.32, 1)) rather
// than inventing a new motion language for the handoff. The other two were
// torn down rather than left to go stale — same precedent as the earlier
// "Panel Animation" specimen. Wired into the real flow in
// rich-state-flow.tsx (the block right after `{showLoading ? ... :}`);
// this tab stays as the isolated place to keep tuning the reveal itself.

import * as React from 'react';

import * as Button from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { Orb } from './orb';
import { ResultsToolbar } from './results-toolbar';
import shimmerStyles from './shimmer-text.module.css';
import { Specimen } from './specimen';
import { TenderResultCard, type TenderResultCardProps } from './tender-result-card';

const LOAD_MS = 1400;

const MOCK_RESULTS: TenderResultCardProps[] = [
  {
    name: 'Construção de um novo pavilhão polidesportivo municipal',
    buyer: 'Município de Lisboa',
    location: 'Lisbon, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Concurso público',
    deadlineDate: '24th Sept, 2026',
    baseValue: '€2,450,000',
    deadlineStatus: { type: 'days', days: 9 },
    matchedFilters: ['Category', 'Base value'],
  },
  {
    name: 'Manutenção de elevadores em edifícios públicos',
    buyer: 'Câmara Municipal de Sintra',
    location: 'Sintra, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Concurso público',
    deadlineDate: '15th Sept, 2026',
    baseValue: '€96,000',
    deadlineStatus: { type: 'today' },
    matchedFilters: ['Location'],
  },
  {
    name: 'Substituição da rede elétrica interna e iluminação pública',
    buyer: 'Câmara Municipal de Sintra',
    location: 'Sintra, Portugal',
    countryFlag: '🇵🇹',
    procedureType: 'Concurso público',
    deadlineDate: '15th Sept, 2026',
    baseValue: '€650,000',
    deadlineStatus: { type: 'today' },
    matchedFilters: ['Category', 'Publication date'],
  },
];

function ResultCardSkeleton() {
  return (
    <div className='flex w-full items-start gap-4 rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3 pb-3 pt-2.5 shadow-regular-xs'>
      <div className='flex min-w-0 flex-1 flex-col gap-1.5'>
        <div className='h-4 w-4/5 animate-pulse rounded-md bg-bg-weak-50' />
        <div className='h-4 w-2/5 animate-pulse rounded-md bg-bg-weak-50' />
      </div>
      <div className='h-6 w-24 shrink-0 animate-pulse rounded-md bg-bg-weak-50' />
    </div>
  );
}

/** The loading precursor, matching rich-state-flow.tsx's real LoadingResults
 * (orb + shimmering label + skeleton rows) so this demo's reveal is judged
 * against the same run-up it'll actually follow. */
function LoadingPreview() {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex min-h-5 items-center gap-2'>
        <Orb />
        <span className={cn(shimmerStyles.shimmer, 'text-label-sm text-text-sub-600')}>
          Looking through tenders…
        </span>
      </div>
      {[0, 1, 2].map((i) => (
        <ResultCardSkeleton key={i} />
      ))}
    </div>
  );
}

type RunState = { status: 'idle' | 'loading' | 'done'; runId: number };

function useFixedRun(loadMs: number) {
  const [state, setState] = React.useState<RunState>({ status: 'idle', runId: 0 });

  const run = React.useCallback(() => {
    setState((prev) => {
      const runId = prev.runId + 1;
      window.setTimeout(() => {
        setState((current) =>
          current.runId === runId ? { ...current, status: 'done' } : current,
        );
      }, loadMs);
      return { status: 'loading', runId };
    });
  }, [loadMs]);

  return { state, run };
}

function DemoFrame({ children }: { children: React.ReactNode }) {
  // justify-start, not justify-center: the skeleton (3 plain rows) and the
  // real content (header + 3 fuller cards) aren't the same height, and
  // centering a min-height box recenters the whole block the instant that
  // height changes — a repositioning snap racing the fade-in, on top of it.
  // Real usage (rich-state-flow.tsx) just flows top-down with no such box,
  // so centering here was a prototype artifact, not something to preserve.
  return (
    <div className='flex min-h-[340px] w-full flex-col justify-start gap-3 rounded-2xl border border-stroke-soft-200 bg-bg-weak-50 p-4'>
      {children}
    </div>
  );
}

function RunButton({ onRun, loading }: { onRun: () => void; loading: boolean }) {
  return (
    <Button.Root
      variant='neutral'
      mode='stroke'
      size='small'
      className='h-9 w-fit'
      disabled={loading}
      onClick={onRun}
    >
      Run search
    </Button.Root>
  );
}

function EmptyHint() {
  return (
    <div className='flex flex-1 items-center justify-center py-16'>
      <p className='text-paragraph-sm text-text-soft-400'>
        Click “Run search” to preview this reveal
      </p>
    </div>
  );
}

// Matched stagger: header and cards fade-in-up on one shared cascade — the
// header is index 0 (0ms), cards start at index+1, all 50ms apart and
// capped after the 4th (SKELETON_STAGGER_STEP_MS/SKELETON_STAGGER_CAP in
// rich-state-flow.tsx). One motion vocabulary for every element (all rise,
// none just fades in place) and nothing shares a frame, so it reads as a
// single continuous cascade rather than the header and first card popping
// in together.
function MatchedStaggerDemo() {
  const { state, run } = useFixedRun(LOAD_MS);

  return (
    <div className='flex flex-col gap-4'>
      <RunButton onRun={run} loading={state.status === 'loading'} />
      <DemoFrame>
        {state.status === 'idle' ? (
          <EmptyHint />
        ) : state.status === 'loading' ? (
          <LoadingPreview />
        ) : (
          <div key={state.runId} className='flex flex-col gap-4'>
            <div
              className='motion-safe:animate-fade-in-up motion-reduce:animate-fade-in'
              style={{ animationDelay: '0ms' }}
            >
              <ResultsToolbar />
            </div>
            <div className='flex flex-col gap-3'>
              {MOCK_RESULTS.map((card, i) => (
                <div
                  key={card.name}
                  className='motion-safe:animate-fade-in-up motion-reduce:animate-fade-in'
                  style={{ animationDelay: `${Math.min(i + 1, 4) * 50}ms` }}
                >
                  <TenderResultCard {...card} />
                </div>
              ))}
            </div>
          </div>
        )}
      </DemoFrame>
    </div>
  );
}

export function ReadyResults() {
  return (
    <Specimen
      title='Matched stagger'
      description='Header and cards fade-in-up on one shared cascade — the header is index 0 (0ms), cards start at index+1, all 50ms apart and capped after the 4th, the exact cadence LoadingResults already uses for the skeleton. One motion vocabulary for every element (all rise, none just fades in place) and nothing shares a frame, so it reads as a single continuous cascade rather than the header and first card popping in together. Wired into the real flow in rich-state-flow.tsx.'
    >
      <MatchedStaggerDemo />
    </Specimen>
  );
}
