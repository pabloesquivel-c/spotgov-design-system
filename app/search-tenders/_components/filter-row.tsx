'use client';

// Shared building blocks for a filter row: field trigger, operator trigger,
// value trigger, remove button. Figma: "Dropdown Items [1.1]" component,
// reused across every filter kind (node 2465:48084 for Buyer).
//
// These are closed-state triggers only — no dropdown/menu content yet, by
// design: the field/operator/value pickers haven't been handed over.

import * as React from 'react';
import { RiArrowRightSLine, RiCloseFill } from '@remixicon/react';
import type { RemixiconComponentType } from '@remixicon/react';

import { cn } from '@/utils/cn';

export function FilterFieldTrigger({
  label,
  icon: Icon,
}: {
  label: string;
  icon: RemixiconComponentType;
}) {
  return (
    <button
      type='button'
      className='flex w-[284px] shrink-0 items-center gap-2 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-2 text-left'
    >
      <Icon className='size-5 shrink-0 text-text-sub-600' />
      <span className='min-w-0 flex-1 truncate whitespace-nowrap text-paragraph-sm text-text-strong-950'>
        {label}
      </span>
      {/* The chevron signals this field type can be changed, not just
          displayed — it opens the same field picker as any other filter. */}
      <RiArrowRightSLine className='size-5 shrink-0 text-text-sub-600' />
    </button>
  );
}

export function FilterOperatorTrigger({ label }: { label: string }) {
  return (
    <button
      type='button'
      // Wide enough for the longest known operator ("is none of") without
      // relying on the ellipsis as a crutch.
      className='flex w-[130px] shrink-0 items-center gap-2 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-2 text-left'
    >
      <span className='min-w-0 flex-1 truncate whitespace-nowrap text-paragraph-sm text-text-strong-950'>
        {label}
      </span>
      <RiArrowRightSLine className='size-5 shrink-0 text-text-sub-600' />
    </button>
  );
}

/** A fixed, non-editable operator, for kinds with only one operator
 * (keyword fields: "contains"). No box, no chevron — nothing to open.
 * Same width as FilterOperatorTrigger, so the value column that follows
 * starts at the same x position on every row regardless of operator kind. */
export function FilterOperatorLabel({ label }: { label: string }) {
  return (
    <span className='flex w-[130px] shrink-0 items-center whitespace-nowrap px-1 py-2.5 text-paragraph-sm text-text-sub-600'>
      {label}
    </span>
  );
}

export function FilterValueTrigger({
  placeholder = 'Choose...',
  /** Set-kind values open a submenu (chevron). Date/number values open a
   * datepicker or plain input instead, so those variants drop the chevron. */
  showChevron = true,
  /** A range bound that can never match, e.g. lower bound above upper
   * bound. Both ends of the range take the error border, not just one. */
  invalid = false,
  className,
}: {
  placeholder?: string;
  showChevron?: boolean;
  invalid?: boolean;
  className?: string;
}) {
  return (
    <button
      type='button'
      className={cn(
        // min-w-0: a flex item's default min-width is its content size, which
        // would stop the button (and the truncation inside it) from ever
        // shrinking below "Choose...", overflowing the row instead.
        'flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-2 text-left',
        invalid && 'border-error-base',
        className,
      )}
    >
      <span className='min-w-0 flex-1 truncate whitespace-nowrap text-paragraph-sm text-text-soft-400'>
        {placeholder}
      </span>
      {showChevron ? (
        <RiArrowRightSLine className='size-5 shrink-0 text-text-sub-600' />
      ) : null}
    </button>
  );
}

/** The "and" between a range's two value triggers. */
export function FilterRangeSeparator() {
  return (
    <span className='shrink-0 px-1 py-2.5 text-paragraph-sm text-text-sub-600'>
      and
    </span>
  );
}

export function FilterRemoveButton() {
  return (
    <button type='button' aria-label='Remove filter' className='shrink-0'>
      <RiCloseFill className='size-6 text-text-sub-600' />
    </button>
  );
}

export function FilterRow({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex w-full min-w-0 items-center gap-2'>{children}</div>
  );
}
