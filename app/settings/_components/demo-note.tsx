'use client';

// Tiny inline "demo note" convention for the Settings prototype.
//
// A one-line caption that clarifies anything in the demo that could otherwise
// read as broken or ambiguous (e.g. pagination that can't change at this data
// size, buttons whose real destination isn't designed yet). Uses
// `text-text-sub-600` — never `text-soft-400` — to satisfy the 12-14px
// contrast rule from docs/accessibility.md. Kept inline and small on purpose:
// the page should still feel like a shipped screen, not a QA harness.

import { RiInformationLine } from '@remixicon/react';

import { cn } from '@/utils/cn';

export function DemoNote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'flex items-start gap-1 text-paragraph-xs text-text-sub-600',
        className,
      )}
    >
      <RiInformationLine
        aria-hidden='true'
        className='mt-px size-3.5 shrink-0 text-text-soft-400'
      />
      <span>
        <span className='font-medium'>Demo:</span> {children}
      </span>
    </p>
  );
}
