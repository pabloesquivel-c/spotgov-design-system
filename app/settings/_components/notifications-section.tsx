'use client';

import * as React from 'react';
import { RiNotification3Line } from '@remixicon/react';

import * as Switch from '@/components/ui/switch';
import * as Divider from '@/components/ui/divider';

import { SettingsCard } from './settings-card';
import { NOTIFICATION_SETTINGS } from './mock-data';

export function NotificationsSection() {
  const [state, setState] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTIFICATION_SETTINGS.map((s) => [s.id, s.defaultOn])),
  );

  return (
    <SettingsCard
      icon={RiNotification3Line}
      title='Notifications'
      description='Choose which events send you a notification.'
    >
      <div className='flex flex-col'>
        {NOTIFICATION_SETTINGS.map((setting, index) => (
          <React.Fragment key={setting.id}>
            {index > 0 && <Divider.Root variant='line-spacing' className='my-1' />}
            <label className='flex cursor-pointer items-start justify-between gap-4 py-2'>
              <span className='flex flex-col gap-0.5'>
                <span className='text-label-sm text-text-strong-950'>
                  {setting.label}
                </span>
                <span className='text-paragraph-xs text-text-sub-600'>
                  {setting.description}
                </span>
              </span>
              <Switch.Root
                checked={state[setting.id]}
                onCheckedChange={(checked) =>
                  setState((prev) => ({ ...prev, [setting.id]: checked }))
                }
                className='mt-0.5'
              />
            </label>
          </React.Fragment>
        ))}
      </div>
    </SettingsCard>
  );
}
