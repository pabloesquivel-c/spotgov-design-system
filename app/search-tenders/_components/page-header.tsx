'use client';

// Page header. Figma: node 2454:47816 "Page Header [1.1]".
// Title/subtitle + Views (stroke) and Export (filled) actions, divider below.
// Presentational only, no logic.

import * as React from 'react';
import { RiExportLine, RiStackLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';

export function PageHeader() {
  return (
    <div className='flex items-center gap-3 border-b border-stroke-soft-200 px-8 py-5'>
      <div className='flex flex-1 flex-col gap-1'>
        <p className='text-label-lg text-text-strong-950'>Search Tenders</p>
        <p className='text-paragraph-sm text-text-sub-600'>
          Every tender, at every stage of its life.
        </p>
      </div>

      <div className='flex shrink-0 items-center gap-3'>
        <Button.Root variant='neutral' mode='stroke' size='small'>
          <Button.Icon as={RiStackLine} />
          Views
        </Button.Root>

        <Button.Root variant='neutral' mode='filled' size='small'>
          <Button.Icon as={RiExportLine} />
          Export
        </Button.Root>
      </div>
    </div>
  );
}
