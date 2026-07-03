'use client';

import * as React from 'react';
import { type RemixiconComponentType } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import { cn } from '@/utils/cn';

export type EmptyStateProps = {
  title: string;
  description: string;
  icon?: RemixiconComponentType;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-6 text-center',
        className,
      )}
    >
      {Icon ? (
        <div
          className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200'
          aria-hidden
        >
          <Icon className='size-5 text-text-sub-600' />
        </div>
      ) : null}

      <div className='flex max-w-[360px] flex-col gap-1'>
        <h3 className='text-label-md text-text-strong-950'>{title}</h3>
        <p className='text-paragraph-sm text-text-sub-600'>{description}</p>
      </div>

      {actionLabel && onAction ? (
        <Button.Root size='small' onClick={onAction}>
          {actionLabel}
        </Button.Root>
      ) : null}
    </div>
  );
}
