'use client';

// The "Loading pacing" specimen tab: holds the results area at a fixed
// *minimum* duration — long enough to read as real work, per the "LLM
// thinking tokens" reference — instead of resolving the instant a response
// is ready. Went through two rounds of trimming: first among three pacing
// mechanisms (a sequential filter checklist, a status line, a settling
// number ticker), then between two status-line treatments (plain text vs.
// this one, with a lattice orb and a shimmer). Each losing direction was
// torn down rather than left to go stale — same precedent as the earlier
// "Panel Animation" specimen. Wired into the real flow as
// rich-state-flow.tsx's `LoadingResults`; this tab stays as the isolated
// place to keep tuning the pacing itself. The phrases, the pacing
// constants and the crossfade all live in loading-status.tsx, which
// this tab and the real flow both import — so a change made here is a
// change to the page. Run it against three backend
// speeds (instant/typical/slow): the fixed floor should make instant and
// typical feel identical, and slow should extend gracefully past the
// floor, holding on the last phrase rather than looping back to the first
// once it runs out.

import * as React from 'react';
import { RiCheckboxCircleFill } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import { cn } from '@/utils/cn';
import {
  CrossfadeText,
  CROSSFADE_MS,
  FIXED_FLOOR_MS,
  PHRASE_MS,
  STATUS_PHRASES,
  usePhraseSequence,
} from './loading-status';
import { Orb } from './orb';
import shimmerStyles from './shimmer-text.module.css';
import { Specimen } from './specimen';

const SCENARIOS = {
  instant: { label: 'Instant backend (80ms)', backendMs: 80 },
  typical: { label: 'Typical backend (600ms)', backendMs: 600 },
  // Comfortably past the floor (4500ms) so the "held on the last phrase"
  // tail gets real screen time.
  slow: { label: 'Slow backend (6000ms)', backendMs: 6000 },
} as const;
type ScenarioId = keyof typeof SCENARIOS;

type RunState = {
  status: 'idle' | 'loading' | 'done';
  scenario: ScenarioId;
  runId: number;
};

/** Resolves at `max(backendMs, FIXED_FLOOR_MS)` — the floor never cuts a
 * slow backend short, it only ever holds a fast one longer. */
function useFixedFloorSearch() {
  const [state, setState] = React.useState<RunState>({
    status: 'idle',
    scenario: 'typical',
    runId: 0,
  });

  const run = React.useCallback((scenario: ScenarioId) => {
    setState((prev) => {
      const runId = prev.runId + 1;
      const totalMs = Math.max(SCENARIOS[scenario].backendMs, FIXED_FLOOR_MS);
      window.setTimeout(() => {
        setState((current) =>
          current.runId === runId ? { ...current, status: 'done' } : current,
        );
      }, totalMs);
      return { status: 'loading', scenario, runId };
    });
  }, []);

  return { state, run };
}

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

function EmptyHint() {
  return (
    <div className='flex flex-1 items-center justify-center py-16'>
      <p className='text-paragraph-sm text-text-sub-600'>
        Click “Run” to preview this pacing
      </p>
    </div>
  );
}

function DemoFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-[220px] w-full flex-col justify-center gap-3 rounded-2xl border border-stroke-soft-200 bg-bg-weak-50 p-4'>
      {children}
    </div>
  );
}

function ScenarioButtons({
  onRun,
  disabled,
}: {
  onRun: (scenario: ScenarioId) => void;
  disabled: boolean;
}) {
  return (
    <div className='flex flex-wrap items-center gap-2'>
      {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
        <Button.Root
          key={id}
          variant='neutral'
          mode='stroke'
          size='small'
          className='h-9'
          disabled={disabled}
          onClick={() => onRun(id)}
        >
          Run — {SCENARIOS[id].label}
        </Button.Root>
      ))}
    </div>
  );
}

function ResolvedRow() {
  return (
    <div className='motion-safe:animate-fade-in-up motion-reduce:animate-fade-in flex w-full items-center justify-between rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3 py-2.5 shadow-regular-xs'>
      <p className='text-label-sm text-text-strong-950'>
        Construção de um novo pavilhão polidesportivo municipal
      </p>
      <RiCheckboxCircleFill className='size-4 shrink-0 text-success-base' />
    </div>
  );
}

// Status line: the closest analog to an LLM's streamed "thinking" tokens —
// a lattice orb (nine dots, a wave radiating from the centre) plus a single
// line stepping through what it's plausibly doing right now, sitting above
// the skeleton. Deliberately doesn't loop back to the first phrase once it
// reaches the last one: repeating "Looking through tenders…" after "Almost
// there…" read as the search restarting, which undercuts the one thing
// this line exists to communicate.

// A lattice orb (nine dots pulsing outward from the centre) standing in for
// the icon a caption like this usually lacks — pure CSS, no dependency; see
// orb.tsx for the source and its reduced-motion fallback (the centre dot
// alone, static).
function StatusLineDemo() {
  const { state, run } = useFixedFloorSearch();
  const phraseIndex = usePhraseSequence(
    state.status === 'loading',
    STATUS_PHRASES.length,
    PHRASE_MS,
  );

  return (
    <div className='flex flex-col gap-4'>
      <ScenarioButtons onRun={run} disabled={state.status === 'loading'} />
      <DemoFrame>
        {state.status === 'idle' ? (
          <EmptyHint />
        ) : state.status === 'loading' ? (
          <div key={state.runId} className='flex flex-col gap-3'>
            <div className='flex min-h-5 items-center gap-2'>
              <Orb />
              <CrossfadeText
                text={STATUS_PHRASES[phraseIndex]}
                className={cn('text-label-sm text-text-sub-600', shimmerStyles.shimmer)}
              />
            </div>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className='motion-safe:animate-fade-in-up motion-reduce:animate-fade-in'
                style={{ animationDelay: `${Math.min(i, 4) * 50}ms` }}
              >
                <ResultCardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <ResolvedRow />
        )}
      </DemoFrame>
    </div>
  );
}

export function LoadingPacing() {
  return (
    <Specimen
      title='Status line'
      description={`The closest analog to an LLM's streamed "thinking" — a lattice orb plus one line stepping through what it's plausibly doing right now, ${STATUS_PHRASES.length} phrases at ${PHRASE_MS}ms each (a fixed ${FIXED_FLOOR_MS}ms floor), ${CROSSFADE_MS}ms true crossfade (blur-masked, not a hard cut) between each, shimmering continuously underneath. Holds on the last phrase rather than looping back to the first once a genuinely slow backend outlasts the floor — repeating the sequence read as the search restarting. Wired into the real flow as rich-state-flow.tsx's LoadingResults.`}
    >
      <StatusLineDemo />
    </Specimen>
  );
}
