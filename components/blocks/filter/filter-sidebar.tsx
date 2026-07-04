import * as React from 'react';
import { RiArrowRightSLine } from '@remixicon/react';

import { cn } from '@/utils/cn';

export function HorizontalDivider({ className }: { className?: string }) {
  return (
    <div className={cn('relative block h-0 w-full', className)}>
      <div className='absolute left-0 top-0 h-px w-full bg-stroke-soft-200' />
    </div>
  );
}

export function FilterNavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type='button'
      className={cn(
        'group relative flex w-full items-center gap-2 rounded-10 p-2 text-left transition-all duration-200 ease-out',
        active
          ? 'bg-bg-weak-50 font-medium text-text-strong-950'
          : 'text-text-sub-600 hover:bg-bg-weak-50',
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          'flex size-5 items-center justify-center',
          active ? 'text-primary-base' : 'text-text-soft-400',
        )}
      >
        {icon}
      </span>
      <span className='text-label-sm'>{label}</span>
      {active && (
        <RiArrowRightSLine className='ml-auto hidden size-5 text-text-soft-400 md:block md:opacity-100' />
      )}
    </button>
  );
}

export const filterPanelClassName =
  'w-[min(696px,calc(100vw-32px))] overflow-hidden rounded-20 bg-bg-white-0 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200';

export const filterSidebarClassName =
  'w-full border-b border-stroke-soft-200 md:w-[224px] md:border-b-0 md:border-r';

export const filterNavListClassName =
  'flex flex-row gap-2 overflow-x-auto p-3 md:flex-col';
