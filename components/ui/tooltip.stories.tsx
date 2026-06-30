import type { Meta, StoryObj } from '@storybook/react';
import * as Tooltip from './tooltip';
import * as Button from './button';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip.Root,
} satisfies Meta<typeof Tooltip.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>Hover me</Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content>Tooltip content</Tooltip.Content>
    </Tooltip.Root>
  ),
};
