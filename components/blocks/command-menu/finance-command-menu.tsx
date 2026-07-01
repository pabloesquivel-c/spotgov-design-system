'use client';

import * as React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import {
  RiArrowLeftRightLine,
  RiArrowRightSLine,
  RiBankCardLine,
  RiBankLine,
  RiFocus3Line,
  RiGroupLine,
  RiLineChartLine,
  RiMoneyDollarBoxLine,
  RiPieChartLine,
  RiSearch2Line,
  RiTimeLine,
} from '@remixicon/react';
import type { RemixiconComponentType } from '@remixicon/react';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as CommandMenu from '@/components/ui/command-menu';
import * as CompactButton from '@/components/ui/compact-button';
import * as Kbd from '@/components/ui/kbd';
import { CommandMenuScrollbar } from './command-menu-scrollbar';
import { cn } from '@/utils/cn';

const QUICK_ACTIONS = [
  {
    title: 'Transfer',
    description: 'Send Money',
    icon: RiTimeLine,
    iconBgColor: 'bg-information-lighter',
    iconColor: 'text-information-base',
  },
  {
    title: 'Pay',
    description: 'Bills & Payments',
    icon: RiMoneyDollarBoxLine,
    iconBgColor: 'bg-feature-lighter',
    iconColor: 'text-feature-base',
  },
  {
    title: 'Invest',
    description: 'Grow Wealth',
    icon: RiPieChartLine,
    iconBgColor: 'bg-success-lighter',
    iconColor: 'text-success-base',
  },
  {
    title: 'Cards',
    description: 'Manage Cards',
    icon: RiBankCardLine,
    iconBgColor: 'bg-warning-lighter',
    iconColor: 'text-warning-base',
  },
];

const RECENT_ACTIVITY = [
  {
    title: 'Netflix Subscription',
    amount: '$15.99',
    amountColor: 'red' as const,
    time: '2 hours ago',
    icon: 'https://alignui.com/images/major-brands/netflix.svg',
  },
  {
    title: 'Salary Deposit',
    amount: '$3,450.00',
    amountColor: 'green' as const,
    time: '1 day ago',
    icon: 'https://alignui.com/images/major-brands/spotify.svg',
  },
  {
    title: 'Investment Transfer',
    amount: '$500.00',
    amountColor: 'gray' as const,
    time: '2 days ago',
    icon: RiLineChartLine,
  },
];

const FINANCIAL_SERVICES = [
  {
    title: 'Wealth Management',
    description: 'Investment portfolios & advisory',
    badge: 'Premium',
    badgeColor: 'purple' as const,
    icon: RiBankLine,
  },
  {
    title: 'Savings Goals',
    description: 'Set & track financial goals',
    icon: RiFocus3Line,
  },
  {
    title: 'Cash Flow',
    description: 'Income & expense analysis',
    icon: RiArrowLeftRightLine,
  },
  {
    title: 'Joint Accounts',
    description: 'Family & business accounts',
    icon: RiGroupLine,
  },
  {
    title: 'Loans',
    description: 'Personal & business loans',
    icon: RiBankLine,
  },
  {
    title: 'Payroll',
    description: 'Employee payroll & benefits',
    icon: RiBankLine,
  },
];

function ServiceRow({
  title,
  description,
  badge,
  badgeColor,
  icon: Icon,
}: {
  title: string;
  description: string;
  badge?: string;
  badgeColor?: 'purple';
  icon: RemixiconComponentType;
}) {
  return (
    <CommandMenu.Item className='group/cmd-item flex items-center gap-3 p-2.5 hover:bg-bg-weak-50'>
      <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
        <Icon className='size-icon text-text-sub-600' />
      </div>
      <div className='flex flex-1 flex-col gap-1'>
        <div className='flex items-center gap-2'>
          <div className='text-label-sm text-text-strong-950'>{title}</div>
          {badge && (
            <Badge.Root
              variant='lighter'
              color={badgeColor}
              className='text-label-xs'
              size='medium'
            >
              {badge}
            </Badge.Root>
          )}
        </div>
        <div className='text-paragraph-xs text-text-sub-600'>{description}</div>
      </div>
      <CompactButton.Root
        variant='white'
        size='medium'
        className={cn(
          'opacity-0 transition-opacity duration-200 ease-out',
          'group-hover/cmd-item:opacity-100',
          'group-data-[highlighted=true]/cmd-item:opacity-100',
          'group-data-[selected=true]/cmd-item:opacity-100',
        )}
      >
        <CompactButton.Icon as={RiArrowRightSLine} />
      </CompactButton.Root>
    </CommandMenu.Item>
  );
}

