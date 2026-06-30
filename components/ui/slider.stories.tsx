import type { Meta, StoryObj } from '@storybook/react';
import * as Slider from './slider';

const meta = { title: 'UI/Slider', component: Slider.Root } satisfies Meta<typeof Slider.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Slider.Root defaultValue={[40]} className='w-64' />,
};
