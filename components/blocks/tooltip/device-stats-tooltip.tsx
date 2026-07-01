'use client';

import * as Button from '@/components/ui/button';
import * as Tooltip from '@/components/ui/tooltip';

import { useTooltipSide } from './use-tooltip-side';

const deviceStats = [
  { color: 'bg-success-base', label: 'Desktop', value: '1' },
  { color: 'bg-feature-base', label: 'Mobile', value: '49' },
  { color: 'bg-error-base', label: 'Tablet', value: '5' },
] as const;

export function DeviceStatsTooltip() {
  const tooltipSide = useTooltipSide();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke' size='small'>
          Device Stats
        </Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content
        size='medium'
        variant='light'
        className='w-[220px] p-0'
        side={tooltipSide}
      >
        <div className='flex flex-col'>
          <div className='px-4 pt-2.5'>
            <div className='text-label-sm text-text-strong-950'>Impressions</div>
            <div className='text-paragraph-xs text-text-sub-600'>
              Tuesday 19 November 2024
            </div>
          </div>
          <div className='space-y-3 px-4 py-3'>
            {deviceStats.map((device) => (
              <div
                key={device.label}
                className='flex items-center justify-between'
              >
                <div className='flex items-center gap-2'>
                  <div
                    className={`size-3 rounded-full ${device.color}`}
                  />
                  <span className='text-label-xs text-text-sub-600'>
                    {device.label}
                  </span>
                </div>
                <span className='text-label-xs text-text-sub-600'>
                  {device.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
