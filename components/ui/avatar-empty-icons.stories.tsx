import type { Meta, StoryObj } from '@storybook/react';
import { IconEmptyUser } from './avatar-empty-icons';

const meta = {
  title: 'UI/AvatarEmptyIcons',
  component: IconEmptyUser,
} satisfies Meta<typeof IconEmptyUser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <IconEmptyUser className='size-10 text-text-soft-400' />,
};
