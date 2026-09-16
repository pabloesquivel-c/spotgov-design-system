'use client';

// Keyboard navigation for the option lists every picker on this screen is
// built from. One hook rather than six copies: the arrow/Home/End/Enter
// handling is identical everywhere, and the only real difference is where
// focus lives while you're navigating.
//
// Two focus models, because the pickers come in two shapes:
//
// - 'virtual' — a picker with a search box (Buyer, Category, CPV, Views).
//   Real focus stays in the input the whole time, so you can keep typing;
//   the highlight is a *visual* cursor moved by the arrow keys and reported
//   to screen readers via aria-activedescendant. This is the only model
//   that makes "type two letters, press Enter" work, which is the whole
//   point.
// - 'roving' — a picker with no search box (filter type, the operator
//   pickers, keyword target). Nothing needs to hold focus, so the arrow
//   keys move real DOM focus between the options and Enter/Space are
//   handled natively by the option itself. Fewer moving parts than faking
//   it, and correct by default for screen readers.
//
// Everything here is additive. Tab still walks the options exactly as it
// did before, so nobody's existing muscle memory breaks — this adds the
// faster path rather than replacing the slow one.
//
// Only ever one option is highlighted. That takes work, because CSS :hover
// doesn't care that you've since picked up the keyboard: leave the pointer
// resting on row 3, arrow down to row 7, and the browser keeps row 3 lit
// while row 7 lights up too. Two highlights, and no way to tell which one
// Enter is about to take. `navMode` is the fix — it says which input device
// last drove the list, and hover styling is switched off entirely while the
// keyboard has it.
//
// Deliberately *not* animated. Arrowing through a list is a keyboard action
// repeated dozens of times per search, and the rule for those is no
// animation at all: a 100ms colour transition on the highlight smears into
// a trail the moment you hold the key down. The option rows using this hook
// drop their `transition-colors` for that reason.

import * as React from 'react';

/**
 * Which input device last drove a list, on its own — for navigable UI that
 * doesn't use this file's index model. The date calendar is the case:
 * react-day-picker owns its own grid navigation, but it still has to switch
 * hover off while the arrow keys are moving through the days, or the one
 * the pointer is parked on stays lit beside the focused one.
 */
export function useNavMode() {
  // Starts as 'pointer' so a freshly-opened, untouched list still shows
  // hover feedback to the mouse.
  const [navMode, setNavMode] = React.useState<'keyboard' | 'pointer'>('pointer');

  const markKeyboard = React.useCallback(() => {
    setNavMode((current) => (current === 'keyboard' ? current : 'keyboard'));
  }, []);

  /** Hands the list back to the mouse. Goes on the container, not each row:
   * it has to fire for movement between rows and in the padding around
   * them. Returns the same value when already in pointer mode, so React
   * bails out instead of re-rendering on every pixel of mouse travel. */
  const onPointerMove = React.useCallback(() => {
    setNavMode((current) => (current === 'pointer' ? current : 'pointer'));
  }, []);

  return { navMode, markKeyboard, onPointerMove };
}

/** The keys that mean "I'm navigating with the keyboard now". */
export function isNavigationKey(key: string): boolean {
  return (
    key === 'ArrowDown' ||
    key === 'ArrowUp' ||
    key === 'ArrowLeft' ||
    key === 'ArrowRight' ||
    key === 'Home' ||
    key === 'End' ||
    key === 'PageUp' ||
    key === 'PageDown'
  );
}

