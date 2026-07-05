'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';
import {
  articleExampleRow,
  articleExampleContainer,
} from '@/components/playground/typography';
import { CollisionBoundaryProvider } from '@/components/collision-boundary';

// Content width of the article's reading column (ArticleShell's 672px
// max-width minus its 32px side padding). The floor below keeps a demo box
// from ever reading thinner than the text above it; components narrower
// than this (like the sidebar) just sit centered in that space, same as
// before this container could grow wider than the column.
const ARTICLE_CONTENT_WIDTH = 608;

/**
 * The gray "presentation surface" used any time the article shows something
 * concrete instead of prose: a palette, code, a static screenshot, or a live
 * DemoFrame. Width adapts to content but never shrinks below the article's
 * text column and never grows past the max-width below — so it breaks out
 * of the fixed reading column for a wide component instead of capping (and
 * overflowing) it to the text width, without ever looking thinner than the
 * prose it sits under.
 *
 * Also hands its own bounds down via CollisionBoundaryProvider, so a demo
 * that opens a Radix dropdown/popover/tooltip can keep it from spilling
 * past the card's edge — see components/collision-boundary.tsx.
 */
export function ExampleContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [boundary, setBoundary] = React.useState<HTMLDivElement | null>(null);

  return (
    <div className={articleExampleRow}>
      <div
        ref={setBoundary}
        className={cn(articleExampleContainer, className)}
        style={{
          minWidth: `min(${ARTICLE_CONTENT_WIDTH}px, calc(100vw - 4rem))`,
          maxWidth: 'min(1200px, calc(100vw - 4rem))',
        }}
      >
        <CollisionBoundaryProvider value={boundary}>
          {children}
        </CollisionBoundaryProvider>
      </div>
    </div>
  );
}
