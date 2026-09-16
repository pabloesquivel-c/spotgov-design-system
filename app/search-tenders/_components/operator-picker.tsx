'use client';

// Operator pickers: open from a filter row's operator trigger. Same shell
// as filter-type-picker.tsx, minus icons — every operator row here is
// plain text — single-select, only the option set differs per filter kind.
//
// Text size: Figma specs 13px/20px/-0.6% ("Label/Compact"), off this
// project's type scale. Uses text-label-sm (14px), same call as
// filter-type-picker.tsx.

import * as React from 'react';

import { cn } from '@/utils/cn';
import { useOptionNavigation } from './use-option-navigation';

function OperatorPickerShell({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex w-[220px] flex-col gap-1 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-2 shadow-regular-xs'>
      {children}
    </div>
  );
}

function OperatorOptionList<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: Array<{ value: T; label: string }>;
  selected: T;
  onSelect: (value: T) => void;
}) {
  // Roving focus, same as the filter-type picker — no search box to hold
  // focus, so the arrow keys move it for real and Enter stays native.
  const { navMode, onKeyDown, onPointerMove, optionRef } = useOptionNavigation({
    count: options.length,
    focusMode: 'roving',
    initialIndex: Math.max(
      options.findIndex((option) => option.value === selected),
      0,
    ),
    onSelect: () => {},
  });

  return (
    // data-nav + group, same as the filter-type picker: hover is the only
    // pointer feedback in a roving-focus list, so it has to go away while
    // the keyboard has the list or two rows read as lit at once.
    <div
      data-nav={navMode}
      onKeyDown={onKeyDown}
      onPointerMove={onPointerMove}
      className='group/picker contents'
    >
      {options.map((option, index) => (
        <button
          key={option.value}
          ref={optionRef(index)}
          type='button'
          onClick={() => onSelect(option.value)}
          className={cn(
            'rounded-md px-2 py-1 text-left text-label-sm text-text-strong-950 transition-transform duration-100 ease active:scale-[0.98]',
            'group-data-[nav=pointer]/picker:hover:bg-bg-weak-50',
            // No ring — same call as filter-type-picker.tsx: an option row
            // reads as "highlighted" via bg-fill, the same as hover and the
            // selected state, not via the standalone-control focus ring.
            'focus-visible:bg-bg-weak-50 focus-visible:outline-none',
            selected === option.value && 'bg-bg-weak-50',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// Buyer, Category, CPV, Location — set-kind filters whose value is a list
// of options to include or exclude. Figma: node 2544:32105 "Modal - Is
// any/none".
export type SetOperatorValue = 'any-of' | 'none-of';

const SET_OPERATOR_OPTIONS: Array<{ value: SetOperatorValue; label: string }> = [
  { value: 'any-of', label: 'is any of' },
  { value: 'none-of', label: 'is none of' },
];

export function SetOperatorPicker({
  defaultValue = 'any-of',
  onSelect,
}: {
  defaultValue?: SetOperatorValue;
  onSelect?: (value: SetOperatorValue) => void;
}) {
  const [selected, setSelected] = React.useState<SetOperatorValue>(defaultValue);

  return (
    <OperatorPickerShell>
      <OperatorOptionList
        options={SET_OPERATOR_OPTIONS}
        selected={selected}
        onSelect={(value) => {
          setSelected(value);
          onSelect?.(value);
        }}
      />
    </OperatorPickerShell>
  );
}

// Submission Deadline, Publication Date — date-kind filters. Figma: node
// 2544:32178 "Modal - Is between/after/before".
export type DateOperatorValue = 'between' | 'after' | 'before';

const DATE_OPERATOR_OPTIONS: Array<{ value: DateOperatorValue; label: string }> = [
  { value: 'between', label: 'is between' },
  { value: 'after', label: 'is after' },
  { value: 'before', label: 'is before' },
];

export function DateOperatorPicker({
  defaultValue = 'between',
  onSelect,
}: {
  defaultValue?: DateOperatorValue;
  onSelect?: (value: DateOperatorValue) => void;
}) {
  const [selected, setSelected] = React.useState<DateOperatorValue>(defaultValue);

  return (
    <OperatorPickerShell>
      <OperatorOptionList
        options={DATE_OPERATOR_OPTIONS}
        selected={selected}
        onSelect={(value) => {
          setSelected(value);
          onSelect?.(value);
        }}
      />
    </OperatorPickerShell>
  );
}

// Base Price — the value-range filter. Figma: node 2544:32214 "Modal - Is
// between/after/before" (same shell, price-specific option set).
export type PriceOperatorValue = 'between' | 'at-least' | 'at-most';

const PRICE_OPERATOR_OPTIONS: Array<{ value: PriceOperatorValue; label: string }> = [
  { value: 'between', label: 'is between' },
  { value: 'at-least', label: 'is at least' },
  { value: 'at-most', label: 'is at most' },
];

export function PriceOperatorPicker({
  defaultValue = 'at-least',
  onSelect,
}: {
  defaultValue?: PriceOperatorValue;
  onSelect?: (value: PriceOperatorValue) => void;
}) {
  const [selected, setSelected] = React.useState<PriceOperatorValue>(defaultValue);

  return (
    <OperatorPickerShell>
      <OperatorOptionList
        options={PRICE_OPERATOR_OPTIONS}
        selected={selected}
        onSelect={(value) => {
          setSelected(value);
          onSelect?.(value);
        }}
      />
    </OperatorPickerShell>
  );
}
