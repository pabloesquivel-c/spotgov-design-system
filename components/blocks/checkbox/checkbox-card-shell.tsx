import * as React from 'react';
import { RemixiconComponentType } from '@remixicon/react';

export function CheckboxCardShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        className ??
        'flex w-full max-w-[440px] flex-col gap-5 rounded-20 bg-bg-white-0 p-5 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200'
      }
    >
      {children}
    </div>
  );
}

export function CheckboxCardHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: RemixiconComponentType;
  title: string;
  description: string;
}) {
  return (
    <div className='flex items-center gap-3.5'>
      <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200'>
        <Icon className='size-icon text-text-sub-600' />
      </div>
      <div>
        <div className='text-label-sm text-text-strong-950'>{title}</div>
        <div className='mt-1 text-paragraph-xs text-text-sub-600'>{description}</div>
      </div>
    </div>
  );
}
