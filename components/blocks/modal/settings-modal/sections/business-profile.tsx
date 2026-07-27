'use client';

import { RiArrowRightUpLine } from '@remixicon/react';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import { notification } from '@/hooks/use-notification';

const details = [
  ['Legal name', 'Acme Corporation'],
  ['Tax ID', 'US-482913004'],
  ['Registered address', '500 Market St, San Francisco, CA'],
  ['Primary sector', 'IT & Consulting Services'],
];

export function BusinessProfileModalSection() {
  return (
    <div className='flex flex-col gap-5'>
      <dl className='grid gap-x-6 gap-y-4 sm:grid-cols-2'>
        {details.map(([label, value]) => (
          <div key={label} className='flex flex-col gap-0.5'>
            <dt className='text-paragraph-xs text-text-sub-600'>{label}</dt>
            <dd className='text-label-sm text-text-strong-950'>{value}</dd>
          </div>
        ))}
      </dl>
      <Divider.Root />
      <div className='flex flex-col gap-2'>
        <span className='text-label-sm text-text-strong-950'>
          Business profile includes:
        </span>
        <ul className='flex list-disc flex-col gap-1 pl-5 text-paragraph-sm text-text-sub-600'>
          <li>Legal name, address, and registration details</li>
          <li>Certifications and compliance documents</li>
          <li>Licenses required for tender categories</li>
        </ul>
      </div>
      <Button.Root
        variant='primary'
        size='small'
        className='w-fit'
        onClick={() =>
          notification({ status: 'information', title: 'Business profile' })
        }
      >
        Manage business profile
        <Button.Icon as={RiArrowRightUpLine} />
      </Button.Root>
    </div>
  );
}
