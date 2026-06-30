import type { Meta, StoryObj } from '@storybook/react';
import * as ProgressCircle from './progress-circle';

const meta = { title: 'UI/ProgressCircle', component: ProgressCircle.Root } satisfies Meta<typeof ProgressCircle.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ProgressCircle.Root value={60} size='48' />,
};
