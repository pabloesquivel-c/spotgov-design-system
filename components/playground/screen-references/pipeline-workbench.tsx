'use client';

import * as React from 'react';
import {
  RiAddLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarCheckLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiFilter3Line,
  RiSearch2Line,
  RiSettings2Line,
  RiTimeLine,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Input from '@/components/ui/input';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import * as Tooltip from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import { ReferenceScreenShell } from './reference-screen-shell';

type EventKind = 'review' | 'submission' | 'clarification' | 'conflict';
type View = 'all' | 'reviews' | 'conflicts' | 'submissions';

type PipelineEvent = {
  id: string;
  day: string;
  time: string;
  title: string;
  tender: string;
  kind: EventKind;
};

const DAYS = [
  { key: 'mon', label: 'Monday', date: '20 Jul' },
  { key: 'tue', label: 'Tuesday', date: '21 Jul' },
  { key: 'wed', label: 'Wednesday', date: '22 Jul' },
  { key: 'thu', label: 'Thursday', date: '23 Jul' },
  { key: 'fri', label: 'Friday', date: '24 Jul' },
];

const TIMES = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'];

const BASE_EVENTS: PipelineEvent[] = [
  {
    id: 'review-porto',
    day: 'mon',
    time: '09:00',
    title: 'Compliance review',
    tender: 'Porto digital services',
    kind: 'review',
  },
  {
    id: 'clarification-lisbon',
    day: 'tue',
    time: '10:30',
    title: 'Clarification cutoff',
    tender: 'Lisbon mobility data',
    kind: 'clarification',
  },
  {
    id: 'conflict-pricing',
    day: 'tue',
    time: '13:30',
    title: 'Pricing review conflict',
    tender: 'Two review owners unavailable',
    kind: 'conflict',
  },
  {
    id: 'review-health',
    day: 'wed',
    time: '12:00',
    title: 'Evidence review',
    tender: 'Health cloud services',
    kind: 'review',
  },
  {
    id: 'submission-braga',
    day: 'thu',
    time: '15:00',
    title: 'Final submission',
    tender: 'Braga contact centre',
    kind: 'submission',
  },
  {
    id: 'review-security',
    day: 'fri',
    time: '09:00',
    title: 'Security sign-off',
    tender: 'School network services',
    kind: 'review',
  },
];

const WEEK_LABELS = [
  '13 to 17 July 2026',
  '20 to 24 July 2026',
  '27 to 31 July 2026',
];

function eventClass(kind: EventKind) {
  if (kind === 'submission') {
    return 'bg-success-lighter text-success-base ring-success-base';
  }
  if (kind === 'clarification') {
    return 'bg-warning-lighter text-warning-base ring-warning-base';
  }
  if (kind === 'conflict') {
    return 'bg-error-lighter text-error-base ring-error-base';
  }
  return 'bg-information-lighter text-information-base ring-information-base';
}

function eventLabel(kind: EventKind) {
  if (kind === 'submission') return 'Submission';
  if (kind === 'clarification') return 'Clarification';
  if (kind === 'conflict') return 'Conflict';
  return 'Review';
}

function eventIcon(kind: EventKind) {
  if (kind === 'submission') return RiCheckboxCircleLine;
  if (kind === 'conflict') return RiErrorWarningLine;
  if (kind === 'clarification') return RiTimeLine;
  return RiCalendarCheckLine;
}

function matchesView(event: PipelineEvent, view: View) {
  if (view === 'all') return true;
  if (view === 'reviews') return event.kind === 'review';
  if (view === 'conflicts') return event.kind === 'conflict';
  return event.kind === 'submission';
}

export function PipelineWorkbench() {
  const [view, setView] = React.useState<View>('all');
  const [week, setWeek] = React.useState(1);
  const [query, setQuery] = React.useState('');
  const [milestoneAdded, setMilestoneAdded] = React.useState(false);

  const events = React.useMemo(() => {
    const allEvents = milestoneAdded
      ? [
          ...BASE_EVENTS,
          {
            id: 'new-milestone',
            day: 'wed',
            time: '15:00',
            title: 'Bid decision',
            tender: 'Regional analytics capability',
            kind: 'review' as const,
          },
        ]
      : BASE_EVENTS;
    const normalized = query.trim().toLowerCase();
    return allEvents.filter(
      (event) =>
        matchesView(event, view) &&
        (normalized.length === 0 ||
          `${event.title} ${event.tender}`.toLowerCase().includes(normalized)),
    );
  }, [milestoneAdded, query, view]);

  return (
    <ReferenceScreenShell
      activeKey='pipeline-radar'
      title='Pipeline workbench'
      description='Coordinate reviews, clarification cutoffs, and submissions.'
      actions={
        <>
          <Input.Root size='small' className='w-56'>
            <Input.Wrapper>
              <Input.Icon as={RiSearch2Line} />
              <Input.Input
                aria-label='Search pipeline events'
                placeholder='Search schedule...'
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </Input.Wrapper>
          </Input.Root>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Button.Root
                variant='neutral'
                mode='stroke'
                size='small'
                className='w-9 px-0'
                aria-label='Workbench settings'
              >
                <Button.Icon as={RiSettings2Line} />
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content>Workbench settings</Tooltip.Content>
          </Tooltip.Root>
          <Button.Root
            variant='primary'
            size='small'
            disabled={milestoneAdded}
            onClick={() => setMilestoneAdded(true)}
          >
            <Button.Icon
              as={milestoneAdded ? RiCheckboxCircleLine : RiAddLine}
            />
            {milestoneAdded ? 'Milestone added' : 'Add milestone'}
          </Button.Root>
          <span className='sr-only' aria-live='polite'>
            {milestoneAdded ? 'Bid decision milestone added.' : ''}
          </span>
        </>
      }
      mainClassName='flex flex-col overflow-hidden'
    >
      <div className='flex items-center justify-between gap-6'>
        <div className='flex items-center gap-2'>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            onClick={() => setWeek(1)}
          >
            Today
          </Button.Root>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <CompactButton.Root
                variant='stroke'
                size='large'
                aria-label='Previous week'
                disabled={week === 0}
                onClick={() => setWeek((current) => Math.max(0, current - 1))}
              >
                <CompactButton.Icon as={RiArrowLeftSLine} />
              </CompactButton.Root>
            </Tooltip.Trigger>
            <Tooltip.Content>Previous week</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <CompactButton.Root
                variant='stroke'
                size='large'
                aria-label='Next week'
                disabled={week === WEEK_LABELS.length - 1}
                onClick={() =>
                  setWeek((current) =>
                    Math.min(WEEK_LABELS.length - 1, current + 1),
                  )
                }
              >
                <CompactButton.Icon as={RiArrowRightSLine} />
              </CompactButton.Root>
            </Tooltip.Trigger>
            <Tooltip.Content>Next week</Tooltip.Content>
          </Tooltip.Root>
          <span
            className='ml-2 text-label-sm text-text-strong-950'
            aria-live='polite'
          >
            {WEEK_LABELS[week]}
          </span>
        </div>

        <Button.Root
          variant='neutral'
          mode={view === 'conflicts' ? 'lighter' : 'stroke'}
          size='small'
          aria-pressed={view === 'conflicts'}
          onClick={() =>
            setView((current) =>
              current === 'conflicts' ? 'all' : 'conflicts',
            )
          }
        >
          <Button.Icon as={RiFilter3Line} />
          {view === 'conflicts' ? 'Conflicts only' : 'Filter conflicts'}
        </Button.Root>
      </div>

      <TabMenuHorizontal.Root
        value={view}
        onValueChange={(value) => setView(value as View)}
        className='mt-3'
      >
        <TabMenuHorizontal.List>
          <TabMenuHorizontal.Trigger value='all'>
            All scheduled ({BASE_EVENTS.length + (milestoneAdded ? 1 : 0)})
          </TabMenuHorizontal.Trigger>
          <TabMenuHorizontal.Trigger value='reviews'>
            Reviews
          </TabMenuHorizontal.Trigger>
          <TabMenuHorizontal.Trigger value='conflicts'>
            Conflicts (1)
          </TabMenuHorizontal.Trigger>
          <TabMenuHorizontal.Trigger value='submissions'>
            Submissions
          </TabMenuHorizontal.Trigger>
        </TabMenuHorizontal.List>
      </TabMenuHorizontal.Root>

      <div className='mt-4 grid grid-cols-4 gap-4'>
        {[
          {
            label: 'Next deadline',
            value: 'Tomorrow, 12:00',
            detail: 'Lisbon mobility data',
            kind: 'clarification' as const,
          },
          {
            label: 'Reviews today',
            value: '2 reviews',
            detail: 'One needs an owner',
            kind: 'review' as const,
          },
          {
            label: 'Conflict',
            value: 'Pricing review',
            detail: 'Tuesday at 13:30',
            kind: 'conflict' as const,
          },
          {
            label: 'Submission',
            value: 'Thursday, 15:00',
            detail: 'Braga contact centre',
            kind: 'submission' as const,
          },
        ].map((summary) => {
          const Icon = eventIcon(summary.kind);
          return (
            <button
              key={summary.label}
              type='button'
              onClick={() => {
                if (summary.kind === 'review') setView('reviews');
                if (summary.kind === 'conflict') setView('conflicts');
                if (summary.kind === 'submission') setView('submissions');
                if (summary.kind === 'clarification') setView('all');
              }}
              className='flex min-w-0 items-start gap-3 rounded-2xl bg-bg-white-0 p-3 text-left shadow-regular-xs outline-none ring-1 ring-inset ring-stroke-soft-200 transition-colors hover:bg-bg-weak-50 focus-visible:shadow-button-important-focus'
            >
              <span
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-full ring-1 ring-inset',
                  eventClass(summary.kind),
                )}
              >
                <Icon className='size-5' aria-hidden='true' />
              </span>
              <span className='min-w-0'>
                <span className='block text-paragraph-xs text-text-sub-600'>
                  {summary.label}
                </span>
                <span className='block truncate text-label-sm text-text-strong-950'>
                  {summary.value}
                </span>
                <span
                  className='block truncate text-paragraph-xs text-text-sub-600'
                  title={summary.detail}
                >
                  {summary.detail}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className='mt-4 min-h-0 flex-1 overflow-auto rounded-2xl ring-1 ring-inset ring-stroke-soft-200'>
        <table className='w-full min-w-[960px] border-separate border-spacing-0'>
          <caption className='sr-only'>
            Bid pipeline schedule for {WEEK_LABELS[week]}
          </caption>
          <thead className='sticky top-0 z-10 bg-bg-white-0'>
            <tr>
              <th
                scope='col'
                className='w-20 border-b border-r border-stroke-soft-200 px-2 py-3 text-left text-label-xs text-text-sub-600'
              >
                UTC+1
              </th>
              {DAYS.map((day) => (
                <th
                  key={day.key}
                  scope='col'
                  className='border-b border-r border-stroke-soft-200 px-3 py-3 text-left last:border-r-0'
                >
                  <span className='block text-label-sm text-text-strong-950'>
                    {day.label}
                  </span>
                  <span className='block text-paragraph-xs text-text-sub-600'>
                    {day.date}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMES.map((time) => (
              <tr key={time}>
                <th
                  scope='row'
                  className='h-20 border-b border-r border-stroke-soft-200 px-2 text-left align-top text-paragraph-xs font-normal text-text-sub-600'
                >
                  <span className='relative -top-2 bg-bg-white-0 pr-2'>
                    {time}
                  </span>
                </th>
                {DAYS.map((day) => {
                  const slotEvents = events.filter(
                    (event) => event.day === day.key && event.time === time,
                  );
                  return (
                    <td
                      key={`${day.key}-${time}`}
                      className='h-20 border-b border-r border-stroke-soft-200 p-2 align-top last:border-r-0'
                    >
                      {slotEvents.map((event) => {
                        const Icon = eventIcon(event.kind);
                        return (
                          <button
                            key={event.id}
                            type='button'
                            className={cn(
                              'flex w-full flex-col rounded-lg p-2 text-left outline-none ring-1 ring-inset transition-opacity hover:opacity-80 focus-visible:shadow-button-important-focus',
                              eventClass(event.kind),
                            )}
                            aria-label={`${eventLabel(event.kind)}: ${
                              event.title
                            }, ${event.tender}, ${day.label} at ${event.time}`}
                          >
                            <span className='flex items-center gap-1 text-label-xs'>
                              <Icon className='size-4' aria-hidden='true' />
                              {eventLabel(event.kind)}
                            </span>
                            <span className='mt-1 truncate text-label-sm text-text-strong-950'>
                              {event.title}
                            </span>
                            <span
                              className='truncate text-paragraph-xs text-text-sub-600'
                              title={event.tender}
                            >
                              {event.tender}
                            </span>
                          </button>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReferenceScreenShell>
  );
}
