import type { Meta, StoryObj } from '@storybook/react';
import * as Divider from './divider';

const meta = {
  title: 'UI/Divider',
  component: Divider.Root,
} satisfies Meta<typeof Divider.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Divider.Root className='w-64' />,
};
