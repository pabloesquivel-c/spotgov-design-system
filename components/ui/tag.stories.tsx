import type { Meta, StoryObj } from '@storybook/react';
import * as Tag from './tag';

const meta = { title: 'UI/Tag', component: Tag.Root } satisfies Meta<typeof Tag.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Tag.Root>Procurement</Tag.Root>,
};
