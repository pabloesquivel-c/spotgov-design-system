import type { Meta, StoryObj } from '@storybook/react';
import { RiArrowRightSLine } from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as CompactButton from '@/components/ui/compact-button';
import { ProfileOptionsMenu } from './profile-options-menu';

const meta = {
  title: 'Blocks/ProfileOptionsMenu',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Route URLs and callbacks are supplied by the application. This story uses mock destinations only.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ProfileOptionsMenu
      email='pablo@acmecorp.com'
      links={{
        settings: '/settings',
        help: 'https://support.example.com',
        'learn-more': 'https://www.example.com',
        docs: 'https://docs.example.com',
        contact: 'mailto:support@example.com',
      }}
      onSignOut={() => console.info('Sign out')}
      defaultOpen
    >
      <button
        type='button'
        className='flex min-w-[280px] items-center gap-3 rounded-10 bg-bg-white-0 p-3 text-left shadow-regular-xs outline-none ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out hover:bg-bg-weak-50 focus-visible:ring-2 focus-visible:ring-primary-base'
      >
        <Avatar.Root size='40' color='gray'>
          PC
        </Avatar.Root>
        <span className='min-w-0 flex-1 truncate text-label-sm text-text-strong-950'>
          Pablo Costa
        </span>
        <CompactButton.Root
          asChild
          variant='ghost'
          size='large'
          className='pointer-events-none'
        >
          <span>
            <CompactButton.Icon as={RiArrowRightSLine} />
          </span>
        </CompactButton.Root>
      </button>
    </ProfileOptionsMenu>
  ),
};
