'use client';

// The filter-type picker: opens from a filter row's field trigger, letting
// the user swap which field the row filters on. Figma: node 2544:32024
// "Modal - Filter Type". Icon + label rows; the design shows no separate
// checkmark for the selected item — it just keeps the same hover highlight.
//
// Text size: Figma specs 13px/20px/-0.6% ("Label/Compact"), off this
// project's type scale. Uses text-label-sm (14px) instead, matching every
// other picker's option text (checkbox-search-picker.tsx,
// keyword-target-picker.tsx) rather than introducing a one-off size.

import * as React from 'react';
import {
  RiBuildingLine,
  RiCalendarEventFill,
  RiCoinsLine,
  RiFileTextLine,
  RiNodeTree,
} from '@remixicon/react';
import type { RemixiconComponentType } from '@remixicon/react';

import { cn } from '@/utils/cn';

export type FilterTypeValue =
  | 'buyer'
  | 'category'
  | 'submission-deadline'
  | 'base-price'
  | 'document';

const OPTIONS: Array<{
  value: FilterTypeValue;
  label: string;
  icon: RemixiconComponentType;
}> = [
  { value: 'buyer', label: 'Buyer', icon: RiBuildingLine },
  { value: 'category', label: 'Category', icon: RiNodeTree },
  {
    value: 'submission-deadline',
    label: 'Submission Deadline',
    icon: RiCalendarEventFill,
  },
  { value: 'base-price', label: 'Base Price', icon: RiCoinsLine },
  { value: 'document', label: 'Document', icon: RiFileTextLine },
];

export function FilterTypePicker({
  defaultValue = 'buyer',
  onSelect,
}: {
  defaultValue?: FilterTypeValue;
  onSelect?: (value: FilterTypeValue) => void;
}) {
  const [selected, setSelected] = React.useState<FilterTypeValue>(defaultValue);

  return (
    <div className='flex w-[220px] flex-col gap-1 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-2 shadow-regular-xs'>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type='button'
          onClick={() => {
            setSelected(option.value);
            onSelect?.(option.value);
          }}
          className={cn(
            'flex items-center gap-2 rounded-md px-2 py-1 text-left transition-[background-color,transform] duration-100 ease hover:bg-bg-weak-50 active:scale-[0.98]',
            selected === option.value && 'bg-bg-weak-50',
          )}
        >
          <option.icon className='size-5 shrink-0 text-text-sub-600' />
          <span className='flex-1 truncate text-label-sm text-text-strong-950'>
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}
