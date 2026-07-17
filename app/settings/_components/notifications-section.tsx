'use client';

import * as React from 'react';
import { RiNotification3Line } from '@remixicon/react';

import * as Switch from '@/components/ui/switch';
import * as Divider from '@/components/ui/divider';

import { SettingsCard } from './settings-card';
import {
  NOTIFICATION_GROUP_LABEL,
  NOTIFICATION_SETTINGS,
  type NotificationChannels,
  type NotificationGroup,
} from './mock-data';

const GROUP_ORDER: NotificationGroup[] = ['activity', 'mentions', 'tenders'];

function initialState(): Record<string, NotificationChannels> {
  return Object.fromEntries(
    NOTIFICATION_SETTINGS.map((s) => [s.id, { ...s.defaultChannels }]),
  );
}

function channelsEqual(a: NotificationChannels, b: NotificationChannels) {
  return a.inApp === b.inApp && a.email === b.email;
}

export function NotificationsSection({
  onDirtyChange,
}: {
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [state, setState] =
    React.useState<Record<string, NotificationChannels>>(initialState);
  const [saved, setSaved] = React.useState(state);

  const dirty = Object.keys(state).some(
    (id) => !channelsEqual(state[id], saved[id]),
  );

  React.useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  const setChannel = (id: string, channel: keyof NotificationChannels, value: boolean) => {
    setState((prev) => ({
      ...prev,
      [id]: { ...prev[id], [channel]: value },
    }));
  };

  return (
    <SettingsCard
      icon={RiNotification3Line}
      title='Notification Preferences'
      description='Choose what notifications you want to receive, and where.'
      dirty={dirty}
      onDiscard={() => setState(saved)}
      onApply={() => setSaved(state)}
    >
      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-end gap-6'>
          <span className='w-11 shrink-0 text-center text-subheading-2xs uppercase text-text-soft-400'>
            In-app
          </span>
          <span className='w-11 shrink-0 text-center text-subheading-2xs uppercase text-text-soft-400'>
            Email
          </span>
        </div>

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
                  <div
                    key={setting.id}
                    className='flex items-start justify-between gap-4'
                  >
                    <span className='flex min-w-0 flex-1 flex-col gap-0.5'>
                      <span className='text-label-sm text-text-strong-950'>
                        {setting.label}
                      </span>
                      <span className='text-paragraph-xs text-text-sub-600'>
                        {setting.description}
                      </span>
                    </span>
                    <div className='flex shrink-0 items-center gap-6'>
                      <div className='flex w-11 shrink-0 justify-center'>
                        <Switch.Root
                          aria-label={`${setting.label} — in-app`}
                          checked={state[setting.id].inApp}
                          onCheckedChange={(checked) =>
                            setChannel(setting.id, 'inApp', checked)
                          }
                          className='mt-0.5'
                        />
                      </div>
                      <div className='flex w-11 shrink-0 justify-center'>
                        <Switch.Root
                          aria-label={`${setting.label} — email`}
                          checked={state[setting.id].email}
                          onCheckedChange={(checked) =>
                            setChannel(setting.id, 'email', checked)
                          }
                          className='mt-0.5'
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </SettingsCard>
  );
}
