import type { Meta, StoryObj } from '@storybook/react';
import * as Avatar from './avatar';
import * as AvatarGroup from './avatar-group';

const meta = { title: 'UI/AvatarGroup', component: AvatarGroup.Root } satisfies Meta<typeof AvatarGroup.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AvatarGroup.Root size='32'>
      <Avatar.Root size='32' color='blue'><Avatar.Image src='https://i.pravatar.cc/80?img=1' alt='' /></Avatar.Root>
      <Avatar.Root size='32' color='green'><Avatar.Image src='https://i.pravatar.cc/80?img=2' alt='' /></Avatar.Root>
      <Avatar.Root size='32' color='orange'><Avatar.Image src='https://i.pravatar.cc/80?img=3' alt='' /></Avatar.Root>
    </AvatarGroup.Root>
  ),
};
