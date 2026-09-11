'use client';

// Toolbar row: stage tabs, keyword search, country select, add filter/keyword
// actions. Figma: node 2454:45581 "Header / Search filters", inside the
// Panel / Search filters container (node 2454:45531). Presentational only.

import * as React from 'react';
import { RiAddLine, RiFilter3Line, RiSearch2Line } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Select from '@/components/ui/select';
import * as SegmentedControl from '@/components/ui/segmented-control';

const STAGE_TABS = [
  { value: 'active', label: 'Active' },
  { value: 'evaluating', label: 'Evaluating' },
  { value: 'awarded', label: 'Awarded' },
] as const;

export function ToolbarRow() {
  return (
    <div className='flex min-w-0 items-center gap-3'>
      <SegmentedControl.Root defaultValue='active' className='w-80 shrink-0'>
        <SegmentedControl.List>
          {STAGE_TABS.map((tab) => (
            <SegmentedControl.Trigger key={tab.value} value={tab.value}>
              {tab.label}
            </SegmentedControl.Trigger>
          ))}
        </SegmentedControl.List>
      </SegmentedControl.Root>

      <div className='flex min-w-0 flex-1 items-center justify-end gap-3'>
        {/* size='small' = h-9/rounded-lg, matching the 36px/8px-radius row
            height set by Select and the buttons below (medium is 40px/10px).
            flex-1 + min-w: the search box is the one element built to give
            up space first, so the row compresses here instead of overflowing
            past the panel's rounded corner at narrower widths. */}
        <Input.Root size='small' className='min-w-[160px] max-w-[300px] flex-1'>
          <Input.Wrapper>
            <Input.Icon as={RiSearch2Line} />
            {/* [confirmed] Scoped to reference/contract number, buyer name,
                and tender title/contract object only — the three fields
                that can return suggestions without new search logic.
                Everything else (category, location, dates, value) stays in
                the filter rows; document text stays in the Documents
                keyword row; fuzzy/supplier/competitor matching is deferred.
                Copy avoids "keyword" so this never reads as the same
                mechanism as the Document/Contract Object rows. */}
            <Input.Input placeholder='Reference, buyer, or tender title' />
          </Input.Wrapper>
        </Input.Root>

        <Select.Root size='small' defaultValue='pt'>
          <Select.Trigger className='w-[180px] shrink-0'>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='pt' textValue='Portugal'>
              <span aria-hidden='true' className='text-label-md leading-none'>
                🇵🇹
              </span>
              Portugal
            </Select.Item>
          </Select.Content>
        </Select.Root>

        {/* h-9 override: Button has no 36px size (small is 32px), but the
            Figma row height is 36px throughout. */}
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='small'
          className='h-9'
        >
          <Button.Icon as={RiFilter3Line} />
          Add filter
        </Button.Root>

        <Button.Root
          variant='neutral'
          mode='stroke'
          size='small'
          className='h-9'
        >
          <Button.Icon as={RiAddLine} />
          Add keywords
        </Button.Root>
      </div>
    </div>
  );
}
