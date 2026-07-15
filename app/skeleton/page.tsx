'use client';

// Isolated preview route for the skeleton sidebar redesign. Doesn't touch
// "/" (still redirects to Storybook) or the production app-sidebar.tsx —
// see the plan this was built from for why it lives here on its own.

import * as React from 'react';

import { SkeletonSidebar } from '@/components/blocks/sidebar/skeleton/skeleton-sidebar';
import { SkeletonNotificationsDrawer } from '@/components/blocks/sidebar/skeleton/skeleton-notifications-drawer';
import { SkeletonHomeMock } from '@/components/blocks/sidebar/skeleton/skeleton-home-mock';
import {
  mockSessionMultiOrg,
  mockSessionSingleOrg,
} from '@/components/blocks/sidebar/skeleton/skeleton-mock-session';

export default function SkeletonPreviewPage() {
  const [multiOrg, setMultiOrg] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  const session = multiOrg ? mockSessionMultiOrg : mockSessionSingleOrg;

  return (
    <div className='flex h-screen flex-col bg-bg-weak-50'>
      <div className='flex shrink-0 items-center gap-3 border-b border-stroke-soft-200 bg-bg-white-0 px-4 py-2 text-paragraph-sm text-text-sub-600'>
        <span className='font-medium text-text-strong-950'>Preview controls</span>
        <span>— mock data only, not part of the design:</span>
        <label className='flex items-center gap-1.5'>
          <input
            type='checkbox'
            checked={multiOrg}
            onChange={(e) => setMultiOrg(e.target.checked)}
          />
          Simulate multi-org account
        </label>
      </div>

      <div className='flex min-h-0 flex-1 gap-4 p-4'>
        <SkeletonSidebar
          session={session}
          onOpenNotifications={() => setNotificationsOpen(true)}
        />
        <div className='min-h-0 flex-1 overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0'>
          <SkeletonHomeMock user={session.user} org={session.organizations[0]} />
        </div>
      </div>

      <SkeletonNotificationsDrawer
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
    </div>
  );
}
