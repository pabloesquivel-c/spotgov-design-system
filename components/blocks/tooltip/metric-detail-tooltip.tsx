'use client';

import * as Button from '@/components/ui/button';
import * as Tooltip from '@/components/ui/tooltip';

import { useTooltipSide } from './use-tooltip-side';

export function MetricDetailTooltip() {
  const tooltipSide = useTooltipSide();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          Hover or focus
        </Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content
        size='medium'
        variant='light'
        className='w-[195px] p-0'
        side={tooltipSide}
      >
        <div className='flex flex-col'>
          <div className='px-4 py-2.5'>
            <div className='relative flex items-center gap-3'>
              <div className='h-12 w-0.5 bg-error-base' />
              <div>
                <div className='text-label-lg text-text-strong-950'>35.92%</div>
                <div className='text-label-xs text-text-sub-600'>
                  397.66 over 1,107
                </div>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-2 border-t border-stroke-soft-200'>
            <div className='flex flex-col border-r border-stroke-soft-200 px-4 py-2.5'>
              <div className='text-label-sm text-text-sub-600'>GB</div>
              <div className='text-paragraph-xs text-text-soft-400'>Country</div>
            </div>
            <div className='flex flex-col px-4 py-2.5'>
              <div className='text-label-sm text-text-sub-600'>Q3/25</div>
              <div className='text-paragraph-xs text-text-soft-400'>Quarters</div>
            </div>
          </div>
        </div>
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
