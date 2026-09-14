'use client';

// Keyword match tooltip: shown on a tender result when it only surfaced
// because of a keyword the user set up, matched inside a document or the
// contract object. Figma: node 2446:35205 "Tooltip [1.1]" (content),
// AlignUI Design System 2.0 node 2604:2121 "Tooltip [1.1]" (canonical
// shell + tail structure this now mirrors: isolate stacking context, the
// tail layered above/below the box via z-index, centered on the box
// rather than offset to one side).
//
// v1 is intentionally inert — no link to open the document, just enough
// context ("this matched keyword X, here's where") to explain why the
// result is here. Doc title truncates with the full name in a native
// `title` attribute; the snippet clamps to 2 lines rather than growing to
// fit whatever text surrounds the match.
//
// The close button only renders when `onClose` is passed. Used as a real
// hover tooltip (tender-result-card.tsx), there's nothing to click — it
// dismisses on mouse-out like any tooltip, so no `onClose` is given.

import * as React from 'react';
import { RiCloseLine, RiFileTextLine } from '@remixicon/react';

import * as CompactButton from '@/components/ui/compact-button';
import { cn } from '@/utils/cn';

type KeywordMatchTooltipProps = {
  documentTitle: string;
  snippet: string;
  onClose?: () => void;
  // Which side of the trigger the card opens on: 'top' (card above the
  // trigger, tail below the box pointing down at it) or 'bottom' (card
  // below the trigger, tail above the box pointing up at it). Defaults to
  // 'top' to match the original standalone demo in the Modals tab.
  side?: 'top' | 'bottom';
};

export function KeywordMatchTooltip({
  documentTitle,
  snippet,
  onClose,
  side = 'top',
}: KeywordMatchTooltipProps) {
  const box = (
    <div className='z-[1] flex items-start gap-3 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-3 shadow-regular-md'>
      <RiFileTextLine className='size-5 shrink-0 text-text-sub-600' />

      <div className='flex w-[180px] flex-col gap-1'>
        <p
          title={documentTitle}
          className='truncate text-label-sm text-text-strong-950'
        >
          {documentTitle}
        </p>
        <p className='line-clamp-2 text-paragraph-xs text-text-sub-600'>
          {snippet}
        </p>
      </div>

      {onClose ? (
        <CompactButton.Root
          variant='ghost'
          size='medium'
          onClick={onClose}
          aria-label='Dismiss'
        >
          <CompactButton.Icon as={RiCloseLine} />
        </CompactButton.Root>
      ) : null}
    </div>
  );

  const tail = (
    <div className='z-[2] flex w-full shrink-0 items-center justify-center'>
      <TooltipTail rotated={side === 'bottom'} />
    </div>
  );

  return (
    <div className='isolate flex w-fit flex-col items-center'>
      {side === 'bottom' ? tail : null}
      {box}
      {side === 'top' ? tail : null}
    </div>
  );
}

// AlignUI's real tooltip tail asset (Figma: node 2604:2122 "Tail",
// AlignUI Design System 2.0). The path alone isn't enough — the "Safe"
// rect over its top 2px is what hides the seam between the tail and the
// box's border/radius so they read as one continuous shape.
function TooltipTail({ rotated }: { rotated?: boolean }) {
  return (
    <div className={cn('relative h-[6px] w-[12px]', rotated && 'rotate-180')}>
      <svg
        width='18'
        height='9'
        viewBox='0 0 18 8.37868'
        fill='none'
        className='absolute -top-[1px] left-1/2 -translate-x-1/2'
      >
        <path
          d='M10.4141 7.29297C9.63304 8.07387 8.36696 8.07387 7.58594 7.29297L1.79297 1.5L16.207 1.5L10.4141 7.29297Z'
          className='fill-bg-white-0 stroke-stroke-soft-200'
        />
        <rect width='18' height='2' rx='1' className='fill-bg-white-0' />
      </svg>
    </div>
  );
}
