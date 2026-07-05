'use client';

import * as React from 'react';

/**
 * Optional bounding element for Radix Popper-based overlays (dropdown,
 * popover, select, tooltip). By default those only avoid crossing the
 * browser viewport — fine for the real app, but inside a snugly-sized
 * playground demo card an overlay can still fly past the card's own edges
 * into the surrounding page. A demo container (see
 * components/playground/example-container.tsx) provides its own element
 * here; a component that opens a Radix overlay can read it and pass it
 * straight through as `collisionBoundary` so Radix flips/shifts to stay
 * inside the card instead. Outside a playground demo this context is never
 * provided, so `useCollisionBoundary()` returns `undefined` and consumers
 * fall back to Radix's normal viewport-based behavior, unchanged.
 */
const CollisionBoundaryContext = React.createContext<Element | null>(null);

export const CollisionBoundaryProvider = CollisionBoundaryContext.Provider;

export function useCollisionBoundary(): Element | undefined {
  return React.useContext(CollisionBoundaryContext) ?? undefined;
}
