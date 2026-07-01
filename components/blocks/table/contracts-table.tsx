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
import * as FileFormatIcon from '@/components/ui/file-format-icon';
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

type ContractRow = {
  id: string;
  company: string;
  category: string;
  logo: string;
  contactName: string;
  contactEmail: string;
  contactAvatar: string;
  relationship: string;
  contractPeriod: string;
  fileName: string;
  fileSize: string;
  status: 'active' | 'inactive';
};

const contracts: ContractRow[] = [
  {
    id: '1',
    company: 'Trello',
    category: 'Project Management',
    logo: 'https://alignui.com/images/major-brands/trello.svg',
    contactName: 'Nuray Aksoy',
    contactEmail: 'nuray@alignui.com',
    contactAvatar: 'https://alignui.com/images/avatar/illustration/nuray.png',
    relationship: 'Client-Provider',
    contractPeriod: 'Aug 2022 - 2024',
    fileName: 'trello-contract.pdf',
    fileSize: '1.8 MB',
    status: 'active',
  },
  {
    id: '2',
    company: 'Loom',
    category: 'Video Messaging',
    logo: 'https://alignui.com/images/major-brands/loom.svg',
    contactName: 'Ravi Patel',
    contactEmail: 'ravi@alignui.com',
    contactAvatar: 'https://alignui.com/images/avatar/illustration/ravi.png',
    relationship: 'Partnership Collab.',
    contractPeriod: 'Sep 2023 - 2024',
    fileName: 'loom-contract.pdf',
    fileSize: '1.5 MB',
    status: 'active',
  },
  {
    id: '3',
    company: 'Monday.com',
    category: 'Work Operation System',
    logo: 'https://alignui.com/images/major-brands/monday.svg',
    contactName: 'Natalia Nowak',
    contactEmail: 'natalia@alignui.com',
    contactAvatar: 'https://alignui.com/images/avatar/illustration/natalia.png',
    relationship: 'Vendor-Client',
    contractPeriod: 'May 2022 - May 2023',
    fileName: 'mondaycom-contract.pdf',
    fileSize: '1.6 MB',
    status: 'active',
  },
  {
    id: '4',
    company: 'Zoom',
    category: 'Video Conferencing',
    logo: 'https://alignui.com/images/major-brands/zoom.svg',
    contactName: 'Juma Omondi',
    contactEmail: 'juma@alignui.com',
    contactAvatar: 'https://alignui.com/images/avatar/illustration/juma.png',
    relationship: 'Partnership Collab.',
    contractPeriod: 'Apr 2021 - 2024',
    fileName: 'zoom-contract.pdf',
    fileSize: '1.8 MB',
    status: 'active',
  },
  {
    id: '5',
    company: 'Linear',
    category: 'Project Management',
    logo: 'https://alignui.com/images/major-brands/linear.svg',
    contactName: 'Lena Müller',
    contactEmail: 'lena@alignui.com',
    contactAvatar: 'https://alignui.com/images/avatar/illustration/lena.png',
    relationship: 'Client-Provider',
    contractPeriod: 'Jan 2023 - 2024',
    fileName: 'linear-contract.pdf',
    fileSize: '1.4 MB',
    status: 'inactive',
  },
  {
    id: '6',
    company: 'Skype',
    category: 'Video Conferencing',
    logo: 'https://alignui.com/images/major-brands/skype.svg',
    contactName: 'Wei Chen',
    contactEmail: 'wei@alignui.com',
    contactAvatar: 'https://alignui.com/images/avatar/illustration/wei.png',
    relationship: 'Vendor-Client',
    contractPeriod: 'Mar 2020 - Mar 2023',
    fileName: 'skype-contract.pdf',
    fileSize: '1.2 MB',
    status: 'inactive',
  },
  {
    id: '7',
    company: 'Evernote',
    category: 'Note-Taking',
    logo: 'https://alignui.com/images/major-brands/evernote.svg',
    contactName: 'Laura Gomez',
    contactEmail: 'laura@alignui.com',
    contactAvatar: 'https://alignui.com/images/avatar/illustration/laura.png',
    relationship: 'Client-Provider',
    contractPeriod: 'Jun 2022 - Jun 2023',
    fileName: 'evernote-contract.pdf',
    fileSize: '1.7 MB',
    status: 'active',
  },
];

const columns: ColumnDef<ContractRow>[] = [
  createSelectColumn<ContractRow>('contracts'),
  {
    id: 'company',
    accessorKey: 'company',
    header: ({ column }) => (
      <SortableHeader column={column}>Company Name</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='flex min-w-[180px] items-center gap-3'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={row.original.logo}
          alt=''
          className='size-10 shrink-0 rounded-full bg-bg-white-0 object-contain p-1.5 shadow-regular-xs ring-1 ring-stroke-soft-200'
        />
        <div>
          <div className='text-label-sm text-text-strong-950'>
            {row.original.company}
          </div>
          <div className='text-paragraph-xs text-text-sub-600'>
            {row.original.category}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'contact',
    accessorKey: 'contactName',
    header: ({ column }) => (
      <SortableHeader column={column}>Contact Person</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='flex min-w-[180px] items-center gap-3'>
        <Avatar.Root size='32'>
          <Avatar.Image src={row.original.contactAvatar} />
        </Avatar.Root>
        <div>
          <div className='text-label-sm text-text-strong-950'>
            {row.original.contactName}
          </div>
          <div className='text-paragraph-xs text-text-sub-600'>
            {row.original.contactEmail}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'relationship',
    accessorKey: 'relationship',
    header: ({ column }) => (
      <SortableHeader column={column}>Relationship</SortableHeader>
    ),
    cell: ({ row }) => (
      <div>
        <div className='text-label-sm text-text-strong-950'>
          {row.original.relationship}
        </div>
        <div className='text-paragraph-xs text-text-sub-600'>
          {row.original.contractPeriod}
        </div>
      </div>
    ),
  },
  {
    id: 'contract',
    accessorKey: 'fileName',
    header: ({ column }) => (
      <SortableHeader column={column}>Contract Details</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='flex min-w-[180px] items-center gap-3'>
        <FileFormatIcon.Root format='PDF' color='red' size='small' />
        <div>
          <div className='text-label-sm text-text-strong-950'>
            {row.original.fileName}
          </div>
          <div className='text-paragraph-xs text-text-sub-600'>
            {row.original.fileSize}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => (
      <SortableHeader column={column}>Status</SortableHeader>
    ),
    cell: ({ row }) => (
      <StatusBadge.Root
        variant='light'
        status={row.original.status === 'active' ? 'completed' : 'disabled'}
      >
        <StatusBadge.Dot />
        {row.original.status === 'active' ? 'Active' : 'Inactive'}
      </StatusBadge.Root>
    ),
  },
  createActionsColumn<ContractRow>(),
];

export function ContractsTable() {
  const [activeTab, setActiveTab] = React.useState(tableTabValue('All'));
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const filteredData = React.useMemo(() => {
    return contracts.filter((row) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'active' && row.status === 'active') ||
        (activeTab === 'inactive' && row.status === 'inactive');

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        row.company.toLowerCase().includes(query) ||
        row.contactName.toLowerCase().includes(query) ||
        row.contactEmail.toLowerCase().includes(query);

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
        tabs={['All', 'Active', 'Inactive']}
        value={activeTab}
        onValueChange={setActiveTab}
      />
      <TableBlockToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder='Search...'
      />
      <BlockDataTable table={table} />
      <TableBlockFooter />
    </TableBlock>
  );
}
