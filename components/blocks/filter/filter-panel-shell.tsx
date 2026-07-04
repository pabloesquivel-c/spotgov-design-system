'use client';

import * as React from 'react';
import type { RemixiconComponentType } from '@remixicon/react';
import { RiSearch2Line } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Kbd from '@/components/ui/kbd';
import { cn } from '@/utils/cn';
import { FILTER_NAV_ITEMS } from './filter-nav-items';
import {
  FilterNavItem,
  filterNavListClassName,
  filterPanelClassName,
  filterSidebarClassName,
} from './filter-sidebar';

export function FilterPanelShell({
  activeFilter,
  onActiveFilterChange,
  children,
}: {
  activeFilter: string;
  onActiveFilterChange: (label: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className={filterPanelClassName}>
      <div className='flex flex-col md:flex-row'>
        <div className={filterSidebarClassName}>
          <div className={filterNavListClassName}>
            {FILTER_NAV_ITEMS.map((item) => (
              <FilterNavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={activeFilter === item.label}
                onClick={() => onActiveFilterChange(item.label)}
              />
            ))}
          </div>
        </div>
        <div className='flex flex-1 flex-col'>{children}</div>
      </div>
    </div>
  );
}

export function FilterPanelHeader({
  icon: Icon,
  title,
  action,
  bordered = false,
}: {
  icon: RemixiconComponentType;
  title: string;
  action?: React.ReactNode;
  bordered?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-5 py-4',
        bordered && 'border-b border-stroke-soft-200',
      )}
    >
      <div className='flex flex-row items-center gap-2'>
        <Icon className='size-5 text-text-sub-600' />
        <h4 className='text-label-sm text-text-strong-950'>{title}</h4>
      </div>
      {action}
    </div>
  );
}

export function FilterSearchField({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'group/cmd-input flex h-11 items-center gap-3 border-b border-stroke-soft-200 px-5',
        className,
      )}
    >
      <RiSearch2Line
        className={cn(
          'size-5 shrink-0 text-text-soft-400 transition duration-200 ease-out',
          'group-focus-within/cmd-input:text-primary-base',
        )}
      />
      <input
        type='text'
        className='h-full w-full flex-1 bg-transparent text-paragraph-sm text-text-strong-950 outline-none placeholder:text-text-sub-600'
        placeholder='Search...'
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <Kbd.Root>⌘K</Kbd.Root>
    </div>
  );
}

export function FilterPanelFooter({
  onClear,
}: {
  onClear: () => void;
}) {
  return (
    <div className='mt-auto flex justify-between gap-4 border-t border-stroke-soft-200 px-5 py-4'>
      <Button.Root
        variant='neutral'
        mode='stroke'
        size='small'
        className='flex-1'
        onClick={onClear}
      >
        Clear
      </Button.Root>
      <Button.Root
        variant='primary'
        mode='filled'
        size='small'
        className='flex-1'
      >
        Apply
      </Button.Root>
    </div>
  );
}
