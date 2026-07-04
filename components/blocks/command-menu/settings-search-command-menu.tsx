'use client';

import * as React from 'react';
import {
  RiAppsLine,
  RiArrowRightSLine,
  RiSettings2Line,
  RiShoppingBag2Line,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as CommandMenu from '@/components/ui/command-menu';
import * as CompactButton from '@/components/ui/compact-button';
import * as LinkButton from '@/components/ui/link-button';
import * as Tag from '@/components/ui/tag';
import { CommandMenuKeyboardFooter } from './command-menu-keyboard-footer';
import { CommandMenuSearchHeader } from './command-menu-search-header';

const RESULTS = [
  {
    title: 'Customer communications',
    description:
      'Interactions between a business and its customers through various channels.',
  },
  {
    title: 'Customer SMS notification',
    description:
      'Automated text messages providing updates or information to customers.',
  },
  {
    title: 'Customize email templates',
    description:
      'Tailoring pre-designed email layouts to match branding and messaging preferences.',
  },
  {
    title: 'Custom order fulfillment',
    description:
      'Fulfilling customer orders with tailored or specialized handling',
  },
];

export function SettingsSearchCommandMenu() {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Button.Root variant='neutral' mode='stroke' onClick={() => setOpen(true)}>
        Open Command Menu
      </Button.Root>
      <CommandMenu.Dialog open={open} onOpenChange={setOpen}>
        <CommandMenuSearchHeader onClose={() => setOpen(false)} />

        <div className='px-5 py-4'>
          <div className='mb-3 text-label-xs text-text-sub-600'>Searching for</div>
          <div className='flex flex-wrap gap-2'>
            <Tag.Root variant='stroke'>
              <Tag.Icon as={RiSettings2Line} />
              Settings (36)
              <Tag.DismissButton type='button' />
            </Tag.Root>
            <Tag.Root variant='stroke'>
              <Tag.Icon as={RiShoppingBag2Line} />
              Orders (4)
              <Tag.DismissButton type='button' />
            </Tag.Root>
            <Tag.Root variant='stroke'>
              <Tag.Icon as={RiAppsLine} />
              Products (2)
              <Tag.DismissButton type='button' />
            </Tag.Root>
          </div>
        </div>

        <CommandMenu.List>
          <CommandMenu.Group heading='Results (56)'>
            <LinkButton.Root
              size='small'
              variant='gray'
              className='absolute right-4 top-5'
            >
              See All
            </LinkButton.Root>
            {RESULTS.map((result) => (
              <CommandMenu.Item key={result.title} size='medium'>
                <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
                  <RiSettings2Line className='size-5 text-text-sub-600' />
                </div>
                <div className='flex flex-1 flex-col gap-1'>
                  <span className='text-label-sm'>{result.title}</span>
                  <span className='text-paragraph-xs text-text-sub-600'>
                    {result.description}
                  </span>
                </div>
                <CompactButton.Root variant='ghost' size='medium'>
                  <CompactButton.Icon as={RiArrowRightSLine} />
                </CompactButton.Root>
              </CommandMenu.Item>
            ))}
          </CommandMenu.Group>
        </CommandMenu.List>

        <CommandMenuKeyboardFooter />
      </CommandMenu.Dialog>
    </>
  );
}
