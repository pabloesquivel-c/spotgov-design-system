'use client';

import * as React from 'react';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCloseLine,
  RiTimeLine,
} from '@remixicon/react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as CompactButton from '@/components/ui/compact-button';
import { Calendar } from '@/components/ui/datepicker';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import { rangeCellClassNames } from './range-calendar-styles';
import { cn } from '@/utils/cn';

export function EventCalendarDatepicker() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 15),
    to: new Date(2024, 0, 21),
  });
  const [participants, setParticipants] = React.useState(10);
  const [openToAll, setOpenToAll] = React.useState(true);

  return (
    <div className='h-fit w-[min(736px,calc(100vw-32px))] min-w-[280px] rounded-20 bg-bg-white-0 p-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex items-start justify-between px-5 py-4'>
        <div className='flex items-center gap-[14px]'>
          <div className='flex size-11 shrink-0 items-center justify-center rounded-full bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200'>
            <RiTimeLine className='size-icon-emphasis text-text-sub-600' />
          </div>
          <div className='flex flex-col gap-1'>
            <h2 className='text-label-md text-text-strong-950'>Event Calendar</h2>
            <p className='text-paragraph-sm text-text-sub-600'>
              Schedule your team meetings and events easily
            </p>
          </div>
        </div>
        <CompactButton.Root variant='ghost' size='large'>
          <CompactButton.Icon as={RiCloseLine} />
        </CompactButton.Root>
      </div>

      <div className='flex w-full flex-col border-t border-stroke-soft-200 sm:flex-row'>
        <div className='flex-1'>
          <Calendar
            mode='range'
            selected={range}
            onSelect={setRange}
            defaultMonth={new Date(2024, 0)}
            numberOfMonths={1}
            weekStartsOn={1}
            showOutsideDays={false}
            classNames={{
              caption:
                'relative mb-2 flex h-9 w-full items-center justify-center rounded-full bg-bg-weak-50 px-3 py-2 text-center',
              tbody: 'w-full',
              head: 'w-full',
              nav_button_previous:
                'top-1/2 -translate-y-1/2 left-1.5 !rounded-full',
              nav_button_next:
                'top-1/2 -translate-y-1/2 right-1.5 !rounded-full',
              day: cn(
                'flex aspect-square h-full w-full items-center justify-center rounded-full text-center text-label-sm text-text-sub-600 outline-none transition duration-200 ease-out hover:bg-bg-weak-50 hover:text-text-strong-950 focus:outline-none focus-visible:bg-bg-weak-50 focus-visible:text-text-strong-950 aria-[selected]:bg-primary-base aria-[selected]:text-static-white',
              ),
              table:
                'flex w-full flex-col items-center justify-center !mt-0 border-collapse',
              row: 'mt-2 grid w-full auto-cols-fr grid-flow-col gap-2',
              head_cell:
                'flex size-10 w-full select-none items-center justify-center text-center text-label-sm uppercase text-text-soft-400',
              cell: rangeCellClassNames,
            }}
            components={{
              IconLeft: () => (
                <RiArrowLeftSLine className='size-icon !rounded-full' />
              ),
              IconRight: () => (
                <RiArrowRightSLine className='size-icon !rounded-full' />
              ),
            }}
          />
        </div>

        <div className='max-w-[368px] flex-1 border-t border-stroke-soft-200 sm:border-l sm:border-t-0'>
          <div className='flex flex-col gap-3 p-5'>
            <div className='flex flex-col gap-1.5'>
              <Label.Root htmlFor='event-start-date'>
                Start date <Label.Asterisk />
              </Label.Root>
              <Input.Root className='w-full'>
                <Input.Wrapper>
                  <Input.Input
                    id='event-start-date'
                    type='text'
                    value={range?.from ? format(range.from, 'yyyy-MM-dd') : ''}
                    readOnly
                    className='text-label-sm text-text-sub-600'
                  />
                  <Input.Input
                    type='time'
                    defaultValue='09:00'
                    className='border-l border-stroke-soft-200 pl-4 text-label-sm text-text-sub-600 [&::-webkit-calendar-picker-indicator]:hidden'
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label.Root htmlFor='event-end-date'>
                End date <Label.Asterisk />
              </Label.Root>
              <Input.Root className='w-full'>
                <Input.Wrapper>
                  <Input.Input
                    id='event-end-date'
                    type='text'
                    value={range?.to ? format(range.to, 'yyyy-MM-dd') : ''}
                    readOnly
                    className='text-label-sm text-text-sub-600'
                  />
                  <Input.Input
                    type='time'
                    defaultValue='09:00'
                    className='border-l border-stroke-soft-200 pl-4 text-label-sm text-text-sub-600 [&::-webkit-calendar-picker-indicator]:hidden'
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
          </div>
          <div className='flex flex-col gap-4 border-t border-stroke-soft-200 p-5'>
            <div className='flex flex-col gap-1.5'>
              <Label.Root htmlFor='event-participants'>
                Maximum participants
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='event-participants'
                    type='number'
                    value={participants}
                    onChange={(e) => setParticipants(Number(e.target.value))}
                    required
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox.Root
                id='event-open-to-all'
                checked={openToAll}
                onCheckedChange={(checked) => setOpenToAll(checked === true)}
              />
              <Label.Root className='text-paragraph-sm' htmlFor='event-open-to-all'>
                Open to all departments
              </Label.Root>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col items-center justify-between gap-4 border-t border-stroke-soft-200 p-4 pl-6 sm:flex-row'>
        <div>
          <span className='text-label-sm text-text-soft-400'>Range:</span>{' '}
          <span className='text-paragraph-sm text-text-sub-600'>
            {range?.from && format(range.from, 'MMMM dd, yyyy')} -{' '}
            {range?.to && format(range.to, 'MMMM dd, yyyy')}
          </span>
        </div>
        <div className='flex gap-4'>
          <Button.Root variant='neutral' mode='stroke' size='small'>
            Cancel
          </Button.Root>
          <Button.Root variant='primary' mode='filled' size='small'>
            Schedule meetings
          </Button.Root>
        </div>
      </div>
    </div>
  );
}
