'use client';

import * as React from 'react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';
import * as Label from '@/components/ui/label';
import * as Radio from '@/components/ui/radio';
import * as Select from '@/components/ui/select';
import { drawerPanelClassName } from './drawer-panel';

type SelectOption = {
  value: string;
  label: string;
  flag?: string;
};

const LANGUAGES: SelectOption[] = [
  { value: 'en', label: 'English (US)', flag: 'US' },
  { value: 'tr', label: 'Türkçe', flag: 'TR' },
];

const TIMEZONES: SelectOption[] = [
  { value: 'gmt-4', label: 'GMT-4:00 - Atlantic Standard Time' },
  { value: 'gmt0', label: 'GMT+0:00 - Greenwich Mean Time' },
];

const TIME_FORMATS: SelectOption[] = [
  { value: '12', label: '12 Hours' },
  { value: '24', label: '24 Hours' },
];

const DATE_FORMATS: SelectOption[] = [
  { value: 'DD/MM/YY', label: 'DD/MM/YY' },
  { value: 'MM/DD/YY', label: 'MM/DD/YY' },
];

const THEME_OPTIONS = [
  {
    value: 'light',
    id: 'settings-light-mode',
    label: 'Light Mode',
    sub: '(Default)',
    desc: 'Pick a clean and classic light theme.',
  },
  {
    value: 'dark',
    id: 'settings-dark-mode',
    label: 'Dark Mode',
    desc: 'Select a sleek and modern dark theme.',
  },
  {
    value: 'system',
    id: 'settings-system-mode',
    label: 'System Mode',
    desc: "Adapts to your device's theme.",
  },
];

function SettingsSelect({
  label,
  value,
  onChange,
  options,
  required,
  optional,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  optional?: boolean;
}) {
  const selected = options.find((option) => option.value === value);
  const hasFlags = options.some((option) => option.flag);

  return (
    <div className='flex flex-col gap-1'>
      <Label.Root className='text-label-sm text-text-strong-950'>
        {label} {required && <Label.Asterisk />}{' '}
        {optional && (
          <span className='text-paragraph-sm text-text-sub-600'>
            (Optional)
          </span>
        )}
      </Label.Root>
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger className='w-full'>
          <Select.Value>
            {hasFlags && selected?.flag ? (
              <div className='flex items-center gap-2'>
                <img
                  src={`https://alignui.com/flags/${selected.flag}.svg`}
                  className='size-icon rounded-sm'
                  alt=''
                />
                {selected.label}
              </div>
            ) : (
              selected?.label
            )}
          </Select.Value>
        </Select.Trigger>
        <Select.Content>
          {options.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.flag && (
                <Select.ItemIcon
                  style={{
                    backgroundImage: `url(https://alignui.com/flags/${option.flag}.svg)`,
                  }}
                  className='size-icon rounded-sm'
                />
              )}
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
}

export function GeneralSettingsDrawer() {
  const [open, setOpen] = React.useState(false);
  const [language, setLanguage] = React.useState('en');
  const [timezone, setTimezone] = React.useState('gmt-4');
  const [timeFormat, setTimeFormat] = React.useState('24');
  const [dateFormat, setDateFormat] = React.useState('DD/MM/YY');
  const [lightMode, setLightMode] = React.useState('light');
  const [systemMode, setSystemMode] = React.useState('system');

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          General Settings
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content className={drawerPanelClassName}>
        <div className='flex h-full flex-col'>
          <Drawer.Header className='items-start'>
            <Drawer.Title>
              <div className='flex flex-col gap-1'>
                <span className='text-label-lg text-text-strong-950'>
                  General Settings
                </span>
                <div className='text-paragraph-sm text-text-sub-600'>
                  Personalize and configure options.
                </div>
              </div>
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className='flex-1'>
            <Divider.Root variant='solid-text'>REGIONAL PREFERENCES</Divider.Root>
            <div className='flex flex-col gap-3 p-5'>
              <SettingsSelect
                label='Language'
                value={language}
                onChange={setLanguage}
                options={LANGUAGES}
                required
              />
              <SettingsSelect
                label='Timezone'
                value={timezone}
                onChange={setTimezone}
                options={TIMEZONES}
                required
              />
              <SettingsSelect
                label='Time Format'
                value={timeFormat}
                onChange={setTimeFormat}
                options={TIME_FORMATS}
                optional
              />
              <SettingsSelect
                label='Date Format'
                value={dateFormat}
                onChange={setDateFormat}
                options={DATE_FORMATS}
                optional
              />
            </div>
            <Divider.Root variant='solid-text'>THEME OPTIONS</Divider.Root>
            <div className='space-y-4 p-5'>
              <Radio.Group
                value={systemMode === 'system' ? 'system' : lightMode}
                onValueChange={(value) => {
                  if (value === 'system') {
                    setSystemMode('system');
                    setLightMode('system');
                  } else {
                    setLightMode(value);
                    setSystemMode('off');
                  }
                }}
                className='space-y-4'
              >
                {THEME_OPTIONS.map((theme) => (
                  <div
                    key={theme.value}
                    className='group/radio flex items-start gap-2'
                  >
                    <Radio.Item value={theme.value} id={theme.id} />
                    <div className='flex flex-col gap-1'>
                      <Label.Root htmlFor={theme.id}>
                        <span className='text-label-sm text-text-strong-950'>
                          {theme.label}{' '}
                          {theme.sub && (
                            <span className='text-paragraph-xs text-text-sub-600'>
                              {theme.sub}
                            </span>
                          )}
                        </span>
                      </Label.Root>
                      <span className='text-paragraph-xs text-text-sub-600'>
                        {theme.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </Radio.Group>
            </div>
          </Drawer.Body>
          <Drawer.Footer className='flex justify-between gap-3 border-t border-stroke-soft-200'>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='medium'
              className='flex-1'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button.Root>
            <Button.Root
              variant='primary'
              size='medium'
              className='flex-1'
              onClick={() => setOpen(false)}
            >
              Apply Changes
            </Button.Root>
          </Drawer.Footer>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
}
