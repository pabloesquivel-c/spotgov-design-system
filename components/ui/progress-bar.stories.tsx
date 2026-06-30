import type { Meta, StoryObj } from '@storybook/react';
import * as ProgressBar from './progress-bar';

const meta = {
  title: 'UI/ProgressBar',
  component: ProgressBar.Root,
} satisfies Meta<typeof ProgressBar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ProgressBar.Root value={60} className='w-64' />,
};
