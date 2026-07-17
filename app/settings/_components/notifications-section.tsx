'use client';

import * as React from 'react';
import { RiNotification3Line } from '@remixicon/react';

import * as Switch from '@/components/ui/switch';
import * as Divider from '@/components/ui/divider';

import { SettingsCard } from './settings-card';
import {
  NOTIFICATION_GROUP_LABEL,
  NOTIFICATION_SETTINGS,
  type NotificationGroup,
} from './mock-data';

const GROUP_ORDER: NotificationGroup[] = ['activity', 'mentions'];

export function NotificationsSection() {
  const [state, setState] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTIFICATION_SETTINGS.map((s) => [s.id, s.defaultOn])),
  );
  const [saved, setSaved] = React.useState(state);

  const dirty = Object.keys(state).some((id) => state[id] !== saved[id]);

  return (
    <SettingsCard
      icon={RiNotification3Line}
      title='Notification Preferences'
      description='Choose what notifications you want to receive.'
      dirty={dirty}
      onDiscard={() => setState(saved)}
      onApply={() => setSaved(state)}
    >
      <div className='flex flex-col gap-4'>
        {GROUP_ORDER.map((group, groupIndex) => {
          const settings = NOTIFICATION_SETTINGS.filter(
            (s) => s.group === group,
          );
          return (
            <React.Fragment key={group}>
              {groupIndex > 0 && <Divider.Root variant='line-spacing' />}
              <div className='flex flex-col gap-3.5'>
                <span className='text-[12px] font-medium uppercase tracking-[0.04em] text-text-sub-600'>
                  {NOTIFICATION_GROUP_LABEL[group]}
                </span>
                {settings.map((setting) => (
                  <label
                    key={setting.id}
                    className='flex cursor-pointer items-start justify-between gap-4'
                  >
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
                ))}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </SettingsCard>
  );
}
