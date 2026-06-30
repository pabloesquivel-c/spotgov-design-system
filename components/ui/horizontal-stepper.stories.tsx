import type { Meta, StoryObj } from '@storybook/react';
import * as HorizontalStepper from './horizontal-stepper';

const meta = { title: 'UI/HorizontalStepper', component: HorizontalStepper.Root } satisfies Meta<typeof HorizontalStepper.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HorizontalStepper.Root className='max-w-lg'>
      <HorizontalStepper.Item state='completed'>
        <HorizontalStepper.ItemIndicator>1</HorizontalStepper.ItemIndicator>
        Draft
      </HorizontalStepper.Item>
      <HorizontalStepper.SeparatorIcon />
      <HorizontalStepper.Item state='active'>
        <HorizontalStepper.ItemIndicator>2</HorizontalStepper.ItemIndicator>
        Review
      </HorizontalStepper.Item>
    </HorizontalStepper.Root>
  ),
};
