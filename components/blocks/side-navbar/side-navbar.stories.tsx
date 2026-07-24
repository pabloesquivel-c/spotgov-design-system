import type { Meta, StoryObj } from '@storybook/react';

import { SideNavbar } from './side-navbar';

const meta = {
  title: 'Blocks/SideNavbar',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className='flex h-[900px] bg-bg-weak-50'>
      <SideNavbar
        onOrganizationChange={(organizationId) =>
          console.info('Organization changed', organizationId)
        }
        unreadNotificationCount={2}
        onNotificationsClick={() => console.info('Notifications opened')}
        accountMenuLinks={{
          settings: '/settings',
          help: 'https://support.example.com',
          'learn-more': 'https://www.example.com',
          docs: 'https://docs.example.com',
          contact: 'mailto:support@example.com',
        }}
        termsHref='/terms'
        onSignOut={() => console.info('Sign out')}
      />
    </div>
  ),
};

export const CapabilityStates: Story = {
  render: () => (
    <div className='flex h-[900px] bg-bg-weak-50'>
      <SideNavbar
        capabilityStates={{
          'upcoming-opportunities': { tag: 'beta' },
          'proposal-revision': { tag: 'soon' },
          'market-intelligence': { unavailable: true },
        }}
        unreadNotificationCount={2}
      />
    </div>
  ),
};
