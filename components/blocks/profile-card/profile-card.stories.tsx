import type { Meta, StoryObj } from '@storybook/react';
import { ProfileCard } from './index';

const meta = {
  title: 'Blocks/ProfileCard',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ProfileCard />,
};