export function useOptionNavigation({
  count,
  onSelect,
  focusMode = 'virtual',
  resetKey,
  initialIndex = 0,
  isDisabled,
}: {
  /** How many options are currently rendered. Changes as a search filters
   * the list, which is why the highlight is clamped below. */
  count: number;
  /** Enter (and, in virtual mode, a click) on the option at this index. */
  onSelect: (index: number) => void;
  focusMode?: 'virtual' | 'roving';
  /** Snaps the highlight back to the top when it changes — pass the search
   * query, so every keystroke re-aims Enter at the best match. Watching
   * `count` alone isn't enough: "asphalt" and "asphalts" can both return
   * four rows while pointing at completely different ones. */
  resetKey?: string;
  /** Where the highlight starts, for pickers that open on an already-
   * chosen option (the filter-type and operator pickers). */
  initialIndex?: number;
  /** Options the arrow keys step over and Enter refuses. Without this, a
   * disabled row swallows the keypress — `.focus()` on a disabled button is
   * a no-op, so the highlight just stops moving and the keyboard reads as
   * broken. */
  isDisabled?: (index: number) => boolean;
}) {
  const { navMode, markKeyboard, onPointerMove } = useNavMode();

  // Held in a ref so the step/clamp callbacks below don't have to list a
  // new closure as a dependency on every render.
  const isDisabledRef = React.useRef(isDisabled);
  isDisabledRef.current = isDisabled;
  const disabled = React.useCallback(
    (index: number) => isDisabledRef.current?.(index) ?? false,
    [],
  );

  /** The next enabled index `delta` steps from `from`, wrapping. Returns
   * `from` unchanged if every option is disabled. */
  const step = React.useCallback(
    (from: number, delta: number, total: number) => {
      let next = from;
      for (let i = 0; i < total; i++) {
        next = (next + delta + total) % total;
        if (!disabled(next)) {
          return next;
        }
      }
      return from;
    },
    [disabled],
  );

  const [activeIndex, setActiveIndex] = React.useState(() =>
    isDisabled?.(initialIndex) ? 0 : initialIndex,
  );
  const optionRefs = React.useRef<Array<HTMLElement | null>>([]);
  const isFirstRun = React.useRef(true);

  React.useEffect(() => {
    // Skipped on mount, or it would immediately overwrite `initialIndex`
    // with 0 — which is invisible in a search picker (where 0 is where the
    // highlight belongs anyway) and silently broke the pickers that open on
    // an already-chosen row.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setActiveIndex(0);
  }, [resetKey]);

  // The list can shrink under the highlight mid-search. Clamping beats
  // resetting to 0: filtering from 9 rows to 6 while sitting on row 8
  // should leave you at the end of the list, not back at the top.
  React.useEffect(() => {
    setActiveIndex((current) =>
      current >= count ? Math.max(count - 1, 0) : current,
    );
  }, [count]);

  React.useEffect(() => {
    const option = optionRefs.current[activeIndex];
    if (!option) {
      return;
    }
    if (focusMode === 'roving') {
      // preventScroll + our own scrollIntoView: letting focus() scroll
      // centres the option in the list, which makes a single arrow press
      // look like a jump rather than a step.
      option.focus({ preventScroll: true });
    }
    // 'nearest', and never smooth — a smooth scroll can't keep up with a
    // held-down arrow key and ends up lagging several rows behind it.
    option.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, focusMode]);

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (count === 0) {
        return;
      }
      // Wraps at both ends: these lists are short, and hitting an invisible
      // floor on the last row reads as the key having failed.
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        markKeyboard();
        setActiveIndex((current) => step(current, 1, count));
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        markKeyboard();
        setActiveIndex((current) => step(current, -1, count));
        return;
      }
      // Home/End land on the first/last *enabled* option: stepping forward
      // from the end wraps to index 0 and walks down from there, which is
      // exactly "the first one you can actually use".
      if (event.key === 'Home') {
        event.preventDefault();
        markKeyboard();
        setActiveIndex(step(count - 1, 1, count));
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        markKeyboard();
        setActiveIndex(step(0, -1, count));
        return;
      }
      // Roving mode leaves Enter alone: focus is already on the option, so
      // the button handles it natively and intercepting here would fire the
      // selection twice.
      if (event.key === 'Enter' && focusMode === 'virtual') {
        event.preventDefault();
        if (!disabled(activeIndex)) {
          onSelect(activeIndex);
        }
      }
    },
    [count, activeIndex, onSelect, focusMode, markKeyboard, disabled, step],
  );

  /** Ref callback for the option at `index`, so the hook can scroll it into
   * view (and focus it, in roving mode). */
  const optionRef = React.useCallback(
    (index: number) => (element: HTMLElement | null) => {
      optionRefs.current[index] = element;
    },
    [],
  );

  return { activeIndex, setActiveIndex, navMode, onKeyDown, onPointerMove, optionRef };
}

/** Stable id for an option, so a search input can point
 * `aria-activedescendant` at the row it's highlighting. */
export function optionId(listId: string, index: number): string {
  return `${listId}-option-${index}`;
}
