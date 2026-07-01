'use client';

import * as React from 'react';

import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';
import * as Label from '@/components/ui/label';
import { drawerPanelClassName } from './drawer-panel';

const EQUITY_PLAN_ITEMS = [
  { id: 'equity-stock', label: 'Stock' },
  { id: 'equity-rsu', label: 'RSU' },
  { id: 'equity-cash-plans', label: 'Cash Plans', checked: true },
];

const TIER_ITEMS = [
  { id: 'tier-preferred', label: 'Preferred', checked: true },
  { id: 'tier-possible', label: 'Possible', checked: true },
  { id: 'tier-discouraged', label: 'Discouraged' },
  {
    id: 'tier-align-countries',
    label: 'Show only countries supported by Align',
  },
];

export function EquityFiltersDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          Open Filters
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content className={drawerPanelClassName}>
        <div className='flex h-full flex-col'>
          <Drawer.Header>
            <Drawer.Title className='text-label-lg text-text-strong-950'>
              Filters
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className='flex-1 overflow-y-auto'>
            <Divider.Root variant='solid-text'>EQUITY PLAN</Divider.Root>
            <div className='flex flex-col gap-4 p-5'>
              {EQUITY_PLAN_ITEMS.map((item) => (
                <div key={item.id} className='flex items-center gap-2'>
                  <Checkbox.Root id={item.id} defaultChecked={item.checked} />
                  <Label.Root htmlFor={item.id} className='text-paragraph-sm'>
                    {item.label}
                  </Label.Root>
                </div>
              ))}
            </div>
            <Divider.Root variant='solid-text'>TIERS</Divider.Root>
            <div className='flex flex-col gap-4 p-5'>
              {TIER_ITEMS.map((item) => (
                <div key={item.id} className='flex items-center gap-2'>
                  <Checkbox.Root id={item.id} defaultChecked={item.checked} />
                  <Label.Root htmlFor={item.id} className='text-paragraph-sm'>
                    {item.label}
                  </Label.Root>
                </div>
              ))}
            </div>
          </Drawer.Body>
          <Drawer.Footer className='flex justify-between gap-3 border-t border-stroke-soft-200 p-5'>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='medium'
              className='flex-1'
              onClick={() => setOpen(false)}
            >
              Reset
            </Button.Root>
          </Drawer.Footer>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
}
