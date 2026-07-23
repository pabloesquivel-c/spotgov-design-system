'use client';

import * as React from 'react';
import {
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
  RiCheckboxCircleLine,
  RiDownload2Line,
  RiEqualizer2Line,
  RiFilter3Line,
  RiMore2Line,
  RiSearch2Line,
  RiTimeLine,
  RiErrorWarningLine,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as CompactButton from '@/components/ui/compact-button';
import * as Input from '@/components/ui/input';
import * as Pagination from '@/components/ui/pagination';
import * as SegmentedControl from '@/components/ui/segmented-control';
import * as StatusBadge from '@/components/ui/status-badge';
import * as Table from '@/components/ui/table';
import * as Tooltip from '@/components/ui/tooltip';
import { ReferenceScreenShell } from './reference-screen-shell';

type TenderStatus = 'Qualified' | 'Review' | 'At risk' | 'Watching';
type SortKey = 'title' | 'deadline' | 'value';

type Tender = {
  id: string;
  title: string;
  reference: string;
  authority: string;
  deadline: string;
  deadlineLabel: string;
  value: number;
  valueLabel: string;
  status: TenderStatus;
};

const TENDERS: Tender[] = [
  {
    id: 'sg-2481',
    title: 'Digital services framework',
    reference: 'SG-2481',
    authority: 'Municipality of Porto',
    deadline: '2026-07-26',
    deadlineLabel: '26 Jul, 17:00',
    value: 2400000,
    valueLabel: 'EUR 2.4m',
    status: 'At risk',
  },
  {
    id: 'sg-2474',
    title: 'Urban mobility data platform',
    reference: 'SG-2474',
    authority: 'Lisbon Transport Agency',
    deadline: '2026-07-29',
    deadlineLabel: '29 Jul, 12:00',
    value: 1850000,
    valueLabel: 'EUR 1.85m',
    status: 'Review',
  },
  {
    id: 'sg-2468',
    title: 'Cloud hosting and managed support',
    reference: 'SG-2468',
    authority: 'National Health Service',
    deadline: '2026-08-01',
    deadlineLabel: '1 Aug, 18:00',
    value: 3200000,
    valueLabel: 'EUR 3.2m',
    status: 'Qualified',
  },
  {
    id: 'sg-2459',
    title: 'Citizen contact centre renewal',
    reference: 'SG-2459',
    authority: 'Braga City Council',
    deadline: '2026-08-05',
    deadlineLabel: '5 Aug, 16:00',
    value: 940000,
    valueLabel: 'EUR 940k',
    status: 'Watching',
  },
  {
    id: 'sg-2447',
    title: 'Public records digitisation',
    reference: 'SG-2447',
    authority: 'Ministry of Justice',
    deadline: '2026-08-08',
    deadlineLabel: '8 Aug, 15:00',
    value: 2750000,
    valueLabel: 'EUR 2.75m',
    status: 'Review',
  },
  {
    id: 'sg-2438',
    title: 'School network security services',
    reference: 'SG-2438',
    authority: 'Coimbra Education Board',
    deadline: '2026-08-12',
    deadlineLabel: '12 Aug, 17:00',
    value: 680000,
    valueLabel: 'EUR 680k',
    status: 'Qualified',
  },
  {
    id: 'sg-2426',
    title: 'Regional analytics capability',
    reference: 'SG-2426',
    authority: 'Algarve Regional Authority',
    deadline: '2026-08-15',
    deadlineLabel: '15 Aug, 12:00',
    value: 1120000,
    valueLabel: 'EUR 1.12m',
    status: 'Watching',
  },
];

function TenderStatusBadge({ status }: { status: TenderStatus }) {
  if (status === 'Qualified') {
    return (
      <StatusBadge.Root variant='light' status='completed'>
        <StatusBadge.Icon as={RiCheckboxCircleLine} />
        Qualified
      </StatusBadge.Root>
    );
  }

  if (status === 'At risk') {
    return (
      <StatusBadge.Root variant='light' status='failed'>
        <StatusBadge.Icon as={RiErrorWarningLine} />
        At risk
      </StatusBadge.Root>
    );
  }

  if (status === 'Review') {
    return (
      <StatusBadge.Root variant='light' status='pending'>
        <StatusBadge.Icon as={RiTimeLine} />
        Review
      </StatusBadge.Root>
    );
  }

  return (
    <StatusBadge.Root variant='stroke' status='disabled'>
      <StatusBadge.Dot />
      Watching
    </StatusBadge.Root>
  );
}

function SortButton({
  label,
  sortKey,
  activeSort,
  direction,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeSort: SortKey;
  direction: 'ascending' | 'descending';
  onSort: (key: SortKey) => void;
}) {
  const active = sortKey === activeSort;
  const Icon =
    active && direction === 'ascending' ? RiArrowUpSLine : RiArrowDownSLine;

  return (
    <button
      type='button'
      className='inline-flex items-center gap-1 rounded-md outline-none transition-colors hover:text-text-strong-950 focus-visible:shadow-button-important-focus'
      onClick={() => onSort(sortKey)}
      aria-label={`Sort by ${label}, ${
        active ? direction : 'not currently sorted'
      }`}
    >
      {label}
      <Icon className='size-4' aria-hidden='true' />
    </button>
  );
}

export function SavedTendersDataIndex() {
  const [query, setQuery] = React.useState('');
  const [segment, setSegment] = React.useState('all');
  const [urgentOnly, setUrgentOnly] = React.useState(false);
  const [sortKey, setSortKey] = React.useState<SortKey>('deadline');
  const [direction, setDirection] = React.useState<'ascending' | 'descending'>(
    'ascending',
  );
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(2);
  const [exported, setExported] = React.useState(false);

  const visibleTenders = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = TENDERS.filter((tender) => {
      const matchesQuery =
        normalized.length === 0 ||
        [tender.title, tender.reference, tender.authority].some((value) =>
          value.toLowerCase().includes(normalized),
        );
      const matchesSegment =
        segment === 'all' ||
        (segment === 'qualified' && tender.status === 'Qualified') ||
        (segment === 'review' && ['Review', 'At risk'].includes(tender.status));
      const matchesUrgent = !urgentOnly || tender.status === 'At risk';
      return matchesQuery && matchesSegment && matchesUrgent;
    });

    return filtered.sort((a, b) => {
      const first =
        sortKey === 'value'
          ? a.value
          : sortKey === 'deadline'
            ? a.deadline
            : a.title;
      const second =
        sortKey === 'value'
          ? b.value
          : sortKey === 'deadline'
            ? b.deadline
            : b.title;
      const result =
        typeof first === 'number'
          ? first - (second as number)
          : first.localeCompare(second as string);
      return direction === 'ascending' ? result : -result;
    });
  }, [direction, query, segment, sortKey, urgentOnly]);

  const allVisibleSelected =
    visibleTenders.length > 0 &&
    visibleTenders.every((tender) => selected.includes(tender.id));
  const someVisibleSelected =
    visibleTenders.some((tender) => selected.includes(tender.id)) &&
    !allVisibleSelected;

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setDirection((current) =>
        current === 'ascending' ? 'descending' : 'ascending',
      );
    } else {
      setSortKey(key);
      setDirection('ascending');
    }
  };

  const toggleSelected = (id: string) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <ReferenceScreenShell
      activeKey='saved-tenders'
      title='Saved tenders'
      description='Compare qualified opportunities and keep deadlines visible.'
      actions={
        <>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            disabled={exported}
            onClick={() => setExported(true)}
          >
            <Button.Icon as={RiDownload2Line} />
            {exported ? 'Exported' : 'Export'}
          </Button.Root>
          <Button.Root variant='primary' size='small'>
            Find tenders
          </Button.Root>
          <span className='sr-only' aria-live='polite'>
            {exported ? 'Saved tender view exported.' : ''}
          </span>
        </>
      }
      mainClassName='flex flex-col overflow-hidden'
    >
      <div className='flex items-center justify-between gap-6'>
        <SegmentedControl.Root
          value={segment}
          onValueChange={setSegment}
          className='w-80 shrink-0'
        >
          <SegmentedControl.List aria-label='Saved tender view'>
            <SegmentedControl.Trigger value='all' className='text-text-sub-600'>
              All
            </SegmentedControl.Trigger>
            <SegmentedControl.Trigger
              value='qualified'
              className='text-text-sub-600'
            >
              Qualified
            </SegmentedControl.Trigger>
            <SegmentedControl.Trigger
              value='review'
              className='text-text-sub-600'
            >
              Review
            </SegmentedControl.Trigger>
          </SegmentedControl.List>
        </SegmentedControl.Root>

        <div className='flex items-center gap-3'>
          <Input.Root size='small' className='w-72'>
            <Input.Wrapper>
              <Input.Icon as={RiSearch2Line} />
              <Input.Input
                aria-label='Search saved tenders'
                placeholder='Search saved tenders...'
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </Input.Wrapper>
          </Input.Root>
          <Button.Root
            variant='neutral'
            mode={urgentOnly ? 'lighter' : 'stroke'}
            size='small'
            aria-pressed={urgentOnly}
            onClick={() => setUrgentOnly((current) => !current)}
          >
            <Button.Icon as={RiFilter3Line} />
            Urgent only
          </Button.Root>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            onClick={() => toggleSort('deadline')}
          >
            <Button.Icon as={RiEqualizer2Line} />
            Deadline
          </Button.Root>
        </div>
      </div>

      {selected.length > 0 ? (
        <div
          className='mt-4 flex min-h-10 items-center justify-between rounded-lg bg-primary-alpha-10 px-3'
          aria-live='polite'
        >
          <span className='text-label-sm text-primary-base'>
            {selected.length} selected
          </span>
          <Button.Root
            variant='primary'
            mode='ghost'
            size='xsmall'
            onClick={() => setSelected([])}
          >
            Clear selection
          </Button.Root>
        </div>
      ) : null}

      <div className='mt-4 min-h-0 flex-1 overflow-y-auto'>
        <Table.Root className='min-w-[980px]' aria-label='Saved tenders'>
          <Table.Header>
            <Table.Row>
              <Table.Head className='w-12'>
                <Checkbox.Root
                  checked={
                    allVisibleSelected ||
                    (someVisibleSelected ? 'indeterminate' : false)
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelected((current) => [
                        ...new Set([
                          ...current,
                          ...visibleTenders.map((tender) => tender.id),
                        ]),
                      ]);
                    } else {
                      const visibleIds = new Set(
                        visibleTenders.map((tender) => tender.id),
                      );
                      setSelected((current) =>
                        current.filter((id) => !visibleIds.has(id)),
                      );
                    }
                  }}
                  aria-label='Select all visible tenders'
                />
              </Table.Head>
              <Table.Head
                className='w-[280px]'
                aria-sort={sortKey === 'title' ? direction : 'none'}
              >
                <SortButton
                  label='Tender'
                  sortKey='title'
                  activeSort={sortKey}
                  direction={direction}
                  onSort={toggleSort}
                />
              </Table.Head>
              <Table.Head className='w-[220px]'>Authority</Table.Head>
              <Table.Head
                className='w-[164px]'
                aria-sort={sortKey === 'deadline' ? direction : 'none'}
              >
                <SortButton
                  label='Deadline'
                  sortKey='deadline'
                  activeSort={sortKey}
                  direction={direction}
                  onSort={toggleSort}
                />
              </Table.Head>
              <Table.Head
                className='w-[136px] text-right'
                aria-sort={sortKey === 'value' ? direction : 'none'}
              >
                <SortButton
                  label='Value'
                  sortKey='value'
                  activeSort={sortKey}
                  direction={direction}
                  onSort={toggleSort}
                />
              </Table.Head>
              <Table.Head className='w-[132px]'>Status</Table.Head>
              <Table.Head className='w-12'>
                <span className='sr-only'>Actions</span>
              </Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleTenders.length > 0 ? (
              visibleTenders.map((tender, index) => (
                <React.Fragment key={tender.id}>
                  <Table.Row
                    data-state={
                      selected.includes(tender.id) ? 'selected' : undefined
                    }
                  >
                    <Table.Cell className='w-12'>
                      <Checkbox.Root
                        checked={selected.includes(tender.id)}
                        onCheckedChange={() => toggleSelected(tender.id)}
                        aria-label={`Select ${tender.title}`}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <div className='min-w-0'>
                        <p
                          className='truncate text-label-sm text-text-strong-950'
                          title={tender.title}
                        >
                          {tender.title}
                        </p>
                        <p className='text-paragraph-xs text-text-sub-600'>
                          {tender.reference}
                        </p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <p
                        className='truncate text-paragraph-sm text-text-strong-950'
                        title={tender.authority}
                      >
                        {tender.authority}
                      </p>
                    </Table.Cell>
                    <Table.Cell>
                      <p className='text-paragraph-sm text-text-strong-950'>
                        {tender.deadlineLabel}
                      </p>
                    </Table.Cell>
                    <Table.Cell className='text-right text-paragraph-sm text-text-strong-950'>
                      {tender.valueLabel}
                    </Table.Cell>
                    <Table.Cell>
                      <TenderStatusBadge status={tender.status} />
                    </Table.Cell>
                    <Table.Cell className='w-12'>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <CompactButton.Root
                            variant='ghost'
                            size='large'
                            aria-label={`More actions for ${tender.title}`}
                          >
                            <CompactButton.Icon as={RiMore2Line} />
                          </CompactButton.Root>
                        </Tooltip.Trigger>
                        <Tooltip.Content>More actions</Tooltip.Content>
                      </Tooltip.Root>
                    </Table.Cell>
                  </Table.Row>
                  {index < visibleTenders.length - 1 ? (
                    <Table.RowDivider />
                  ) : null}
                </React.Fragment>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={7} className='h-64 text-center'>
                  <p className='text-label-md text-text-strong-950'>
                    No saved tenders match this view
                  </p>
                  <p className='mt-1 text-paragraph-sm text-text-sub-600'>
                    Clear the search or urgent filter to see more tenders.
                  </p>
                  <Button.Root
                    variant='neutral'
                    mode='stroke'
                    size='small'
                    className='mt-4'
                    onClick={() => {
                      setQuery('');
                      setUrgentOnly(false);
                      setSegment('all');
                    }}
                  >
                    Clear filters
                  </Button.Root>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </div>

      <div className='mt-4 flex shrink-0 items-center justify-between gap-6 border-t border-stroke-soft-200 pt-3'>
        <p className='w-48 text-paragraph-xs text-text-sub-600'>
          Page {page} of 16
        </p>
        <Pagination.Root variant='basic'>
          <Pagination.NavButton
            aria-label='Previous page'
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <Pagination.NavIcon as={RiArrowLeftSLine} />
          </Pagination.NavButton>
          {[1, 2, 3].map((number) => (
            <Pagination.Item
              key={number}
              current={page === number}
              aria-current={page === number ? 'page' : undefined}
              aria-label={`Page ${number}`}
              onClick={() => setPage(number)}
            >
              {number}
            </Pagination.Item>
          ))}
          <Pagination.NavButton
            aria-label='Next page'
            onClick={() => setPage((current) => Math.min(16, current + 1))}
          >
            <Pagination.NavIcon as={RiArrowRightSLine} />
          </Pagination.NavButton>
        </Pagination.Root>
        <p className='w-48 text-right text-paragraph-xs text-text-sub-600'>
          25 per page
        </p>
      </div>
    </ReferenceScreenShell>
  );
}
