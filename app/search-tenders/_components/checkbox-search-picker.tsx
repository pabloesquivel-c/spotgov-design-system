'use client';

// The set-field picker: what opens when the user clicks a set-kind filter
// row's value trigger (Buyer, Category, Location, Procedure type). Figma:
// node 2446:30159 (Buyer) and 2446:30741 (Category) — same shape, different
// options. Both nodes only cover the inner content ("Body"); the bordered
// rounded shell is inferred from the screenshot, not spec'd by either node.
//
// The search box is real: it filters `options` by a case-insensitive
// substring match on the label, shared by every caller (Buyer, Category,
// Location, Procedure type) since they all go through
// `CheckboxSearchPicker`. Checking a box is wired per-caller via
// `selected`/`onToggle` — see dynamic-filter-rows.tsx.
//
// Hover: node 2446:30162 "Checkbox-Row" — bg-weak-50 row background, and
// the checked checkbox is black (fill-strong-950), not the primitive's
// default primary blue. The checkbox primitive hardcodes its checked/hover/
// focus fills to fill-primary-{base,darker,dark}, which are themselves
// `var(--primary-{base,darker,dark})` — so rather than fight Tailwind's
// generated-class specificity to override a fill on a nested SVG rect
// (fragile: unclear which rule wins, and it silently rendered blue before
// this fix), this scopes those three CSS variables to black locally.
//
// Keyboard: the search box owns navigation. Arrow keys move a highlight
// through the rows without focus ever leaving the input, and Enter checks
// the highlighted one — so "type three letters, press Enter" works, which
// is the whole reason a search box is here. Tab still walks the checkboxes
// one by one exactly as it did before; this is the fast path, not a
// replacement. See use-option-navigation.ts.
//
// Shell: node 2446:30156 "CPV-Filter-Dropdown" — rounded-xl (12px, not the
// design system's rounded-10/20 scale), shadow-regular-md (not -xs), and
// the row list has no gap between rows — each row's own py-1 is the only
// spacing, so rows sit flush against each other.

import * as React from 'react';
import { RiSearch2Line } from '@remixicon/react';

import * as Checkbox from '@/components/ui/checkbox';
import * as Input from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { optionId, useOptionNavigation } from './use-option-navigation';

export type CheckboxPickerOption = {
  label: string;
  checked?: boolean;
};

/** Scopes the three primary-fill variables the Checkbox primitive hardcodes
 * to black, per the header note above. Exported because the CPV picker
 * renders its own two-line rows and has to match — duplicating the object
 * there would leave two copies of a fix whose reasoning lives here. */
export const PICKER_CHECKBOX_VARS = {
  '--primary-base': 'var(--bg-strong-950)',
  '--primary-dark': 'var(--bg-strong-950)',
  '--primary-darker': 'var(--bg-strong-950)',
} as React.CSSProperties;

/** The row list alone, no search or shell — the "Add keyword" target
 * picker (node 2449:45097, Contract Object / Documents) is short enough to
 * skip search entirely, but shares the same row rendering. */
export function CheckboxOptionList({
  options,
  selected,
  onToggle,
  listId,
  activeIndex,
  onActiveIndexChange,
  optionRef,
}: {
  options: CheckboxPickerOption[];
  /** Controlled selection by label. Omit both this and `onToggle` to fall
   * back to each option's own `checked` as an uncontrolled default, as
   * every specimen usage does. */
  selected?: Set<string>;
  onToggle?: (label: string) => void;
  /** Keyboard navigation, from `useOptionNavigation` in the picker above.
   * All four travel together — omit them and the list renders exactly as
   * it always did, which is what the pickers with no search box do. */
  listId?: string;
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  optionRef?: (index: number) => (element: HTMLElement | null) => void;
}) {
  const hasNavigation = activeIndex !== undefined;

  return (
    <div id={listId} className='flex flex-col' style={PICKER_CHECKBOX_VARS}>
      {options.map((option, index) => (
        <label
          key={option.label}
          id={listId ? optionId(listId, index) : undefined}
          ref={optionRef?.(index)}
          // Hovering moves the highlight instead of drawing a second one:
          // with the pointer resting on row 3 while the arrow keys are on
          // row 7, two highlighted rows would leave the user guessing which
          // one Enter is about to take.
          onMouseMove={
            onActiveIndexChange ? () => onActiveIndexChange(index) : undefined
          }
          className={cn(
            'flex items-center gap-2 rounded-md px-2 py-1 active:scale-[0.99]',
            // No colour transition: the highlight is driven by held-down
            // arrow keys as often as by the pointer, and easing it turns a
            // fast scroll through the list into a smear.
            //
            // When navigation is wired, `activeIndex` is the *only* source
            // of the highlight and CSS :hover is dropped entirely — hover
            // moves the index instead (onMouseMove above), so the pointer
            // still lights the row under it while never lighting a second
            // one. Lists with no navigation keep plain :hover.
            hasNavigation
              ? activeIndex === index && 'bg-bg-weak-50'
              : 'hover:bg-bg-weak-50',
          )}
        >
          <Checkbox.Root
            checked={selected ? selected.has(option.label) : undefined}
            defaultChecked={selected ? undefined : option.checked}
            onCheckedChange={onToggle ? () => onToggle(option.label) : undefined}
          />
          <span className='flex-1 text-label-sm text-text-strong-950'>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}

/** The shared popover shell: rounded-xl, shadow-regular-md, fixed 300px
 * width regardless of the trigger's own width (see width comment below). */
export function CheckboxPickerShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 300px, fixed regardless of the trigger's own width: labels here run
    // long (Portuguese municipality names, procedure types), and tying the
    // popover to the trigger's flex-1 width would make it a different size
    // per filter row for no reason the user would understand.
    <div className='flex w-[300px] flex-col gap-2 overflow-hidden rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-2 shadow-regular-md'>
      {children}
    </div>
  );
}

export function CheckboxSearchPicker({
  searchPlaceholder,
  options,
  selected,
  onToggle,
}: {
  searchPlaceholder: string;
  options: CheckboxPickerOption[];
  selected?: Set<string>;
  onToggle?: (label: string) => void;
}) {
  const [search, setSearch] = React.useState('');
  const listId = React.useId();
  const trimmed = search.trim();
  const filtered = trimmed
    ? options.filter((option) =>
        option.label.toLowerCase().includes(trimmed.toLowerCase()),
      )
    : options;

  const { activeIndex, setActiveIndex, onKeyDown, optionRef } =
    useOptionNavigation({
      count: filtered.length,
      resetKey: search,
      onSelect: (index) => onToggle?.(filtered[index].label),
    });

  return (
    <CheckboxPickerShell>
      <Input.Root size='xsmall'>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onKeyDown}
            // combobox + activedescendant: the highlight is a visual cursor
            // the input owns, so this is the only way a screen reader hears
            // about it moving.
            role='combobox'
            aria-expanded
            aria-autocomplete='list'
            aria-controls={listId}
            aria-activedescendant={
              filtered.length > 0 ? optionId(listId, activeIndex) : undefined
            }
          />
        </Input.Wrapper>
      </Input.Root>

      {filtered.length === 0 ? (
        <p className='px-2 py-4 text-center text-label-sm text-text-soft-400'>
          No matches found
        </p>
      ) : (
        <CheckboxOptionList
          options={filtered}
          selected={selected}
          onToggle={onToggle}
          listId={listId}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          optionRef={optionRef}
        />
      )}
    </CheckboxPickerShell>
  );
}
