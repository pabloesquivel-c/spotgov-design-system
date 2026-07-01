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

import * as Tag from '@/components/ui/tag';
import { StarRating } from '@/components/ui/svg-rating-icons';

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

type CourseRow = {
  id: string;
  name: string;
  instructor: string;
  instructorLogo: string;
  categories: string[];
  categoryOverflow: number;
  rating: number;
  duration: string;
  status: 'in-progress' | 'completed';
};

const courses: CourseRow[] = [
  {
    id: '1',
    name: 'Leadership Skills',
    instructor: 'Horizon Shift',
    instructorLogo: 'https://alignui.com/images/logo/horizon.svg',
    categories: ['Team', 'Communication'],
    categoryOverflow: 4,
    rating: 4.5,
    duration: '3 weeks',
    status: 'in-progress',
  },
  {
    id: '2',
    name: 'Data Science Fundamentals',
    instructor: 'Orandis',
    instructorLogo: 'https://alignui.com/images/logo/orandis.svg',
    categories: ['Data', 'Analytics'],
    categoryOverflow: 2,
    rating: 4,
    duration: '6 weeks',
    status: 'in-progress',
  },
  {
    id: '3',
    name: 'Web Development Basics',
    instructor: 'Phoenix',
    instructorLogo: 'https://alignui.com/images/logo/phoenix.svg',
    categories: ['Programming', 'Web'],
    categoryOverflow: 2,
    rating: 5,
    duration: '8 weeks',
    status: 'completed',
  },
  {
    id: '4',
    name: 'Digital Marketing',
    instructor: 'Catalyst',
    instructorLogo: 'https://alignui.com/images/logo/catalyst.svg',
    categories: ['Marketing', 'Social Media'],
    categoryOverflow: 2,
    rating: 4.5,
    duration: '2 weeks',
    status: 'completed',
  },
  {
    id: '5',
    name: 'Financial Planning',
    instructor: 'Apex',
    instructorLogo: 'https://alignui.com/images/logo/apex.svg',
    categories: ['Finance', 'Strategy'],
    categoryOverflow: 1,
    rating: 3.5,
    duration: '4 weeks',
    status: 'in-progress',
  },
  {
    id: '6',
    name: 'Product Design Systems',
    instructor: 'Pulse',
    instructorLogo: 'https://alignui.com/images/logo/pulse.svg',
    categories: ['Design', 'UI/UX'],
    categoryOverflow: 3,
    rating: 4.8,
    duration: '5 weeks',
    status: 'in-progress',
  },
];

const columns: ColumnDef<CourseRow>[] = [
  createSelectColumn<CourseRow>('courses'),
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <SortableHeader column={column}>Course Name</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='text-label-sm text-text-strong-950'>{row.original.name}</div>
    ),
  },
  {
    id: 'instructor',
    accessorKey: 'instructor',
    header: ({ column }) => (
      <SortableHeader column={column}>Instructor</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='flex min-w-[140px] items-center gap-2'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={row.original.instructorLogo}
          alt=''
          className='size-6 shrink-0 rounded-full object-contain'
        />
        <span className='text-label-sm text-text-strong-950'>
          {row.original.instructor}
        </span>
      </div>
    ),
  },
  {
    id: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <div className='flex flex-wrap items-center gap-1.5'>
        {row.original.categories.map((category) => (
          <Tag.Root key={category} variant='stroke'>
            {category}
          </Tag.Root>
        ))}
        {row.original.categoryOverflow > 0 ? (
          <Tag.Root variant='stroke'>+{row.original.categoryOverflow}</Tag.Root>
        ) : null}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: 'rating',
    accessorKey: 'rating',
    header: ({ column }) => (
      <SortableHeader column={column}>Course Rating</SortableHeader>
    ),
    cell: ({ row }) => <StarRating rating={row.original.rating} />,
  },
  {
    id: 'duration',
    accessorKey: 'duration',
    header: ({ column }) => (
      <SortableHeader column={column}>Duration</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {row.original.duration}
      </div>
    ),
  },
  createActionsColumn<CourseRow>(),
];

export function CoursesTable() {
  const [activeTab, setActiveTab] = React.useState(tableTabValue('All'));
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const filteredData = React.useMemo(() => {
    return courses.filter((row) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'in-progress' && row.status === 'in-progress') ||
        (activeTab === 'completed' && row.status === 'completed');

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        row.name.toLowerCase().includes(query) ||
        row.instructor.toLowerCase().includes(query);

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
        tabs={['All', 'In Progress', 'Completed']}
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
