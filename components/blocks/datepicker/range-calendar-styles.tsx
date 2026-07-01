import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';

import { cn } from '@/utils/cn';

export const rangeCellClassNames = cn(
  'group/cell relative h-10 w-full select-none p-0',
  '[&:has(.day-range-middle)]:bg-primary-alpha-10',
  '[&:has(.day-range-start):not(:has(.day-range-end))]:rounded-l-full [&:has(.day-range-start):not(:has(.day-range-end))]:bg-primary-alpha-10 [&:has(.day-range-start):not(:has(.day-range-end))]:before:block',
  '[&:has(.day-range-end):not(:has(.day-range-start))]:rounded-r-full [&:has(.day-range-end):not(:has(.day-range-start))]:bg-primary-alpha-10',
  '[&:not(:has(+_*_[type=button]))]:before:hidden',
  'before:absolute before:inset-y-0 before:-right-2 before:hidden before:w-2 before:bg-primary-alpha-10',
  'last:[&:has(.day-range-middle)]:before:hidden',
  '[&:has(.day-range-middle)]:before:block',
  '[&:has(.day-range-end)]:before:left-0 [&:has(.day-range-end)]:before:right-auto',
);

export const rangeDayClassNames = cn(
  'flex h-10 w-full items-center justify-center rounded-lg text-center text-label-sm text-text-sub-600 outline-none transition duration-200 ease-out hover:bg-bg-weak-50 hover:text-text-strong-950 focus:outline-none focus-visible:bg-bg-weak-50 focus-visible:text-text-strong-950',
  'aria-[selected]:bg-primary-base aria-[selected]:text-static-white',
  'day-range-middle:text-primary-base',
);

export const rangeCalendarClassNames = {
  months: 'flex w-full',
  caption_start: 'p-5 w-full',
  caption_end: 'p-5 w-full',
  table: 'w-full border-collapse flex justify-center items-center flex-col !mt-0',
  row: 'grid grid-flow-col auto-cols-fr w-full mt-2 gap-2',
  cell: rangeCellClassNames,
  day: rangeDayClassNames,
  head_cell:
    'text-text-soft-400 text-label-sm uppercase size-10 flex items-center justify-center text-center select-none w-full mt-2',
  tbody: 'w-full',
  head: 'w-full',
};

export const rangeCalendarComponents = {
  IconLeft: () => <RiArrowLeftSLine className='size-icon text-text-sub-600' />,
  IconRight: () => <RiArrowRightSLine className='size-icon text-text-sub-600' />,
};
