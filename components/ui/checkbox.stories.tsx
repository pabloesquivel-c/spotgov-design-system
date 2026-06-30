import type { Meta, StoryObj } from '@storybook/react';
import * as Checkbox from './checkbox';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox.Root,
} satisfies Meta<typeof Checkbox.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Checkbox.Root defaultChecked />,
};
