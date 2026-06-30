import type { Meta, StoryObj } from '@storybook/react';
import * as Label from './label';

const meta = {
  title: 'UI/Label',
  component: Label.Root,
} satisfies Meta<typeof Label.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Label.Root>Agency name</Label.Root>,
};
