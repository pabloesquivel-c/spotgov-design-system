import type { Meta, StoryObj } from '@storybook/react';
import * as Textarea from './textarea';

const meta = { title: 'UI/Textarea', component: Textarea.Root } satisfies Meta<typeof Textarea.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Textarea.Root placeholder='Add notes…' className='max-w-sm' />,
};
