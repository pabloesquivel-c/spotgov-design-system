import type { Meta, StoryObj } from '@storybook/react';
import * as Select from './select';

const meta = {
  title: 'UI/Select',
  component: Select.Root,
} satisfies Meta<typeof Select.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select.Root defaultValue='federal'>
      <Select.Trigger className='w-48'>
        <Select.Value placeholder='Agency type' />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value='federal'>Federal</Select.Item>
        <Select.Item value='state'>State</Select.Item>
      </Select.Content>
    </Select.Root>
  ),
};
