'use client';

import { RiInformationLine, RiNotificationBadgeLine } from '@remixicon/react';

import * as Alert from '@/components/ui/alert';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Label from '@/components/ui/label';
import * as Switch from '@/components/ui/switch';

const NOTIFICATION_OPTIONS = [
  {
    id: 'notification-news',
    title: 'News and Updates',
    description:
      'Stay informed about the latest news, updates, and announcements.',
  },
  {
    id: 'notification-promotions',
    title: 'Promotions and Offers',
    description:
      'Receive notifications about special promotions, discounts, and exclusive offers.',
  },
  {
    id: 'notification-reminders',
    title: 'Reminders and Events',
    description:
      'Get reminders for upcoming events, deadlines, and appointments.',
  },
];

export function NotificationPreferencesSwitch() {
  return (
    <div className='flex w-full max-w-[440px] flex-col gap-5 rounded-20 bg-bg-white-0 p-5 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-3.5'>
          <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200'>
            <RiNotificationBadgeLine className='size-5 text-text-sub-600' />
          </div>
          <div>
            <div className='text-label-sm text-text-strong-950'>
              Notification Preferences
            </div>
            <div className='mt-1 text-paragraph-xs text-text-sub-600'>
              Choose what notifications you want to receive.
            </div>
          </div>
        </div>
        <Divider.Root variant='line-spacing' />
        {NOTIFICATION_OPTIONS.map((option) => (
          <div key={option.id} className='flex items-start gap-2'>
            <Switch.Root id={option.id} />
            <Label.Root htmlFor={option.id} className='cursor-pointer'>
              <div className='text-label-sm text-text-strong-950'>
                {option.title}
              </div>
              <div className='mt-1 text-paragraph-xs text-text-sub-600'>
                {option.description}
              </div>
            </Label.Root>
          </div>
        ))}
      </div>
      <Alert.Root variant='lighter' status='information' size='xsmall'>
        <Alert.Icon as={RiInformationLine} />
        Maximize your app usage by leaving notification settings active.
      </Alert.Root>
      <div className='grid grid-cols-2 gap-3'>
        <Button.Root variant='neutral' mode='stroke' size='small'>
          Discard
        </Button.Root>
        <Button.Root size='small'>Apply Changes</Button.Root>
      </div>
    </div>
  );
}
