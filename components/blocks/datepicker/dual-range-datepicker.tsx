'use client';

import * as React from 'react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import * as Button from '@/components/ui/button';
import { Calendar } from '@/components/ui/datepicker';
import { EXTENDED_RANGE_PRESETS } from './date-range-presets';
import { PresetItem, PresetsContainer } from './preset-ui';
import {
  rangeCalendarClassNames,
  rangeCalendarComponents,
} from './range-calendar-styles';

export function DualRangeDatepicker() {
  const [beforeDate, setBeforeDate] = React.useState<Date | undefined>(
    undefined,
  );
  const [afterDate, setAfterDate] = React.useState<Date | undefined>(undefined);
  const [localBeforeDate, setLocalBeforeDate] = React.useState(beforeDate);
  const [localAfterDate, setLocalAfterDate] = React.useState(afterDate);
  const [range, setRange] = React.useState<DateRange | undefined>(
    localAfterDate && localBeforeDate
      ? { from: localAfterDate, to: localBeforeDate }
      : undefined,
  );

  const handleRangeSelect = (selectedRange: DateRange | undefined) => {
    if (!selectedRange) {
      return;
    }

    setLocalAfterDate(selectedRange.from);
    setLocalBeforeDate(selectedRange.to);
    setRange(selectedRange);
  };

  const handleApply = () => {
    setBeforeDate(localBeforeDate);
    setAfterDate(localAfterDate);
  };

  const handleCancel = () => {
    setLocalBeforeDate(beforeDate);
    setLocalAfterDate(afterDate);
    setRange(
      afterDate && beforeDate
        ? { from: afterDate, to: beforeDate }
        : undefined,
    );
  };

  return (
    <div className='w-[min(936px,calc(100vw-32px))] rounded-20 bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex h-full flex-col md:flex-row'>
        <PresetsContainer className='border-b md:border-b-0 md:border-r'>
          <div className='flex flex-row gap-2 overflow-x-auto md:flex-col md:overflow-x-visible'>
            {EXTENDED_RANGE_PRESETS.map((preset) => (
              <PresetItem
                key={preset.label}
                onClick={() => {
                  setLocalAfterDate(preset.dateRange.from);
                  setLocalBeforeDate(preset.dateRange.to);
                  setRange(preset.dateRange);
                }}
                isActive={
                  localAfterDate?.getTime() ===
                    preset.dateRange.from?.getTime() &&
                  localBeforeDate?.getTime() === preset.dateRange.to?.getTime()
                }
                className='whitespace-nowrap md:whitespace-normal'
              >
                {preset.label}
              </PresetItem>
            ))}
          </div>
        </PresetsContainer>

        <div className='flex-1'>
          <div className='flex w-full flex-col'>
            <div className='flex w-full flex-col md:flex-row'>
              <div className='flex-1'>
                <Calendar
                  mode='range'
                  selected={range}
                  onSelect={handleRangeSelect}
                  defaultMonth={localAfterDate}
                  numberOfMonths={1}
                  initialFocus
                  showOutsideDays={false}
                  weekStartsOn={1}
                  classNames={rangeCalendarClassNames}
                  components={rangeCalendarComponents}
                />
              </div>
              <div className='flex-1 border-stroke-soft-200 md:border-l'>
                <Calendar
                  mode='range'
                  selected={range}
                  onSelect={handleRangeSelect}
                  defaultMonth={localBeforeDate}
                  numberOfMonths={1}
                  initialFocus
                  showOutsideDays={false}
                  weekStartsOn={1}
                  classNames={rangeCalendarClassNames}
                  components={rangeCalendarComponents}
                />
              </div>
            </div>
            <div className='flex flex-col items-center justify-between gap-3 border-t border-stroke-soft-200 p-4 md:flex-row'>
              <div>
                <span className='text-label-sm text-text-soft-400'>Range:</span>{' '}
                <span className='text-label-sm text-text-sub-600'>
                  {range?.from && range?.to
                    ? `${format(range.from, 'MMMM dd, yyyy')} - ${format(range.to, 'MMMM dd, yyyy')}`
                    : 'Select a range'}
                </span>
              </div>
              <div className='flex gap-4'>
                <Button.Root
                  variant='neutral'
                  mode='stroke'
                  size='small'
                  onClick={handleCancel}
                >
                  Cancel
                </Button.Root>
                <Button.Root
                  variant='primary'
                  mode='filled'
                  size='small'
                  onClick={handleApply}
                >
                  Apply
                </Button.Root>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
