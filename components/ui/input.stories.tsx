import type { Meta, StoryObj } from '@storybook/react';
import * as Input from './input';

const meta = {
  title: 'UI/Input',
  component: Input.Root,
} satisfies Meta<typeof Input.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Input.Root className='max-w-sm'>
      <Input.Wrapper>
        <Input.Input placeholder='Search tenders…' />
      </Input.Wrapper>
    </Input.Root>
  ),
};
