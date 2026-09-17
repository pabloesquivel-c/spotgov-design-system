'use client';

// The results-area loading treatment, in one place: the phrase sequence,
// its pacing constants, and the crossfading status text.
//
// This used to exist twice — once in rich-state-flow.tsx (the real flow)
// and once in loading-pacing.tsx (the specimen tab that exists to tune it).
// Two copies of the thing whose whole point is being tuned is the exact
// shape of drift: the specimen would be adjusted, the real flow wouldn't,
// and the tab would stop describing what ships. Both now import from here,
// so tuning the pacing on the specimen tunes the page.
//
// The pacing itself was chosen by prototyping three directions on that tab:
// a fixed floor long enough to read as real work (the "LLM thinking tokens"
// reference) rather than resolving the instant a response is ready.

import * as React from 'react';

import { cn } from '@/utils/cn';

// Per docs/copy.md: specific over clever ("Bad: Working magic…"), name the
// object, no em dashes. Three phrases — plain and short enough to read in
// one glance rather than a caption someone has to parse.
export const STATUS_PHRASES = [
  'Looking through tenders…',
  'Matching your filters…',
  'Almost there…',
];

// 1500ms/phrase, not 1000ms: this is a deliberate "thinking" pause, not a
// snappy UI transition, and 1000ms still read as short once the rest of the
// treatment made the sequence feel more alive — the pace should feel
// unhurried, not just technically readable.
export const PHRASE_MS = 1500;

// The floor the sequence is choreographed to fill exactly — equal to the
// full phrase sequence's own length (not a separate, independently-picked
// number), so it never cuts the last phrase's dwell time short. Composed of
// individual sub-300ms beats, not one continuous tween: the 300ms UI ceiling
// from /animate applies per-transition, not to an orchestrated multi-beat
// sequence like this one.
export const FIXED_FLOOR_MS = PHRASE_MS * STATUS_PHRASES.length;

// A real crossfade (both texts briefly overlap, blur-masked), not a hard cut
// with a fade-in bolted on — see CrossfadeText below.
export const CROSSFADE_MS = 350;

/** Keeps a just-shown loading state visible for at least `minMs` even if the
 * real request finishes sooner — without it, a fast connection makes the
 * skeleton's own entrance stagger flash and cut itself off mid-animation
 * instead of settling. Doesn't delay *showing* it, only hiding it. */
export function useMinimumVisibleDuration(active: boolean, minMs: number): boolean {
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
export function usePhraseSequence(
  active: boolean,
  phraseCount: number,
  phraseMs: number,
): number {
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
 * A shimmer class folds into `className` at the call sites — the shimmer's
 * `animation` (mask-position, infinite) and this component's `transition`
 * (opacity/filter) target different properties on the same element, so they
 * run independently: the phrase change still gets a real crossfade, on top
 * of which the shimmer keeps sweeping continuously throughout. Dropping the
 * crossfade for a shimmer-only treatment (an earlier pass on the specimen
 * tab) was a mistake — the shimmer's motion doesn't stand in for a
 * transition on the text *content* changing; a phrase swap with zero
 * transition read as a jump cut regardless. */
export function CrossfadeText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
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
