import type { Meta, StoryObj } from '@storybook/react';
import {
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiTimeLine,
} from '@remixicon/react';
import * as StatusBadge from './status-badge';

const meta = {
  title: 'UI/StatusBadge',
  component: StatusBadge.Root,
} satisfies Meta<typeof StatusBadge.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StatusBadge.Root variant='light' status='completed'>
      <StatusBadge.Icon as={RiCheckboxCircleLine} />
      Completed
    </StatusBadge.Root>
  ),
};

export const WorkflowStates: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <StatusBadge.Root variant='light' status='completed'>
        <StatusBadge.Icon as={RiCheckboxCircleLine} />
        Awarded
      </StatusBadge.Root>
      <StatusBadge.Root variant='light' status='pending'>
        <StatusBadge.Icon as={RiTimeLine} />
        Pending review
      </StatusBadge.Root>
      <StatusBadge.Root variant='light' status='failed'>
        <StatusBadge.Icon as={RiCloseCircleLine} />
        Rejected
      </StatusBadge.Root>
      <StatusBadge.Root variant='stroke' status='disabled'>
        <StatusBadge.Dot />
        Archived
      </StatusBadge.Root>
    </div>
  ),
};
