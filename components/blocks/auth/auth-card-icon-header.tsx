import * as React from 'react';
import { RemixiconComponentType } from '@remixicon/react';
import { cn } from '@/utils/cn';

type AuthCardIconHeaderProps = {
  icon: RemixiconComponentType;
  title: string;
  description: React.ReactNode;
};

export function AuthCardIconHeader({
  icon: Icon,
  title,
  description,
}: AuthCardIconHeaderProps) {
  return (
    <div className='flex flex-col items-center gap-2'>
      <div
        className={cn(
          'relative flex size-[68px] shrink-0 items-center justify-center rounded-full backdrop-blur-xl md:size-24',
          'before:absolute before:inset-0 before:rounded-full',
          'before:bg-gradient-to-b before:from-neutral-500 before:to-transparent before:opacity-10',
        )}
      >
        <div className='relative z-10 flex size-12 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 md:size-16'>
          <Icon className='size-6 text-text-sub-600 md:size-8' />
        </div>
      </div>

      <div className='space-y-1 text-center'>
        <div className='text-title-h6 text-text-strong-950'>{title}</div>
        <div className='text-paragraph-sm text-text-sub-600'>{description}</div>
      </div>
    </div>
  );
}
