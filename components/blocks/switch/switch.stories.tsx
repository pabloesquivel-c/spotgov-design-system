import type { Meta, StoryObj } from '@storybook/react';
import { NotificationPreferencesSwitch } from './index';

const meta = {
  title: 'Blocks/Switch',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotificationPreferences: Story = {
  render: () => <NotificationPreferencesSwitch />,
};
