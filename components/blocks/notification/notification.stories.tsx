import type { Meta, StoryObj } from '@storybook/react';
import { NotificationsPopover } from './index';

const meta = {
  title: 'Blocks/Notification',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Popover: Story = {
  render: () => <NotificationsPopover />,
};
