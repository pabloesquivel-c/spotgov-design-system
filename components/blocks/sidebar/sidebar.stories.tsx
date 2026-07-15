import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { SkeletonSidebar } from './skeleton/skeleton-sidebar';
import { SkeletonNotificationsDrawer } from './skeleton/skeleton-notifications-drawer';
import { mockSessionSingleOrg } from './skeleton/skeleton-mock-session';

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
    <div className='flex h-screen bg-bg-weak-50 p-4'>
      <SkeletonSidebar
        session={mockSessionSingleOrg}
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
  render: () => <SkeletonSidebarDemo />,
};
