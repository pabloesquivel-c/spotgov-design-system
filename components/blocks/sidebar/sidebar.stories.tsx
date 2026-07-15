import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { SkeletonSidebar } from './skeleton/skeleton-sidebar';
import { SkeletonNotificationsDrawer } from './skeleton/skeleton-notifications-drawer';
import { mockSessionMultiOrg } from './skeleton/skeleton-mock-session';

const meta = {
  title: 'Blocks/Sidebar/Skeleton',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function SkeletonSidebarDemo() {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  return (
    <div className='flex h-[883px] bg-bg-weak-50 p-4'>
      <SkeletonSidebar
        session={mockSessionMultiOrg}
        onOpenNotifications={() => setNotificationsOpen(true)}
      />
      <SkeletonNotificationsDrawer
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
    </div>
  );
}

// Fixed at 240px — no collapse. Uses the multi-org session so the workspace
// row's interactive state renders: a chevron trigger next to the org name
// that opens the "Switch workspace" dropdown (skeleton-workspace-toggle.tsx).
export const Default: Story = {
  render: () => <SkeletonSidebarDemo />,
};
