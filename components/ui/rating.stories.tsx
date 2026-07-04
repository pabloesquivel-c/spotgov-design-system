'use client';

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RatingDisplay, RatingInput } from './rating';

const meta = { title: 'UI/Rating', component: RatingDisplay } satisfies Meta<
  typeof RatingDisplay
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Display: Story = {
  args: {
    value: 4.5,
  },
};

function InteractiveRatingDemo() {
  const [value, setValue] = React.useState(3);

  return (
    <div className='flex flex-col gap-2'>
      <RatingInput value={value} onChange={setValue} label='Rate this tender match' />
      <p className='text-paragraph-xs text-text-sub-600'>Selected: {value} stars</p>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveRatingDemo />,
};
