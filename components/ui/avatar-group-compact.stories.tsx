import type { Meta, StoryObj } from '@storybook/react';
import * as Avatar from './avatar';
import * as AvatarGroupCompact from './avatar-group-compact';

const meta = { title: 'UI/AvatarGroupCompact', component: AvatarGroupCompact.Root } satisfies Meta<typeof AvatarGroupCompact.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AvatarGroupCompact.Root size='24'>
      <Avatar.Root size='24' color='blue'><Avatar.Image src='https://i.pravatar.cc/80?img=4' alt='' /></Avatar.Root>
      <Avatar.Root size='24' color='green'><Avatar.Image src='https://i.pravatar.cc/80?img=5' alt='' /></Avatar.Root>
    </AvatarGroupCompact.Root>
  ),
};
