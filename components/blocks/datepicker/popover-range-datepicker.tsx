'use client';

import * as React from 'react';
import { format, isSameDay } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import * as Button from '@/components/ui/button';
import { Calendar } from '@/components/ui/datepicker';
import * as Popover from '@/components/ui/popover';
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

export function PopoverRangeDatepicker() {
  const [open, setOpen] = React.useState(false);
  const [committedRange, setCommittedRange] = React.useState<
    DateRange | undefined
  >(undefined);
  const [range, setRange] = React.useState<DateRange | undefined>(committedRange);
  const [month, setMonth] = React.useState<Date | undefined>(range?.from);

  React.useEffect(() => {
    setRange(committedRange);
  }, [committedRange]);

  React.useEffect(() => {
    if (range?.from) {
      setMonth(range.from);
    }
  }, [range]);

  React.useEffect(() => {
    if (!open && committedRange?.from) {
      setMonth(committedRange.from);
    }
  }, [open, committedRange]);

  const handleCancel = () => {
    setRange(committedRange);
  };

  const handleApply = () => {
    setCommittedRange(range);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleCancel();
    }
    setOpen(isOpen);
  };

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          {committedRange?.from ? (
            <>
              {format(committedRange.from, 'LLL dd, y')}
              {committedRange.to && (
                <> - {format(committedRange.to, 'LLL dd, y')}</>
              )}
            </>
          ) : (
            <span>Select a range</span>
          )}
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content className='w-[min(632px,calc(100vw-32px))] p-0'>
        <div className='flex h-full flex-col md:flex-row'>
          <PresetsContainer className='border-b md:border-b-0 md:border-r'>
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
              <div className='flex flex-col gap-3 border-t border-stroke-soft-200 p-4 px-6 md:flex-row md:items-center md:justify-between'>
                <RangeSummary range={range} />
                <div className='flex w-full gap-4 md:w-auto'>
                  <Button.Root
                    variant='neutral'
                    mode='stroke'
                    size='small'
                    className='flex-1 md:flex-none'
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button.Root>
                  <Button.Root
                    variant='primary'
                    mode='filled'
                    size='small'
                    className='flex-1 md:flex-none'
                    onClick={handleApply}
                  >
                    Apply
                  </Button.Root>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