export function FinanceCommandMenu() {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Button.Root variant='neutral' mode='stroke' onClick={() => setOpen(true)}>
        Open Command Menu
      </Button.Root>
      <CommandMenu.Dialog
        open={open}
        onOpenChange={setOpen}
        className='h-full max-h-[702px] w-full max-w-[632px]'
      >
        <div className='rounded-sg-lg bg-bg-white-0 shadow-regular-md'>
          <div className='group/cmd-input flex h-14 items-center gap-2 border-b border-stroke-soft-200 px-5'>
            <RiSearch2Line
              className={cn(
                'size-icon shrink-0 text-text-soft-400',
                'transition duration-200 ease-out',
                'group-focus-within/cmd-input:text-primary-base',
              )}
            />
            <CommandMenu.Input placeholder='Search transactions, payments, or type a command...' />
            <Kbd.Root className='hidden items-center justify-center text-text-soft-400 md:flex'>
              ⌘K
            </Kbd.Root>
          </div>

          <div className='grid grid-cols-4 border-b border-stroke-soft-200'>
            {QUICK_ACTIONS.map((action, index) => {
              const Icon = action.icon;

              return (
                <div
                  key={action.title}
                  className={cn(
                    'flex cursor-pointer flex-col items-center gap-3 rounded-none p-4 hover:bg-bg-weak-50',
                    index < QUICK_ACTIONS.length - 1 &&
                      'border-r border-stroke-soft-200',
                  )}
                >
                  <div
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full p-1.5',
                      action.iconBgColor,
                    )}
                  >
                    <Icon className={cn('size-icon', action.iconColor)} />
                  </div>
                  <div className='flex flex-col items-center gap-0.5 text-center'>
                    <div className='text-label-sm text-text-strong-950'>
                      {action.title}
                    </div>
                    <div className='text-paragraph-xs text-text-sub-600'>
                      {action.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <ScrollArea.Root className='h-[532px] pr-[20px]'>
            <ScrollArea.Viewport className='h-full w-full'>
              <CommandMenu.List>
                <CommandMenu.Group
                  heading={
                    <div className='flex items-center gap-1.5'>
                      <RiTimeLine className='size-icon text-text-soft-400' />
                      <span className='text-label-sm text-text-soft-400'>
                        Recent activity
                      </span>
                    </div>
                  }
                  className='p-2.5 [&>[cmdk-group-heading]]:mb-0 [&>[cmdk-group-heading]]:p-0 [&>[cmdk-group-heading]]:px-2.5 [&>[cmdk-group-heading]]:py-2'
                >
                  {RECENT_ACTIVITY.map((item) => {
                    const ActivityIcon = item.icon;

                    return (
                      <CommandMenu.Item
                        key={item.title}
                        className='group/cmd-item flex items-center gap-3 p-2.5 hover:bg-bg-weak-50'
                      >
                        <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
                          {typeof item.icon === 'string' ? (
                            <img
                              src={item.icon}
                              alt=''
                              className='size-6'
                            />
                          ) : (
                            <ActivityIcon className='size-icon text-text-sub-600' />
                          )}
                        </div>
                        <div className='flex flex-1 flex-col gap-1'>
                          <div className='flex items-center gap-2'>
                            <div className='text-label-sm text-text-strong-950'>
                              {item.title}
                            </div>
                            <Badge.Root
                              variant='lighter'
                              color={item.amountColor}
                              className='text-label-xs'
                              size='medium'
                            >
                              {item.amount}
                            </Badge.Root>
                          </div>
                          <div className='text-paragraph-xs text-text-sub-600'>
                            {item.time}
                          </div>
                        </div>
                        <CompactButton.Root
                          variant='white'
                          size='medium'
                          className={cn(
                            'opacity-0 transition-opacity duration-200 ease-out',
                            'group-hover/cmd-item:opacity-100',
                            'group-data-[highlighted=true]/cmd-item:opacity-100',
                            'group-data-[selected=true]/cmd-item:opacity-100',
                          )}
                        >
                          <CompactButton.Icon as={RiArrowRightSLine} />
                        </CompactButton.Root>
                      </CommandMenu.Item>
                    );
                  })}
                </CommandMenu.Group>

                <CommandMenu.Group
                  heading={
                    <div className='flex items-center gap-1.5'>
                      <RiBankLine className='size-icon text-text-soft-400' />
                      <span className='text-label-sm text-text-soft-400'>
                        Financial services
                      </span>
                    </div>
                  }
                  className='p-2.5 [&>[cmdk-group-heading]]:mb-0 [&>[cmdk-group-heading]]:p-0 [&>[cmdk-group-heading]]:px-2.5 [&>[cmdk-group-heading]]:py-2'
                >
                  {FINANCIAL_SERVICES.map((service) => (
                    <ServiceRow key={service.title} {...service} />
                  ))}
                </CommandMenu.Group>
              </CommandMenu.List>
            </ScrollArea.Viewport>
            <CommandMenuScrollbar />
          </ScrollArea.Root>
        </div>
      </CommandMenu.Dialog>
    </>
  );
}
