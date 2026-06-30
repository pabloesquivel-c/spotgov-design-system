import type { Meta, StoryObj } from '@storybook/react';
import * as VerticalStepper from './vertical-stepper';

const meta = { title: 'UI/VerticalStepper', component: VerticalStepper.Root } satisfies Meta<typeof VerticalStepper.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <VerticalStepper.Root className='max-w-sm'>
      <VerticalStepper.Item state='completed'>
        <VerticalStepper.ItemIndicator>1</VerticalStepper.ItemIndicator>
        Intake
      </VerticalStepper.Item>
      <VerticalStepper.Item state='active'>
        <VerticalStepper.ItemIndicator>2</VerticalStepper.ItemIndicator>
        Review
      </VerticalStepper.Item>
    </VerticalStepper.Root>
  ),
};
