'use client';

import * as React from 'react';
import { format, isSameDay } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import { Calendar } from '@/components/ui/datepicker';
import { STANDARD_RANGE_PRESETS } from './date-range-presets';
import {
  areDateRangesEqual,
  PresetItem,
  PresetsContainer,
} from './preset-ui';
import { rangeCalendarClassNames } from './range-calendar-styles';

function RangeSummary({ range }: { range: DateRange | undefined }) {
  return (
    <div className='text-paragraph-sm text-text-sub-600'>
      Range:{' '}
      <span className='text-label-sm text-text-strong-950'>
        {range?.from ? (
          <>
            {format(range.from, 'LLL dd, y')}
            {range.to && <> - {format(range.to, 'LLL dd, y')}</>}
          </>
        ) : (
          <span>Select a range</span>
        )}
      </span>
    </div>
  );
}

export function InlineRangeDatepicker() {
  const [range, setRange] = React.useState<DateRange | undefined>(undefined);
  const [month, setMonth] = React.useState<Date | undefined>(range?.from);

  React.useEffect(() => {
    if (range?.from) {
      setMonth(range.from);
    }
  }, [range]);

  return (
    <div className='m-4 inline-flex w-fit flex-col overflow-hidden rounded-20 bg-bg-white-0 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200 sm:w-[632px]'>
      <div className='flex h-full flex-col md:flex-row'>
        <PresetsContainer className='border-b sm:border-b-0 sm:border-r'>
          <div className='flex flex-row gap-2 overflow-x-auto md:flex-col md:overflow-x-visible'>
            {STANDARD_RANGE_PRESETS.map((preset) => (
              <PresetItem
                key={preset.label}
                onClick={() => setRange(preset.dateRange)}
                isActive={areDateRangesEqual(range, preset.dateRange, isSameDay)}
                className='whitespace-nowrap md:whitespace-normal'
              >
                {preset.label}
              </PresetItem>
            ))}
          </div>
        </PresetsContainer>

        <div className='min-w-0 flex-1'>
          <div className='flex w-full flex-col'>
            <Calendar
              mode='range'
              month={month}
              onMonthChange={setMonth}
              selected={range}
              onSelect={setRange}
              numberOfMonths={1}
              initialFocus
              showOutsideDays={false}
              classNames={rangeCalendarClassNames}
            />
            <div className='flex items-center justify-between gap-4 border-t border-stroke-soft-200 p-4 pl-6'>
              <RangeSummary range={range} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
