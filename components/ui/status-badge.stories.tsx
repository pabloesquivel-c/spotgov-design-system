import type { Meta, StoryObj } from '@storybook/react';
import * as StatusBadge from './status-badge';

const meta = { title: 'UI/StatusBadge', component: StatusBadge.Root } satisfies Meta<typeof StatusBadge.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <StatusBadge.Root variant='light' status='completed'>Completed</StatusBadge.Root>,
};
