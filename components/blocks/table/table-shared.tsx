'use client';

import * as React from 'react';
import {
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
  RiEqualizer2Line,
  RiExpandUpDownLine,
  RiFilter3Line,
  RiMore2Line,
  RiSearch2Line,
} from '@remixicon/react';
import {
  flexRender,
  type Column,
  type ColumnDef,
  type Table as ReactTable,
} from '@tanstack/react-table';

import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as CompactButton from '@/components/ui/compact-button';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import * as Pagination from '@/components/ui/pagination';
import * as Table from '@/components/ui/table';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import { cn } from '@/utils/cn';

export function getSortingIcon(state: 'asc' | 'desc' | false) {
  if (state === 'asc') {
    return <RiArrowUpSLine className='size-icon text-text-sub-600' />;
  }
  if (state === 'desc') {
    return <RiArrowDownSLine className='size-icon text-text-sub-600' />;
  }
  return <RiExpandUpDownLine className='size-icon text-text-sub-600' />;
}

export function SortableHeader<T>({
  column,
  children,
}: {
  column: Column<T, unknown>;
  children: React.ReactNode;
}) {
  return (
    <div className='flex items-center gap-0.5'>
      {children}
      <button
        type='button'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {getSortingIcon(column.getIsSorted())}
      </button>
    </div>
  );
}

export function createSelectColumn<T>(idPrefix: string): ColumnDef<T> {
  return {
    id: 'select',
    header: ({ table }) => (
      <Checkbox.Root
        id={`${idPrefix}-select-all`}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox.Root
        id={`${idPrefix}-select-${row.id}`}
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

export function createActionsColumn<T>(): ColumnDef<T> {
  return {
    id: 'actions',
    header: () => null,
    cell: () => (
      <CompactButton.Root variant='ghost' size='large'>
        <CompactButton.Icon as={RiMore2Line} />
      </CompactButton.Root>
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

type TableBlockProps = {
  children: React.ReactNode;
  className?: string;
};

export function TableBlock({ children, className }: TableBlockProps) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-20 bg-bg-white-0 shadow-regular-xs ring-1 ring-stroke-soft-200',
        className,
      )}
    >
      {children}
    </div>
  );
}

type TableBlockTabsProps = {
  tabs: string[];
  value: string;
  onValueChange: (value: string) => void;
};

export function TableBlockTabs({ tabs, value, onValueChange }: TableBlockTabsProps) {
  const tabValue = (label: string) => label.toLowerCase().replace(/\s+/g, '-');

  return (
    <TabMenuHorizontal.Root value={value} onValueChange={onValueChange}>
      <TabMenuHorizontal.List className='px-4'>
        {tabs.map((tab) => (
          <TabMenuHorizontal.Trigger key={tab} value={tabValue(tab)}>
            {tab}
          </TabMenuHorizontal.Trigger>
        ))}
      </TabMenuHorizontal.List>
    </TabMenuHorizontal.Root>
  );
}

export { tabValueFromLabel as tableTabValue };

function tabValueFromLabel(label: string) {
  return label.toLowerCase().replace(/\s+/g, '-');
}

type TableBlockToolbarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  showFilter?: boolean;
  showSort?: boolean;
  showKbd?: boolean;
};

export function TableBlockToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  showFilter = true,
  showSort = true,
  showKbd = false,
}: TableBlockToolbarProps) {
  return (
    <div className='flex flex-col gap-3 border-t border-stroke-soft-200 px-4 py-3.5 sm:flex-row sm:items-center'>
      <Input.Root size='small' className='flex-1'>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input
            type='text'
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {showKbd ? (
            <Input.InlineAffix>
              <Kbd.Root>⌘1</Kbd.Root>
            </Input.InlineAffix>
          ) : null}
        </Input.Wrapper>
      </Input.Root>

      <div className='flex shrink-0 items-center gap-2'>
        {showFilter ? (
          <Button.Root variant='neutral' mode='stroke' size='small'>
            <Button.Icon as={RiFilter3Line} />
            Filter
          </Button.Root>
        ) : null}
        {showSort ? (
          <Button.Root variant='neutral' mode='stroke' size='small'>
            <Button.Icon as={RiEqualizer2Line} />
            Sort by
            <Button.Icon as={RiArrowDownSLine} />
          </Button.Root>
        ) : null}
      </div>
    </div>
  );
}

export function TableBlockFooter() {
  return (
    <div className='flex items-center justify-center border-t border-stroke-soft-200 px-4 py-3.5'>
      <Pagination.Root variant='basic'>
        <Pagination.NavButton aria-label='Previous page'>
          <Pagination.NavIcon as={RiArrowLeftSLine} />
        </Pagination.NavButton>
        <Pagination.Item current>1</Pagination.Item>
        <Pagination.Item>2</Pagination.Item>
        <Pagination.Item>3</Pagination.Item>
        <Pagination.NavButton aria-label='Next page'>
          <Pagination.NavIcon as={RiArrowRightSLine} />
        </Pagination.NavButton>
      </Pagination.Root>
    </div>
  );
}

type BlockDataTableProps<T> = {
  table: ReactTable<T>;
  checkboxColumn?: boolean;
  actionsColumn?: boolean;
};

export function BlockDataTable<T>({
  table,
  checkboxColumn = true,
  actionsColumn = true,
}: BlockDataTableProps<T>) {
  return (
    <div className='overflow-x-auto px-4 pb-2'>
      <Table.Root>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <Table.Head
                  key={header.id}
                  className={cn({
                    'w-0 pr-0': checkboxColumn && index === 0,
                    'w-0 pl-0': actionsColumn && index === headerGroup.headers.length - 1,
                  })}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </Table.Head>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows.length > 0 &&
            table.getRowModel().rows.map((row, rowIndex, rows) => (
              <React.Fragment key={row.id}>
                <Table.Row
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <Table.Cell
                      key={cell.id}
                      className={cn({
                        'w-0 pr-0': checkboxColumn && cellIndex === 0,
                        'w-0 pl-0': actionsColumn && cellIndex === row.getVisibleCells().length - 1,
                      })}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Cell>
                  ))}
                </Table.Row>
                {rowIndex < rows.length - 1 ? <Table.RowDivider /> : null}
              </React.Fragment>
            ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
