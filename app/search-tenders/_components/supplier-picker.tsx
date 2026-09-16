'use client';

// The supplier picker — the value picker behind both Winner and Competitor
// rows. One component, not two: it's the same universe of companies both
// times, and the difference between "won it" and "bid for it" lives in the
// field, not in the list. Same shape as BuyerPicker, pointed at suppliers.
//
// Deliberately exposes no `onSelect`: that's what keeps the popover open
// across multiple checks under `withAutoClose` (filter-row.tsx), the same
// convention every other multi-select picker follows.

import * as React from 'react';

import { CheckboxSearchPicker } from './checkbox-search-picker';

// The companies recorded as winners or bidders across the awarded fixtures
// in rich-state-flow.tsx. Kept in sync by hand — the mock data is the only
// source, and a name here that never appears there would just be a filter
// that silently returns nothing.
const SUPPLIER_OPTIONS = [
  { label: 'Acme Construction' },
  { label: 'BuildCo' },
  { label: 'Mota-Engil' },
  { label: 'Teixeira Duarte' },
  { label: 'NovaRede Sistemas' },
  { label: 'MediSupply Ibérica' },
  { label: 'Grupo Elecnor' },
  { label: 'Ferrovial Construcción' },
];

export function SupplierPicker({
  selected,
  onChange,
}: {
  /** Controlled selection by label, matching every other set-kind picker.
   * Omit to leave the picker uncontrolled (nothing reported back). */
  selected?: string[];
  onChange?: (selected: string[]) => void;
}) {
  const selectedSet = React.useMemo(
    () => (selected ? new Set(selected) : undefined),
    [selected],
  );

  function toggle(label: string) {
    if (!selectedSet || !onChange) {
      return;
    }
    const next = new Set(selectedSet);
    if (next.has(label)) {
      next.delete(label);
    } else {
      next.add(label);
    }
    onChange(Array.from(next));
  }

  return (
    <CheckboxSearchPicker
      searchPlaceholder='Search supplier...'
      options={SUPPLIER_OPTIONS}
      selected={selectedSet}
      onToggle={onChange ? toggle : undefined}
    />
  );
}
