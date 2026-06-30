import type { Meta, StoryObj } from '@storybook/react';
import * as DotStepper from './dot-stepper';

const meta = { title: 'UI/DotStepper', component: DotStepper.Root } satisfies Meta<typeof DotStepper.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DotStepper.Root>
      <DotStepper.Item active />
      <DotStepper.Item />
      <DotStepper.Item />
    </DotStepper.Root>
  ),
};
