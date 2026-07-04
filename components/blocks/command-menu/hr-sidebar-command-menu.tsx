'use client';

import * as React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import {
  RiArrowRightSLine,
  RiBookletLine,
  RiDashboardLine,
  RiFocus3Line,
  RiFocusLine,
  RiGiftLine,
  RiGitForkLine,
  RiHandHeartLine,
  RiLayoutGridLine,
  RiLineChartLine,
  RiPieChartLine,
  RiSearch2Line,
  RiStarSmileLine,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as CommandMenu from '@/components/ui/command-menu';
import * as CompactButton from '@/components/ui/compact-button';
import * as Kbd from '@/components/ui/kbd';
import { cn } from '@/utils/cn';

const ScrollbarVertical = React.forwardRef<
  React.ComponentRef<typeof ScrollArea.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollArea.ScrollAreaScrollbar>
>(({ className, ...rest }, ref) => (
  <ScrollArea.Scrollbar
    ref={ref}
    className={cn(
      'relative z-30 flex w-5 touch-none select-none justify-center border-l border-stroke-soft-200 bg-bg-white-0 py-1.5',
      className,
    )}
    orientation='vertical'
    {...rest}
  >
    <ScrollArea.Thumb className='!w-1 shrink-0 rounded-full bg-stroke-soft-200' />
  </ScrollArea.Scrollbar>
));
ScrollbarVertical.displayName = 'ScrollbarVertical';

const CATEGORIES = [
  {
    title: 'Benefits & Compensation',
    description: 'Employee benefits, salary, and rewards',
    count: '18',
    icon: RiGiftLine,
  },
  {
    title: 'Employee Development',
    description: 'Career growth and skill development',
    count: '24',
    icon: RiPieChartLine,
  },
  {
    title: 'Employee Relations',
    description: 'Workplace relationships and culture',
    count: '12',
    icon: RiHandHeartLine,
  },
  {
    title: 'Onboarding',
    description: 'New employee integration process',
    count: '36',
    icon: RiFocus3Line,
  },
  {
    title: 'Performance',
    description: 'Employee evaluation and metrics',
    count: '48',
    icon: RiStarSmileLine,
  },
  {
    title: 'Recruitment',
    description: 'Hiring and talent acquisition',
    count: '22',
    icon: RiFocusLine,
  },
  {
    title: 'Training',
    description: 'Learning and development programs',
    count: '16',
    icon: RiBookletLine,
  },
  {
    title: 'Workflows',
    description: 'Automated workflows and processes',
    count: '16',
    icon: RiGitForkLine,
  },
  {
    title: 'Analytics',
    description: 'Data analysis and reporting',
    count: '16',
    icon: RiLineChartLine,
  },
];

const SIDEBAR_ITEMS = [
  { title: 'Analytics', icon: RiLineChartLine },
  { title: 'Categories', icon: RiLayoutGridLine },
  { title: 'Dashboards', icon: RiDashboardLine },
  { title: 'Workflows', icon: RiGitForkLine },
];

export function HrSidebarCommandMenu() {
  const [open, setOpen] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState('Dashboards');

  return (
    <>
      <Button.Root variant='neutral' mode='stroke' onClick={() => setOpen(true)}>
        Open Command Menu
      </Button.Root>
      <CommandMenu.Dialog open={open} onOpenChange={setOpen}>
        <div className='flex flex-col overflow-hidden rounded-20 bg-bg-white-0 shadow-regular-md md:flex-row'>
          <div className='border-b border-stroke-soft-200 md:flex md:min-w-[220px] md:flex-col md:border-b-0 md:border-r'>
            <div className='flex gap-2 overflow-x-auto p-3 md:flex-col'>
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.title;

                return (
                  <button
                    key={item.title}
                    type='button'
                    onClick={() => setActiveItem(item.title)}
                    className={cn(
                      'flex shrink-0 cursor-pointer items-center gap-2 rounded-10 p-2 text-left transition-all duration-200 ease-out',
                      isActive
                        ? 'bg-bg-weak-50 font-medium text-primary-base'
                        : 'text-text-sub-600 hover:bg-bg-weak-50',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-5',
                        isActive ? 'text-primary-base' : 'text-text-soft-400',
                      )}
                    />
                    <span
                      className={cn(
                        'text-label-sm',
                        isActive ? 'text-text-strong-950' : 'text-text-sub-600',
                      )}
                    >
                      {item.title}
                    </span>
                    {isActive && (
                      <RiArrowRightSLine className='ml-auto size-5 text-text-sub-600' />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className='flex w-full min-w-[320px] flex-1 flex-col md:w-[70%]'>
            <div className='group/cmd-input flex h-14 items-center gap-3 border-b border-stroke-soft-200 px-5'>
              <RiSearch2Line
                className={cn(
                  'size-5 shrink-0 text-text-soft-400',
                  'transition duration-200 ease-out',
                  'group-focus-within/cmd-input:text-primary-base',
                )}
              />
              <CommandMenu.Input placeholder='Search HR tools or press...' />
              <Kbd.Root className='hidden items-center justify-center text-text-soft-400 md:flex'>
                ⌘K
              </Kbd.Root>
            </div>
            <div className='w-full pb-px pr-px'>
              <ScrollArea.Root type='auto' className='h-[524px] overflow-hidden'>
                <ScrollArea.Viewport className='h-full w-full'>
                  <CommandMenu.List className='flex w-full flex-1 flex-col'>
                    <CommandMenu.Group className='flex flex-col p-0'>
                      <div className='flex flex-col gap-2 py-2 pl-2 pr-[30px]'>
                        {CATEGORIES.map((category) => {
                          const Icon = category.icon;

                          return (
                            <CommandMenu.Item
                              key={category.title}
                              value={category.title}
                              className={cn(
                                'group/cmd-item flex w-full items-center gap-3 px-2.5 py-2 outline-none transition-all duration-200 ease-out',
                              )}
                            >
                              <div
                                className={cn(
                                  'flex size-9 shrink-0 items-center justify-center rounded-full bg-bg-weak-50 text-text-sub-600 transition-all duration-200 ease-in-out',
                                  'group-hover/cmd-item:bg-bg-white-0 group-hover/cmd-item:shadow-regular-xs',
                                  'group-data-[selected=true]/cmd-item:bg-bg-white-0 group-data-[selected=true]/cmd-item:shadow-regular-xs',
                                )}
                              >
                                <Icon className='size-5' />
                              </div>
                              <div className='flex flex-1 flex-col gap-1'>
                                <div className='flex items-center gap-2'>
                                  <span className='text-label-sm text-text-strong-950'>
                                    {category.title}
                                  </span>
                                  <span className='text-label-sm text-text-soft-400'>
                                    ({category.count})
                                  </span>
                                </div>
                                <span className='text-paragraph-xs text-text-sub-600'>
                                  {category.description}
                                </span>
                              </div>
                              <CompactButton.Root
                                variant='ghost'
                                size='medium'
                                className={cn(
                                  'opacity-0 transition-all duration-200 ease-in-out',
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
                      </div>
                    </CommandMenu.Group>
                  </CommandMenu.List>
                </ScrollArea.Viewport>
                <ScrollbarVertical />
              </ScrollArea.Root>
            </div>
          </div>
        </div>
      </CommandMenu.Dialog>
    </>
  );
}
