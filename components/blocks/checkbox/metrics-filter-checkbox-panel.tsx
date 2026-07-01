'use client';

import * as Checkbox from '@/components/ui/checkbox';
import * as Label from '@/components/ui/label';

export function MetricsFilterCheckboxPanel() {
  return (
    <div className='flex w-[200px] shrink-0 flex-col -space-y-px divide-y divide-stroke-soft-200 rounded-20 bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex flex-col gap-3 p-4 pb-5'>
        <div className='text-label-sm text-text-soft-400'>Performance Metrics</div>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <Checkbox.Root id='metrics-roi' defaultChecked />
            <Label.Root htmlFor='metrics-roi'>ROI</Label.Root>
          </div>
          <div className='flex items-center gap-2'>
            <Checkbox.Root id='metrics-volatility' />
            <Label.Root htmlFor='metrics-volatility'>Volatility</Label.Root>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-3 p-4 pb-5'>
        <div className='text-label-sm text-text-soft-400'>Benchmarks</div>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <Checkbox.Root id='metrics-sharpe' defaultChecked />
            <Label.Root htmlFor='metrics-sharpe'>Sharpe Ratio</Label.Root>
          </div>
          <div className='flex items-center gap-2'>
            <Checkbox.Root id='metrics-sp500' />
            <Label.Root htmlFor='metrics-sp500'>S&P 500</Label.Root>
          </div>
          <div className='flex items-center gap-2'>
            <Checkbox.Root id='metrics-sector' />
            <Label.Root htmlFor='metrics-sector'>Sector Average</Label.Root>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-3 p-4 pb-5'>
        <div className='text-label-sm text-text-soft-400'>Risk Analysis</div>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <Checkbox.Root id='metrics-var' defaultChecked />
            <Label.Root htmlFor='metrics-var'>Value at Risk</Label.Root>
          </div>
          <div className='flex items-center gap-2'>
            <Checkbox.Root id='metrics-beta' />
            <Label.Root htmlFor='metrics-beta'>Beta</Label.Root>
          </div>
          <div className='flex items-center gap-2'>
            <Checkbox.Root id='metrics-drawdown' />
            <Label.Root htmlFor='metrics-drawdown'>Drawdown</Label.Root>
          </div>
        </div>
      </div>
    </div>
  );
}
