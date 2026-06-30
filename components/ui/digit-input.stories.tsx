import type { Meta, StoryObj } from '@storybook/react';
import * as DigitInput from './digit-input';

const meta = { title: 'UI/DigitInput', component: DigitInput.Root } satisfies Meta<typeof DigitInput.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DigitInput.Root numInputs={4} />,
};
