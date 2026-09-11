'use client';

import * as React from 'react';

import { CheckboxSearchPicker } from './checkbox-search-picker';

const BUYER_OPTIONS = [
  { label: 'Município de Lisboa', checked: true },
  { label: 'Município do Porto' },
  { label: 'Câmara Municipal de Sintra' },
  { label: 'Infraestruturas de Portugal' },
  { label: 'Universidade de Coimbra' },
];

export function BuyerPicker() {
  return (
    <CheckboxSearchPicker
      searchPlaceholder='Search buyer...'
      options={BUYER_OPTIONS}
    />
  );
}
