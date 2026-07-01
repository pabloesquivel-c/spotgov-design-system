'use client';

import { RiCheckboxCircleLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Tooltip from '@/components/ui/tooltip';

import { useTooltipSide } from './use-tooltip-side';

const passwordRequirements = [
  'At least 1 uppercase',
  'At least 1 number',
  'At least 8 characters',
] as const;

export function PasswordRequirementsTooltip() {
  const tooltipSide = useTooltipSide();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke' size='small'>
          Password Requirements
        </Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content
        size='medium'
        variant='light'
        className='w-[266px] px-4 py-3'
        side={tooltipSide}
      >
        <div className='flex flex-col gap-2'>
          <div className='flex w-full gap-2'>
            <div className='h-1 flex-1 rounded-sm bg-error-base' />
            <div className='h-1 flex-1 rounded-sm bg-warning-base' />
            <div className='h-1 flex-1 rounded-sm bg-success-base' />
          </div>
          <div className='text-paragraph-xs text-text-sub-600'>
            Must contain at least;
          </div>
          {passwordRequirements.map((requirement) => (
            <div key={requirement} className='flex items-center gap-1'>
              <RiCheckboxCircleLine className='size-icon-inline text-success-base' />
              <span className='text-label-xs text-text-sub-600'>
                {requirement}
              </span>
            </div>
          ))}
        </div>
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
