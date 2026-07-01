'use client';

import * as React from 'react';
import {
  RiArrowRightSLine,
  RiHistoryLine,
  RiHomeSmileLine,
  RiLightbulbFlashLine,
  RiPieChartLine,
  RiShoppingCartLine,
} from '@remixicon/react';
import type { RemixiconComponentType } from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';
import { drawerPanelClassName } from './drawer-panel';

const TransactionItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...rest }, ref) => (
  <button
    type='button'
    ref={ref}
    className='flex w-full items-center gap-3 rounded-sg-lg py-2 text-left transition-all duration-200 ease-out hover:bg-bg-weak-50 hover:px-3'
    {...rest}
  >
    {children}
    <CompactButton.Root size='medium' variant='ghost'>
      <CompactButton.Icon as={RiArrowRightSLine} />
    </CompactButton.Root>
  </button>
));
TransactionItem.displayName = 'TransactionItem';

type Transaction = {
  title: string;
  desc: string;
  amount: string;
  date: string;
  bg?: string;
  color?: string;
} & (
  | { isImg: true; icon: string }
  | { isImg?: false; icon: RemixiconComponentType }
);

const TRANSACTIONS: Transaction[] = [
  {
    icon: 'https://alignui.com/images/major-brands/netflix.svg',
    isImg: true,
    title: 'Netflix Cashback',
    desc: 'Cashback of September, 2023',
    amount: '$36.24',
    date: 'Sep 18',
  },
  {
    icon: RiHomeSmileLine,
    bg: 'bg-success-lighter',
    color: 'text-success-base',
    title: 'Rental Income',
    desc: 'Rental payment from Mr. Dudley.',
    amount: '$800.00',
    date: 'Sep 17',
  },
  {
    icon: RiShoppingCartLine,
    title: 'Grocery Shopping',
    desc: 'Purchase of monthly groceries.',
    amount: '-$84.14',
    date: 'Sep 16',
  },
  {
    icon: RiPieChartLine,
    title: 'Stock Dividend',
    desc: 'Payment from stock investments.',
    amount: '$1,500.00',
    date: 'Sep 15',
  },
  {
    icon: RiLightbulbFlashLine,
    bg: 'bg-away-lighter',
    color: 'text-away-base',
    title: 'Electricity Bills',
    desc: 'Payment for electricity bills.',
    amount: '-$72.32',
    date: 'Sep 14',
  },
];

export function ContactDetailsDrawer() {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          Open Drawer
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content className={drawerPanelClassName}>
        <Drawer.Header>
          <Drawer.Title>Contact Details</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <Divider.Root variant='solid-text'>contact</Divider.Root>
          <div className='flex flex-col items-center gap-4 px-5 py-6'>
            <Avatar.Root color='purple' size='64'>
              <Avatar.Image src='https://alignui.com/images/avatar/illustration/matthew.png' />
            </Avatar.Root>
            <div className='space-y-1 text-center'>
              <div className='text-label-lg text-text-strong-950'>
                Matthew Johnson
              </div>
              <div className='text-paragraph-sm text-text-sub-600'>
                A-8486214
              </div>
            </div>
          </div>

          <Divider.Root variant='solid-text'>Information</Divider.Root>
          <div className='space-y-3 p-5'>
            <div className='space-y-1'>
              <div className='text-label-xs uppercase text-text-soft-400'>
                Email Address
              </div>
              <div className='text-label-sm text-text-strong-950'>
                matthew@alignui.com
              </div>
            </div>
            <Divider.Root variant='line-spacing' />
            <div className='space-y-1'>
              <div className='text-label-xs uppercase text-text-soft-400'>
                Phone number
              </div>
              <div className='text-label-sm text-text-strong-950'>
                +1 548 485 62 16
              </div>
            </div>
          </div>

          <Divider.Root variant='solid-text'>Recent Transactions</Divider.Root>
          <div className='space-y-2.5 px-5 py-3.5'>
            {TRANSACTIONS.map((transaction) => {
              const iconClassName = `size-icon ${transaction.color ?? 'text-text-sub-600'}`;

              return (
                <TransactionItem key={transaction.title}>
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full ${transaction.bg ?? 'bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'}`}
                  >
                    {transaction.isImg ? (
                      <img
                        src={transaction.icon}
                        alt=''
                        className='size-6'
                      />
                    ) : (
                      <transaction.icon className={iconClassName} />
                    )}
                  </div>
                  <div className='min-w-0 flex-1 space-y-1'>
                    <div className='text-label-sm text-text-strong-950'>
                      {transaction.title}
                    </div>
                    <div className='truncate text-paragraph-xs text-text-sub-600'>
                      {transaction.desc}
                    </div>
                  </div>
                  <div className='space-y-1 text-right'>
                    <div className='text-label-sm text-text-strong-950'>
                      {transaction.amount}
                    </div>
                    <div className='text-paragraph-xs text-text-sub-600'>
                      {transaction.date}
                    </div>
                  </div>
                </TransactionItem>
              );
            })}
          </div>
        </Drawer.Body>
        <Drawer.Footer className='border-t border-stroke-soft-200'>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='medium'
            className='w-full'
          >
            <Button.Icon as={RiHistoryLine} />
            See All Transactions
          </Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
