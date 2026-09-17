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
  RiBarcodeLine,
  RiBuildingLine,
  RiCalendarEventLine,
  RiCoinsLine,
  RiFileTextLine,
  RiGroupLine,
  RiMedalLine,
  RiNodeTree,
} from '@remixicon/react';
import type { RemixiconComponentType } from '@remixicon/react';

import { cn } from '@/utils/cn';
import { useOptionNavigation } from './use-option-navigation';

export type FilterTypeValue =
  | 'buyer'
  | 'category'
  | 'cpv'
  | 'submission-deadline'
  | 'base-price'
  | 'winner'
  | 'competitor'
  | 'document';

// Winner/Competitor are Awarded-only and country-gated, so they aren't in
// this list unconditionally — the caller passes `available`, computed by
// `availableFilterTypes` (dynamic-filter-rows.tsx), which owns that rule.
// A medal for Winner ("who won it") and a group for Competitor ("who else
// was in the room") — both Line variants, per the icon rules.
const OPTIONS: Array<{
  value: FilterTypeValue;
  label: string;
  icon: RemixiconComponentType;
}> = [
  { value: 'buyer', label: 'Buyer', icon: RiBuildingLine },
  { value: 'category', label: 'Category', icon: RiNodeTree },
  // A barcode, not another tree: Category is SpotGov's own broad grouping
  // (the RiNodeTree above), CPV is the EU's numeric code list. Two fields
  // that both classify what's being bought need icons that tell them
  // apart at a glance, and the code is what makes CPV CPV.
  { value: 'cpv', label: 'CPV', icon: RiBarcodeLine },
  {
    value: 'submission-deadline',
    label: 'Submission Deadline',
    icon: RiCalendarEventLine,
  },
  { value: 'base-price', label: 'Base Price', icon: RiCoinsLine },
  { value: 'winner', label: 'Winner', icon: RiMedalLine },
  { value: 'competitor', label: 'Competitor', icon: RiGroupLine },
  { value: 'document', label: 'Document', icon: RiFileTextLine },
];

export function FilterTypePicker({
  defaultValue = 'buyer',
  available,
  disabledFields,
  onSelect,
}: {
  defaultValue?: FilterTypeValue;
  /** Which fields the current stage + country actually support. Omit to
   * offer everything, as the static specimens do. Unavailable fields are
   * dropped rather than shown disabled: unlike the Awarded tab (where a
   * locked tab is an upsell worth showing), a filter that doesn't exist in
   * this country has nothing to sell and no way to unlock. */
  available?: FilterTypeValue[];
  /** Fields to show but block, mapped to the short reason why — currently
   * only CPV, which is capped at one row per search. Distinct from
   * `available` on purpose: a field left out of `available` is gone because
   * this country's data doesn't have it, which the user can't change, while
   * a field in here is blocked by something they *can* change (remove the
   * CPV row they already have). Saying so beats a row that quietly isn't
   * there. */
  disabledFields?: Partial<Record<FilterTypeValue, string>>;
  onSelect?: (value: FilterTypeValue) => void;
}) {
  const [selected, setSelected] = React.useState<FilterTypeValue>(defaultValue);
  const options = available
    ? OPTIONS.filter((option) => available.includes(option.value))
    : OPTIONS;

  // Roving focus, not a virtual highlight: there's no search box here to
  // hold focus, so the arrow keys move real focus between the buttons and
  // Enter/Space stay native. Opens on the currently-selected row, so the
  // first ArrowDown steps off *your* field rather than off the top of the
  // list. See use-option-navigation.ts.
  const { navMode, onKeyDown, onPointerMove, optionRef } = useOptionNavigation({
    count: options.length,
    focusMode: 'roving',
    initialIndex: Math.max(
      options.findIndex((option) => option.value === defaultValue),
      0,
    ),
    // Arrow keys step over a blocked field rather than stalling on it.
    isDisabled: (index) => Boolean(disabledFields?.[options[index].value]),
    onSelect: () => {},
  });

  return (
    // data-nav + group: focus doesn't follow the mouse here (moving focus on
    // hover is disorienting), so CSS :hover is the only pointer feedback —
    // which means it has to be switched off outright while the keyboard is
    // driving, or the row the pointer happens to rest on stays lit next to
    // the focused one.
    <div
      data-nav={navMode}
      onKeyDown={onKeyDown}
      onPointerMove={onPointerMove}
      className='group/picker flex w-[220px] flex-col gap-1 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-2 shadow-regular-xs'
    >
      {options.map((option, index) => {
        const blockedReason = disabledFields?.[option.value];

        return (
          <button
            key={option.value}
            ref={optionRef(index)}
            type='button'
            disabled={Boolean(blockedReason)}
            onClick={() => {
              setSelected(option.value);
              onSelect?.(option.value);
            }}
            className={cn(
              'flex items-center gap-2 rounded-md px-2 py-1 text-left transition-transform duration-100 ease',
              blockedReason
                ? 'cursor-not-allowed'
                : [
                    'active:scale-[0.98]',
                    'group-data-[nav=pointer]/picker:hover:bg-bg-weak-50',
                    // Focus has to be visible now that the arrow keys move
                    // it — the list had no focus-visible treatment at all
                    // before, which left keyboard users guessing which row
                    // Enter would take. Same bg-fill as hover/selected, no
                    // ring: a ring is the standalone-control treatment
                    // (buttons, inputs — the thing you tab *to*), not the
                    // option-row one. An option inside an already-open list
                    // only needs to read as "highlighted", matching
                    // checkbox-search-picker.tsx and Select.Item.
                    'focus-visible:bg-bg-weak-50 focus-visible:outline-none',
                    selected === option.value && 'bg-bg-weak-50',
                  ],
            )}
          >
            <option.icon
              className={cn(
                'size-5 shrink-0',
                blockedReason ? 'text-text-disabled-300' : 'text-text-sub-600',
              )}
            />
            <span
              className={cn(
                'min-w-0 flex-1 truncate text-label-sm',
                blockedReason ? 'text-text-disabled-300' : 'text-text-strong-950',
              )}
            >
              {option.label}
            </span>
            {/* The reason keeps full contrast while the label greys out —
                dimming the explanation along with the thing it explains is
                how a disabled row ends up telling the user nothing. */}
            {blockedReason ? (
              <span className='shrink-0 text-label-xs text-text-sub-600'>
                {blockedReason}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
