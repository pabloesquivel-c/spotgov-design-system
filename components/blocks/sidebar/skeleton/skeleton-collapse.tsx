'use client';

// Shared collapse primitives for the skeleton sidebar. One spring drives
// every part of the transition: rail width, row reflow, and the
// opacity/height of anything that disappears (labels, badges, section
// headers). Nothing gets its own timing — that's what keeps it feeling like
// a single continuous motion instead of several animations layered together.

import * as React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/utils/cn';

export const SIDEBAR_SPRING = { type: 'spring', visualDuration: 0.2, bounce: 0.1 } as const;

export const SIDEBAR_EXPANDED_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 50;

// Always mounted (never removed from the DOM), just faded/shrunk with
// SIDEBAR_SPRING, so it reads as one motion instead of text popping in and
// out on its own timing.
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
    <motion.span
      aria-hidden={isCollapsed}
      initial={false}
      animate={{
        opacity: isCollapsed ? 0 : 1,
        flexGrow: isCollapsed || !grow ? 0 : 1,
        width: isCollapsed ? 0 : 'auto',
        height: isCollapsed ? 0 : 'auto',
      }}
      style={{ pointerEvents: isCollapsed ? 'none' : 'auto' }}
      transition={SIDEBAR_SPRING}
      className={cn('overflow-hidden whitespace-nowrap', className)}
    >
      {children}
    </motion.span>
  );
}
