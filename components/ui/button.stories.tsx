import type { Meta, StoryObj } from '@storybook/react';
import * as Button from './button';

const meta = { title: 'UI/Button', component: Button.Root } satisfies Meta<typeof Button.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Button.Root variant='primary' mode='filled'>Primary</Button.Root>,
};
