'use client';

// Read-on-visible via IntersectionObserver, not scroll events: the spec's
// [suggested] "substantially visible" is a ratio plus a dwell, and only a real
// observer measures the ratio. Rows are found by [data-row-id] after each
// render, so the caller bumps `revision` whenever the list changes.

import * as React from 'react';

type Options = {
  containerRef: React.RefObject<HTMLElement | null>;
  enabled: boolean;
  /** How much of the row must be on screen, 0 to 1. */
  threshold: number;
  /** How long it must stay there before it counts. */
  dwellMs: number;
  /** "Only after scrolling": nothing is read until the user scrolls once. */
  requireScroll: boolean;
  onRead: (id: string) => void;
  revision: unknown;
};

export function useReadTracking({
  containerRef,
  enabled,
  threshold,
  dwellMs,
  requireScroll,
  onRead,
  revision,
}: Options) {
  const onReadRef = React.useRef(onRead);
  onReadRef.current = onRead;

  React.useEffect(() => {
    const root = containerRef.current;
    if (!root || !enabled) return;

    const timers = new Map<string, ReturnType<typeof setTimeout>>();
    let observer: IntersectionObserver | null = null;

    const clear = (id: string) => {
      const timer = timers.get(id);
      if (timer) {
        clearTimeout(timer);
        timers.delete(id);
      }
    };

    const start = () => {
      if (observer) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const id = (entry.target as HTMLElement).dataset.rowId;
            if (!id) return;

            if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
              if (timers.has(id)) return;
              timers.set(
                id,
                setTimeout(() => {
                  timers.delete(id);
                  onReadRef.current(id);
                }, dwellMs),
              );
              return;
            }

            clear(id);
          });
        },
        {
          root,
          threshold: Array.from(new Set([0, threshold, 1])).sort(
            (a, b) => a - b,
          ),
        },
      );

      root
        .querySelectorAll<HTMLElement>('[data-row-id]')
        .forEach((element) => observer?.observe(element));
    };

    if (requireScroll) {
      root.addEventListener('scroll', start, { once: true, passive: true });
    } else {
      start();
    }

    return () => {
      root.removeEventListener('scroll', start);
      timers.forEach((timer) => clearTimeout(timer));
      observer?.disconnect();
    };
  }, [containerRef, enabled, threshold, dwellMs, requireScroll, revision]);
}
