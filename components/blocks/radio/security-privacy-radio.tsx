'use client';

import { RiShieldUserLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Label from '@/components/ui/label';
import * as Radio from '@/components/ui/radio';
import { radioPanelClassName } from './radio-panel';

const SECURITY_OPTIONS = [
  {
    id: 'security-two-factor',
    value: 'two-factor',
    title: 'Enable Two-Factor Authentication',
    desc: 'Add an extra layer of security to your account.',
  },
  {
    id: 'security-single',
    value: 'single',
    title: 'Use Single Authentication',
    desc: 'Remove the extra layer of security.',
  },
];

const PRIVACY_OPTIONS = [
  {
    id: 'privacy-allow-data',
    value: 'allow-data',
    title: 'Allow Data Collection',
    desc: 'Help us improve your experience by allowing data collection.',
  },
  {
    id: 'privacy-disable-data',
    value: 'disable-data',
    title: 'Disable Data Collection',
    desc: 'Opt-out of data collection.',
  },
];

function RadioOptionList({
  options,
  defaultValue,
}: {
  options: typeof SECURITY_OPTIONS;
  defaultValue: string;
}) {
  return (
    <Radio.Group defaultValue={defaultValue} className='flex flex-col gap-4'>
      {options.map((option) => (
        <div key={option.id} className='flex items-start gap-2'>
          <Radio.Item id={option.id} value={option.value} />
          <Label.Root htmlFor={option.id} className='cursor-pointer'>
            <div className='text-label-sm text-text-strong-950'>
              {option.title}
            </div>
            <div className='mt-1 text-paragraph-xs text-text-sub-600'>
              {option.desc}
            </div>
          </Label.Root>
        </div>
      ))}
    </Radio.Group>
  );
}

export function SecurityPrivacyRadio() {
  return (
    <div className={radioPanelClassName}>
      <div className='flex items-center gap-3.5 px-5 py-4'>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200'>
          <RiShieldUserLine className='size-icon text-text-sub-600' />
        </div>
        <div>
          <div className='text-label-sm text-text-strong-950'>
            Manage Your Security and Privacy
          </div>
          <div className='mt-1 text-paragraph-xs text-text-sub-600'>
            Customize your security and privacy settings.
          </div>
        </div>
      </div>
      <Divider.Root />
      <div className='flex flex-col gap-4 p-5'>
        <div className='text-label-xs uppercase text-text-soft-400'>Security</div>
        <RadioOptionList
          options={SECURITY_OPTIONS}
          defaultValue='two-factor'
        />
        <div className='text-label-xs uppercase text-text-soft-400'>Privacy</div>
        <RadioOptionList options={PRIVACY_OPTIONS} defaultValue='allow-data' />
      </div>
      <Divider.Root />
      <div className='px-5 py-4'>
        <Button.Root variant='error' mode='stroke' size='small'>
          Reset all Preferences
        </Button.Root>
      </div>
    </div>
  );
}
