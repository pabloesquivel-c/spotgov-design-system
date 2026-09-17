'use client';

// The CPV picker: the value picker behind a CPV filter row. Same shell,
// same search box, same checkbox rows as Buyer and Category — two
// deliberate differences, both forced by the vocabulary rather than added
// as polish:
//
// 1. Its own search. CPV is searchable by code, by name, or by a few words
//    in any order (see searchCpv), which the shared substring filter in
//    CheckboxSearchPicker can't do.
// 2. A two-line row: the name on top, the code under it. The code isn't
//    decoration — it's how half the searches here are typed, and a user who
//    typed "45233" needs to see why these rows came back. It sits below
//    rather than inline because the name is what you're choosing and the
//    code is what identifies it, and a row that leads with eight digits
//    makes every option look the same at a glance.
//
// Keyboard works the same as the shared picker: arrows move a highlight
// without focus leaving the search box, Enter checks the highlighted code.
// It matters more here than anywhere else — "45233", ArrowDown, Enter is
// the whole interaction for someone who already knows their codes.
//
// Deliberately exposes no `onSelect`, like the other multi-select pickers —
// that's what keeps the popover open across picks under `withAutoClose`
// (filter-row.tsx).

import * as React from 'react';
import { RiSearch2Line } from '@remixicon/react';

import * as Checkbox from '@/components/ui/checkbox';
import * as Input from '@/components/ui/input';
import { cn } from '@/utils/cn';
import {
  CheckboxPickerShell,
  PICKER_CHECKBOX_VARS,
} from './checkbox-search-picker';
import { searchCpv, type CpvEntry } from './cpv-data';
import { optionId, useOptionNavigation } from './use-option-navigation';

const CpvOptionRow = React.forwardRef<
  HTMLLabelElement,
  {
    id?: string;
    entry: CpvEntry;
    checked: boolean;
    active: boolean;
    onToggle?: () => void;
    onMouseMove?: () => void;
  }
>(function CpvOptionRow({ id, entry, checked, active, onToggle, onMouseMove }, ref) {
  return (
    // items-start with no offset on the checkbox: label-sm's line height is
    // 20px and the checkbox is size-5, so the box and the first line of the
    // name align exactly without nudging either.
    <label
      id={id}
      ref={ref}
      onMouseMove={onMouseMove}
      style={PICKER_CHECKBOX_VARS}
      className={cn(
        'flex cursor-pointer select-none items-start gap-2 rounded-md px-2 py-1.5',
        // No colour transition, and no CSS :hover — `active` is the single
        // source of the highlight, moved by both the arrow keys and the
        // pointer, so two rows can never be lit at once. Same reasoning as
        // the shared list.
        active && 'bg-bg-weak-50',
      )}
    >
      <Checkbox.Root checked={checked} onCheckedChange={onToggle} />
      <span className='flex min-w-0 flex-1 flex-col'>
        <span className='text-label-sm text-text-strong-950'>{entry.label}</span>
        <span className='text-paragraph-xs text-text-sub-600'>{entry.code}</span>
      </span>
    </label>
  );
});

export function CpvPicker({
  selected,
  onChange,
}: {
  /** Controlled selection, by 8-digit code — codes, not labels, because
   * that's what the is-or-is-under-it test runs on. Omit to leave the
   * picker uncontrolled (nothing reported back). */
  selected?: string[];
  onChange?: (selected: string[]) => void;
}) {
  const [search, setSearch] = React.useState('');
  const listId = React.useId();
  const codes = React.useMemo(() => selected ?? [], [selected]);
  const selectedSet = React.useMemo(() => new Set(codes), [codes]);
  const results = React.useMemo(() => searchCpv(search), [search]);

  const { activeIndex, setActiveIndex, onKeyDown, optionRef } =
    useOptionNavigation({
      count: results.length,
      resetKey: search,
      onSelect: (index) => toggle(results[index].code),
    });

  function toggle(code: string) {
    if (!onChange) {
      return;
    }
    onChange(
      selectedSet.has(code)
        ? codes.filter((other) => other !== code)
        : [...codes, code],
    );
  }

  return (
    <CheckboxPickerShell>
      <Input.Root size='xsmall'>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input
            placeholder='Search CPV code or name...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onKeyDown}
            role='combobox'
            aria-expanded
            aria-autocomplete='list'
            aria-controls={listId}
            aria-activedescendant={
              results.length > 0 ? optionId(listId, activeIndex) : undefined
            }
          />
        </Input.Wrapper>
      </Input.Root>

      {results.length === 0 ? (
        <p className='px-2 py-4 text-center text-label-sm text-text-sub-600'>
          No matches found
        </p>
      ) : (
        // The one thing this picker's list needs that the others don't: a
        // ceiling. Buyer and Category top out around ten options, while a
        // broad CPV query can return forty rows of a vocabulary that's
        // thousands deep, which would run the popover off the screen.
        <div id={listId} className='flex max-h-[280px] flex-col overflow-y-auto'>
          {results.map((entry, index) => (
            <CpvOptionRow
              key={entry.code}
              id={optionId(listId, index)}
              ref={optionRef(index)}
              entry={entry}
              checked={selectedSet.has(entry.code)}
              active={activeIndex === index}
              onMouseMove={() => setActiveIndex(index)}
              onToggle={onChange ? () => toggle(entry.code) : undefined}
            />
          ))}
        </div>
      )}
    </CheckboxPickerShell>
  );
}
