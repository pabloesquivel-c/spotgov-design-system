'use client';

import * as React from 'react';

import * as Divider from '@/components/ui/divider';
import * as Label from '@/components/ui/label';
import * as LinkButton from '@/components/ui/link-button';
import * as Select from '@/components/ui/select';
import * as Switch from '@/components/ui/switch';

import { SettingsSection } from './settings-card';
import {
  DEFAULT_EMAIL_NOTIFICATION_PREFERENCES,
  type EmailNotificationPreferences,
} from './mock-data';

const DEADLINE_REMINDER_VALUES = {
  off: null,
  '1': 1,
  '3': 3,
  '7': 7,
} as const;

const DEADLINE_REMINDER_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: '1', label: '1 day before' },
  { value: '3', label: '3 days before' },
  { value: '7', label: '7 days before' },
] as const;

function preferencesEqual(
  a: EmailNotificationPreferences,
  b: EmailNotificationPreferences,
) {
  return (
    a.dailyTenderDigest === b.dailyTenderDigest &&
    a.deadlineReminderDays === b.deadlineReminderDays &&
    a.workUpdates === b.workUpdates
  );
}

export function NotificationsSection({
  onDirtyChange,
  onNavigateToProfile,
}: {
  onDirtyChange?: (dirty: boolean) => void;
  onNavigateToProfile?: () => void;
}) {
  const [preferences, setPreferences] =
    React.useState<EmailNotificationPreferences>(
      DEFAULT_EMAIL_NOTIFICATION_PREFERENCES,
    );
  const [savedPreferences, setSavedPreferences] =
    React.useState<EmailNotificationPreferences>(preferences);

  const dirty = !preferencesEqual(preferences, savedPreferences);

  React.useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  const handleDiscard = () => {
    setPreferences(savedPreferences);
  };

  // TODO(connect): PATCH the user's notification preferences.
  const handleApply = () => {
    setSavedPreferences(preferences);
  };

  return (
    <SettingsSection
      title='Email notifications'
      dirty={dirty}
      onDiscard={handleDiscard}
      onApply={handleApply}
    >
      <div className='flex flex-col gap-6'>
        <p className='text-paragraph-sm text-text-sub-600'>
          Updates are sent to user@example.com.{' '}
          <LinkButton.Root
            type='button'
            variant='primary'
            onClick={onNavigateToProfile}
          >
            Profile
          </LinkButton.Root>{' '}
          to change the address.
        </p>

        <Divider.Root variant='line-spacing' />

        <div className='flex items-start justify-between gap-4'>
          <Label.Root
            htmlFor='daily-tender-digest'
            className='min-w-0 flex-1 flex-col items-start gap-0.5'
          >
            <span className='text-label-sm text-text-strong-950'>
              Daily tender digest
            </span>
            <span className='text-paragraph-sm text-text-sub-600'>
              One morning email for matching tenders and awards.
            </span>
          </Label.Root>
          <Switch.Root
            id='daily-tender-digest'
            checked={preferences.dailyTenderDigest}
            onCheckedChange={(checked) =>
              setPreferences((previous) => ({
                ...previous,
                dailyTenderDigest: checked,
              }))
            }
            className='mt-0.5 shrink-0'
          />
        </div>

        <Divider.Root variant='line-spacing' />

        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4'>
          <Label.Root
            htmlFor='deadline-reminders'
            className='min-w-0 flex-1 flex-col items-start gap-0.5'
          >
            <span className='text-label-sm text-text-strong-950'>
              Deadline reminders
            </span>
            <span className='text-paragraph-sm text-text-sub-600'>
              Get an email before a tracked tender&apos;s deadline.
            </span>
          </Label.Root>
          <Select.Root
            value={
              preferences.deadlineReminderDays === null
                ? 'off'
                : String(preferences.deadlineReminderDays)
            }
            onValueChange={(value) =>
              setPreferences((previous) => ({
                ...previous,
                deadlineReminderDays:
                  DEADLINE_REMINDER_VALUES[
                    value as keyof typeof DEADLINE_REMINDER_VALUES
                  ],
              }))
            }
            size='small'
          >
            <Select.Trigger
              id='deadline-reminders'
              aria-label='Deadline reminder timing'
              className='w-full sm:w-[180px]'
            >
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {DEADLINE_REMINDER_OPTIONS.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        <Divider.Root variant='line-spacing' />

        <div className='flex items-start justify-between gap-4'>
          <Label.Root
            htmlFor='work-updates'
            className='min-w-0 flex-1 flex-col items-start gap-0.5'
          >
            <span className='text-label-sm text-text-strong-950'>
              Work updates
            </span>
            <span className='text-paragraph-sm text-text-sub-600'>
              Timely emails for @mentions and completed analyses.
            </span>
          </Label.Root>
          <Switch.Root
            id='work-updates'
            checked={preferences.workUpdates}
            onCheckedChange={(checked) =>
              setPreferences((previous) => ({
                ...previous,
                workUpdates: checked,
              }))
            }
            className='mt-0.5 shrink-0'
          />
        </div>
      </div>
    </SettingsSection>
  );
}
