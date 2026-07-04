'use client';

import * as React from 'react';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarCheckLine,
  RiCalendarLine,
  RiCloseLine,
  RiForbidLine,
  RiSunLine,
  RiTimeLine,
} from '@remixicon/react';
import { format, isSameDay } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import type { RemixiconComponentType } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import { Calendar } from '@/components/ui/datepicker';
import * as Popover from '@/components/ui/popover';
import { areDateRangesEqual } from './preset-ui';
import { cn } from '@/utils/cn';

const SCHEDULING_PRESETS: {
  icon: RemixiconComponentType;
  iconColor: string;
  label: string;
  dateRange: DateRange;
}[] = [
  {
    icon: RiSunLine,
    iconColor: 'text-away-base',
    label: 'Tomorrow',
    dateRange: {
      from: new Date(new Date().setDate(new Date().getDate() + 1)),
      to: new Date(new Date().setDate(new Date().getDate() + 1)),
    },
  },
  {
    icon: RiCalendarLine,
    iconColor: 'text-success-base',
    label: 'Later this week',
    dateRange: {
      from: new Date(),
      to: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
  },
  {
    icon: RiCalendarCheckLine,
    iconColor: 'text-feature-base',
    label: 'Next week',
    dateRange: {
      from: new Date(),
      to: new Date(new Date().setDate(new Date().getDate() + 14)),
    },
  },
  {
    icon: RiForbidLine,
    iconColor: 'text-error-base',
    label: 'No date',
    dateRange: { from: new Date(), to: new Date() },
  },
];

function SchedulingPresetItem({
  className,
  isActive,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }) {
  return (
    <button
      type='button'
      className={cn(
        'flex w-full items-center justify-between px-4 py-2 text-label-sm hover:bg-bg-weak-50',
        { 'bg-bg-weak-50': isActive },
        className,
      )}
      {...rest}
    />
  );
}

export function SchedulingDatepicker() {
  const [open, setOpen] = React.useState(true);
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
          {committedRange?.from
            ? format(committedRange.from, 'dd MMMM, HH:mm')
            : 'Select a date'}
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content
        unstyled
        className='w-[min(368px,calc(100vw-32px))] min-w-[280px] rounded-20 bg-bg-white-0 p-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'
      >
        <div className='flex w-full flex-col'>
          <div className='flex items-center justify-between gap-2 border-b border-stroke-soft-200 px-4 py-3'>
            <div className='flex items-center gap-2'>
              <RiTimeLine className='size-5 shrink-0 text-text-soft-400' />
              <div className='text-label-sm text-text-sub-600'>
                {range?.from
                  ? format(range.from, 'dd MMMM, HH:mm a')
                  : 'Select a time'}
              </div>
            </div>
            <CompactButton.Root variant='ghost' onClick={() => setOpen(false)}>
              <CompactButton.Icon as={RiCloseLine} className='text-text-sub-600' />
            </CompactButton.Root>
          </div>

          <div className='flex flex-col gap-0.5 p-2'>
            {SCHEDULING_PRESETS.map((preset) => {
              const Icon = preset.icon;

              return (
                <SchedulingPresetItem
                  key={preset.label}
                  onClick={() => setRange(preset.dateRange)}
                  isActive={areDateRangesEqual(
                    range,
                    preset.dateRange,
                    isSameDay,
                  )}
                  className='flex justify-between gap-2.5 rounded-lg px-3 py-2'
                >
                  <div className='flex items-center gap-2.5'>
                    <Icon className={cn('size-5', preset.iconColor)} />
                    <span className='text-label-sm text-text-sub-600'>
                      {preset.label}
                    </span>
                  </div>
                  <span className='text-label-sm text-text-soft-400'>
                    {preset.label === 'Next week'
                      ? format(preset.dateRange.from!, 'EEE, dd MMMM')
                      : format(preset.dateRange.from!, 'EEEE')}
                  </span>
                </SchedulingPresetItem>
              );
            })}
          </div>

          <div className='w-full border-t border-stroke-soft-200'>
            <Calendar
              mode='single'
              month={month}
              onMonthChange={setMonth}
              selected={range?.from}
              onSelect={(date) =>
                setRange(date ? { from: date, to: date } : undefined)
              }
              numberOfMonths={1}
              initialFocus
              showOutsideDays
              weekStartsOn={1}
              classNames={{
                caption_start: 'p-0 w-full',
                caption_end: 'p-0 w-full',
                nav_button_previous: 'top-1/2 -translate-y-1/2 left-3',
                months: 'flex w-full divide-x divide-stroke-soft-200',
                nav_button_next: 'top-1/2 -translate-y-1/2 right-3',
                caption:
                  'relative flex h-9 w-full items-center justify-center border-b border-stroke-soft-200 px-3 py-2 text-center',
                table:
                  'flex w-full flex-col items-center justify-center !mt-0 border-collapse p-3',
                row: 'mt-2 grid w-full auto-cols-fr grid-flow-col gap-2',
                cell: 'group/cell relative h-10 w-full select-none p-0',
                day: cn(
                  'flex h-10 w-full items-center justify-center rounded-lg text-center text-label-sm text-text-sub-600 outline-none transition duration-200 ease-out hover:bg-bg-weak-50 hover:text-text-strong-950 focus:outline-none focus-visible:bg-bg-weak-50 focus-visible:text-text-strong-950 aria-[selected]:bg-primary-base aria-[selected]:text-static-white',
                ),
                day_today:
                  'after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-primary-base',
                tbody: 'w-full',
                head: 'w-full',
                head_cell:
                  'flex size-10 w-full select-none items-center justify-center text-center text-label-sm uppercase text-text-soft-400',
              }}
              components={{
                IconLeft: () => (
                  <RiArrowLeftSLine className='size-5 text-text-sub-600' />
                ),
                IconRight: () => (
                  <RiArrowRightSLine className='size-5 text-text-sub-600' />
                ),
              }}
            />
          </div>

          <div className='flex justify-end gap-4 border-t border-stroke-soft-200 p-4'>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              onClick={handleCancel}
              className='flex-1 rounded-10'
            >
              Cancel
            </Button.Root>
            <Button.Root
              variant='primary'
              mode='filled'
              size='small'
              onClick={handleApply}
              className='flex-1 rounded-10'
            >
              Apply
            </Button.Root>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
