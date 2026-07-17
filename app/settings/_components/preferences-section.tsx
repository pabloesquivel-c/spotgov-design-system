'use client';

import * as React from 'react';
import { RiEqualizer2Line } from '@remixicon/react';

import * as Select from '@/components/ui/select';
import * as Divider from '@/components/ui/divider';
import { cn } from '@/utils/cn';

import { SettingsCard } from './settings-card';
import { DemoNote } from './demo-note';

type Appearance = 'light' | 'dark' | 'system';

const APPEARANCES: { value: Appearance; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const APPEARANCE_HINT: Record<Appearance, string> = {
  light: 'Always light, regardless of your device.',
  dark: 'Always dark, regardless of your device.',
  system: "Matches your device's setting and switches automatically.",
};

const CURRENCIES = [
  { value: 'usd', label: 'USD ($)' },
  { value: 'eur', label: 'EUR (€)' },
  { value: 'gbp', label: 'GBP (£)' },
  { value: 'brl', label: 'BRL (R$)' },
];

function AppearancePreview({ appearance }: { appearance: Appearance }) {
  if (appearance === 'system') {
    return (
      <div className='flex h-16 w-full shrink-0 overflow-hidden rounded-lg ring-1 ring-inset ring-stroke-soft-200'>
        <div className='flex h-full grow flex-col gap-1 bg-bg-white-0 p-2'>
          <div className='h-1.5 w-[70%] rounded-[3px] bg-bg-soft-200' />
          <div className='h-1.5 w-full rounded-[3px] bg-bg-weak-50' />
        </div>
        <div className='flex h-full grow flex-col gap-1 bg-[#171717] p-2'>
          <div className='h-1.5 w-[70%] rounded-[3px] bg-[#3A3A3A]' />
          <div className='h-1.5 w-full rounded-[3px] bg-[#2A2A2A]' />
        </div>
      </div>
    );
  }

  const dark = appearance === 'dark';
  return (
    <div
      className={cn(
        'flex h-16 w-full shrink-0 flex-col gap-1.25 rounded-lg p-2 ring-1 ring-inset ring-stroke-soft-200',
        dark ? 'bg-[#171717]' : 'bg-bg-white-0',
      )}
    >
      <div
        className={cn(
          'h-1.5 w-[40%] rounded-[3px]',
          dark ? 'bg-[#3A3A3A]' : 'bg-bg-soft-200',
        )}
      />
      <div
        className={cn(
          'h-1.5 w-[70%] rounded-[3px]',
          dark ? 'bg-[#2A2A2A]' : 'bg-bg-weak-50',
        )}
      />
      <div
        className={cn(
          'h-1.5 w-[55%] rounded-[3px]',
          dark ? 'bg-[#2A2A2A]' : 'bg-bg-weak-50',
        )}
      />
    </div>
  );
}

export function PreferencesSection({
  onDirtyChange,
}: {
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [appearance, setAppearance] = React.useState<Appearance>('light');
  const [currency, setCurrency] = React.useState('usd');
  const [saved, setSaved] = React.useState({ appearance, currency });

  const dirty = appearance !== saved.appearance || currency !== saved.currency;

  React.useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  return (
    <SettingsCard
      icon={RiEqualizer2Line}
      title='Preferences'
      description='Personal display preferences.'
      dirty={dirty}
      onDiscard={() => {
        setAppearance(saved.appearance);
        setCurrency(saved.currency);
      }}
      onApply={() => setSaved({ appearance, currency })}
    >
      <div className='flex flex-col gap-5'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex flex-col gap-0.5'>
            <span className='text-label-sm text-text-strong-950'>
              Display Currency
            </span>
            <span className='text-paragraph-xs text-text-sub-600'>
              Converted for display only — official tender values stay in
              their original currency.
            </span>
          </div>
          <Select.Root
            value={currency}
            onValueChange={setCurrency}
            size='xsmall'
          >
            <Select.Trigger className='w-[140px]'>
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

        <Divider.Root />

        <div className='flex flex-col gap-2.5'>
          <div className='flex flex-col gap-0.5'>
            <span className='text-label-sm text-text-strong-950'>
              Appearance
            </span>
            <span className='text-paragraph-xs text-text-sub-600'>
              How SpotGov looks on this device.
            </span>
          </div>
          <div className='grid grid-cols-3 gap-3'>
            {APPEARANCES.map((option) => {
              const selected = appearance === option.value;
              return (
                <label
                  key={option.value}
                  className={cn(
                    'flex cursor-pointer flex-col gap-2 rounded-xl p-2.5 ring-1 ring-inset transition-colors',
                    selected
                      ? 'bg-primary-alpha-10 ring-2 ring-primary-base'
                      : 'ring-stroke-soft-200 hover:bg-bg-weak-50',
                  )}
                >
                  <AppearancePreview appearance={option.value} />
                  <span className='flex items-center justify-between'>
                    <span className='text-[13px] font-medium text-text-strong-950'>
                      {option.label}
                    </span>
                    <span
                      className={cn(
                        'size-3.5 shrink-0 rounded-full ring-1 ring-inset',
                        selected
                          ? 'ring-[5px] ring-primary-base'
                          : 'ring-stroke-sub-300',
                      )}
                    />
                  </span>
                  <input
                    type='radio'
                    name='appearance'
                    value={option.value}
                    checked={selected}
                    onChange={() => setAppearance(option.value)}
                    className='sr-only'
                  />
                </label>
              );
            })}
          </div>
          <span className='text-paragraph-xs text-text-sub-600'>
            {APPEARANCE_HINT[appearance]}
          </span>
          <DemoNote>
            SpotGov ships light-only, so choosing an appearance updates the
            selection here but doesn&apos;t actually re-theme the demo.
          </DemoNote>
        </div>
      </div>
    </SettingsCard>
  );
}
