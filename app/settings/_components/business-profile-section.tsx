'use client';

import { RiArrowRightUpLine, RiBriefcaseLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import { notification } from '@/hooks/use-notification';

import { SettingsCard } from './settings-card';
import { DemoNote } from './demo-note';

const DETAILS = [
  { label: 'Legal name', value: 'Acme Corporation' },
  { label: 'Tax ID', value: 'US-482913004' },
  { label: 'Registered address', value: '500 Market St, San Francisco, CA' },
  { label: 'Primary sector', value: 'IT & Consulting Services' },
];

const EXPECTED_ITEMS = [
  'Legal name, address, and registration details',
  'Certifications and compliance documents',
  'Licenses required for specific tender categories',
];

export function BusinessProfileSection() {
  return (
    <SettingsCard
      icon={RiBriefcaseLine}
      title='Business Profile'
      description='Company details, certifications, and licenses used across bids.'
    >
      <div className='flex flex-col gap-6'>
        <dl className='grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2'>
          {DETAILS.map((detail) => (
            <div key={detail.label} className='flex flex-col gap-0.5'>
              <dt className='text-paragraph-xs text-text-sub-600'>
                {detail.label}
              </dt>
              <dd className='text-label-sm text-text-strong-950'>
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>

        <Divider.Root />

        <div className='flex flex-col gap-2'>
          <span className='text-label-sm text-text-strong-950'>
            Inside Business Profile you can view and update:
          </span>
          <ul className='flex flex-col gap-1'>
            {EXPECTED_ITEMS.map((item) => (
              <li
                key={item}
                className='text-paragraph-sm text-text-sub-600'
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className='flex flex-col gap-1.5'>
          <Button.Root
            variant='primary'
            size='small'
            className='w-fit'
            onClick={() =>
              notification({
                status: 'information',
                title: 'Business Profile',
                description:
                  'The full Business Profile screen isn’t designed yet, so this button has no destination in the prototype.',
              })
            }
          >
            Manage Business Profile
            <Button.Icon as={RiArrowRightUpLine} />
          </Button.Root>
          <DemoNote>
            The dedicated Business Profile screen isn&apos;t designed yet, so
            this button fires a toast instead of navigating.
          </DemoNote>
        </div>
      </div>
    </SettingsCard>
  );
}
