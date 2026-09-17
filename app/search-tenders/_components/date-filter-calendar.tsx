'use client';

// The date filter's calendar popover: what opens for a date field's single
// value trigger (e.g. Submission Deadline "is after"). Figma: node
// 2446:31336 "Submission Deadline-Filter-Dropdown".
//
// Unlike the other pickers on this screen, this one is asked to actually
// work: month navigation and day selection are real state, not a static
// mock. Built on react-day-picker directly (not the components/ui/datepicker
// Calendar wrapper) because the caption here is one merged pill with the
// arrows inside it, and the selected-day color is black, not the
// primitive's default primary blue — both need custom classNames/layout
// the wrapper doesn't expose.
//
// Apply reports the current selection via `onSelect`; the caller (a
// FilterValueTrigger in filter-row.tsx) uses that to close its own popover
// and store the date on the row. Clear only resets the calendar's own
// selection — it doesn't fire onSelect or close, so clearing mid-pick
// doesn't dismiss the popover out from under you.
//
// Keyboard: react-day-picker already moves focus through the grid with the
// arrow keys, so there's no index model to add here — but the same two
// rules as every other picker on this screen still apply, and neither was
// being met. Hover is switched off while the keyboard drives (`data-nav`,
// see useNavMode), or the day the pointer is parked on stays lit next to
// the focused one; and the focused day now draws a ring, which a bare
// `outline-none` had been suppressing with nothing put back in its place.

import * as React from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { DayPicker, useNavigation } from 'react-day-picker';

import * as Button from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { isNavigationKey, useNavMode } from './use-option-navigation';

function CalendarCaption() {
  const { currentMonth, goToMonth, previousMonth, nextMonth } =
    useNavigation();

  return (
    <div className='flex w-full items-center justify-center gap-1.5 rounded-lg bg-bg-weak-50 p-1.5'>
      <button
        type='button'
        aria-label='Previous month'
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
        className='flex size-6 shrink-0 items-center justify-center rounded-md bg-bg-white-0 shadow-regular-xs disabled:opacity-40'
      >
        <RiArrowLeftSLine className='size-5 text-text-sub-600' />
      </button>

      <p className='flex-1 text-center text-label-sm text-text-sub-600'>
        {currentMonth.toLocaleDateString('en-GB', {
          month: 'long',
          year: 'numeric',
        })}
      </p>

      <button
        type='button'
        aria-label='Next month'
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
        className='flex size-6 shrink-0 items-center justify-center rounded-md bg-bg-white-0 shadow-regular-xs disabled:opacity-40'
      >
        <RiArrowRightSLine className='size-5 text-text-sub-600' />
      </button>
    </div>
  );
}

export function DateFilterCalendar({
  value,
  onSelect,
}: {
  /** The row's currently applied date, if any — reopening the calendar
   * should pick up where the last Apply left off. */
  value?: Date;
  /** Fires on Apply with the calendar's current selection (or `undefined`
   * after Clear + Apply). Omit to keep the calendar decorative, as every
   * specimen usage does. */
  onSelect?: (date: Date | undefined) => void;
}) {
  // No fallback date. This used to seed `new Date(2024, 0, 11)` when the
  // row had no date yet, so opening an untouched Submission Deadline filter
  // landed on January 2024 with a day already selected — a value the user
  // never picked, which Apply would then commit.
  const [selected, setSelected] = React.useState<Date | undefined>(value);
  const { navMode, markKeyboard, onPointerMove } = useNavMode();

  return (
    <div
      data-nav={navMode}
      onPointerMoveCapture={onPointerMove}
      // Capture, not bubble: react-day-picker calls stopPropagation() on
      // every arrow key it handles (dist/index.js:1560), so a bubble-phase
      // listener here never hears the one event it exists to hear. A
      // "which device is driving" detector shouldn't be defeatable by a
      // child in any case — capture is the correct phase for it.
      onKeyDownCapture={(event) => {
        if (isNavigationKey(event.key)) {
          markKeyboard();
        }
      }}
      className='group/calendar flex w-[320px] flex-col items-start overflow-hidden rounded-xl border border-stroke-soft-200 bg-bg-white-0 shadow-regular-md'
    >
      <div className='w-full border-b border-stroke-soft-200 px-4 py-5'>
        <DayPicker
          mode='single'
          selected={selected}
          onSelect={setSelected}
          defaultMonth={selected}
          weekStartsOn={1}
          formatters={{
            formatWeekdayName: (day) =>
              day
                .toLocaleDateString('en-GB', { weekday: 'short' })
                .slice(0, 2)
                .toUpperCase(),
          }}
          classNames={{
            months: 'w-full',
            month: 'flex w-full flex-col gap-2',
            caption: 'w-full',
            table: 'w-full border-collapse',
            head_row: 'flex gap-2',
            head_cell:
              'flex-1 py-2.5 text-center text-label-sm text-text-sub-600',
            row: 'flex w-full gap-2 mt-0',
            cell: 'flex-1 p-0 text-center',
            day: cn(
              'flex size-10 w-full items-center justify-center rounded-lg text-label-sm text-text-sub-600 outline-none',
              // No colour transition: arrowing across a month is a keyboard
              // action, and easing each day smears the trail behind it.
              // Hover is gated on the pointer actually being in charge.
              'group-data-[nav=pointer]/calendar:hover:bg-bg-weak-50 group-data-[nav=pointer]/calendar:hover:text-text-strong-950',
              // Same treatment as the option rows in the other pickers, so
              // a focused day and a focused filter-type row read alike —
              // bg-fill, the same tone hover already uses, not a ring. A
              // ring is the standalone-control treatment (buttons, inputs);
              // a day cell inside an already-open calendar just needs to
              // read as "highlighted".
              'focus-visible:bg-bg-weak-50 focus-visible:text-text-strong-950',
              'aria-[selected]:bg-bg-strong-950 aria-[selected]:text-static-white group-data-[nav=pointer]/calendar:aria-[selected]:hover:bg-bg-strong-950',
            ),
            day_today: '!bg-bg-weak-50',
            day_outside: '!text-text-disabled-300',
            day_disabled: '!text-text-disabled-300',
          }}
          components={{ Caption: CalendarCaption }}
        />
      </div>

      <div className='flex w-full items-center justify-between px-4 py-3'>
        <Button.Root
          variant='neutral'
          mode='ghost'
          size='xsmall'
          onClick={() => setSelected(undefined)}
        >
          Clear
        </Button.Root>
        <Button.Root
          variant='neutral'
          mode='filled'
          size='xsmall'
          onClick={() => onSelect?.(selected)}
        >
          Apply
        </Button.Root>
      </div>
    </div>
  );
}
