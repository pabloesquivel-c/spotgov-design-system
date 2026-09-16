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
// place to keep tuning the pacing itself — run it against three backend
// speeds (instant/typical/slow): the fixed floor should make instant and
// typical feel identical, and slow should extend gracefully past the
// floor, holding on the last phrase rather than looping back to the first
// once it runs out.

import * as React from 'react';
import { RiCheckboxCircleFill } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { Orb } from './orb';
import shimmerStyles from './shimmer-text.module.css';
import { Specimen } from './specimen';

// A separate, longer duration for the crossfade itself (not just a fade-in
// on a hard cut) — the old/new text visibly overlap rather than one
// disappearing the instant the other appears.
const CROSSFADE_MS = 350;

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
      <p className='text-paragraph-sm text-text-soft-400'>
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

/** A real crossfade, not a hard cut with a fade-in bolted on: the outgoing
 * text fades out (with a light blur, masking the swap per Emil Kowalski's
 * "blur bridges two states that would otherwise read as two objects
 * swapping") while the incoming text fades in, both driven by CSS
 * transitions so a fast re-trigger retargets smoothly instead of restarting
 * from zero. `ease`, not `ease-out` — this is the same "slightly slower,
 * more elegant" choice Sonner makes for a component with personality,
 * rather than the snappier default for functional UI chrome.
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
 * earlier pass here) was a mistake — the shimmer's motion doesn't stand in
 * for a transition on the text *content* changing; a phrase swap with zero
 * transition read as a jump cut regardless. */
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

// Status line: the closest analog to an LLM's streamed "thinking" tokens —
// a lattice orb (nine dots, a wave radiating from the centre) plus a single
// line stepping through what it's plausibly doing right now, sitting above
// the skeleton. Deliberately doesn't loop back to the first phrase once it
// reaches the last one: repeating "Looking through tenders…" after "Almost
// there…" read as the search restarting, which undercuts the one thing
// this line exists to communicate.

// Per docs/copy.md: specific over clever ("Bad: Working magic…"), name the
// object, no em dashes. Three phrases — plain and short enough to read in
// one glance rather than a caption someone has to parse.
const STATUS_PHRASES = [
  'Looking through tenders…',
  'Matching your filters…',
  'Almost there…',
];
// 1500ms/phrase: this is a deliberate "thinking" pause, not a snappy UI
// transition — the pace should feel unhurried, not just technically
// readable. The floor (below) derives from this pace, not the other way
// around, so it's never squeezed to fit a pre-picked total.
const PHRASE_MS = 1500;
// The floor the sequence is choreographed to fill exactly — equal to the
// full phrase sequence's own length, so it never cuts the last phrase's
// dwell time short. Composed of individual sub-300ms beats, not one
// continuous tween — the 300ms UI ceiling from /animate applies
// per-transition, not to an orchestrated multi-beat sequence like this one.
const FIXED_FLOOR_MS = PHRASE_MS * STATUS_PHRASES.length;

/** Steps through `phraseCount` phrases once, `phraseMs` apart, then holds on
 * the last one for as long as `active` stays true. */
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
