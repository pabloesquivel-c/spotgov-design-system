import type { Meta, StoryObj } from '@storybook/react';
import * as Popover from './popover';
import * as Button from './button';

const meta = {
  title: 'UI/Popover',
  component: Popover.Root,
} satisfies Meta<typeof Popover.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>Open popover</Button.Root>
      </Popover.Trigger>
      <Popover.Content className='w-64'>Popover content</Popover.Content>
    </Popover.Root>
  ),
};
