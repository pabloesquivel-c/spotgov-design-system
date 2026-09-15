'use client';

import * as React from 'react';

import { CheckboxSearchPicker } from './checkbox-search-picker';

const CATEGORY_OPTIONS = [
  { label: 'Construction', checked: true },
  { label: 'Civil engineering' },
  { label: 'Road maintenance' },
  { label: 'Electrical works' },
  { label: 'IT services' },
  { label: 'Software licences' },
  { label: 'Medical equipment' },
];

export function CategoryPicker({
  selected,
  onChange,
}: {
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
      searchPlaceholder='Search category...'
      options={CATEGORY_OPTIONS}
      selected={selectedSet}
      onToggle={onChange ? toggle : undefined}
    />
  );
}
