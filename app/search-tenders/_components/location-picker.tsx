'use client';

import * as React from 'react';

import { CheckboxSearchPicker } from './checkbox-search-picker';

const LOCATION_OPTIONS = [
  { label: 'Lisboa · Lisboa', checked: true },
  { label: 'Porto · Porto' },
  { label: 'Sintra · Lisboa' },
  { label: 'Braga · Braga' },
  { label: 'Coimbra · Coimbra' },
];

export function LocationPicker() {
  return (
    <CheckboxSearchPicker
      searchPlaceholder='Search location...'
      options={LOCATION_OPTIONS}
    />
  );
}
