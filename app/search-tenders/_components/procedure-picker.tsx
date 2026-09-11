'use client';

import * as React from 'react';

import { CheckboxSearchPicker } from './checkbox-search-picker';

const PROCEDURE_OPTIONS = [
  { label: 'Concurso público', checked: true },
  { label: 'Concurso limitado por prévia qualificação' },
  { label: 'Ajuste direto' },
  { label: 'Consulta prévia' },
  { label: 'Diálogo concorrencial' },
];

export function ProcedurePicker() {
  return (
    <CheckboxSearchPicker
      searchPlaceholder='Search procedure type...'
      options={PROCEDURE_OPTIONS}
    />
  );
}
