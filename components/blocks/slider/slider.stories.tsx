import type { Meta, StoryObj } from '@storybook/react';
import { WeeklyPromotionsSlider } from './index';

const meta = {
  title: 'Blocks/Slider',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const WeeklyPromotions: Story = {
  render: () => <WeeklyPromotionsSlider />,
};
