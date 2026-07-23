'use client';

import * as React from 'react';
import { RiCheckLine } from '@remixicon/react';

import * as Checkbox from '@/components/ui/checkbox';
import * as Divider from '@/components/ui/divider';
import * as Label from '@/components/ui/label';
import * as Switch from '@/components/ui/switch';

import { SettingsSection } from './settings-card';
import {
  DEFAULT_TENDER_NOTIFICATION_PREFS,
  NOTIFICATION_SETTINGS,
  type NotificationChannels,
  type NotificationGroup,
  type TenderNotificationPrefs,
} from './mock-data';

const DEADLINE_OPTIONS = [
  { value: 7, label: '7 days before' },
  { value: 3, label: '3 days before' },
  { value: 1, label: '1 day before' },
] as const;

const ACTIVITY_AND_MENTION_GROUPS: NotificationGroup[] = [
  'activity',
  'mentions',
];

function initialChannels(): Record<string, NotificationChannels> {
  return Object.fromEntries(
    NOTIFICATION_SETTINGS.map((setting) => [
      setting.id,
      { ...setting.defaultChannels },
    ]),
  );
}

function cloneTenderPrefs(
  preferences: TenderNotificationPrefs,
): TenderNotificationPrefs {
  return {
    ...preferences,
    deadlineLeadDays: [...preferences.deadlineLeadDays],
  };
}

function channelsEqual(
  a: Record<string, NotificationChannels>,
  b: Record<string, NotificationChannels>,
) {
  return Object.keys(a).every(
    (id) => a[id].inApp === b[id]?.inApp && a[id].email === b[id]?.email,
  );
}

function tenderPrefsEqual(
  a: TenderNotificationPrefs,
  b: TenderNotificationPrefs,
) {
  return (
    a.dailyDigest === b.dailyDigest &&
    a.deadlineLeadDays.length === b.deadlineLeadDays.length &&
    a.deadlineLeadDays.every((day, index) => day === b.deadlineLeadDays[index])
  );
}

