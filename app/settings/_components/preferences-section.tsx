'use client';

import * as React from 'react';
import { RiEqualizer2Line } from '@remixicon/react';

import * as Radio from '@/components/ui/radio';
import * as Select from '@/components/ui/select';
import * as Label from '@/components/ui/label';
import { cn } from '@/utils/cn';

import { SettingsCard } from './settings-card';
import { DemoNote } from './demo-note';

const APPEARANCES = [
  { value: 'light', label: 'Light', hint: 'Always light' },
  { value: 'dark', label: 'Dark', hint: 'Always dark' },
  { value: 'system', label: 'System', hint: 'Match your OS' },
];

const CURRENCIES = [
  { value: 'usd', label: 'USD (US Dollar)' },
  { value: 'eur', label: 'EUR (Euro)' },
  { value: 'gbp', label: 'GBP (British Pound)' },
  { value: 'brl', label: 'BRL (Brazilian Real)' },
];

export function PreferencesSection() {
  const [appearance, setAppearance] = React.useState('light');
  const [currency, setCurrency] = React.useState('usd');

  return (
    <SettingsCard
      icon={RiEqualizer2Line}
      title='Preferences'
      description='Set how the workspace looks and displays values for you.'
    >
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <span className='text-label-sm text-text-strong-950'>Appearance</span>
          <Radio.Group
            value={appearance}
            onValueChange={setAppearance}
            className='grid grid-cols-1 gap-3 sm:grid-cols-3'
          >
            {APPEARANCES.map((option) => {
              const selected = appearance === option.value;
              return (
                <label
                  key={option.value}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-xl p-4 ring-1 ring-inset transition-colors',
                    selected
                      ? 'ring-2 ring-primary-base'
                      : 'ring-stroke-soft-200 hover:bg-bg-weak-50',
                  )}
                >
                  <Radio.Item value={option.value} className='mt-0.5' />
                  <span className='flex flex-col gap-0.5'>
                    <span className='text-label-sm text-text-strong-950'>
                      {option.label}
                    </span>
                    <span className='text-paragraph-xs text-text-sub-600'>
                      {option.hint}
                    </span>
                  </span>
                </label>
              );
            })}
          </Radio.Group>
          <DemoNote>
            SpotGov ships light-only, so choosing an appearance updates the
            selection here but doesn&apos;t actually re-theme the demo.
          </DemoNote>
        </div>

        <div className='flex max-w-[280px] flex-col gap-1'>
          <Label.Root htmlFor='currency'>Display Currency</Label.Root>
          <Select.Root value={currency} onValueChange={setCurrency}>
            <Select.Trigger id='currency'>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {CURRENCIES.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
      </div>
    </SettingsCard>
  );
}
