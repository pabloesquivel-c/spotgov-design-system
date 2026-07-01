'use client';

import * as React from 'react';
import { RiHomeSmile2Line } from '@remixicon/react';

import type { BreadcrumbItem } from './types';

const DEMO_BREADCRUMBS: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Electronics', href: '/products/electronics' },
];

export function SlashBreadcrumbs({
  breadcrumbs = DEMO_BREADCRUMBS,
}: {
  breadcrumbs?: BreadcrumbItem[];
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <nav className='flex items-center justify-center gap-2'>
      {breadcrumbs.length > 0 && (
        <>
          <a href='/' onClick={handleClick}>
            <RiHomeSmile2Line className='size-icon-inline text-text-soft-400 hover:text-text-sub-600' />
          </a>
          <span className='cursor-default text-label-xs text-text-soft-400'>
            /
          </span>
        </>
      )}

      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && breadcrumbs[index - 1] && (
            <span className='cursor-default text-label-xs text-text-soft-400'>
              /
            </span>
          )}
          <a
            href={item.href}
            className='text-label-xs text-text-soft-400 hover:text-text-sub-600'
            onClick={handleClick}
          >
            {item.label}
          </a>
        </React.Fragment>
      ))}
    </nav>
  );
}
