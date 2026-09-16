'use client';

import * as React from 'react';

import { CheckboxSearchPicker } from './checkbox-search-picker';

// One flat list across every country. A real picker would scope options to
// the selected country (a Portuguese user has no use for Leeds City
// Council), but that's a change to how options are sourced, not to this
// component's shape — the non-PT buyers are here so the Buyer filter still
// works against the Spanish and UK fixtures.
const BUYER_OPTIONS = [
  { label: 'Município de Lisboa', checked: true },
  { label: 'Município do Porto' },
  { label: 'Câmara Municipal de Sintra' },
  { label: 'Infraestruturas de Portugal' },
  { label: 'Universidade de Coimbra' },
  { label: 'Ayuntamiento de Madrid' },
  { label: 'Ayuntamiento de Sevilla' },
  { label: 'Ayuntamiento de Valencia' },
  { label: 'Diputación de Barcelona' },
  { label: 'Manchester City Council' },
  { label: 'Leeds City Council' },
];

export function BuyerPicker({
  selected,
  onChange,
}: {
  /** Controlled selection by label. Omit to keep the picker's own
   * uncontrolled default (one option pre-checked, nothing reported back). */
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
      searchPlaceholder='Search buyer...'
      options={BUYER_OPTIONS}
      selected={selectedSet}
      onToggle={onChange ? toggle : undefined}
    />
  );
}
