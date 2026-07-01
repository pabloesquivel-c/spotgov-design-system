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
import * as AvatarGroup from '@/components/ui/avatar-group';
import * as ProgressBar from '@/components/ui/progress-bar';

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

type ProjectRow = {
  id: string;
  company: string;
  category: string;
  logo: string;
  description: string;
  teamAvatars: string[];
  teamOverflow: number;
  deadline: string;
  progress: number;
  status: 'ongoing' | 'completed';
};

const projects: ProjectRow[] = [
  {
    id: '1',
    company: 'Spotify',
    category: 'Music & Podcast',
    logo: 'https://alignui.com/images/major-brands/spotify.svg',
    description: 'Spotify mobile app UX enhancements and rebranding project.',
    teamAvatars: [
      'https://alignui.com/images/avatar/illustration/james.png',
      'https://alignui.com/images/avatar/illustration/sophia.png',
      'https://alignui.com/images/avatar/illustration/arthur.png',
      'https://alignui.com/images/avatar/illustration/emma.png',
    ],
    teamOverflow: 9,
    deadline: '29/09/2023',
    progress: 100,
    status: 'completed',
  },
  {
    id: '2',
    company: 'Opensea',
    category: 'NFT Marketplace',
    logo: 'https://alignui.com/images/major-brands/opensea.svg',
    description: 'Mobile & Desktop App Design',
    teamAvatars: [
      'https://alignui.com/images/avatar/illustration/james.png',
      'https://alignui.com/images/avatar/illustration/sophia.png',
      'https://alignui.com/images/avatar/illustration/arthur.png',
      'https://alignui.com/images/avatar/illustration/emma.png',
    ],
    teamOverflow: 4,
    deadline: '02/11/2023',
    progress: 60,
    status: 'ongoing',
  },
  {
    id: '3',
    company: 'Zoom',
    category: 'Video Conferencing',
    logo: 'https://alignui.com/images/major-brands/zoom.svg',
    description: 'Integration of advanced security features.',
    teamAvatars: [
      'https://alignui.com/images/avatar/illustration/james.png',
      'https://alignui.com/images/avatar/illustration/sophia.png',
      'https://alignui.com/images/avatar/illustration/arthur.png',
      'https://alignui.com/images/avatar/illustration/emma.png',
    ],
    teamOverflow: 3,
    deadline: '20/11/2023',
    progress: 45,
    status: 'ongoing',
  },
  {
    id: '4',
    company: 'Notion',
    category: 'Note-Taking and Organization',
    logo: 'https://alignui.com/images/major-brands/notion.svg',
    description: 'Redesign of user interface and addition of new features.',
    teamAvatars: [
      'https://alignui.com/images/avatar/illustration/james.png',
      'https://alignui.com/images/avatar/illustration/sophia.png',
      'https://alignui.com/images/avatar/illustration/arthur.png',
      'https://alignui.com/images/avatar/illustration/emma.png',
    ],
    teamOverflow: 10,
    deadline: '05/01/2024',
    progress: 30,
    status: 'ongoing',
  },
  {
    id: '5',
    company: 'Skype',
    category: 'Video Conferencing',
    logo: 'https://alignui.com/images/major-brands/skype.svg',
    description: 'Legacy platform migration and UI refresh.',
    teamAvatars: [
      'https://alignui.com/images/avatar/illustration/james.png',
      'https://alignui.com/images/avatar/illustration/sophia.png',
      'https://alignui.com/images/avatar/illustration/arthur.png',
    ],
    teamOverflow: 2,
    deadline: '15/12/2023',
    progress: 100,
    status: 'completed',
  },
  {
    id: '6',
    company: 'Slack',
    category: 'Team Communication',
    logo: 'https://alignui.com/images/major-brands/slack.svg',
    description: 'Workflow automation and integration updates.',
    teamAvatars: [
      'https://alignui.com/images/avatar/illustration/james.png',
      'https://alignui.com/images/avatar/illustration/sophia.png',
      'https://alignui.com/images/avatar/illustration/arthur.png',
      'https://alignui.com/images/avatar/illustration/emma.png',
    ],
    teamOverflow: 5,
    deadline: '22/10/2023',
    progress: 75,
    status: 'ongoing',
  },
];

const columns: ColumnDef<ProjectRow>[] = [
  createSelectColumn<ProjectRow>('projects'),
  {
    id: 'company',
    accessorKey: 'company',
    header: ({ column }) => (
      <SortableHeader column={column}>Company Name</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='flex min-w-[160px] items-center gap-3'>
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
    id: 'description',
    accessorKey: 'description',
    header: ({ column }) => (
      <SortableHeader column={column}>Description</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='max-w-[280px] text-paragraph-sm text-text-sub-600'>
        {row.original.description}
      </div>
    ),
  },
  {
    id: 'team',
    header: 'Team Members',
    cell: ({ row }) => (
      <AvatarGroup.Root size='24'>
        {row.original.teamAvatars.map((avatar) => (
          <Avatar.Root key={avatar} size='24'>
            <Avatar.Image src={avatar} />
          </Avatar.Root>
        ))}
        <AvatarGroup.Overflow>+{row.original.teamOverflow}</AvatarGroup.Overflow>
      </AvatarGroup.Root>
    ),
    enableSorting: false,
  },
  {
    id: 'deadline',
    accessorKey: 'deadline',
    header: ({ column }) => (
      <SortableHeader column={column}>Deadline</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {row.original.deadline}
      </div>
    ),
  },
  {
    id: 'progress',
    accessorKey: 'progress',
    header: ({ column }) => (
      <SortableHeader column={column}>Progress</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='min-w-[120px]'>
        <div className='mb-1 text-paragraph-xs text-text-sub-600'>
          {row.original.progress}%
        </div>
        <ProgressBar.Root value={row.original.progress} />
      </div>
    ),
  },
  createActionsColumn<ProjectRow>(),
];

export function ProjectsTable() {
  const [activeTab, setActiveTab] = React.useState(tableTabValue('All'));
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const filteredData = React.useMemo(() => {
    return projects.filter((row) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'ongoing' && row.status === 'ongoing') ||
        (activeTab === 'completed' && row.status === 'completed');

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        row.company.toLowerCase().includes(query) ||
        row.description.toLowerCase().includes(query);

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
        tabs={['All', 'Ongoing', 'Completed']}
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
