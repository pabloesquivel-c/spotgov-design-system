'use client';

import * as React from 'react';

import { AppSidebar } from '@/components/blocks/sidebar/app-sidebar';
import { cn } from '@/utils/cn';

export function ReferenceScreenShell({
  activeKey,
  title,
  description,
  actions,
  mainClassName,
  children,
}: {
  activeKey: string;
  title: string;
  description: string;
  actions: React.ReactNode;
  mainClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-[900px] w-[1440px] gap-4 overflow-hidden bg-bg-weak-50 p-4 font-sans text-text-strong-950'>
      <AppSidebar defaultActiveKey={activeKey} />

      <div className='flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
        <header className='flex min-h-[88px] shrink-0 items-center justify-between gap-6 border-b border-stroke-soft-200 px-8 py-5'>
          <div className='min-w-0'>
            <h2 className='truncate text-title-h6 text-text-strong-950'>
              {title}
            </h2>
            <p className='truncate text-paragraph-sm text-text-sub-600'>
              {description}
            </p>
          </div>
          <div className='flex shrink-0 items-center gap-3'>{actions}</div>
        </header>

        <main
          className={cn(
            'min-h-0 flex-1 overflow-auto px-8 py-6',
            mainClassName,
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
