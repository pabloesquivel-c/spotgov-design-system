'use client';

import * as React from 'react';
import Link from 'next/link';
import { RiArrowRightSLine, RiHomeSmile2Line } from '@remixicon/react';

import * as LinkButton from '@/components/ui/link-button';
import type { BreadcrumbItem } from './types';

const DEMO_BREADCRUMBS: BreadcrumbItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Analytics', href: '/dashboard/analytics' },
  { label: 'Reports', href: '/dashboard/analytics/reports' },
];

export function BarBreadcrumbs({
  breadcrumbs = DEMO_BREADCRUMBS,
}: {
  breadcrumbs?: BreadcrumbItem[];
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <nav className='flex items-center gap-1.5 rounded-lg bg-bg-weak-50 px-2.5 py-2'>
      <Link href='/' onClick={handleClick}>
        <RiHomeSmile2Line className='size-4 text-text-sub-600 hover:text-text-strong-950' />
      </Link>
      {breadcrumbs.length > 0 && (
        <RiArrowRightSLine className='size-4 cursor-default text-text-soft-400' />
      )}

      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.href}>
          <LinkButton.Root
            asChild
            variant='gray'
            size='small'
            className='hover:text-text-strong-950'
            onClick={handleClick}
          >
            <Link href={item.href}>{item.label}</Link>
          </LinkButton.Root>
          {index < breadcrumbs.length - 1 && (
            <RiArrowRightSLine className='size-4 cursor-default text-text-soft-400' />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
