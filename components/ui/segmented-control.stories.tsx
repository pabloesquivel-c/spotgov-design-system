import type { Meta, StoryObj } from '@storybook/react';
import * as SegmentedControl from './segmented-control';

const meta = { title: 'UI/SegmentedControl', component: SegmentedControl.Root } satisfies Meta<typeof SegmentedControl.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SegmentedControl.Root defaultValue='list' className='w-64'>
      <SegmentedControl.List>
        <SegmentedControl.Trigger value='list'>List</SegmentedControl.Trigger>
        <SegmentedControl.Trigger value='board'>Board</SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  ),
};
