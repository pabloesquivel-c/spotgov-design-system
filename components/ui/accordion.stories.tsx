import type { Meta, StoryObj } from '@storybook/react';
import * as Accordion from './accordion';

const meta = {
  title: 'UI/Accordion',
  component: Accordion.Root,
} satisfies Meta<typeof Accordion.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Accordion.Root type='single' collapsible className='w-full max-w-md'>
      <Accordion.Item value='item-1'>
        <Accordion.Trigger>Section one</Accordion.Trigger>
        <Accordion.Content>Accordion content goes here.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};