export function NotificationsSection({
  onDirtyChange,
}: {
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [channels, setChannels] = React.useState(initialChannels);
  const [savedChannels, setSavedChannels] = React.useState(channels);
  const [tenderPreferences, setTenderPreferences] =
    React.useState<TenderNotificationPrefs>(() =>
      cloneTenderPrefs(DEFAULT_TENDER_NOTIFICATION_PREFS),
    );
  const [savedTenderPreferences, setSavedTenderPreferences] =
    React.useState<TenderNotificationPrefs>(() =>
      cloneTenderPrefs(DEFAULT_TENDER_NOTIFICATION_PREFS),
    );

  const dirty =
    !channelsEqual(channels, savedChannels) ||
    !tenderPrefsEqual(tenderPreferences, savedTenderPreferences);

  React.useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  const handleDiscard = () => {
    setChannels(savedChannels);
    setTenderPreferences(cloneTenderPrefs(savedTenderPreferences));
  };

  const handleApply = () => {
    // TODO(connect): PATCH the user's notification channel and tender preferences.
    setSavedChannels(channels);
    setSavedTenderPreferences(cloneTenderPrefs(tenderPreferences));
  };

  const handleChannelChange = (
    id: string,
    channel: keyof NotificationChannels,
    checked: boolean,
  ) => {
    setChannels((previous) => ({
      ...previous,
      [id]: { ...previous[id], [channel]: checked },
    }));
  };

  const handleDeadlineLeadDayChange = (day: number, checked: boolean) => {
    setTenderPreferences((previous) => ({
      ...previous,
      deadlineLeadDays: checked
        ? [...previous.deadlineLeadDays, day].sort((a, b) => b - a)
        : previous.deadlineLeadDays.filter((value) => value !== day),
    }));
  };

  const handleDailyDigestChange = (checked: boolean) => {
    setTenderPreferences((previous) => ({ ...previous, dailyDigest: checked }));
  };

  const activityAndMentionSettings = NOTIFICATION_SETTINGS.filter((setting) =>
    ACTIVITY_AND_MENTION_GROUPS.includes(setting.group),
  );
  const tenderSettings = NOTIFICATION_SETTINGS.filter(
    (setting) => setting.group === 'tenders',
  );

  return (
    <SettingsSection
      title='Notifications'
      description='Choose which tender updates, activity, and mentions you receive.'
      dirty={dirty}
      onDiscard={handleDiscard}
      onApply={handleApply}
    >
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-0.5'>
            <h3 className='text-label-sm text-text-strong-950'>
              Tender deadlines
            </h3>
            <p className='text-paragraph-sm text-text-sub-600'>
              Remind me before a tracked tender&apos;s deadline.
            </p>
          </div>
          <div className='flex flex-col gap-3 sm:flex-row sm:gap-6'>
            {DEADLINE_OPTIONS.map((option) => {
              const id = `deadline-lead-${option.value}`;
              return (
                <Label.Root
                  key={option.value}
                  htmlFor={id}
                  className='cursor-pointer gap-2 text-paragraph-sm text-text-strong-950'
                >
                  <Checkbox.Root
                    id={id}
                    checked={tenderPreferences.deadlineLeadDays.includes(
                      option.value,
                    )}
                    onCheckedChange={(checked) =>
                      handleDeadlineLeadDayChange(option.value, checked === true)
                    }
                  />
                  {option.label}
                </Label.Root>
              );
            })}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div className='flex items-start justify-between gap-4'>
          <Label.Root
            htmlFor='daily-tender-digest'
            className='min-w-0 flex-1 flex-col items-start gap-0.5'
          >
            <span className='text-label-sm text-text-strong-950'>
              Tender email digest
            </span>
            <span className='text-paragraph-sm text-text-sub-600'>
              One morning email with matching tenders, direct invitations,
              awards, and upcoming deadlines.
            </span>
          </Label.Root>
          <Switch.Root
            id='daily-tender-digest'
            checked={tenderPreferences.dailyDigest}
            onCheckedChange={handleDailyDigestChange}
            className='mt-0.5 shrink-0'
          />
        </div>

        <Divider.Root variant='line-spacing' />

        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-0.5'>
            <h3 className='text-label-sm text-text-strong-950'>
              Activity &amp; mentions
            </h3>
            <p className='text-paragraph-sm text-text-sub-600'>
              Choose how you receive activity, mention, and tender updates.
            </p>
          </div>

          <div className='flex items-center justify-end gap-6'>
            <span className='w-11 shrink-0 text-center text-label-xs text-text-sub-600'>
              In-app
            </span>
            <span className='w-32 shrink-0 text-center text-label-xs text-text-sub-600'>
              Email
            </span>
          </div>

          <div className='flex flex-col gap-4'>
            {activityAndMentionSettings.map((setting) => (
              <NotificationRow
                key={setting.id}
                setting={setting}
                channels={channels[setting.id]}
                onChannelChange={handleChannelChange}
              />
            ))}
          </div>

          <Divider.Root variant='line-spacing' />

          <div className='flex flex-col gap-3'>
            <span className='text-label-sm text-text-strong-950'>
              Tender updates
            </span>
            {tenderSettings.map((setting) => (
              <NotificationRow
                key={setting.id}
                setting={setting}
                channels={channels[setting.id]}
                digestEnabled={tenderPreferences.dailyDigest}
                onChannelChange={handleChannelChange}
              />
            ))}
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}

function NotificationRow({
  setting,
  channels,
  digestEnabled = false,
  onChannelChange,
}: {
  setting: (typeof NOTIFICATION_SETTINGS)[number];
  channels: NotificationChannels;
  digestEnabled?: boolean;
  onChannelChange: (
    id: string,
    channel: keyof NotificationChannels,
    checked: boolean,
  ) => void;
}) {
  return (
    <div className='flex items-start justify-between gap-4'>
      <div className='min-w-0 flex-1 flex flex-col gap-0.5'>
        <span className='text-label-sm text-text-strong-950'>{setting.label}</span>
        <span className='text-paragraph-xs text-text-sub-600'>
          {setting.description}
        </span>
      </div>
      <div className='flex shrink-0 items-start gap-6'>
        <div className='flex w-11 justify-center'>
          <Switch.Root
            aria-label={`${setting.label} in-app notifications`}
            checked={channels.inApp}
            onCheckedChange={(checked) =>
              onChannelChange(setting.id, 'inApp', checked)
            }
            className='mt-0.5'
          />
        </div>
        <div className='flex w-32 justify-center'>
          {digestEnabled ? (
            <span className='flex items-center gap-1 text-label-xs text-text-sub-600'>
              <RiCheckLine aria-hidden className='size-4 shrink-0' />
              <span className='sr-only'>{setting.label}: </span>
              Included in daily digest
            </span>
          ) : (
            <Switch.Root
              aria-label={`${setting.label} email notifications`}
              checked={channels.email}
              onCheckedChange={(checked) =>
                onChannelChange(setting.id, 'email', checked)
              }
              className='mt-0.5'
            />
          )}
        </div>
      </div>
    </div>
  );
}
