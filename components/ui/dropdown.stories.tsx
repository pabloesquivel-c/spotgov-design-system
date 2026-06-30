import type { Meta, StoryObj } from '@storybook/react';
import * as Dropdown from './dropdown';
import * as Button from './button';

const meta = {
  title: 'UI/Dropdown',
  component: Dropdown.Root,
} satisfies Meta<typeof Dropdown.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>Open menu</Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Edit</Dropdown.Item>
        <Dropdown.Item>Duplicate</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  ),
};
