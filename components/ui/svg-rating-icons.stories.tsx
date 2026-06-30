import type { Meta, StoryObj } from '@storybook/react';
import { StarRating } from './svg-rating-icons';

const meta = {
  title: 'UI/SvgRatingIcons',
  component: StarRating,
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { rating: 3.5 },
};
