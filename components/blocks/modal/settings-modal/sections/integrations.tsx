'use client';

import * as React from 'react';
import { RiDownload2Line, RiPlugLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import { notification } from '@/hooks/use-notification';

type Integration = { id: string; name: string; description: string };

// Vendor marks will replace these temporary icons once the assets are available.
const SERVICES: Integration[] = [
  {
    id: 'vortal',
    name: 'Vortal',
    description: 'Sync tender notices and submissions from Vortal.',
  },
  {
    id: 'acingov',
    name: 'Acingov',
    description: 'Import opportunities published on the Acingov platform.',
  },
];

export function IntegrationsModalSection() {
  return (
    <ul className='flex flex-col gap-5'>
      {SERVICES.map((service, index) => (
        <React.Fragment key={service.id}>
          <li className='flex min-h-12 items-center gap-3.5'>
            <span className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <RiPlugLine
                className='size-6 text-text-sub-600'
                aria-hidden='true'
              />
            </span>

            <div className='min-w-0 flex-1'>
              <p className='text-label-md text-text-strong-950'>
                {service.name}
              </p>
              <p className='text-paragraph-xs text-text-sub-600'>
                {service.description}
              </p>
            </div>

            <Button.Root
              variant='neutral'
              mode='stroke'
              size='xsmall'
              className='shrink-0'
              onClick={() =>
                notification({
                  status: 'success',
                  title: `${service.name} install started`,
                })
              }
            >
              <Button.Icon as={RiDownload2Line} />
              Install
            </Button.Root>
          </li>

          {index < SERVICES.length - 1 ? (
            <Divider.Root variant='line-spacing' />
          ) : null}
        </React.Fragment>
      ))}
    </ul>
  );
}
