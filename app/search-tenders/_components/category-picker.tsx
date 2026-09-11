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

export function CategoryPicker() {
  return (
    <CheckboxSearchPicker
      searchPlaceholder='Search category...'
      options={CATEGORY_OPTIONS}
    />
  );
}
