'use client';

import * as React from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';

import { cn } from '@/utils/cn';

import {
  BlockDataTable,
  createActionsColumn,
  createSelectColumn,
  SortableHeader,
  TableBlock,
  TableBlockFooter,
  TableBlockTabs,
  tableTabValue,
  TableBlockToolbar,
} from './table-shared';

type TransactionRow = {
  id: string;
  reference: string;
  date: string;
  product: string;
  client: string;
  amount: number;
  type: 'income' | 'outgoing';
};

const transactions: TransactionRow[] = [
  {
    id: '1',
    reference: '#4170',
    date: '10/08/2023',
    product: 'Notion Monthly Subscription',
    client: 'Notion Labs Inc.',
    amount: -280.35,
    type: 'outgoing',
  },
  {
    id: '2',
    reference: '#4169',
    date: '09/08/2023',
    product: 'Zoom Annual Plan Renewal',
    client: 'Zoom Video Communications',
    amount: -1599.0,
    type: 'outgoing',
  },
  {
    id: '3',
    reference: '#4168',
    date: '08/08/2023',
    product: 'Marketing Consultation Services',
    client: 'Apex Financial',
    amount: 2301.2,
    type: 'income',
  },
  {
    id: '4',
    reference: '#4167',
    date: '07/08/2023',
    product: 'Web Development Project Payment',
    client: 'Orandis Technology',
    amount: -1245.35,
    type: 'outgoing',
  },
  {
    id: '5',
    reference: '#4166',
    date: '06/08/2023',
    product: 'SaaS Platform License',
    client: 'Linear Inc.',
    amount: -420.0,
    type: 'outgoing',
  },
  {
    id: '6',
    reference: '#4165',
    date: '05/08/2023',
    product: 'Enterprise Support Retainer',
    client: 'Pulse Medical',
    amount: 3500.0,
    type: 'income',
  },
  {
    id: '7',
    reference: '#4164',
    date: '04/08/2023',
    product: 'Design System Audit',
    client: 'Horizon Shift',
    amount: 1850.5,
    type: 'income',
  },
];

function formatAmount(amount: number) {
  const formatted = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(Math.abs(amount));

  return amount < 0 ? `-${formatted}` : `+${formatted}`;
}

const columns: ColumnDef<TransactionRow>[] = [
  createSelectColumn<TransactionRow>('transactions'),
  {
    id: 'reference',
    accessorKey: 'reference',
    header: ({ column }) => <SortableHeader column={column}>ID</SortableHeader>,
    cell: ({ row }) => (
      <div className='text-label-sm text-text-strong-950'>
        {row.original.reference}
      </div>
    ),
  },
  {
    id: 'date',
    accessorKey: 'date',
    header: ({ column }) => <SortableHeader column={column}>Date</SortableHeader>,
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {row.original.date}
      </div>
    ),
  },
  {
    id: 'product',
    accessorKey: 'product',
    header: ({ column }) => (
      <SortableHeader column={column}>Product</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='max-w-[220px] text-label-sm text-text-strong-950'>
        {row.original.product}
      </div>
    ),
  },
  {
    id: 'client',
    accessorKey: 'client',
    header: ({ column }) => (
      <SortableHeader column={column}>Client / Company</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {row.original.client}
      </div>
    ),
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    header: ({ column }) => (
      <SortableHeader column={column}>Amount</SortableHeader>
    ),
    cell: ({ row }) => (
      <div
        className={cn('text-label-sm', {
          'text-error-base': row.original.amount < 0,
          'text-success-base': row.original.amount > 0,
        })}
      >
        {formatAmount(row.original.amount)}
      </div>
    ),
  },
  createActionsColumn<TransactionRow>(),
];

export function TransactionsLedgerTable() {
  const [activeTab, setActiveTab] = React.useState(tableTabValue('All'));
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const filteredData = React.useMemo(() => {
    return transactions.filter((row) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'income' && row.type === 'income') ||
        (activeTab === 'outgoing' && row.type === 'outgoing');

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        row.reference.toLowerCase().includes(query) ||
        row.product.toLowerCase().includes(query) ||
        row.client.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <TableBlock>
      <TableBlockTabs
        tabs={['All', 'Income', 'Outgoing']}
        value={activeTab}
        onValueChange={setActiveTab}
      />
      <TableBlockToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showKbd
      />
      <BlockDataTable table={table} />
      <TableBlockFooter />
    </TableBlock>
  );
}
