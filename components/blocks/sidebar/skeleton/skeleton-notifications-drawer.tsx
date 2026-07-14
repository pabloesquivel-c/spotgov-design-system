'use client';

// Right-side overlay drawer — unchanged from the earlier, already-liked
// design round. Built on the existing Drawer primitive (Radix Dialog under
// the hood) rather than hand-rolled, so closing via the × button, an
// outside click, or Escape all come for free.

import * as React from 'react';
import {
  RiCheckLine,
  RiCloseLine,
  RiFileTextLine,
  RiSparklingLine,
} from '@remixicon/react';
import type { RemixiconComponentType } from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Drawer from '@/components/ui/drawer';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';

type NotificationItem = {
  id: string;
  icon: RemixiconComponentType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
};

const NEW_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'deadline',
    icon: RiFileTextLine,
    iconBg: 'bg-warning-light',
    iconColor: 'text-warning-base',
    title: 'Deadline in 2 days: Highway maintenance framework',
    description: 'Closes Wed 15 Jul, 17:00',
    time: '2h',
    unread: true,
  },
  {
    id: 'match',
    icon: RiSparklingLine,
    iconBg: 'bg-feature-light',
    iconColor: 'text-feature-base',
    title: '4 new tenders match "Rail signalling, > €500k"',
    description: 'Found by your saved search this morning',
    time: '4h',
    unread: true,
  },
];

const EARLIER_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'revision',
    icon: RiCheckLine,
    iconBg: 'bg-success-light',
    iconColor: 'text-success-base',
    title: 'Revision finished: Water treatment upgrade',
    description: 'Ready to review',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 'draft',
    icon: RiFileTextLine,
    iconBg: 'bg-success-light',
    iconColor: 'text-success-base',
    title: 'Draft ready: School catering services, Lot 2',
    description: '6 sections drafted',
    time: '2d',
    unread: false,
  },
];

const TABS = ['All', 'Mentions', 'Invites', 'Archived'] as const;

export function SkeletonNotificationsDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [allRead, setAllRead] = React.useState(false);
  const unreadCount = allRead ? 0 : NEW_NOTIFICATIONS.length;

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Content className='max-w-[428px] rounded-l-20'>
        <div className='flex flex-col gap-3.5 px-5 pt-5'>
          <div className='flex items-center gap-2.5'>
            <h5 className='text-[18px] font-semibold tracking-tight text-text-strong-950'>
              Notifications
            </h5>
            {unreadCount > 0 && (
              <span className='inline-flex h-5 items-center rounded-full bg-error-light px-2 text-label-xs font-semibold text-error-base'>
                {unreadCount} new
              </span>
            )}
            <div className='flex-1' />
            <button
              type='button'
              onClick={() => setAllRead(true)}
              aria-label='Mark all read'
              className='flex size-8 shrink-0 items-center justify-center rounded-lg border border-stroke-soft-200 text-text-sub-600 transition-colors hover:bg-bg-weak-50'
            >
              <RiCheckLine className='size-[17px]' />
            </button>
            <Drawer.Close asChild>
              <button
                type='button'
                aria-label='Close notifications'
                className='flex size-8 shrink-0 items-center justify-center rounded-lg text-text-sub-600 transition-colors hover:bg-bg-weak-50'
              >
                <RiCloseLine className='size-[19px]' />
              </button>
            </Drawer.Close>
          </div>

          <TabMenuHorizontal.Root defaultValue='All'>
            <TabMenuHorizontal.List wrapperClassName='border-none' className='h-auto gap-5.5 border-none'>
              {TABS.map((tab) => (
                <TabMenuHorizontal.Trigger key={tab} value={tab} className='h-auto py-0.5'>
                  {tab}
                </TabMenuHorizontal.Trigger>
              ))}
            </TabMenuHorizontal.List>
          </TabMenuHorizontal.Root>
        </div>

        <div className='flex flex-col gap-1 overflow-y-auto p-3'>
          <SectionLabel>New</SectionLabel>
          {NEW_NOTIFICATIONS.map((item) => (
            <NotificationRow key={item.id} item={item} unread={!allRead} />
          ))}

          <SectionLabel>Earlier</SectionLabel>
          {EARLIER_NOTIFICATIONS.map((item) => (
            <NotificationRow key={item.id} item={item} unread={false} />
          ))}
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className='px-2 py-1.5 pt-2 text-label-xs font-semibold uppercase tracking-wide text-text-soft-400'>
      {children}
    </div>
  );
}

function NotificationRow({
  item,
  unread,
}: {
  item: NotificationItem;
  unread: boolean;
}) {
  const Icon = item.icon;
  return (
    <div
      className={cn(
        'flex items-start gap-[11px] rounded-10 p-3',
        unread ? 'bg-primary-alpha10' : 'bg-bg-white-0',
      )}
    >
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full',
          item.iconBg,
        )}
      >
        <Icon className={cn('size-[17px]', item.iconColor)} />
      </span>
      <div className='flex flex-1 flex-col gap-0.5'>
        <span
          className={cn(
            'text-label-sm',
            unread ? 'text-text-strong-950' : 'text-text-sub-600',
          )}
        >
          {item.title}
        </span>
        <span
          className={cn(
            'text-paragraph-xs',
            unread ? 'text-text-sub-600' : 'text-text-soft-400',
          )}
        >
          {item.description}
        </span>
      </div>
      <div className='flex shrink-0 flex-col items-end gap-1.5'>
        <span className='text-label-xs text-text-soft-400'>{item.time}</span>
        {unread && <span className='size-[7px] rounded-full bg-primary-base' />}
      </div>
    </div>
  );
}
