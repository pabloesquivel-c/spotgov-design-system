import type { Meta, StoryObj } from '@storybook/react';
import * as Kbd from './kbd';

const meta = { title: 'UI/Kbd', component: Kbd.Root } satisfies Meta<typeof Kbd.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Kbd.Root>⌘K</Kbd.Root>,
};
