'use client';

import * as React from 'react';

import type { BreadcrumbItem } from './types';

const DEMO_BREADCRUMBS: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Electronics', href: '/products/electronics' },
];

function PillSeparator() {
  return (
    <div className='relative flex size-1 items-center justify-center'>
      <div className='absolute inset-0 rounded-full border border-stroke-soft-200 bg-bg-white-0' />
    </div>
  );
}

export function PillBreadcrumbs({
  breadcrumbs = DEMO_BREADCRUMBS,
}: {
  breadcrumbs?: BreadcrumbItem[];
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <nav className='flex items-center gap-2'>
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.href}>
          <a
            href={item.href}
            onClick={handleClick}
            className='rounded-full bg-bg-weak-50 px-2.5 py-1 text-label-xs text-text-sub-600 transition-colors hover:bg-primary-alpha-10 hover:text-primary-base'
          >
            {item.label}
          </a>
          {index < breadcrumbs.length - 1 && <PillSeparator />}
        </React.Fragment>
      ))}
    </nav>
  );
}
