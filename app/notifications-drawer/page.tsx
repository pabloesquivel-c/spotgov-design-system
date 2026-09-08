'use client';

// Scratch preview route for .context/notifications-drawer.html. Not production.
// No archetype: screen-composition.md:3 is page-only and silent on overlays.
// Decided: Drawer + drawerPanelClassName, the floating inset panel (design-system.md:655)
// Decided: toast is Notification via the provider, the only one with an action slot
// Decided: loading placeholder is local to this route, not a new primitive
// Decided: no text-text-soft-400 on metadata (accessibility.md:29); contrast moved to weight
// Open: owner and custom-field copy naming the phase or field is [needs decision]
// Open: formatUnreadNotificationCount caps at 99+, the spec confirms 9+
// Teardown: rm -rf app/notifications-drawer

import * as React from 'react';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import { formatUnreadNotificationCount } from '@/components/blocks/side-navbar/side-navbar';

import { NotificationsDrawer, type Tab } from './_components/notifications-drawer';
import { DEFAULT_SETTINGS, type NotificationsDrawerSettings } from './_components/settings';

export default function NotificationsDrawerPreviewPage() {
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState<Tab>('all');
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [destination, setDestination] = React.useState<string | null>(null);
  const [settings, setSettings] =
    React.useState<NotificationsDrawerSettings>(DEFAULT_SETTINGS);

  const patch = React.useCallback((update: Partial<NotificationsDrawerSettings>) => {
    setSettings((current) => ({ ...current, ...update }));
  }, []);

  const navigate = React.useCallback((label: string, placeholder: boolean) => {
    setDestination(
      placeholder
        ? `Navigated to ${label}, a placeholder page, so it lands on "coming soon".`
        : `Navigated to ${label} and closed the drawer.`,
    );
  }, []);

  return (
    <div className='flex h-screen flex-col bg-bg-weak-50'>
      <div className='flex min-h-0 flex-1 p-4'>
        <div className='flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-8'>
          <div className='flex max-w-[420px] flex-col items-center gap-4 text-center'>
            <p className='text-label-md text-text-strong-950'>
              Notifications drawer, built with the design system
            </p>
            <p className='text-paragraph-sm text-text-sub-600'>
              The pages behind the items were deliberately not built, so when a
              notification navigates, the drawer closes and the destination is
              printed below instead.
            </p>
            <Button.Root type='button' onClick={() => setOpen(true)}>
              Open Drawer
              {unreadCount > 0 ? (
                <Badge.Root
                  aria-hidden='true'
                  variant='filled'
                  color='red'
                  size='medium'
                  className='min-w-5 px-1'
                >
                  {formatUnreadNotificationCount(unreadCount)}
                </Badge.Root>
              ) : null}
            </Button.Root>
            {destination ? (
              <p
                aria-live='polite'
                className='rounded-10 bg-bg-weak-50 p-3 text-paragraph-sm text-text-sub-600'
              >
                {destination}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <NotificationsDrawer
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
  );
}
