'use client';

import * as Button from '@/components/ui/button';
import * as Tooltip from '@/components/ui/tooltip';

import { useTooltipSide } from './use-tooltip-side';

const riskLevels = [
  { color: 'bg-error-base', label: 'High', value: '1' },
  { color: 'bg-warning-base', label: 'Medium', value: '2' },
  { color: 'bg-success-base', label: 'Low', value: '2' },
] as const;

export function RiskReportTooltip() {
  const tooltipSide = useTooltipSide();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke' size='small'>
          Risk Report
        </Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content
        size='medium'
        variant='light'
        className='w-[226px] p-0'
        side={tooltipSide}
      >
        <div className='flex flex-col gap-2 px-4 py-2.5'>
          <div className='text-label-xs text-text-soft-400'>
            Risks identified as of Aug 20
          </div>
          <div className='space-y-2'>
            {riskLevels.map((risk) => (
              <div
                key={risk.label}
                className='flex items-center justify-between'
              >
                <div className='flex items-center gap-2'>
                  <div className={`size-3 rounded-sm ${risk.color}`} />
                  <span className='text-label-xs text-text-sub-600'>
                    {risk.label}
                  </span>
                </div>
                <span className='text-label-xs text-text-sub-600'>
                  {risk.value}
                </span>
              </div>
            ))}
            <div className='border-t border-stroke-soft-200 pt-2'>
              <div className='flex items-center justify-between'>
                <span className='text-label-xs text-text-sub-600'>Total</span>
                <span className='text-label-xs text-text-sub-600'>5</span>
              </div>
            </div>
          </div>
        </div>
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
