'use client';

import * as React from 'react';

import * as Select from '@/components/ui/select';
import * as Switch from '@/components/ui/switch';

import { SettingRow } from '../setting-row';
import type { SectionCommitHandle } from '../settings-modal';

type NotificationSetting = {
  id: string;
  label: string;
  description: string;
  defaultOn: boolean;
};

// Decision 3 (locked): one toggle per event, no in-app/email split. The
// three separate @mention rows the design carried (comment, tender note,
// analysis) blend into a single "Mentions" event — this is what takes the
// Figma frame's 7 rows down to the canonical 5.
const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    id: 'analysis-completed',
    label: 'Analysis completed',
    description: 'A reviewer finishes an analysis.',
    defaultOn: true,
  },
  {
    id: 'mentions',
    label: 'Mentions',
    description: 'Someone @mentions you in a comment, note, or analysis.',
    defaultOn: true,
  },
  {
    id: 'deadline-approaching',
    label: 'Deadline approaching',
    description: "A tracked tender's submission deadline is coming up.",
    defaultOn: true,
  },
  {
    id: 'new-matching-tender',
    label: 'New matching tender',
    description: 'A new tender matches your saved search criteria.',
    defaultOn: true,
  },
  {
    id: 'award-published',
    label: 'Award published',
    description: 'The award decision for a tracked tender is published.',
    defaultOn: true,
  },
];

const LEAD_DAY_OPTIONS = [
  { value: '1', label: '1 day before' },
  { value: '3', label: '3 days before' },
  { value: '7', label: '7 days before' },
  { value: '14', label: '14 days before' },
];

function initialState(): Record<string, boolean> {
  return Object.fromEntries(
    NOTIFICATION_SETTINGS.map((setting) => [setting.id, setting.defaultOn]),
  );
}

type NotificationPreferences = {
  enabled: Record<string, boolean>;
  deadlineReminders: boolean;
  leadDays: string;
};

function initialPreferences(): NotificationPreferences {
  return {
    enabled: initialState(),
    deadlineReminders: true,
    leadDays: '7',
  };
}

function preferencesEqual(
  first: NotificationPreferences,
  second: NotificationPreferences,
) {
  return (
    first.deadlineReminders === second.deadlineReminders &&
    first.leadDays === second.leadDays &&
    NOTIFICATION_SETTINGS.every(
      (setting) => first.enabled[setting.id] === second.enabled[setting.id],
    )
  );
}

export type NotificationsModalSectionProps = {
  onDirtyChange: (dirty: boolean) => void;
};

export const NotificationsModalSection = React.forwardRef<
  SectionCommitHandle,
  NotificationsModalSectionProps
>(function NotificationsModalSection({ onDirtyChange }, ref) {
  const [saved, setSaved] = React.useState(initialPreferences);
  const [draft, setDraft] = React.useState(initialPreferences);
  const dirty = !preferencesEqual(draft, saved);

  React.useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);

  React.useImperativeHandle(ref, () => ({
    save: () => setSaved(draft),
    discard: () => setDraft(saved),
  }));

  return (
    <div className='flex flex-col divide-y divide-stroke-soft-200'>
      <SettingRow
        title='Deadline reminders'
        description="Remind me before a tracked tender's deadline."
        control={
          <div className='flex items-center gap-3'>
            <Switch.Root
              aria-label='Deadline reminders'
              checked={draft.deadlineReminders}
              onCheckedChange={(deadlineReminders) =>
                setDraft((current) => ({ ...current, deadlineReminders }))
              }
            />
            <Select.Root
              value={draft.leadDays}
              onValueChange={(leadDays) =>
                setDraft((current) => ({ ...current, leadDays }))
              }
              size='small'
              disabled={!draft.deadlineReminders}
            >
              <Select.Trigger className='w-36 shrink-0'>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {LEAD_DAY_OPTIONS.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        }
      />
      {NOTIFICATION_SETTINGS.map((setting) => (
        <SettingRow
          key={setting.id}
          title={setting.label}
          description={setting.description}
          control={
            <Switch.Root
              aria-label={setting.label}
              checked={draft.enabled[setting.id]}
              onCheckedChange={(checked) =>
                setDraft((current) => ({
                  ...current,
                  enabled: { ...current.enabled, [setting.id]: checked },
                }))
              }
            />
          }
        />
      ))}
    </div>
  );
});
