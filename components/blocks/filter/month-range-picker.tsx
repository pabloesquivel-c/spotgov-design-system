'use client';

import * as React from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { Label as ReactAriaLabel } from 'react-aria-components';
import type { DateRange } from 'react-day-picker';

import { inputVariants } from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import { cn } from '@/utils/cn';
import { HorizontalDivider } from './filter-sidebar';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function MonthCalendar({
  year,
  onYearChange,
  onMonthClick,
  getMonthClassName,
}: {
  year: number;
  onYearChange: (increment: number) => void;
  onMonthClick: (monthIndex: number) => void;
  getMonthClassName: (year: number, month: number) => string;
}) {
  return (
    <div className='flex-1'>
      <div className='flex h-5 items-center justify-between'>
        <button
          type='button'
          onClick={() => onYearChange(-1)}
          className='flex items-center justify-center rounded-full p-1 hover:bg-bg-weak-50'
        >
          <RiArrowLeftSLine className='size-5 text-text-sub-600' />
        </button>
        <span className='text-label-sm text-text-sub-600'>{year}</span>
        <button
          type='button'
          onClick={() => onYearChange(1)}
          className='flex items-center justify-center rounded-full p-1 hover:bg-bg-weak-50'
        >
          <RiArrowRightSLine className='size-5 text-text-sub-600' />
        </button>
      </div>
      <div className='py-4'>
        <HorizontalDivider />
      </div>
      <div className='grid grid-cols-3 gap-y-1'>
        {MONTH_NAMES.map((month, index) => (
          <button
            key={month}
            type='button'
            onClick={() => onMonthClick(index)}
            className={cn(
              'flex h-8 w-full items-center justify-center text-center text-label-sm font-medium outline-none transition duration-200 ease-out',
              getMonthClassName(year, index),
            )}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
}

function DateSelector({
  label,
  selectedDate,
  year,
  onYearChange,
  onMonthClick,
  getMonthClassName,
}: {
  label: string;
  selectedDate?: Date;
  year: number;
  onYearChange: (increment: number) => void;
  onMonthClick: (monthIndex: number) => void;
  getMonthClassName: (year: number, month: number) => string;
}) {
  const { root, wrapper } = inputVariants();

  return (
    <div className='flex flex-1 flex-col gap-4 p-5'>
      <div className='flex flex-col gap-1'>
        <Label.Root asChild>
          <ReactAriaLabel className='block text-label-sm text-text-strong-950'>
            {label}
          </ReactAriaLabel>
        </Label.Root>
        <div className={root()}>
          <div className={wrapper({ class: 'h-9 cursor-pointer' })}>
            <div className='flex h-full w-full items-center'>
              {selectedDate ? (
                <span className='text-paragraph-sm text-text-strong-950'>
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    month: 'short',
                  })}
                  {', '}
                  {new Date(selectedDate).getFullYear()}
                </span>
              ) : (
                <span className='text-paragraph-sm text-text-sub-600'>
                  MM / YYYY
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <MonthCalendar
        year={year}
        onYearChange={onYearChange}
        onMonthClick={onMonthClick}
        getMonthClassName={getMonthClassName}
      />
    </div>
  );
}

function useMonthDateRange() {
  const [range, setRange] = React.useState<DateRange>({
    from: new Date(2024, 4, 1),
    to: new Date(2025, 1, 1),
  });
  const [fromYear, setFromYear] = React.useState(2024);
  const [toYear, setToYear] = React.useState(2025);

  const selectMonth = (year: number, monthIndex: number) => {
    const isFromMatch =
      range.from &&
      range.from.getFullYear() === year &&
      range.from.getMonth() === monthIndex;
    const isToMatch =
      range.to &&
      range.to.getFullYear() === year &&
      range.to.getMonth() === monthIndex;

    if (isFromMatch || isToMatch) {
      if (isFromMatch) {
        setRange((prev) => ({ ...prev, from: undefined }));
      }
      if (isToMatch) {
        setRange((prev) => ({ ...prev, to: undefined }));
      }
      return;
    }

    if (!range.from || (range.from && range.to)) {
      setRange({ from: new Date(year, monthIndex, 1), to: undefined });
      return;
    }

    if (range.from && !range.to) {
      const fromTime = range.from.getTime();
      const selectedTime = new Date(year, monthIndex, 1).getTime();

      if (selectedTime < fromTime) {
        setRange({ from: new Date(year, monthIndex, 1), to: range.from });
      } else {
        setRange({ from: range.from, to: new Date(year, monthIndex, 1) });
      }
    }
  };

  const changeYear = (
    currentYear: number,
    setYear: React.Dispatch<React.SetStateAction<number>>,
    type: 'from' | 'to',
    increment: number,
  ) => {
    const nextYear = currentYear + increment;
    setYear(nextYear);

    const date = type === 'from' ? range.from : range.to;
    if (date && date.getFullYear() === currentYear) {
      setRange((prev) => ({
        ...prev,
        [type]: new Date(nextYear, date.getMonth(), 1),
      }));
    }
  };

  const isMonthInRange = (year: number, month: number) => {
    if (!range.from && !range.to) {
      return false;
    }

    if (range.from && !range.to) {
      return (
        range.from.getFullYear() === year && range.from.getMonth() === month
      );
    }

    if (!range.from && range.to) {
      return range.to.getFullYear() === year && range.to.getMonth() === month;
    }

    if (range.from && range.to) {
      const fromTime = new Date(
        range.from.getFullYear(),
        range.from.getMonth(),
        1,
      ).getTime();
      const toTime = new Date(
        range.to.getFullYear(),
        range.to.getMonth(),
        1,
      ).getTime();
      const currentTime = new Date(year, month, 1).getTime();

      return currentTime >= fromTime && currentTime <= toTime;
    }

    return false;
  };

  const getMonthClassName = (year: number, month: number) => {
    const isFrom =
      range.from &&
      range.from.getFullYear() === year &&
      range.from.getMonth() === month;
    const isTo =
      range.to &&
      range.to.getFullYear() === year &&
      range.to.getMonth() === month;
    const inRange = isMonthInRange(year, month);
    const column = month % 3;
    const isLeft = column === 0;
    const isRight = column === 2;

    const color =
      isFrom || isTo
        ? 'bg-information-light text-information-dark'
        : inRange
          ? 'bg-information-lighter text-information-dark'
          : 'text-text-sub-600 hover:bg-bg-weak-50';

    let border = 'rounded-10';

    if (isFrom && isTo) {
      border = 'rounded-10';
    } else if (isFrom) {
      border = 'rounded-l-lg rounded-r-none';
    } else if (isTo) {
      border = 'rounded-r-lg rounded-l-none';
    } else if (inRange) {
      border = isLeft
        ? 'rounded-l-lg rounded-r-none'
        : isRight
          ? 'rounded-r-lg rounded-l-none'
          : 'rounded-none';
    }

    return `${color} ${border}`;
  };

  const handleClear = () => {
    const now = new Date();
    setFromYear(now.getFullYear());
    setToYear(now.getFullYear());
    setRange({ from: now, to: now });
  };

  return {
    range,
    fromYear,
    toYear,
    changeFromYear: (increment: number) =>
      changeYear(fromYear, setFromYear, 'from', increment),
    changeToYear: (increment: number) =>
      changeYear(toYear, setToYear, 'to', increment),
    handleCalendarClick: selectMonth,
    handleClear,
    getMonthClassName,
  };
}

export function MonthRangePicker({
  range,
  fromYear,
  toYear,
  changeFromYear,
  changeToYear,
  handleCalendarClick,
  getMonthClassName,
}: {
  range: { from?: Date; to?: Date };
  fromYear: number;
  toYear: number;
  changeFromYear: (increment: number) => void;
  changeToYear: (increment: number) => void;
  handleCalendarClick: (year: number, monthIndex: number) => void;
  getMonthClassName: (year: number, month: number) => string;
}) {
  return (
    <div className='flex flex-col md:flex-row'>
      <DateSelector
        label='From'
        selectedDate={range.from}
        year={fromYear}
        onYearChange={changeFromYear}
        onMonthClick={(monthIndex) => handleCalendarClick(fromYear, monthIndex)}
        getMonthClassName={getMonthClassName}
      />
      <div className='relative hidden bg-stroke-soft-200 md:block md:h-auto md:w-px' />
      <HorizontalDivider className='md:hidden' />
      <DateSelector
        label='To'
        selectedDate={range.to}
        year={toYear}
        onYearChange={changeToYear}
        onMonthClick={(monthIndex) => handleCalendarClick(toYear, monthIndex)}
        getMonthClassName={getMonthClassName}
      />
    </div>
  );
}

export { useMonthDateRange };
