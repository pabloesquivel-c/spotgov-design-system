import type { Meta, StoryObj } from '@storybook/react';
import * as Badge from './badge';

const meta = { title: 'UI/Badge', component: Badge.Root } satisfies Meta<typeof Badge.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Badge.Root variant='filled' color='blue'>Federal</Badge.Root>,
};
