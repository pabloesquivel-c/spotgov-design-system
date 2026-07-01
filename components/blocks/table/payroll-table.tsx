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

import * as Avatar from '@/components/ui/avatar';
import * as StatusBadge from '@/components/ui/status-badge';

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

type PayrollRow = {
  id: string;
  brandName: string;
  brandSubtitle: string;
  brandLogo: string;
  employeeName: string;
  employeeRole: string;
  employeeAvatar: string;
  cardNumber: string;
  salary: number;
  status: 'paid' | 'unpaid' | 'pending';
};

const payrollRows: PayrollRow[] = [
  {
    id: '1',
    brandName: 'Visa',
    brandSubtitle: 'Visa Inc.',
    brandLogo: 'https://alignui.com/images/banking-and-finance/visa.svg',
    employeeName: 'Nuray Aksoy',
    employeeRole: 'Product Manager',
    employeeAvatar: 'https://alignui.com/images/avatar/illustration/nuray.png',
    cardNumber: '**** **** **** 1234',
    salary: 5550.63,
    status: 'paid',
  },
  {
    id: '2',
    brandName: 'PayPal',
    brandSubtitle: 'PayPal Holdings, Inc.',
    brandLogo: 'https://alignui.com/images/banking-and-finance/paypal.svg',
    employeeName: 'James Brown',
    employeeRole: 'Marketing Manager',
    employeeAvatar: 'https://alignui.com/images/avatar/illustration/james.png',
    cardNumber: '**** **** **** 2345',
    salary: 4420.35,
    status: 'paid',
  },
  {
    id: '3',
    brandName: 'Mastercard',
    brandSubtitle: 'Mastercard Inc.',
    brandLogo: 'https://alignui.com/images/banking-and-finance/mastercard.svg',
    employeeName: 'Sophia Williams',
    employeeRole: 'HR Assistant',
    employeeAvatar: 'https://alignui.com/images/avatar/illustration/sophia.png',
    cardNumber: '**** **** **** 3456',
    salary: 2730.12,
    status: 'pending',
  },
  {
    id: '4',
    brandName: 'Stripe',
    brandSubtitle: 'Stripe Inc.',
    brandLogo: 'https://alignui.com/images/banking-and-finance/stripe.svg',
    employeeName: 'Emma Wright',
    employeeRole: 'Front-end Developer',
    employeeAvatar: 'https://alignui.com/images/avatar/illustration/emma.png',
    cardNumber: '**** **** **** 4567',
    salary: 3814.22,
    status: 'paid',
  },
  {
    id: '5',
    brandName: 'Visa',
    brandSubtitle: 'Visa Inc.',
    brandLogo: 'https://alignui.com/images/banking-and-finance/visa.svg',
    employeeName: 'Arthur Taylor',
    employeeRole: 'Sales Lead',
    employeeAvatar: 'https://alignui.com/images/avatar/illustration/arthur.png',
    cardNumber: '**** **** **** 5678',
    salary: 4980.0,
    status: 'unpaid',
  },
  {
    id: '6',
    brandName: 'PayPal',
    brandSubtitle: 'PayPal Holdings, Inc.',
    brandLogo: 'https://alignui.com/images/banking-and-finance/paypal.svg',
    employeeName: 'Laura Gomez',
    employeeRole: 'Design Lead',
    employeeAvatar: 'https://alignui.com/images/avatar/illustration/laura.png',
    cardNumber: '**** **** **** 6789',
    salary: 5210.88,
    status: 'unpaid',
  },
];

function payrollStatusBadge(status: PayrollRow['status']) {
  if (status === 'paid') {
    return (
      <StatusBadge.Root variant='light' status='completed'>
        <StatusBadge.Dot />
        Paid
      </StatusBadge.Root>
    );
  }

  if (status === 'pending') {
    return (
      <StatusBadge.Root variant='light' status='pending'>
        <StatusBadge.Dot />
        Pending
      </StatusBadge.Root>
    );
  }

  return (
    <StatusBadge.Root variant='light' status='failed'>
      <StatusBadge.Dot />
      Unpaid
    </StatusBadge.Root>
  );
}

const columns: ColumnDef<PayrollRow>[] = [
  createSelectColumn<PayrollRow>('payroll'),
  {
    id: 'payment',
    accessorKey: 'brandName',
    header: ({ column }) => (
      <SortableHeader column={column}>Payment Preference</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='flex min-w-[160px] items-center gap-3'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={row.original.brandLogo}
          alt=''
          className='size-10 shrink-0 rounded-full bg-bg-white-0 object-contain p-1.5 shadow-regular-xs ring-1 ring-stroke-soft-200'
        />
        <div>
          <div className='text-label-sm text-text-strong-950'>
            {row.original.brandName}
          </div>
          <div className='text-paragraph-xs text-text-sub-600'>
            {row.original.brandSubtitle}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'employee',
    accessorKey: 'employeeName',
    header: ({ column }) => (
      <SortableHeader column={column}>Employee Name</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='flex min-w-[180px] items-center gap-3'>
        <Avatar.Root size='32'>
          <Avatar.Image src={row.original.employeeAvatar} />
        </Avatar.Root>
        <div>
          <div className='text-label-sm text-text-strong-950'>
            {row.original.employeeName}
          </div>
          <div className='text-paragraph-xs text-text-sub-600'>
            {row.original.employeeRole}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'card',
    accessorKey: 'cardNumber',
    header: ({ column }) => (
      <SortableHeader column={column}>Card Number</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='font-mono text-paragraph-sm text-text-sub-600'>
        {row.original.cardNumber}
      </div>
    ),
  },
  {
    id: 'salary',
    accessorKey: 'salary',
    header: ({ column }) => (
      <SortableHeader column={column}>Monthly Salary</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='text-label-sm text-text-strong-950'>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(row.original.salary)}
      </div>
    ),
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => (
      <SortableHeader column={column}>Status</SortableHeader>
    ),
    cell: ({ row }) => payrollStatusBadge(row.original.status),
  },
  createActionsColumn<PayrollRow>(),
];

export function PayrollTable() {
  const [activeTab, setActiveTab] = React.useState(tableTabValue('All'));
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const filteredData = React.useMemo(() => {
    return payrollRows.filter((row) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'paid' && row.status === 'paid') ||
        (activeTab === 'unpaid' &&
          (row.status === 'unpaid' || row.status === 'pending'));

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        row.employeeName.toLowerCase().includes(query) ||
        row.brandName.toLowerCase().includes(query);

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
        tabs={['All', 'Paid', 'Unpaid']}
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
