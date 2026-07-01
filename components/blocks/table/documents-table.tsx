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

type DocumentRow = {
  id: string;
  fileName: string;
  fileSize: string;
  format: 'PDF' | 'DOC' | 'PPTX' | 'XLS';
  formatColor: 'red' | 'blue' | 'orange' | 'green';
  uploadedBy: string;
  uploadedEmail: string;
  uploadedAvatar: string;
  uploadDate: string;
  lastUpdated: string;
  category: 'employee' | 'company';
};

const documents: DocumentRow[] = [
  {
    id: '1',
    fileName: 'employee-contract.pdf',
    fileSize: '1.2 MB',
    format: 'PDF',
    formatColor: 'red',
    uploadedBy: 'James Brown',
    uploadedEmail: 'james@alignui.com',
    uploadedAvatar: 'https://alignui.com/images/avatar/illustration/james.png',
    uploadDate: 'July 15, 2023',
    lastUpdated: 'July 17, 2023',
    category: 'employee',
  },
  {
    id: '2',
    fileName: 'project-proposal.docx',
    fileSize: '1.2 MB',
    format: 'DOC',
    formatColor: 'blue',
    uploadedBy: 'Sophia Williams',
    uploadedEmail: 'sophia@alignui.com',
    uploadedAvatar: 'https://alignui.com/images/avatar/illustration/sophia.png',
    uploadDate: 'July 17, 2023',
    lastUpdated: 'July 20, 2023',
    category: 'company',
  },
  {
    id: '3',
    fileName: 'meeting-minutes.pdf',
    fileSize: '1.2 MB',
    format: 'PDF',
    formatColor: 'red',
    uploadedBy: 'Arthur Taylor',
    uploadedEmail: 'arthur@alignui.com',
    uploadedAvatar: 'https://alignui.com/images/avatar/illustration/arthur.png',
    uploadDate: 'July 19, 2023',
    lastUpdated: 'July 21, 2023',
    category: 'employee',
  },
  {
    id: '4',
    fileName: 'marketing-strategy.pptx',
    fileSize: '1.2 MB',
    format: 'PPTX',
    formatColor: 'orange',
    uploadedBy: 'Emma Wright',
    uploadedEmail: 'emma@alignui.com',
    uploadedAvatar: 'https://alignui.com/images/avatar/illustration/emma.png',
    uploadDate: 'July 21, 2023',
    lastUpdated: 'July 23, 2023',
    category: 'company',
  },
  {
    id: '5',
    fileName: 'budget-report.xlsx',
    fileSize: '980 KB',
    format: 'XLS',
    formatColor: 'green',
    uploadedBy: 'Natalia Nowak',
    uploadedEmail: 'natalia@alignui.com',
    uploadedAvatar: 'https://alignui.com/images/avatar/illustration/natalia.png',
    uploadDate: 'July 24, 2023',
    lastUpdated: 'July 25, 2023',
    category: 'company',
  },
  {
    id: '6',
    fileName: 'onboarding-checklist.pdf',
    fileSize: '860 KB',
    format: 'PDF',
    formatColor: 'red',
    uploadedBy: 'Ravi Patel',
    uploadedEmail: 'ravi@alignui.com',
    uploadedAvatar: 'https://alignui.com/images/avatar/illustration/ravi.png',
    uploadDate: 'July 26, 2023',
    lastUpdated: 'July 28, 2023',
    category: 'employee',
  },
];

const columns: ColumnDef<DocumentRow>[] = [
  createSelectColumn<DocumentRow>('documents'),
  {
    id: 'file',
    accessorKey: 'fileName',
    header: ({ column }) => (
      <SortableHeader column={column}>File Name</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='flex min-w-[200px] items-center gap-3'>
        <FileFormatIcon.Root
          format={row.original.format}
          color={row.original.formatColor}
          size='small'
        />
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
    id: 'uploadedBy',
    accessorKey: 'uploadedBy',
    header: ({ column }) => (
      <SortableHeader column={column}>Uploaded By</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='flex min-w-[180px] items-center gap-3'>
        <Avatar.Root size='32'>
          <Avatar.Image src={row.original.uploadedAvatar} />
        </Avatar.Root>
        <div>
          <div className='text-label-sm text-text-strong-950'>
            {row.original.uploadedBy}
          </div>
          <div className='text-paragraph-xs text-text-sub-600'>
            {row.original.uploadedEmail}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'uploadDate',
    accessorKey: 'uploadDate',
    header: ({ column }) => (
      <SortableHeader column={column}>Upload Date</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {row.original.uploadDate}
      </div>
    ),
  },
  {
    id: 'lastUpdated',
    accessorKey: 'lastUpdated',
    header: ({ column }) => (
      <SortableHeader column={column}>Last Updated</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {row.original.lastUpdated}
      </div>
    ),
  },
  createActionsColumn<DocumentRow>(),
];

export function DocumentsTable() {
  const [activeTab, setActiveTab] = React.useState(tableTabValue('All'));
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const filteredData = React.useMemo(() => {
    return documents.filter((row) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'employee' && row.category === 'employee') ||
        (activeTab === 'company' && row.category === 'company');

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        row.fileName.toLowerCase().includes(query) ||
        row.uploadedBy.toLowerCase().includes(query);

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
        tabs={['All', 'Employee', 'Company']}
        value={activeTab}
        onValueChange={setActiveTab}
      />
      <TableBlockToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <BlockDataTable table={table} />
      <TableBlockFooter />
    </TableBlock>
  );
}
