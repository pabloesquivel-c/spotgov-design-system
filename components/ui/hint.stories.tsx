import type { Meta, StoryObj } from '@storybook/react';
import * as Hint from './hint';

const meta = { title: 'UI/Hint', component: Hint.Root } satisfies Meta<typeof Hint.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Hint.Root>Helper text for the field.</Hint.Root>,
};
