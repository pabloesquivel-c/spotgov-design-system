import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './datepicker';

const meta = {
  title: 'UI/Datepicker',
  component: Calendar,
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Calendar mode='single' />,
};
