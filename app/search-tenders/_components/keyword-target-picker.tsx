'use client';

// The "Add keyword" target picker: what opens when choosing what a keyword
// row searches — Contract Object or Documents. Figma: node 2449:45097
// "Body". Only 2 options, so unlike the set-field pickers there's no
// search input.
//
// Mutually exclusive, not multi-select: a keyword row searches one target,
// so checking one disables the other rather than letting both be checked.
// Real state, since this behavior only shows up when it actually works —
// checking Documents then Contract Object should flip which one is
// disabled, not just render two independent checkboxes.

import * as React from 'react';

import * as Checkbox from '@/components/ui/checkbox';
import { cn } from '@/utils/cn';
import { CheckboxPickerShell } from './checkbox-search-picker';

export type KeywordTarget = 'contract-object' | 'documents';

const OPTIONS: Array<{ value: KeywordTarget; label: string }> = [
  { value: 'contract-object', label: 'Contract Object' },
  { value: 'documents', label: 'Documents' },
];

export function KeywordTargetPicker({
  defaultValue = 'contract-object',
  onSelect,
}: {
  defaultValue?: KeywordTarget;
  onSelect?: (value: KeywordTarget) => void;
}) {
  const [selected, setSelected] = React.useState<KeywordTarget | undefined>(
    defaultValue,
  );

  return (
    <CheckboxPickerShell>
      {/* Checked black (--primary-* scoped to bg-strong-950), same reasoning
          as checkbox-search-picker.tsx: the primitive hardcodes its checked
          fill to fill-primary-base, which resolves through these CSS vars. */}
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
        {OPTIONS.map((option) => {
          const checked = selected === option.value;
          const disabled = selected !== undefined && !checked;

          return (
            <label
              key={option.value}
              className={cn(
                'flex select-none items-center gap-2 rounded-md px-2 py-1 transition-colors duration-100 ease',
                disabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:bg-bg-weak-50',
              )}
            >
              <Checkbox.Root
                checked={checked}
                disabled={disabled}
                onCheckedChange={(next) => {
                  setSelected(next ? option.value : undefined);
                  if (next) {
                    onSelect?.(option.value);
                  }
                }}
              />
              <span className='flex-1 text-label-sm text-text-strong-950'>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </CheckboxPickerShell>
  );
}
