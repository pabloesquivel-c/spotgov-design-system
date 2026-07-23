'use client';

import * as React from 'react';
import {
  RiAddLine,
  RiArrowRightSLine,
  RiCalendarScheduleLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiFileSearchLine,
  RiMore2Line,
  RiNotification3Line,
  RiSearch2Line,
  RiTimeLine,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as ButtonGroup from '@/components/ui/button-group';
import * as Checkbox from '@/components/ui/checkbox';
import * as CompactButton from '@/components/ui/compact-button';
import * as Input from '@/components/ui/input';
import * as ProgressBar from '@/components/ui/progress-bar';
import * as StatusBadge from '@/components/ui/status-badge';
import * as Tooltip from '@/components/ui/tooltip';
import { ReferenceScreenShell } from './reference-screen-shell';

const REVIEW_ITEMS = [
  {
    id: 'compliance',
    title: 'Compliance matrix',
    meta: 'Lisbon mobility framework',
  },
  {
    id: 'pricing',
    title: 'Pricing assumptions',
    meta: 'Porto data platform',
  },
  {
    id: 'evidence',
    title: 'Evidence pack',
    meta: 'National health procurement',
  },
];

const NOTE_ITEMS = [
  'Confirm consortium eligibility',
  'Request updated insurance certificate',
  'Check clarification response',
];

const SCHEDULE = {
  '23': [
    {
      time: '10:00',
      title: 'Bid review',
      detail: 'Porto data platform',
      status: 'pending' as const,
    },
    {
      time: '14:30',
      title: 'Clarification cutoff',
      detail: 'Lisbon mobility framework',
      status: 'failed' as const,
    },
    {
      time: '16:00',
      title: 'Compliance check',
      detail: 'Health procurement',
      status: 'completed' as const,
    },
  ],
  '24': [
    {
      time: '09:30',
      title: 'Pricing sign-off',
      detail: 'Porto data platform',
      status: 'pending' as const,
    },
    {
      time: '15:00',
      title: 'Submission rehearsal',
      detail: 'Lisbon mobility framework',
      status: 'pending' as const,
    },
  ],
  '25': [],
};

function statusIcon(status: 'completed' | 'pending' | 'failed') {
  if (status === 'completed') return RiCheckboxCircleLine;
  if (status === 'failed') return RiCloseCircleLine;
  return RiTimeLine;
}

function Widget({
  id,
  title,
  action,
  children,
}: {
  id: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className='flex min-h-0 flex-col overflow-hidden rounded-2xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'
    >
      <div className='flex min-h-8 items-center justify-between gap-3'>
        <h3 id={id} className='text-label-md text-text-strong-950'>
          {title}
        </h3>
        {action}
      </div>
      <div className='mt-4 min-h-0 flex-1'>{children}</div>
    </section>
  );
}

export function BidOperationsDashboard() {
  const [query, setQuery] = React.useState('');
  const [draftCreated, setDraftCreated] = React.useState(false);
  const [reviewed, setReviewed] = React.useState<string[]>([]);
  const [notes, setNotes] = React.useState<string[]>([NOTE_ITEMS[0]]);
  const [day, setDay] = React.useState<keyof typeof SCHEDULE>('23');

  const toggleReviewed = (id: string) => {
    setReviewed((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const toggleNote = (note: string) => {
    setNotes((current) =>
      current.includes(note)
        ? current.filter((item) => item !== note)
        : [...current, note],
    );
  };

  return (
    <ReferenceScreenShell
      activeKey='saved-tenders'
      title='Bid operations'
      description='Prioritize reviews, deadlines, and active submissions.'
      actions={
        <>
          <Input.Root size='small' className='w-56'>
            <Input.Wrapper>
              <Input.Icon as={RiSearch2Line} />
              <Input.Input
                aria-label='Search bid operations'
                placeholder='Search bids...'
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
                aria-label='Open notifications'
                className='w-9 px-0'
              >
                <Button.Icon as={RiNotification3Line} />
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content>Notifications</Tooltip.Content>
          </Tooltip.Root>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            onClick={() => {
              const firstPending = REVIEW_ITEMS.find(
                (item) => !reviewed.includes(item.id),
              );
              if (firstPending) toggleReviewed(firstPending.id);
            }}
          >
            Review queue
          </Button.Root>
          <Button.Root
            variant='primary'
            size='small'
            disabled={draftCreated}
            onClick={() => setDraftCreated(true)}
            aria-busy={false}
          >
            <Button.Icon as={draftCreated ? RiCheckboxCircleLine : RiAddLine} />
            {draftCreated ? 'Draft created' : 'Create bid plan'}
          </Button.Root>
          <span className='sr-only' aria-live='polite'>
            {draftCreated ? 'Bid plan draft created.' : ''}
          </span>
        </>
      }
      mainClassName='overflow-hidden'
    >
      <div className='grid h-full min-h-0 grid-cols-3 gap-6'>
        <div className='col-span-2 grid min-h-0 grid-cols-2 grid-rows-2 gap-6'>
          <Widget id='priority-summary-title' title='Priority summary'>
            <div className='flex h-full flex-col justify-between'>
              {[
                {
                  label: 'Due in 48 hours',
                  value: '3 bids',
                  status: 'failed' as const,
                  icon: RiCloseCircleLine,
                },
                {
                  label: 'Waiting for review',
                  value: `${REVIEW_ITEMS.length - reviewed.length} items`,
                  status: 'pending' as const,
                  icon: RiTimeLine,
                },
                {
                  label: 'Ready to submit',
                  value: '2 bids',
                  status: 'completed' as const,
                  icon: RiCheckboxCircleLine,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className='flex items-center justify-between gap-4 border-b border-stroke-soft-200 py-3 last:border-b-0'
                >
                  <div className='min-w-0'>
                    <p className='text-label-sm text-text-strong-950'>
                      {item.label}
                    </p>
                    <p className='text-paragraph-xs text-text-sub-600'>
                      {item.value}
                    </p>
                  </div>
                  <StatusBadge.Root variant='light' status={item.status}>
                    <StatusBadge.Icon as={item.icon} />
                    {item.status === 'failed'
                      ? 'Urgent'
                      : item.status === 'pending'
                        ? 'Review'
                        : 'Ready'}
                  </StatusBadge.Root>
                </div>
              ))}
            </div>
          </Widget>

          <Widget
            id='active-bid-title'
            title='Active bid'
            action={
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <CompactButton.Root
                    variant='ghost'
                    size='large'
                    aria-label='More actions for active bid'
                  >
                    <CompactButton.Icon as={RiMore2Line} />
                  </CompactButton.Root>
                </Tooltip.Trigger>
                <Tooltip.Content>More actions</Tooltip.Content>
              </Tooltip.Root>
            }
          >
            <div className='flex h-full flex-col'>
              <div className='flex size-10 items-center justify-center rounded-full bg-primary-alpha-10 text-primary-base'>
                <RiFileSearchLine className='size-5' aria-hidden='true' />
              </div>
              <p
                className='mt-3 truncate text-label-sm text-text-strong-950'
                title='Digital services framework for the Municipality of Porto'
              >
                Digital services framework for the Municipality of Porto
              </p>
              <p className='mt-1 text-paragraph-xs text-text-sub-600'>
                Submission closes 26 July at 17:00
              </p>

              <div className='mt-auto'>
                <div className='mb-2 flex items-center justify-between text-paragraph-xs text-text-sub-600'>
                  <span>Bid readiness</span>
                  <span>68%</span>
                </div>
                <ProgressBar.Root value={68} aria-hidden='true' />
                <Button.Root
                  variant='neutral'
                  mode='ghost'
                  size='xsmall'
                  className='mt-3'
                >
                  Open bid
                  <Button.Icon as={RiArrowRightSLine} />
                </Button.Root>
              </div>
            </div>
          </Widget>

          <Widget id='review-queue-title' title='Review queue'>
            <ul className='flex h-full flex-col justify-between'>
              {REVIEW_ITEMS.map((item) => {
                const isReviewed = reviewed.includes(item.id);
                return (
                  <li
                    key={item.id}
                    className='flex items-center gap-3 border-b border-stroke-soft-200 py-2 last:border-b-0'
                  >
                    <button
                      type='button'
                      onClick={() => toggleReviewed(item.id)}
                      className='flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left outline-none transition-colors hover:bg-bg-weak-50 focus-visible:shadow-button-important-focus'
                      aria-pressed={isReviewed}
                    >
                      {isReviewed ? (
                        <RiCheckboxCircleLine
                          className='size-5 shrink-0 text-success-base'
                          aria-hidden='true'
                        />
                      ) : (
                        <RiTimeLine
                          className='size-5 shrink-0 text-warning-base'
                          aria-hidden='true'
                        />
                      )}
                      <span className='min-w-0 py-1'>
                        <span
                          className='block truncate text-label-sm text-text-strong-950'
                          title={item.title}
                        >
                          {item.title}
                        </span>
                        <span
                          className='block truncate text-paragraph-xs text-text-sub-600'
                          title={item.meta}
                        >
                          {item.meta}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Widget>

          <Widget id='bid-notes-title' title='Bid notes'>
            <ul className='flex h-full flex-col justify-between'>
              {NOTE_ITEMS.map((note) => {
                const checked = notes.includes(note);
                const id = `dashboard-note-${note
                  .toLowerCase()
                  .replaceAll(' ', '-')}`;
                return (
                  <li
                    key={note}
                    className='flex items-center gap-3 border-b border-stroke-soft-200 py-2 last:border-b-0'
                  >
                    <Checkbox.Root
                      id={id}
                      checked={checked}
                      onCheckedChange={() => toggleNote(note)}
                      aria-label={note}
                    />
                    <label
                      htmlFor={id}
                      className={
                        checked
                          ? 'text-paragraph-sm text-text-sub-600 line-through'
                          : 'text-paragraph-sm text-text-strong-950'
                      }
                    >
                      {note}
                    </label>
                  </li>
                );
              })}
            </ul>
          </Widget>
        </div>

        <Widget
          id='deadline-schedule-title'
          title='Deadline schedule'
          action={
            <RiCalendarScheduleLine
              className='size-5 text-text-sub-600'
              aria-hidden='true'
            />
          }
        >
          <div className='flex h-full min-h-0 flex-col'>
            <ButtonGroup.Root size='xsmall' className='w-full'>
              {(['23', '24', '25'] as const).map((date) => (
                <ButtonGroup.Item
                  key={date}
                  className='flex-1'
                  data-state={day === date ? 'on' : 'off'}
                  aria-pressed={day === date}
                  onClick={() => setDay(date)}
                >
                  Jul {date}
                </ButtonGroup.Item>
              ))}
            </ButtonGroup.Root>

            <div className='mt-4 min-h-0 flex-1 overflow-y-auto'>
              {SCHEDULE[day].length > 0 ? (
                <ol className='flex flex-col'>
                  {SCHEDULE[day].map((event) => {
                    const Icon = statusIcon(event.status);
                    return (
                      <li
                        key={`${event.time}-${event.title}`}
                        className='flex gap-3 border-b border-stroke-soft-200 py-4 last:border-b-0'
                      >
                        <span className='w-12 shrink-0 text-paragraph-xs text-text-sub-600'>
                          {event.time}
                        </span>
                        <div className='min-w-0 flex-1'>
                          <p
                            className='truncate text-label-sm text-text-strong-950'
                            title={event.title}
                          >
                            {event.title}
                          </p>
                          <p
                            className='truncate text-paragraph-xs text-text-sub-600'
                            title={event.detail}
                          >
                            {event.detail}
                          </p>
                          <StatusBadge.Root
                            variant='stroke'
                            status={event.status}
                            className='mt-2'
                          >
                            <StatusBadge.Icon as={Icon} />
                            {event.status === 'completed'
                              ? 'Complete'
                              : event.status === 'failed'
                                ? 'At risk'
                                : 'Scheduled'}
                          </StatusBadge.Root>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <div className='flex h-full flex-col items-center justify-center px-6 text-center'>
                  <RiCalendarScheduleLine
                    className='size-6 text-text-sub-600'
                    aria-hidden='true'
                  />
                  <p className='mt-3 text-label-sm text-text-strong-950'>
                    No deadlines on 25 July
                  </p>
                  <p className='mt-1 text-paragraph-xs text-text-sub-600'>
                    Choose another date to review scheduled work.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Widget>
      </div>
    </ReferenceScreenShell>
  );
}
