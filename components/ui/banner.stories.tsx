import type { Meta, StoryObj } from '@storybook/react';
import { RiCloseLine, RiSparklingLine } from '@remixicon/react';

import * as Banner from './banner';

const meta = { title: 'UI/Banner', component: Banner.Root } satisfies Meta<
  typeof Banner.Root
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FeatureFilled: Story = {
  render: () => (
    <Banner.Root variant='filled' status='feature'>
      <Banner.Content className='text-label-sm'>
        Proposal AI is now available for your workspace.
      </Banner.Content>
      <Banner.Icon as={RiSparklingLine} aria-hidden />
      <Banner.CloseButton aria-label='Dismiss announcement'>
        <RiCloseLine className='size-5' />
      </Banner.CloseButton>
    </Banner.Root>
  ),
};

export const InformationStroke: Story = {
  render: () => (
    <Banner.Root variant='stroke' status='information'>
      <Banner.Content className='text-label-sm'>
        Submission deadline reminders are sent 48 hours before close.
      </Banner.Content>
      <Banner.CloseButton aria-label='Dismiss'>
        <RiCloseLine className='size-5' />
      </Banner.CloseButton>
    </Banner.Root>
  ),
};
