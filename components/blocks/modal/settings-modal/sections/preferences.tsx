'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import * as Divider from '@/components/ui/divider';
import * as Label from '@/components/ui/label';
import * as Radio from '@/components/ui/radio';
import * as Select from '@/components/ui/select';

import { SettingRow } from '../setting-row';
import type { SectionCommitHandle } from '../settings-modal';

type Appearance = 'light' | 'dark' | 'system';

type Preferences = {
  language: string;
  currency: string;
  appearance: Appearance;
};

const APPEARANCES: { value: Appearance; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const LANGUAGES = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { value: 'de', label: 'German', flag: '🇩🇪' },
  { value: 'fr', label: 'French', flag: '🇫🇷' },
  { value: 'es', label: 'Spanish', flag: '🇪🇸' },
];

const CURRENCIES = [
  { value: 'eur', label: 'EUR (€)', flag: '🇪🇺' },
  { value: 'usd', label: 'USD ($)', flag: '🇺🇸' },
  { value: 'gbp', label: 'GBP (£)', flag: '🇬🇧' },
];

const DEFAULT_PREFERENCES: Preferences = {
  language: 'pt',
  currency: 'eur',
  appearance: 'light',
};

export type PreferencesModalSectionProps = {
  onDirtyChange: (dirty: boolean) => void;
};

function ChoiceMark({ children }: { children: React.ReactNode }) {
  return (
    <span className='flex size-5 shrink-0 items-center justify-center text-label-md leading-none'>
      {children}
    </span>
  );
}

/** Settings in this pane are staged so the shared header actions remain useful. */
export const PreferencesModalSection = React.forwardRef<
  SectionCommitHandle,
  PreferencesModalSectionProps
>(function PreferencesModalSection({ onDirtyChange }, ref) {
  const { setTheme } = useTheme();
  const [saved, setSaved] = React.useState<Preferences>(DEFAULT_PREFERENCES);
  const [draft, setDraft] = React.useState<Preferences>(DEFAULT_PREFERENCES);

  const dirty =
    draft.language !== saved.language ||
    draft.currency !== saved.currency ||
    draft.appearance !== saved.appearance;

  React.useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);

  React.useImperativeHandle(ref, () => ({
    save: () => {
      setSaved(draft);
      setTheme(draft.appearance);
    },
    discard: () => {
      setDraft(saved);
      setTheme(saved.appearance);
    },
  }));

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col divide-y divide-stroke-soft-200'>
        <SettingRow
          title='Language'
          description='Choose the language used across SpotGov.'
          controlClassName='flex-1'
          control={
            <Select.Root
              value={draft.language}
              onValueChange={(language) =>
                setDraft((current) => ({ ...current, language }))
              }
              size='xsmall'
            >
              <Select.Trigger className='w-full'>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {LANGUAGES.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    textValue={option.label}
                  >
                    <ChoiceMark>{option.flag}</ChoiceMark>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          }
        />
        <SettingRow
          title='Currency'
          description='Show amounts in this currency.'
          controlClassName='flex-1'
          control={
            <Select.Root
              value={draft.currency}
              onValueChange={(currency) =>
                setDraft((current) => ({ ...current, currency }))
              }
              size='xsmall'
            >
              <Select.Trigger className='w-full'>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {CURRENCIES.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    <ChoiceMark>{option.flag}</ChoiceMark>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          }
        />
      </div>

      <Divider.Root />

      <SettingRow
        className='py-0'
        title='Appearance'
        description='Choose how SpotGov looks on this device.'
        controlClassName='w-64'
        control={
          <Radio.Group
            value={draft.appearance}
            onValueChange={(appearance: Appearance) =>
              setDraft((current) => ({ ...current, appearance }))
            }
            aria-label='Interface theme'
            className='flex w-full items-center justify-between'
          >
            {APPEARANCES.map((option) => (
              <Label.Root
                key={option.value}
                htmlFor={`appearance-${option.value}`}
                className='flex cursor-pointer items-center gap-1.5 text-label-sm text-text-sub-600'
              >
                <Radio.Item
                  id={`appearance-${option.value}`}
                  value={option.value}
                />
                {option.label}
              </Label.Root>
            ))}
          </Radio.Group>
        }
      />
    </div>
  );
});
