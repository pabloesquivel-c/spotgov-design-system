import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { SkeletonSidebar } from './skeleton/skeleton-sidebar';
import { SkeletonNotificationsDrawer } from './skeleton/skeleton-notifications-drawer';
import {
  mockSessionMultiOrg,
  mockSessionSingleOrg,
  type Session,
} from './skeleton/skeleton-mock-session';

const meta = {
  title: 'Blocks/Sidebar/Skeleton',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function SkeletonSidebarDemo({ session }: { session: Session }) {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  return (
    <div className='flex h-[883px] bg-bg-weak-50 p-4'>
      <SkeletonSidebar
        session={session}
        onOpenNotifications={() => setNotificationsOpen(true)}
      />
      <SkeletonNotificationsDrawer
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <SkeletonSidebarDemo session={mockSessionSingleOrg} />,
};

// ~9% of accounts belong to more than one organization — this variant shows
// the workspace row's interactive state: a chevron trigger next to the org
// name that opens the "Switch workspace" dropdown (skeleton-workspace-toggle.tsx).
export const WithWorkspaceToggle: Story = {
  render: () => <SkeletonSidebarDemo session={mockSessionMultiOrg} />,
};
