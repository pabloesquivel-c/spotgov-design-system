import type { Meta, StoryObj } from '@storybook/react';
import * as Switch from './switch';

const meta = {
  title: 'UI/Switch',
  component: Switch.Root,
} satisfies Meta<typeof Switch.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Switch.Root defaultChecked />,
};
