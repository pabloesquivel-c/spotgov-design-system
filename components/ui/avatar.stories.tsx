import type { Meta, StoryObj } from '@storybook/react';
import * as Avatar from './avatar';

const meta = { title: 'UI/Avatar', component: Avatar.Root } satisfies Meta<typeof Avatar.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar.Root size='40' color='blue'>
      <Avatar.Image src='https://i.pravatar.cc/80' alt='User' />
    </Avatar.Root>
  ),
};
