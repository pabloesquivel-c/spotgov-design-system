'use client';

import {
  RiChatSmileLine,
  RiFocus2Line,
  RiMore2Line,
  RiNotification3Line,
  RiSettings2Line,
  RiUser6Line,
} from '@remixicon/react';
import type { RemixiconComponentType } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Popover from '@/components/ui/popover';
import { DashedDivider } from './dashed-divider';

type NotificationItem = {
  id: string;
  icon: RemixiconComponentType;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  hasIndicator?: boolean;
};

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    icon: RiUser6Line,
    iconColor: 'text-information-base',
    title: 'New Lead Generated',
    description: 'John Smith submitted web form',
    time: '10 minutes ago',
  },
  {
    id: '2',
    icon: RiFocus2Line,
    iconColor: 'text-away-base',
    title: 'Campaign Milestone',
    description: 'Black Friday campaign hit 150% target',
    time: '3 days ago',
    hasIndicator: true,
  },
  {
    id: '3',
    icon: RiChatSmileLine,
    iconColor: 'text-feature-base',
    title: 'Live Chat Interaction',
    description: 'John Smith submitted web form',
    time: '4 days ago',
  },
];

export function NotificationsPopover() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke' className='relative'>
          <Button.Icon as={RiNotification3Line} />
          <div className='absolute right-2.5 top-2.5 size-2 rounded-full border-2 border-stroke-white-0 bg-primary-base shadow-regular-xs' />
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content
        unstyled
        showArrow={false}
        sideOffset={5}
        className='z-50 mx-4 w-[calc(100vw-32px)] rounded-20 bg-bg-white-0 p-0 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200 will-change-transform min-[480px]:max-w-[420px]'
      >
        <div className='relative z-10 flex items-center justify-between px-5 py-4'>
          <h5 className='text-label-md text-text-sub-600'>Notifications</h5>
          <CompactButton.Root
            size='large'
            variant='ghost'
            className='text-text-soft-400'
            tabIndex={-1}
          >
            <CompactButton.Icon as={RiSettings2Line} />
          </CompactButton.Root>
        </div>
        <div className='px-4'>
          <DashedDivider />
        </div>
        <div className='p-2 pb-0'>
          {NOTIFICATIONS.map((notification) => {
            const Icon = notification.icon;

            return (
              <div
                key={notification.id}
                className='group relative rounded-sg-lg p-4 hover:bg-bg-weak-50'
              >
                <CompactButton.Root
                  size='medium'
                  variant='ghost'
                  className='absolute right-3 top-3 opacity-0 group-hover:opacity-100'
                >
                  <CompactButton.Icon as={RiMore2Line} />
                </CompactButton.Root>
                <div className='flex items-start gap-4'>
                  <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
                    <Icon className={`size-icon ${notification.iconColor}`} />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-2'>
                        <h5 className='text-label-sm text-text-strong-950'>
                          {notification.title}
                        </h5>
                        {notification.hasIndicator && (
                          <div className='h-1.5 w-1.5 rounded-full bg-primary-base' />
                        )}
                      </div>
                      <span className='text-paragraph-sm text-text-sub-600'>
                        {notification.description}
                      </span>
                    </div>
                    <span className='text-label-xs text-text-soft-400'>
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className='px-5 pb-5 pt-2'>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='xsmall'
            className='w-full'
          >
            Archive All
          </Button.Root>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
