'use client';

import * as React from 'react';
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiHomeSmile2Line,
} from '@remixicon/react';

import * as Dropdown from '@/components/ui/dropdown';
import type { BreadcrumbItemWithMenu } from './types';

const DEMO_BREADCRUMBS: BreadcrumbItemWithMenu[] = [
  {
    label: 'Products',
    href: '/products',
    items: [
      { label: 'Products', href: '/products' },
      { label: 'Books', href: '/products/books' },
      { label: 'Sports', href: '/products/sports' },
    ],
  },
  {
    label: 'Electronics',
    href: '/electronics',
    items: [
      { label: 'Electronics', href: '/electronics' },
      { label: 'House', href: '/electronics/house' },
      { label: 'Technology', href: '/electronics/technology' },
    ],
  },
];

export function DropdownBreadcrumbs({
  breadcrumbs = DEMO_BREADCRUMBS,
}: {
  breadcrumbs?: BreadcrumbItemWithMenu[];
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <nav className='flex items-center justify-center gap-2'>
      <a
        href='/'
        className='text-text-soft-400 hover:text-text-sub-600'
        onClick={handleClick}
      >
        <RiHomeSmile2Line className='size-icon-inline' />
      </a>

      {breadcrumbs.map((item) => (
        <React.Fragment key={item.href}>
          <span className='cursor-default text-label-xs text-text-soft-400'>
            /
          </span>

          {item.items ? (
            <Dropdown.Root>
              <Dropdown.Trigger asChild>
                <button
                  type='button'
                  className='group flex items-center gap-1 text-label-xs text-text-soft-400 hover:text-text-sub-600'
                  onClick={handleClick}
                >
                  <span className='group-data-[state=open]:text-text-sub-600'>
                    {item.label}
                  </span>
                  <span className='rounded-full group-data-[state=open]:bg-bg-weak-50'>
                    <RiArrowDownSLine className='size-icon-inline transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-text-sub-600' />
                  </span>
                </button>
              </Dropdown.Trigger>
              <Dropdown.Content
                align='start'
                className='w-[148px] gap-0.5 rounded-10 p-1'
              >
                {item.items.map((subItem) => (
                  <Dropdown.Item key={subItem.href} asChild>
                    <button
                      type='button'
                      onClick={handleClick}
                      className='group relative flex w-full items-center justify-between rounded-lg py-1 pl-1.5 pr-1 hover:bg-bg-weak-50'
                    >
                      <span className='text-label-xs text-text-sub-600'>
                        {subItem.label}
                      </span>
                      <RiArrowRightSLine className='size-icon-inline text-text-soft-400 opacity-0 transition-opacity group-hover:opacity-100' />
                    </button>
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown.Root>
          ) : (
            <button
              type='button'
              onClick={handleClick}
              className='text-label-xs text-text-soft-400 hover:text-text-sub-600'
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
