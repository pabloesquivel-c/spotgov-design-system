'use client';

// Scratch DialKit sandbox for tuning the notifications drawer's states and
// motion live. Not production, not the /playground MDX showcase — this is a
// tuning rig. Reuses the real drawer component (via its `inline` escape
// hatch, notifications-drawer.tsx) so what gets tuned here is the same code
// that ships, not a lookalike.
// Teardown: rm -rf app/notifications-drawer-sandbox

import * as React from 'react';
import { DialRoot, useDialKit } from 'dialkit';
import 'dialkit/styles.css';

import * as Button from '@/components/ui/button';

import { NotificationsDrawer, type Tab } from '../notifications-drawer/_components/notifications-drawer';
import { DEFAULT_SETTINGS, type NotificationsDrawerSettings } from '../notifications-drawer/_components/settings';

export default function NotificationsDrawerSandboxPage() {
  const [open, setOpen] = React.useState(true);
  const [tab, setTab] = React.useState<Tab>('all');
  const [, setUnreadCount] = React.useState(0);
  const [destination, setDestination] = React.useState<string | null>(null);

  const values = useDialKit('Notifications drawer', {
    data: {
      dataset: {
        type: 'select',
        options: ['mixed', 'opportunities', 'people', 'many', 'tiny'],
        default: DEFAULT_SETTINGS.dataset,
      },
      unreadCount: [DEFAULT_SETTINGS.unreadCount, 0, 20],
    },
    load: {
      surface: {
        type: 'select',
        options: ['ready', 'loading', 'error', 'empty'],
        default: DEFAULT_SETTINGS.surface,
      },
      latency: [DEFAULT_SETTINGS.latency, 0, 3000],
      permission: {
        type: 'select',
        options: ['full', 'read-only'],
        default: DEFAULT_SETTINGS.permission,
      },
    },
    readModel: {
      readTrigger: {
        type: 'select',
        options: ['visible', 'scroll', 'manual'],
        default: DEFAULT_SETTINGS.readTrigger,
      },
      visibleThreshold: [DEFAULT_SETTINGS.visibleThreshold, 0, 1, 0.05],
      dwellMs: [DEFAULT_SETTINGS.dwellMs, 0, 3000],
      markAllAsRead: DEFAULT_SETTINGS.markAllAsRead,
    },
    items: {
      attribution: {
        type: 'select',
        options: ['icon', 'avatar'],
        default: DEFAULT_SETTINGS.attribution,
      },
      nameFieldInCopy: DEFAULT_SETTINGS.nameFieldInCopy,
      pageLimit: [DEFAULT_SETTINGS.pageLimit, 5, 100],
    },
  } as const);

  // DialKit owns these values; the drawer's own onSettingsChange (e.g. the
  // error state's "Try again" resetting surface back to "ready") has nowhere
  // to write back to a dial, so it's folded into local overrides on top of
  // the dial values instead of fighting DialKit for ownership.
  const [overrides, setOverrides] = React.useState<
    Partial<NotificationsDrawerSettings>
  >({});

  const settings: NotificationsDrawerSettings = {
    dataset: values.data.dataset as NotificationsDrawerSettings['dataset'],
    unreadCount: values.data.unreadCount,
    surface: values.load.surface as NotificationsDrawerSettings['surface'],
    latency: values.load.latency,
    failNextAction: DEFAULT_SETTINGS.failNextAction,
    permission: values.load.permission as NotificationsDrawerSettings['permission'],
    readTrigger: values.readModel.readTrigger as NotificationsDrawerSettings['readTrigger'],
    visibleThreshold: values.readModel.visibleThreshold,
    dwellMs: values.readModel.dwellMs,
    markAllAsRead: values.readModel.markAllAsRead,
    pageSize: DEFAULT_SETTINGS.pageSize,
    attribution: values.items.attribution as NotificationsDrawerSettings['attribution'],
    nameFieldInCopy: values.items.nameFieldInCopy,
    pageLimit: values.items.pageLimit,
    ...overrides,
  };

  const patch = React.useCallback(
    (update: Partial<NotificationsDrawerSettings>) => {
      setOverrides((current) => ({ ...current, ...update }));
    },
    [],
  );

  const navigate = React.useCallback((label: string, placeholder: boolean) => {
    setDestination(
      placeholder
        ? `Navigated to ${label}, a placeholder page, so it lands on "coming soon".`
        : `Navigated to ${label} and closed the drawer.`,
    );
  }, []);

  return (
    <div className='grid h-screen grid-cols-[320px_1fr] gap-4 bg-bg-weak-50 p-4'>
      <div className='flex min-h-0 flex-col gap-4'>
        <div className='min-h-0 flex-1 overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0'>
          <DialRoot mode='inline' />
        </div>

        <div className='flex flex-col gap-3 rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-4'>
          <p className='text-label-sm text-text-strong-950'>
            Animating controls
          </p>
          <div className='grid grid-cols-2 gap-2'>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              onClick={() => setOpen(true)}
            >
              Open
            </Button.Root>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              onClick={() => setOpen(false)}
            >
              Close
            </Button.Root>
          </div>
        </div>
      </div>

      <div className='flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-8'>
        {/*
          The sandbox: fixed 400x550 and overflow-hidden, so whatever the
          panel does inside it (open/close) stays contained — it can never
          spill over the rest of the layout the way the real drawer's
          fixed/portal positioning would.
        */}
        <div className='h-[550px] w-[400px] shrink-0 overflow-hidden rounded-20'>
          <NotificationsDrawer
            inline
            open={open}
            onOpenChange={setOpen}
            settings={settings}
            onSettingsChange={patch}
            tab={tab}
            onTabChange={setTab}
            onNavigate={navigate}
            onUnreadCountChange={setUnreadCount}
          />
        </div>
      </div>

      {destination ? (
        <p
          aria-live='polite'
          className='col-span-2 rounded-10 bg-bg-white-0 p-3 text-paragraph-sm text-text-sub-600'
        >
          {destination}
        </p>
      ) : null}
    </div>
  );
}
