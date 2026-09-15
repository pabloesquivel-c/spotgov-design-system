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
// Shell: node 2446:30156 "CPV-Filter-Dropdown" — rounded-xl (12px, not the
// design system's rounded-10/20 scale), shadow-regular-md (not -xs), and
// the row list has no gap between rows — each row's own py-1 is the only
// spacing, so rows sit flush against each other.

import * as React from 'react';
import { RiSearch2Line } from '@remixicon/react';

import * as Checkbox from '@/components/ui/checkbox';
import * as Input from '@/components/ui/input';

export type CheckboxPickerOption = {
  label: string;
  checked?: boolean;
};

/** The row list alone, no search or shell — the "Add keyword" target
 * picker (node 2449:45097, Contract Object / Documents) is short enough to
 * skip search entirely, but shares the same row rendering. */
export function CheckboxOptionList({
  options,
  selected,
  onToggle,
}: {
  options: CheckboxPickerOption[];
  /** Controlled selection by label. Omit both this and `onToggle` to fall
   * back to each option's own `checked` as an uncontrolled default, as
   * every specimen usage does. */
  selected?: Set<string>;
  onToggle?: (label: string) => void;
}) {
  return (
    <div
      className='flex flex-col'
      style={
        {
          '--primary-base': 'var(--bg-strong-950)',
          '--primary-dark': 'var(--bg-strong-950)',
          '--primary-darker': 'var(--bg-strong-950)',
        } as React.CSSProperties
      }
    >
      {options.map((option) => (
        <label
          key={option.label}
          className='flex items-center gap-2 rounded-md px-2 py-1 transition-colors duration-100 ease hover:bg-bg-weak-50 active:scale-[0.99]'
        >
          <Checkbox.Root
            checked={selected ? selected.has(option.label) : undefined}
            defaultChecked={selected ? undefined : option.checked}
            onCheckedChange={onToggle ? () => onToggle(option.label) : undefined}
          />
          <span className='flex-1 text-label-sm text-text-sub-600'>
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
  const trimmed = search.trim();
  const filtered = trimmed
    ? options.filter((option) =>
        option.label.toLowerCase().includes(trimmed.toLowerCase()),
      )
    : options;

  return (
    <CheckboxPickerShell>
      <Input.Root size='xsmall'>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Input.Wrapper>
      </Input.Root>

      {filtered.length === 0 ? (
        <p className='px-2 py-4 text-center text-label-sm text-text-soft-400'>
          No matches found
        </p>
      ) : (
        <CheckboxOptionList options={filtered} selected={selected} onToggle={onToggle} />
      )}
    </CheckboxPickerShell>
  );
}
