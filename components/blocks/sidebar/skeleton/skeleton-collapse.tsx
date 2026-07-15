'use client';

// Shared collapse primitives for the skeleton sidebar. Everything animates
// with plain CSS transitions (matching app-sidebar.tsx's duration-200
// ease-out convention) instead of a JS animation library — no measuring, no
// competing animated properties. FadeLabel shrinks via the CSS grid
// fr-unit trick: a single-track grid transitioning grid-template-columns
// between 1fr and 0fr is natively animatable by the browser, so it replaces
// animating width to/from 'auto' entirely.

import * as React from 'react';

import { cn } from '@/utils/cn';

export const SIDEBAR_EXPANDED_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 50;

// Always mounted (never removed from the DOM), just shrunk to zero width,
// so it reads as one motion instead of text popping in and out on its own.
export function FadeLabel({
  isCollapsed,
  className,
  children,
  grow = true,
}: {
  isCollapsed: boolean;
  className?: string;
  children: React.ReactNode;
  /**
   * Whether this label should claim leftover row width when expanded.
   * Set to false on trailing fixed-size controls (e.g. a chevron button)
   * so they don't compete with the label meant to fill the row — only one
   * FadeLabel per row should grow.
   */
  grow?: boolean;
}) {
  return (
    <span
      aria-hidden={isCollapsed}
      style={{
        gridTemplateColumns: isCollapsed ? '0fr' : '1fr',
        pointerEvents: isCollapsed ? 'none' : 'auto',
      }}
      className={cn(
        'grid overflow-hidden transition-[grid-template-columns] duration-200 ease-out',
        grow && !isCollapsed && 'flex-1',
      )}
    >
      <span className={cn('min-w-0 overflow-hidden whitespace-nowrap', className)}>
        {children}
      </span>
    </span>
  );
}
